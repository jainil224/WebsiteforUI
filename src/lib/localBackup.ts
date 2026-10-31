import JSZip from 'jszip'
import {
  getAllCollections,
  getAllInspirations,
  getLocalSettings,
  normalizeUrl,
  saveLibrarySnapshot,
} from './localVaultStorage'
import {
  deleteLocalImageFile,
  isOPFSSupported,
  readLocalImageBlob,
  saveLocalImageFile,
} from './opfsStorage'
import {
  type CollectionRecord,
  type InspirationRecord,
  type LocalVaultSettings,
  type StorageResult,
  StorageError,
} from './storageTypes'

const BACKUP_FORMAT = 'inspovault-full-backup'
const BACKUP_VERSION = 1
const MAX_ARCHIVE_BYTES = 200 * 1024 * 1024
const MAX_IMAGE_BYTES = 20 * 1024 * 1024
const MAX_ARCHIVE_ENTRIES = 6000
const MAX_RECORDS = 5000

const IMAGE_TYPES: Record<string, { extension: string; signature: (bytes: Uint8Array) => boolean }> = {
  'image/png': {
    extension: 'png',
    signature: (bytes) => bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47,
  },
  'image/jpeg': {
    extension: 'jpg',
    signature: (bytes) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  'image/gif': {
    extension: 'gif',
    signature: (bytes) => bytes.length >= 6 && String.fromCharCode(...bytes.slice(0, 6)).startsWith('GIF8'),
  },
  'image/webp': {
    extension: 'webp',
    signature: (bytes) =>
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP',
  },
}

type BackupInspiration = Omit<InspirationRecord, 'imageFileName' | 'imageMimeType'>

type BackupManifest = {
  format: typeof BACKUP_FORMAT
  version: number
  createdAt: number
  inspirations: BackupInspiration[]
  collections: CollectionRecord[]
  settings: LocalVaultSettings
  images: Array<{
    inspirationId: string
    path: string
    mimeType: string
  }>
}

export type ParsedLocalBackup = {
  manifest: BackupManifest
  images: Map<string, { bytes: Uint8Array; mimeType: string }>
  summary: {
    inspirations: number
    collections: number
    screenshots: number
    missingScreenshots: number
  }
  warnings: string[]
}

export type BackupRestoreMode = 'merge' | 'replace'

export type BackupRestoreResult = {
  importedInspirations: number
  importedCollections: number
  restoredScreenshots: number
  skippedInspirations: number
  warnings: string[]
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function validateSettings(value: unknown): value is LocalVaultSettings {
  if (!isObject(value)) return false
  return (
    Number.isInteger(value.version) &&
    value.storageType === 'localStorage-and-OPFS' &&
    value.theme === 'dark' &&
    (value.lastBackupDate === undefined || isTimestamp(value.lastBackupDate))
  )
}

function validateCollection(value: unknown): value is CollectionRecord {
  if (!isObject(value)) return false
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    (value.description === undefined || typeof value.description === 'string') &&
    isTimestamp(value.createdAt) &&
    isTimestamp(value.updatedAt)
  )
}

function validateInspiration(value: unknown): value is BackupInspiration {
  if (!isObject(value)) return false
  let validWebUrl = false
  try {
    const url = new URL(String(value.url))
    validWebUrl = url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    validWebUrl = false
  }

  return (
    isNonEmptyString(value.id) &&
    validWebUrl &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.domain) &&
    typeof value.note === 'string' &&
    isNonEmptyString(value.categoryId) &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === 'string') &&
    typeof value.favorite === 'boolean' &&
    (value.collectionId === undefined || isNonEmptyString(value.collectionId)) &&
    isTimestamp(value.createdAt) &&
    isTimestamp(value.updatedAt)
  )
}

function imageHasValidSignature(bytes: Uint8Array, mimeType: string): boolean {
  return IMAGE_TYPES[mimeType]?.signature(bytes) ?? false
}

function uniqueId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function normalizeImageMimeType(mimeType: string | undefined, fileName: string): string | undefined {
  if (mimeType && IMAGE_TYPES[mimeType]) return mimeType
  const extension = fileName.split('.').pop()?.toLowerCase()
  const normalizedExtension = extension === 'jpeg' ? 'jpg' : extension
  return Object.entries(IMAGE_TYPES).find(([, imageType]) => imageType.extension === normalizedExtension)?.[0]
}

function createImageFileName(mimeType: string): string {
  const extension = IMAGE_TYPES[mimeType].extension
  return `restore_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${extension}`
}

