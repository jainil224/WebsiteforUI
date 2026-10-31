import {
  type CollectionRecord,
  type InspirationRecord,
  type LocalVaultSettings,
  type StorageResult,
  STORAGE_KEYS,
  StorageError,
} from './storageTypes'
import { deleteLocalImageFile } from './opfsStorage'

/**
 * InspoVault LocalStorage Service
 * 100% browser-local persistence for inspiration records and user settings.
 * Does not communicate with any external backend, server, or database.
 */

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false
    }
    const testKey = '__inspovault_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Normalizes a URL ensuring valid protocol without destroying query/hash
 */
export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

/**
 * Extract clean hostname/domain from a URL string safely.
 */
export function extractDomain(rawUrl: string): string {
  try {
    const normalized = normalizeUrl(rawUrl)
    const parsed = new URL(normalized)
    return parsed.hostname.replace(/^www\./i, '')
  } catch {
    return rawUrl.split('/')[0] || 'link'
  }
}

/**
 * Retrieves all saved inspiration records from localStorage.
 */
export function getAllInspirations(): StorageResult<InspirationRecord[]> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: new StorageError(
        'STORAGE_UNAVAILABLE',
        'Browser localStorage is disabled or not available in this window.',
      ),
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.INSPIRATIONS)
    if (!raw) {
      return { success: true, data: [] }
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        error: new StorageError(
          'CORRUPTED_DATA',
          'Stored inspiration data is corrupted or in an invalid format.',
        ),
      }
    }

    return { success: true, data: parsed as InspirationRecord[] }
  } catch (err) {
    return {
      success: false,
      error: new StorageError(
        'CORRUPTED_DATA',
        `Failed to parse local storage records: ${err instanceof Error ? err.message : String(err)}`,
      ),
    }
  }
}

/**
 * Saves or updates the entire list of inspiration records in localStorage.
 */
function setAllInspirations(records: InspirationRecord[]): StorageResult<boolean> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: new StorageError('STORAGE_UNAVAILABLE', 'localStorage is unavailable.'),
    }
  }

  try {
    const serialized = JSON.stringify(records)
    window.localStorage.setItem(STORAGE_KEYS.INSPIRATIONS, serialized)
    return { success: true, data: true }
  } catch (err) {
    // Check for quota exceeded error
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED')

    if (isQuota) {
      return {
        success: false,
        error: new StorageError(
          'QUOTA_EXCEEDED',
          'Local browser storage quota has been exceeded. Free up space or remove unused items.',
        ),
      }
    }

    return {
      success: false,
      error: new StorageError(
        'STORAGE_UNAVAILABLE',
        `Could not write to localStorage: ${err instanceof Error ? err.message : String(err)}`,
      ),
    }
  }
}

/**
 * Creates and stores a new InspirationRecord locally.
 */
export function createInspiration(
  input: Omit<InspirationRecord, 'id' | 'createdAt' | 'updatedAt' | 'domain'> & {
    id?: string
    domain?: string
  },
): StorageResult<InspirationRecord> {
  if (!input.title || !input.title.trim()) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'A title is required to save an inspiration.'),
    }
  }

  if (!input.url || !input.url.trim()) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'A valid website URL is required.'),
    }
  }

  const existingRes = getAllInspirations()
  if (!existingRes.success) {
    return existingRes
  }

  const now = Date.now()
  const normalizedUrl = normalizeUrl(input.url)
  const domain = input.domain || extractDomain(normalizedUrl)
  const id = input.id || `insp_${now}_${Math.random().toString(36).slice(2, 9)}`

  const newRecord: InspirationRecord = {
    ...input,
    id,
    domain,
    title: input.title.trim(),
    url: normalizedUrl,
    note: input.note || '',
    categoryId: input.categoryId || 'other',
    tags: Array.isArray(input.tags) ? input.tags : [],
    favorite: Boolean(input.favorite),
    createdAt: now,
    updatedAt: now,
  }

  const updatedRecords = [newRecord, ...existingRes.data]
  const saveRes = setAllInspirations(updatedRecords)

  if (!saveRes.success) {
    return saveRes
  }

  return { success: true, data: newRecord }
}

/**
 * Reads a single inspiration record by ID.
 */
export function getInspirationById(id: string): StorageResult<InspirationRecord> {
  const allRes = getAllInspirations()
  if (!allRes.success) {
    return allRes
  }

  const found = allRes.data.find((item) => item.id === id)
  if (!found) {
    return {
      success: false,
      error: new StorageError('NOT_FOUND', `Inspiration with ID "${id}" was not found locally.`),
    }
  }

  return { success: true, data: found }
}

