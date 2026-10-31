import { StorageError, type StorageResult } from './storageTypes'

/**
 * Origin Private File System (OPFS) Local File Storage Manager.
 * Stores screenshots and preview images directly in the browser's local sandbox
 * filesystem as binary files, completely outside of localStorage and databases.
 */

const OPFS_DIRECTORY_NAME = 'inspovault_previews'

export function isOPFSSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.storage !== 'undefined' &&
    typeof navigator.storage.getDirectory === 'function'
  )
}

/**
 * Retrieves the InspoVault preview image folder in OPFS.
 */
async function getPreviewDirectory(): Promise<FileSystemDirectoryHandle> {
  if (!isOPFSSupported()) {
    throw new StorageError(
      'OPFS_UNSUPPORTED',
      'Origin Private File System (OPFS) is not supported in this browser environment.',
    )
  }

  const root = await navigator.storage.getDirectory()
  return await root.getDirectoryHandle(OPFS_DIRECTORY_NAME, { create: true })
}

/**
 * Saves a local image Blob or File to OPFS under a unique filename.
 * Returns the stable filename identifier.
 */
export async function saveLocalImageFile(
  blob: Blob,
  preferredFileName?: string,
): Promise<StorageResult<string>> {
  try {
    if (!blob || blob.size === 0) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', 'Provided image blob is empty or invalid.'),
      }
    }

    const dir = await getPreviewDirectory()
    const extension = blob.type.split('/')[1] || 'webp'
    const fileName =
      preferredFileName ||
      `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${extension}`

    const fileHandle = await dir.getFileHandle(fileName, { create: true })
    const accessHandle = await fileHandle.createWritable()
    await accessHandle.write(blob)
    await accessHandle.close()

    return { success: true, data: fileName }
  } catch (err) {
    if (err instanceof StorageError) {
      return { success: false, error: err }
    }
    const message = err instanceof Error ? err.message : 'Unknown OPFS write failure'
    return {
      success: false,
      error: new StorageError('FILE_WRITE_FAILED', `Failed to write image to OPFS: ${message}`),
    }
  }
}

/**
 * Reads a local image file from OPFS as an Object URL (blob: URL) for display in <img> tags.
 * Note: Caller can call URL.revokeObjectURL when done.
 */
export async function readLocalImageObjectURL(
  fileName: string,
): Promise<StorageResult<string>> {
  try {
    const fileResult = await readLocalImageBlob(fileName)
    if (!fileResult.success) {
      return fileResult
    }

    const objectUrl = URL.createObjectURL(fileResult.data)
    return { success: true, data: objectUrl }
  } catch (err) {
    return {
      success: false,
      error: new StorageError(
        'FILE_READ_FAILED',
        `Failed to generate object URL: ${err instanceof Error ? err.message : String(err)}`,
      ),
    }
  }
}

/**
 * Reads a local image file from OPFS as a binary Blob.
 */
export async function readLocalImageBlob(
  fileName: string,
): Promise<StorageResult<Blob>> {
  try {
    const dir = await getPreviewDirectory()
    const fileHandle = await dir.getFileHandle(fileName)
    const file = await fileHandle.getFile()
    return { success: true, data: file }
  } catch (err) {
    if (err instanceof StorageError) {
      return { success: false, error: err }
    }
    return {
      success: false,
      error: new StorageError(
        'NOT_FOUND',
        `Local image file "${fileName}" was not found in local file storage.`,
      ),
    }
  }
}

/**
 * Deletes a local image file from OPFS when an inspiration is removed.
 */
export async function deleteLocalImageFile(
  fileName: string,
): Promise<StorageResult<boolean>> {
  try {
    const dir = await getPreviewDirectory()
    await dir.removeEntry(fileName)
    return { success: true, data: true }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'NotFoundError') {
      return { success: true, data: true }
    }
    return {
      success: false,
      error: new StorageError(
        'FILE_WRITE_FAILED',
        `Failed to remove local image file "${fileName}": ${err instanceof Error ? err.message : String(err)}`,
      ),
    }
  }
}

/**
 * Lists all stored preview image filenames in OPFS.
 */
export async function listLocalImageFiles(): Promise<string[]> {
  try {
    if (!isOPFSSupported()) return []
    const dir = await getPreviewDirectory()
    const names: string[] = []
    for await (const name of dir.keys()) {
      names.push(name)
    }
    return names
  } catch {
    return []
  }
}
