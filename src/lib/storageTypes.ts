/**
 * InspoVault — Local Data Model & Storage Types
 * Architecture: 100% Local (localStorage for records & settings, OPFS for image files).
 * Strictly zero database, zero backend, zero external synchronization.
 */

export type InspirationRecord = {
  id: string
  url: string
  title: string
  domain: string
  note: string
  categoryId: string
  tags: string[]
  favorite: boolean
  collectionId?: string
  /**
   * Reference identifier / filename of the local image stored in the
   * browser's Origin Private File System (OPFS), e.g. "preview-171829281.webp".
   * Large preview files are never stored as Base64 strings in localStorage.
   */
  imageFileName?: string
  imageMimeType?: string
  createdAt: number
  updatedAt: number
}

export type CollectionRecord = {
  id: string
  name: string
  description?: string
  createdAt: number
  updatedAt: number
}

export type CategoryRecord = {
  id: string
  label: string
  icon: string
}

export type StorageResult<T> =
  | { success: true; data: T }
  | { success: false; error: StorageError }

export type StorageErrorKind =
  | 'QUOTA_EXCEEDED'
  | 'CORRUPTED_DATA'
  | 'NOT_FOUND'
  | 'STORAGE_UNAVAILABLE'
  | 'OPFS_UNSUPPORTED'
  | 'FILE_WRITE_FAILED'
  | 'FILE_READ_FAILED'
  | 'INVALID_INPUT'

export class StorageError extends Error {
  readonly kind: StorageErrorKind

  constructor(kind: StorageErrorKind, message: string) {
    super(message)
    this.name = 'StorageError'
    this.kind = kind
  }
}

export type LocalVaultSettings = {
  version: number
  storageType: 'localStorage-and-OPFS'
  lastBackupDate?: number
  theme: 'dark'
}

export const STORAGE_KEYS = {
  INSPIRATIONS: 'inspovault_records_v1',
  COLLECTIONS: 'inspovault_collections_v1',
  CATEGORIES: 'inspovault_categories_v1',
  SETTINGS: 'inspovault_settings_v1',
} as const
