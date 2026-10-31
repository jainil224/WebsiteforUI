import { getCategoryLabel } from '../data/categories'
import type { InspirationRecord } from './storageTypes'

export type SortOption = 'newest' | 'oldest' | 'title' | 'updated'

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest saved' },
  { value: 'oldest', label: 'Oldest saved' },
  { value: 'title', label: 'Title (A–Z)' },
  { value: 'updated', label: 'Recently updated' },
]

/**
 * Normalizes tags for comparison and matching (case-insensitive, trims whitespace and leading '#').
 */
export function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#+/, '').toLowerCase()
}

/**
 * Collects all unique normalized tags across an array of records with their occurrence count.
 */
export function extractUniqueTags(
  items: InspirationRecord[],
): { tag: string; count: number }[] {
  const counts = new Map<string, { display: string; count: number }>()

  for (const item of items) {
    if (!Array.isArray(item.tags)) continue
    for (const rawTag of item.tags) {
      const clean = normalizeTag(rawTag)
      if (!clean) continue
      const existing = counts.get(clean)
      if (existing) {
        existing.count += 1
      } else {
        counts.set(clean, { display: rawTag.trim().replace(/^#+/, ''), count: 1 })
      }
    }
  }

  return Array.from(counts.entries())
    .map(([clean, data]) => ({ tag: clean, count: data.count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export type FilterOptions = {
  query?: string
  categoryId?: string
  selectedTag?: string
  collectionId?: string
  onlyFavorites?: boolean
  sort?: SortOption
  collections?: import('./storageTypes').CollectionRecord[]
}

/**
 * Comprehensive filter and sort function combining search, category, tag, collection, favorite, and sorting.
 */
export function filterAndSortItems(
  items: InspirationRecord[],
  options: FilterOptions,
): InspirationRecord[] {
  const {
    query = '',
    categoryId = '',
    selectedTag = '',
    collectionId = '',
    onlyFavorites = false,
    sort = 'newest',
    collections = [],
  } = options

  const normalizedQuery = query.trim().toLowerCase()
  const targetTag = selectedTag ? normalizeTag(selectedTag) : ''

  // Build collection ID to name map for search matching
  const collectionNameMap = new Map<string, string>()
  for (const col of collections) {
    collectionNameMap.set(col.id, col.name.toLowerCase())
  }

  return items
    .filter((item) => {
      // Favorites filter
      if (onlyFavorites && !item.favorite) {
        return false
      }

      // Category filter
      if (categoryId && item.categoryId !== categoryId) {
        return false
      }

      // Collection filter
      if (collectionId && item.collectionId !== collectionId) {
        return false
      }

      // Tag filter
      if (targetTag) {
        const itemTags = Array.isArray(item.tags)
          ? item.tags.map(normalizeTag)
          : []
        if (!itemTags.includes(targetTag)) {
          return false
        }
      }

      // Query search
      if (!normalizedQuery) {
        return true
      }

      const assignedColName = item.collectionId ? collectionNameMap.get(item.collectionId) || '' : ''

      const searchable = [
        item.title,
        item.domain,
        item.note,
        item.url,
        getCategoryLabel(item.categoryId),
        assignedColName,
        ...(Array.isArray(item.tags) ? item.tags : []),
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalizedQuery)
    })
    .sort((a, b) => {
      switch (sort) {
        case 'oldest': {
          const diff = (a.createdAt || 0) - (b.createdAt || 0)
          return diff !== 0 ? diff : a.id.localeCompare(b.id)
        }
        case 'title': {
          const diff = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
          return diff !== 0 ? diff : (b.createdAt || 0) - (a.createdAt || 0)
        }
        case 'updated': {
          const aTime = a.updatedAt || a.createdAt || 0
          const bTime = b.updatedAt || b.createdAt || 0
          const diff = bTime - aTime
          return diff !== 0 ? diff : a.id.localeCompare(b.id)
        }
        case 'newest':
        default: {
          const diff = (b.createdAt || 0) - (a.createdAt || 0)
          return diff !== 0 ? diff : a.id.localeCompare(b.id)
        }
      }
    })
}