export async function exportFullLocalBackup(
  onProgress?: (message: string) => void,
): Promise<StorageResult<{ blob: Blob; summary: ParsedLocalBackup['summary']; warnings: string[] }>> {
  if (!isOPFSSupported()) {
    return {
      success: false,
      error: new StorageError('OPFS_UNSUPPORTED', 'Full backups require OPFS support for local preview files.'),
    }
  }

  const inspirationResult = getAllInspirations()
  if (!inspirationResult.success) return inspirationResult
  const collectionResult = getAllCollections()
  if (!collectionResult.success) return collectionResult

  const zip = new JSZip()
  const images: BackupManifest['images'] = []
  const warnings: string[] = []
  let missingScreenshots = 0
  let totalImageBytes = 0
  const inspirations = inspirationResult.data.map(({ imageFileName: _fileName, imageMimeType: _mime, ...record }) => record)

  for (let index = 0; index < inspirationResult.data.length; index += 1) {
    const record = inspirationResult.data[index]
    if (!record.imageFileName) continue

    onProgress?.(`Adding screenshot ${images.length + 1}…`)
    const imageResult = await readLocalImageBlob(record.imageFileName)
    if (!imageResult.success) {
      if (imageResult.error.kind === 'NOT_FOUND') {
        missingScreenshots += 1
        warnings.push(`Preview for “${record.title}” is missing from OPFS and was omitted.`)
        continue
      }
      return {
        success: false,
        error: new StorageError('FILE_READ_FAILED', `Could not read the preview for “${record.title}”: ${imageResult.error.message}`),
      }
    }

    if (imageResult.data.size > MAX_IMAGE_BYTES) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', `Preview for “${record.title}” exceeds the 20 MB full-backup image limit.`),
      }
    }

    const mimeType = normalizeImageMimeType(record.imageMimeType || imageResult.data.type, record.imageFileName)
    if (!mimeType) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', `Preview for “${record.title}” has an unsupported image type and cannot be safely included in this backup.`),
      }
    }
    const bytes = new Uint8Array(await imageResult.data.arrayBuffer())
    if (!imageHasValidSignature(bytes, mimeType)) {
      return {
        success: false,
        error: new StorageError('FILE_READ_FAILED', `Preview for “${record.title}” is corrupted or does not match its image type.`),
      }
    }
    totalImageBytes += bytes.byteLength
    if (totalImageBytes > MAX_ARCHIVE_BYTES) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', 'The total preview data exceeds the 200 MB full-backup limit.'),
      }
    }

    const path = `assets/images/${String(index).padStart(5, '0')}.${IMAGE_TYPES[mimeType].extension}`
    zip.file(path, bytes)
    images.push({ inspirationId: record.id, path, mimeType })
  }

  const manifest: BackupManifest = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: Date.now(),
    inspirations,
    collections: collectionResult.data,
    settings: getLocalSettings(),
    images,
  }
  zip.file('manifest.json', JSON.stringify(manifest, null, 2))

  try {
    onProgress?.('Packaging the local backup…')
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    return {
      success: true,
      data: {
        blob,
        summary: {
          inspirations: inspirations.length,
          collections: collectionResult.data.length,
          screenshots: images.length,
          missingScreenshots,
        },
        warnings,
      },
    }
  } catch (err) {
    return {
      success: false,
      error: new StorageError('FILE_WRITE_FAILED', `Could not create ZIP backup: ${err instanceof Error ? err.message : String(err)}`),
    }
  }
}