/**
 * Updates an existing inspiration record.
 */
export function updateInspiration(
  id: string,
  patch: Partial<Omit<InspirationRecord, 'id' | 'createdAt'>>,
): StorageResult<InspirationRecord> {
  const allRes = getAllInspirations()
  if (!allRes.success) {
    return allRes
  }

  const index = allRes.data.findIndex((item) => item.id === id)
  if (index === -1) {
    return {
      success: false,
      error: new StorageError('NOT_FOUND', `Inspiration with ID "${id}" does not exist.`),
    }
  }

  const existing = allRes.data[index]
  const updatedUrl = patch.url ? normalizeUrl(patch.url) : existing.url
  const updatedDomain = patch.url ? extractDomain(updatedUrl) : existing.domain

  const updatedRecord: InspirationRecord = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    url: updatedUrl,
    domain: updatedDomain,
    updatedAt: Date.now(),
  }

  const copy = [...allRes.data]
  copy[index] = updatedRecord

  const saveRes = setAllInspirations(copy)
  if (!saveRes.success) {
    return saveRes
  }

  return { success: true, data: updatedRecord }
}

/**
 * Deletes an inspiration record and cleans up any linked OPFS preview image file.
 */
export async function deleteInspiration(id: string): Promise<StorageResult<boolean>> {
  const allRes = getAllInspirations()
  if (!allRes.success) {
    return allRes
  }

  const recordToDelete = allRes.data.find((item) => item.id === id)
  if (!recordToDelete) {
    return {
      success: false,
      error: new StorageError('NOT_FOUND', `Inspiration with ID "${id}" not found.`),
    }
  }

  // If a local OPFS image file exists, remove it
  if (recordToDelete.imageFileName) {
    const imageResult = await deleteLocalImageFile(recordToDelete.imageFileName)
    if (!imageResult.success) return imageResult
  }

  const remaining = allRes.data.filter((item) => item.id !== id)
  const saveRes = setAllInspirations(remaining)

  if (!saveRes.success) {
    return saveRes
  }

  return { success: true, data: true }
}

/**
 * Toggles the favorite status of a saved inspiration.
 */
export function toggleFavorite(id: string): StorageResult<InspirationRecord> {
  const itemRes = getInspirationById(id)
  if (!itemRes.success) {
    return itemRes
  }

  return updateInspiration(id, { favorite: !itemRes.data.favorite })
}

/**
 * Settings helpers
 */
export function getLocalSettings(): LocalVaultSettings {
  const defaultSettings: LocalVaultSettings = {
    version: 1,
    storageType: 'localStorage-and-OPFS',
    theme: 'dark',
  }

  if (!isLocalStorageAvailable()) return defaultSettings

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

/**
 * Persists a complete local vault snapshot, rolling back earlier keys if a write fails.
 */
export function saveLibrarySnapshot(
  inspirations: InspirationRecord[],
  collections: CollectionRecord[],
  settings: LocalVaultSettings,
): StorageResult<boolean> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: new StorageError('STORAGE_UNAVAILABLE', 'localStorage is unavailable.'),
    }
  }

  const updates: Array<[string, string]> = [
    [STORAGE_KEYS.INSPIRATIONS, JSON.stringify(inspirations)],
    [STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections)],
    [STORAGE_KEYS.SETTINGS, JSON.stringify(settings)],
  ]
  const previous = updates.map(([key]) => [key, window.localStorage.getItem(key)] as const)
  let written = 0

  try {
    for (const [key, value] of updates) {
      window.localStorage.setItem(key, value)
      written += 1
    }
    return { success: true, data: true }
  } catch (err) {
    const rollbackErrors: string[] = []
    for (let index = written - 1; index >= 0; index -= 1) {
      const [key, value] = previous[index]
      try {
        if (value === null) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, value)
        }
      } catch (rollbackError) {
        rollbackErrors.push(
          rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
        )
      }
    }

    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    const cause = isQuota
      ? 'Local browser storage quota has been exceeded.'
      : `Could not persist the restored library: ${err instanceof Error ? err.message : String(err)}`
    const rollbackMessage = rollbackErrors.length
      ? ` The prior metadata could not be fully restored: ${rollbackErrors.join('; ')}`
      : ''

    return {
      success: false,
      error: new StorageError(isQuota ? 'QUOTA_EXCEEDED' : 'STORAGE_UNAVAILABLE', `${cause}${rollbackMessage}`),
    }
  }
}

export function exportLibraryJson(): StorageResult<string> {
  const inspirationRes = getAllInspirations()
  if (!inspirationRes.success) {
    return inspirationRes
  }

  const collectionRes = getAllCollections()
  if (!collectionRes.success) {
    return collectionRes
  }

  const payload = {
    version: 1,
    exportedAt: Date.now(),
    inspirations: inspirationRes.data,
    collections: collectionRes.data,
  }

  return {
    success: true,
    data: JSON.stringify(payload, null, 2),
  }
}

export function exportLibraryCsv(
  inspirations?: InspirationRecord[],
): StorageResult<string> {
  const sourceInspirations = inspirations ?? (() => {
    const result = getAllInspirations()
    return result.success ? result.data : []
  })()

  const rows: string[] = []
  const header = [
    'id',
    'title',
    'url',
    'domain',
    'note',
    'categoryId',
    'tags',
    'favorite',
    'collectionId',
    'createdAt',
    'updatedAt',
  ]

  const escapeCell = (value: string | number | boolean | undefined) => {
    const text = String(value ?? '')
    const escaped = text.replace(/"/g, '""')
    return /[",\n]/.test(text) ? `"${escaped}"` : escaped
  }

  rows.push(header.map(escapeCell).join(','))

  sourceInspirations.forEach((item) => {
    rows.push(
      [
        item.id,
        item.title,
        item.url,
        item.domain,
        item.note,
        item.categoryId,
        item.tags.join(' | '),
        item.favorite,
        item.collectionId ?? '',
        item.createdAt,
        item.updatedAt,
      ]
        .map(escapeCell)
        .join(','),
    )
  })

  return {
    success: true,
    data: rows.join('\n'),
  }
}

export function importLibraryFromJson(
  rawJson: string,
): StorageResult<{
  importedInspirations: number
  importedCollections: number
  skipped: number
  warnings: string[]
}> {
  let payload: unknown

  try {
    payload = JSON.parse(rawJson)
  } catch {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The import file is not valid JSON.'),
    }
  }

  if (!payload || typeof payload !== 'object') {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'The import file is missing library data.'),
    }
  }

  const candidate = payload as {
    inspirations?: unknown[]
    collections?: unknown[]
    records?: unknown[]
    items?: unknown[]
  }

  const importedInspirations = Array.isArray(candidate.inspirations)
    ? candidate.inspirations
    : Array.isArray(candidate.records)
      ? candidate.records
      : Array.isArray(candidate.items)
        ? candidate.items
        : []

  const importedCollections = Array.isArray(candidate.collections) ? candidate.collections : []

  const inspirationsRes = getAllInspirations()
  if (!inspirationsRes.success) {
    return inspirationsRes
  }

  const collectionsRes = getAllCollections()
  if (!collectionsRes.success) {
    return collectionsRes
  }

  const existingUrlSet = new Set(
    inspirationsRes.data.map((item) => normalizeUrl(item.url).toLowerCase()),
  )
  const existingCollectionNames = new Set(
    collectionsRes.data.map((item) => item.name.trim().toLowerCase()),
  )

  const mergedInspirations = [...inspirationsRes.data]
  const mergedCollections = [...collectionsRes.data]
  const warnings: string[] = []
  let skipped = 0

  for (const rawInspiration of importedInspirations) {
    if (!rawInspiration || typeof rawInspiration !== 'object') {
      skipped += 1
      warnings.push('Skipped one malformed inspiration entry.')
      continue
    }

    const inspiration = rawInspiration as Partial<InspirationRecord>
    const title = String(inspiration.title ?? '').trim()
    const rawUrl = String(inspiration.url ?? '').trim()

    if (!title || !rawUrl) {
      skipped += 1
      warnings.push('Skipped one inspiration without a title or URL.')
      continue
    }

    const normalizedUrl = normalizeUrl(rawUrl)
    const urlKey = normalizedUrl.toLowerCase()

    if (existingUrlSet.has(urlKey)) {
      skipped += 1
      continue
    }

    const id =
      typeof inspiration.id === 'string' && inspiration.id.trim()
        ? inspiration.id.trim()
        : `insp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    const nextItem: InspirationRecord = {
      id,
      url: normalizedUrl,
      title,
      domain: inspiration.domain || extractDomain(normalizedUrl),
      note: typeof inspiration.note === 'string' ? inspiration.note : '',
      categoryId: inspiration.categoryId || 'other',
      tags: Array.isArray(inspiration.tags) ? inspiration.tags.map(String).filter(Boolean) : [],
      favorite: Boolean(inspiration.favorite),
      collectionId: inspiration.collectionId || undefined,
      imageFileName: inspiration.imageFileName || undefined,
      imageMimeType: inspiration.imageMimeType || undefined,
      createdAt: Number(inspiration.createdAt) || Date.now(),
      updatedAt: Number(inspiration.updatedAt) || Date.now(),
    }

    mergedInspirations.push(nextItem)
    existingUrlSet.add(urlKey)
  }

  for (const rawCollection of importedCollections) {
    if (!rawCollection || typeof rawCollection !== 'object') {
      skipped += 1
      warnings.push('Skipped one malformed collection entry.')
      continue
    }

    const collection = rawCollection as Partial<import('./storageTypes').CollectionRecord>
    const name = String(collection.name ?? '').trim()

    if (!name) {
      skipped += 1
      warnings.push('Skipped one collection without a name.')
      continue
    }

    const lowerName = name.toLowerCase()
    if (existingCollectionNames.has(lowerName)) {
      skipped += 1
      continue
    }

    const nextCollection: import('./storageTypes').CollectionRecord = {
      id:
        typeof collection.id === 'string' && collection.id.trim()
          ? collection.id.trim()
          : `col_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name,
      description: typeof collection.description === 'string' ? collection.description : undefined,
      createdAt: Number(collection.createdAt) || Date.now(),
      updatedAt: Number(collection.updatedAt) || Date.now(),
    }

    mergedCollections.push(nextCollection)
    existingCollectionNames.add(lowerName)
  }

  const saveInspirations = setAllInspirations(mergedInspirations)
  if (!saveInspirations.success) {
    return saveInspirations
  }

  const saveCollections = setAllCollections(mergedCollections)
  if (!saveCollections.success) {
    return saveCollections
  }

  return {
    success: true,
    data: {
      importedInspirations: mergedInspirations.length - inspirationsRes.data.length,
      importedCollections: mergedCollections.length - collectionsRes.data.length,
      skipped,
      warnings,
    },
  }
}