export async function parseLocalBackup(file: File): Promise<StorageResult<ParsedLocalBackup>> {
  if (file.size === 0 || file.size > MAX_ARCHIVE_BYTES) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The backup file is empty or exceeds the 200 MB archive limit.'),
    }
  }

  let zip: JSZip
  try {
    zip = await JSZip.loadAsync(file, { checkCRC32: true })
  } catch (err) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', `This is not a valid or readable ZIP backup: ${err instanceof Error ? err.message : String(err)}`),
    }
  }

  const entries = Object.values(zip.files).filter((entry) => !entry.dir)
  if (entries.length > MAX_ARCHIVE_ENTRIES || entries.some((entry) => entry.unsafeOriginalName?.includes('..'))) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The backup contains too many files or unsafe archive paths.'),
    }
  }

  const manifestEntry = zip.file('manifest.json')
  if (!manifestEntry) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The ZIP archive is missing manifest.json.'),
    }
  }

  let rawManifest: unknown
  try {
    rawManifest = JSON.parse(await manifestEntry.async('string'))
  } catch {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The backup manifest is not valid JSON.'),
    }
  }

  if (!isObject(rawManifest) || rawManifest.format !== BACKUP_FORMAT || rawManifest.version !== BACKUP_VERSION) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'This backup format is incompatible or uses an unsupported version.'),
    }
  }
  if (
    !isTimestamp(rawManifest.createdAt) ||
    !Array.isArray(rawManifest.inspirations) ||
    !Array.isArray(rawManifest.collections) ||
    !Array.isArray(rawManifest.images) ||
    !validateSettings(rawManifest.settings) ||
    rawManifest.inspirations.length > MAX_RECORDS ||
    rawManifest.collections.length > MAX_RECORDS
  ) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The backup manifest is missing required data or exceeds supported record limits.'),
    }
  }

  const records = rawManifest.inspirations
  const collections = rawManifest.collections
  if (!records.every(validateInspiration) || !collections.every(validateCollection)) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The backup contains a malformed inspiration or collection record.'),
    }
  }

  const recordIds = new Set<string>()
  for (const record of records) {
    if (recordIds.has(record.id)) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', `The backup contains duplicate inspiration ID “${record.id}”.`),
      }
    }
    recordIds.add(record.id)
  }
  const collectionIds = new Set<string>()
  for (const collection of collections) {
    if (collectionIds.has(collection.id)) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', `The backup contains duplicate collection ID “${collection.id}”.`),
      }
    }
    collectionIds.add(collection.id)
  }
  if (records.some((record) => record.collectionId && !collectionIds.has(record.collectionId))) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The backup includes an inspiration assigned to a missing collection.'),
    }
  }

  const imageEntries = rawManifest.images as BackupManifest['images']
  const imageIds = new Set<string>()
  const imagePaths = new Set<string>()
  for (const image of imageEntries) {
    const mappedExtension = IMAGE_TYPES[typeof image?.mimeType === 'string' ? image.mimeType : '']?.extension
    if (
      !isObject(image) ||
      !isNonEmptyString(image.inspirationId) ||
      !isNonEmptyString(image.path) ||
      !isNonEmptyString(image.mimeType) ||
      !recordIds.has(image.inspirationId) ||
      !IMAGE_TYPES[image.mimeType] ||
      !/^assets\/images\/[A-Za-z0-9._-]+$/.test(image.path) ||
      image.path.includes('..') ||
      !image.path.endsWith(`.${mappedExtension}`) ||
      imageIds.has(image.inspirationId) ||
      imagePaths.has(image.path)
    ) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', 'The backup contains an invalid or duplicate screenshot mapping.'),
      }
    }
    imageIds.add(image.inspirationId)
    imagePaths.add(image.path)
  }

  const allowedPaths = new Set(['manifest.json', ...imagePaths])
  if (entries.some((entry) => !allowedPaths.has(entry.name))) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The backup contains unexpected files or paths.'),
    }
  }

  const images = new Map<string, { bytes: Uint8Array; mimeType: string }>()
  const warnings: string[] = []
  let totalImageBytes = 0
  for (const image of imageEntries) {
    const zipEntry = zip.file(image.path)
    if (!zipEntry) {
      warnings.push(`Screenshot for “${records.find((record) => record.id === image.inspirationId)?.title || image.inspirationId}” is missing from the archive.`)
      continue
    }

    try {
      const bytes = await zipEntry.async('uint8array')
      totalImageBytes += bytes.byteLength
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES || totalImageBytes > MAX_ARCHIVE_BYTES) {
        return {
          success: false,
          error: new StorageError('INVALID_INPUT', 'A screenshot is empty or the expanded backup exceeds the supported size limit.'),
        }
      }
      if (!imageHasValidSignature(bytes, image.mimeType)) {
        return {
          success: false,
          error: new StorageError('INVALID_INPUT', `Screenshot “${image.path}” is corrupted or does not match its declared type.`),
        }
      }
      images.set(image.inspirationId, { bytes, mimeType: image.mimeType })
    } catch (err) {
      return {
        success: false,
        error: new StorageError('INVALID_INPUT', `Could not read screenshot “${image.path}”: ${err instanceof Error ? err.message : String(err)}`),
      }
    }
  }

  const manifest: BackupManifest = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: rawManifest.createdAt,
    inspirations: records as BackupInspiration[],
    collections: collections as CollectionRecord[],
    settings: rawManifest.settings,
    images: imageEntries,
  }
  return {
    success: true,
    data: {
      manifest,
      images,
      summary: {
        inspirations: records.length,
        collections: collections.length,
        screenshots: images.size,
        missingScreenshots: imageEntries.length - images.size,
      },
      warnings,
    },
  }
}