export async function clearLocalLibraryData(): Promise<StorageResult<boolean>> {
  try {
    const inspirationRes = getAllInspirations()
    if (inspirationRes.success) {
      const imageFiles = inspirationRes.data
        .map((item) => item.imageFileName)
        .filter((name): name is string => Boolean(name))

      for (const fileName of imageFiles) {
        const deletionResult = await deleteLocalImageFile(fileName)
        if (!deletionResult.success) return deletionResult
      }
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.INSPIRATIONS)
      window.localStorage.removeItem(STORAGE_KEYS.COLLECTIONS)
      window.localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    }

    return { success: true, data: true }
  } catch (err) {
    return {
      success: false,
      error: new StorageError(
        'STORAGE_UNAVAILABLE',
        err instanceof Error ? err.message : 'Failed to clear the local library data.',
      ),
    }
  }
}

// ---------------------------------------------------------------------------
// Collections Storage Operations (100% LocalStorage)
// ---------------------------------------------------------------------------

/**
 * Retrieves all saved collections from localStorage.
 */
export function getAllCollections(): StorageResult<import('./storageTypes').CollectionRecord[]> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: new StorageError(
        'STORAGE_UNAVAILABLE',
        'Browser localStorage is disabled or not available in this window.',
      ),
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.COLLECTIONS)
    if (!raw) {
      return { success: true, data: [] }
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        error: new StorageError(
          'CORRUPTED_DATA',
          'Stored collection data is corrupted or in an invalid format.',
        ),
      }
    }

    return { success: true, data: parsed as import('./storageTypes').CollectionRecord[] }
  } catch (err) {
    return {
      success: false,
      error: new StorageError(
        'CORRUPTED_DATA',
        `Failed to parse local collection records: ${err instanceof Error ? err.message : String(err)}`,
      ),
    }
  }
}

/**
 * Saves all collection records to localStorage.
 */
function setAllCollections(
  collections: import('./storageTypes').CollectionRecord[],
): StorageResult<boolean> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: new StorageError('STORAGE_UNAVAILABLE', 'localStorage is unavailable.'),
    }
  }

  try {
    const serialized = JSON.stringify(collections)
    window.localStorage.setItem(STORAGE_KEYS.COLLECTIONS, serialized)
    return { success: true, data: true }
  } catch (err) {
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED')

    if (isQuota) {
      return {
        success: false,
        error: new StorageError(
          'QUOTA_EXCEEDED',
          'Local browser storage quota has been exceeded.',
        ),
      }
    }

    return {
      success: false,
      error: new StorageError(
        'STORAGE_UNAVAILABLE',
        `Could not write collections to localStorage: ${err instanceof Error ? err.message : String(err)}`,
      ),
    }
  }
}

/**
 * Creates and stores a new CollectionRecord locally.
 */
export function createCollection(input: {
  name: string
  description?: string
}): StorageResult<import('./storageTypes').CollectionRecord> {
  const trimmedName = input.name.trim()
  if (!trimmedName) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'A collection name is required.'),
    }
  }

  const existingRes = getAllCollections()
  if (!existingRes.success) {
    return existingRes
  }

  // Prevent duplicate names (case-insensitive)
  const isDuplicate = existingRes.data.some(
    (col) => col.name.trim().toLowerCase() === trimmedName.toLowerCase(),
  )
  if (isDuplicate) {
    return {
      success: false,
      error: new StorageError(
        'INVALID_INPUT',
        `A collection named "${trimmedName}" already exists.`,
      ),
    }
  }

  const now = Date.now()
  const id = `col_${now}_${Math.random().toString(36).slice(2, 9)}`
  const newRecord: import('./storageTypes').CollectionRecord = {
    id,
    name: trimmedName,
    description: input.description?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  }

  const updatedCollections = [newRecord, ...existingRes.data]
  const saveRes = setAllCollections(updatedCollections)
  if (!saveRes.success) {
    return saveRes
  }

  return { success: true, data: newRecord }
}

/**
 * Gets a collection by its ID.
 */
export function getCollectionById(
  id: string,
): StorageResult<import('./storageTypes').CollectionRecord> {
  const allRes = getAllCollections()
  if (!allRes.success) {
    return allRes
  }

  const found = allRes.data.find((col) => col.id === id)
  if (!found) {
    return {
      success: false,
      error: new StorageError('NOT_FOUND', `Collection with ID "${id}" was not found locally.`),
    }
  }

  return { success: true, data: found }
}

/**
 * Updates an existing collection record.
 */
export function updateCollection(
  id: string,
  patch: { name?: string; description?: string },
): StorageResult<import('./storageTypes').CollectionRecord> {
  const allRes = getAllCollections()
  if (!allRes.success) {
    return allRes
  }

  const index = allRes.data.findIndex((col) => col.id === id)
  if (index === -1) {
    return {
      success: false,
      error: new StorageError('NOT_FOUND', `Collection with ID "${id}" does not exist.`),
    }
  }

  const existing = allRes.data[index]
  const updatedName = patch.name !== undefined ? patch.name.trim() : existing.name

  if (!updatedName) {
    return {
      success: false,
      error: new StorageError('INVALID_INPUT', 'A collection name cannot be blank.'),
    }
  }

  // Check name uniqueness if changed
  if (updatedName.toLowerCase() !== existing.name.toLowerCase()) {
    const isDuplicate = allRes.data.some(
      (col) => col.id !== id && col.name.trim().toLowerCase() === updatedName.toLowerCase(),
    )
    if (isDuplicate) {
      return {
        success: false,
        error: new StorageError(
          'INVALID_INPUT',
          `A collection named "${updatedName}" already exists.`,
        ),
      }
    }
  }

  const updatedRecord: import('./storageTypes').CollectionRecord = {
    ...existing,
    name: updatedName,
    description:
      patch.description !== undefined
        ? patch.description.trim() || undefined
        : existing.description,
    updatedAt: Date.now(),
  }

  const copy = [...allRes.data]
  copy[index] = updatedRecord

  const saveRes = setAllCollections(copy)
  if (!saveRes.success) {
    return saveRes
  }

  return { success: true, data: updatedRecord }
}

/**
 * Deletes a collection safely.
 * IMPORTANT: Deleting a collection NEVER deletes its underlying inspirations or screenshots.
 * It clears the collectionId assignment from any affected inspirations.
 */
export function deleteCollection(id: string): StorageResult<boolean> {
  const allRes = getAllCollections()
  if (!allRes.success) {
    return allRes
  }

  const found = allRes.data.some((col) => col.id === id)
  if (!found) {
    return {
      success: false,
      error: new StorageError('NOT_FOUND', `Collection with ID "${id}" not found.`),
    }
  }

  // 1. Remove collection record
  const remainingCollections = allRes.data.filter((col) => col.id !== id)
  const saveColRes = setAllCollections(remainingCollections)
  if (!saveColRes.success) {
    return saveColRes
  }

  // 2. Cascade: Unlink any inspiration records referencing this collectionId
  const allInspRes = getAllInspirations()
  if (allInspRes.success && allInspRes.data.length > 0) {
    let hasChanges = false
    const updatedInspirations = allInspRes.data.map((insp) => {
      if (insp.collectionId === id) {
        hasChanges = true
        const { collectionId: _, ...rest } = insp
        return {
          ...rest,
          updatedAt: Date.now(),
        }
      }
      return insp
    })

    if (hasChanges) {
      setAllInspirations(updatedInspirations)
    }
  }

  return { success: true, data: true }
}