export async function restoreLocalBackup(
  backup: ParsedLocalBackup,
  mode: BackupRestoreMode,
  onProgress?: (message: string) => void,
): Promise<StorageResult<BackupRestoreResult>> {
  if (!isOPFSSupported() && backup.images.size > 0) {
    return {
      success: false,
      error: new StorageError('OPFS_UNSUPPORTED', 'This browser cannot restore screenshots because OPFS is unavailable. Existing data was not changed.'),
    }
  }

  const currentInspirationsResult = getAllInspirations()
  if (!currentInspirationsResult.success) return currentInspirationsResult
  const currentCollectionsResult = getAllCollections()
  if (!currentCollectionsResult.success) return currentCollectionsResult

  const currentInspirations = currentInspirationsResult.data
  const currentCollections = currentCollectionsResult.data
  const oldSettings = getLocalSettings()
  const nextInspirations = mode === 'replace' ? [] : [...currentInspirations]
  const nextCollections = mode === 'replace' ? [] : [...currentCollections]
  const warnings = [...backup.warnings]
  const createdFiles: string[] = []
  const priorImageFiles = mode === 'replace'
    ? currentInspirations.map((record) => record.imageFileName).filter((name): name is string => Boolean(name))
    : []
  const collectionIdMap = new Map<string, string>()
  const existingCollectionNames = new Map(nextCollections.map((collection) => [collection.name.trim().toLowerCase(), collection.id]))
  const existingCollectionIds = new Set(nextCollections.map((collection) => collection.id))

  for (const collection of backup.manifest.collections) {
    const matchedName = existingCollectionNames.get(collection.name.trim().toLowerCase())
    if (matchedName) {
      collectionIdMap.set(collection.id, matchedName)
      continue
    }

    let id = collection.id
    if (existingCollectionIds.has(id)) id = uniqueId('col')
    const restoredCollection = { ...collection, id }
    nextCollections.push(restoredCollection)
    existingCollectionIds.add(id)
    existingCollectionNames.set(collection.name.trim().toLowerCase(), id)
    collectionIdMap.set(collection.id, id)
  }

  const existingUrls = new Set(nextInspirations.map((record) => normalizeUrl(record.url).toLowerCase()))
  const existingInspirationIds = new Set(nextInspirations.map((record) => record.id))
  let importedInspirations = 0
  let skippedInspirations = 0
  let restoredScreenshots = 0

  try {
    for (const [index, record] of backup.manifest.inspirations.entries()) {
      const urlKey = normalizeUrl(record.url).toLowerCase()
      if (mode === 'merge' && existingUrls.has(urlKey)) {
        skippedInspirations += 1
        continue
      }

      let id = record.id
      if (existingInspirationIds.has(id)) id = uniqueId('insp')
      const restoredRecord: InspirationRecord = {
        ...record,
        id,
        collectionId: record.collectionId ? collectionIdMap.get(record.collectionId) : undefined,
      }
      const image = backup.images.get(record.id)
      if (image) {
        onProgress?.(`Restoring screenshot ${restoredScreenshots + 1} of ${backup.images.size}…`)
        const fileName = createImageFileName(image.mimeType)
        const imageBuffer = new ArrayBuffer(image.bytes.byteLength)
        new Uint8Array(imageBuffer).set(image.bytes)
        createdFiles.push(fileName)
        const savedImage = await saveLocalImageFile(new Blob([imageBuffer], { type: image.mimeType }), fileName)
        if (!savedImage.success) throw savedImage.error
        restoredRecord.imageFileName = savedImage.data
        restoredRecord.imageMimeType = image.mimeType
        restoredScreenshots += 1
      } else {
        restoredRecord.imageFileName = undefined
        restoredRecord.imageMimeType = undefined
      }

      nextInspirations.push(restoredRecord)
      existingInspirationIds.add(id)
      existingUrls.add(urlKey)
      importedInspirations += 1
      if (index % 25 === 0) onProgress?.(`Restoring inspiration ${index + 1} of ${backup.manifest.inspirations.length}…`)
    }

    const settings = mode === 'replace' ? backup.manifest.settings : oldSettings
    onProgress?.('Saving restored library metadata…')
    const saveResult = saveLibrarySnapshot(nextInspirations, nextCollections, settings)
    if (!saveResult.success) throw saveResult.error
  } catch (err) {
    const cleanupFailures: string[] = []
    for (const fileName of createdFiles) {
      const cleanupResult = await deleteLocalImageFile(fileName)
      if (!cleanupResult.success) cleanupFailures.push(fileName)
    }
    const baseMessage = err instanceof Error ? err.message : String(err)
    const cleanupMessage = cleanupFailures.length
      ? ` Some staged screenshots could not be removed: ${cleanupFailures.join(', ')}.`
      : ''
    return {
      success: false,
      error: new StorageError('STORAGE_UNAVAILABLE', `Restore failed before the library was committed: ${baseMessage.replace(/[. ]+$/, '')}.${cleanupMessage}`),
    }
  }

  if (mode === 'replace') {
    for (const fileName of priorImageFiles) {
      const deleteResult = await deleteLocalImageFile(fileName)
      if (!deleteResult.success) {
        warnings.push(`Restored data is active, but the previous preview file “${fileName}” could not be removed.`)
      }
    }
  }

  return {
    success: true,
    data: {
      importedInspirations,
      importedCollections: nextCollections.length - (mode === 'replace' ? 0 : currentCollections.length),
      restoredScreenshots,
      skippedInspirations,
      warnings,
    },
  }
}
