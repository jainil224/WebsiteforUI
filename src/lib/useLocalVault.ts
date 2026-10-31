import { useCallback, useState } from 'react'
import type { CollectionRecord, InspirationRecord } from './storageTypes'
import {
  getAllInspirations,
  createInspiration,
  updateInspiration,
  deleteInspiration,
  toggleFavorite,
  getAllCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from './localVaultStorage'
import { isOPFSSupported } from './opfsStorage'

function loadInitialVault(): {
  items: InspirationRecord[]
  collections: CollectionRecord[]
  error: string | null
} {
  const itemsRes = getAllInspirations()
  const collectionsRes = getAllCollections()

  let error: string | null = null
  if (!itemsRes.success) {
    error = itemsRes.error.message
  } else if (!collectionsRes.success) {
    error = collectionsRes.error.message
  }

  return {
    items: itemsRes.success ? itemsRes.data : [],
    collections: collectionsRes.success ? collectionsRes.data : [],
    error,
  }
}

export function useLocalVault() {
  const [initialData] = useState(loadInitialVault)
  const [items, setItems] = useState<InspirationRecord[]>(initialData.items)
  const [collections, setCollections] = useState<CollectionRecord[]>(initialData.collections)
  const [loading, setLoading] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(initialData.error)
  const [opfsAvailable] = useState(() => isOPFSSupported())

  const reloadAll = useCallback(() => {
    const itemsRes = getAllInspirations()
    const colsRes = getAllCollections()

    if (itemsRes.success) {
      setItems(itemsRes.data)
    } else {
      setStorageError(itemsRes.error.message)
    }

    if (colsRes.success) {
      setCollections(colsRes.data)
    } else {
      setStorageError(colsRes.error.message)
    }

    if (itemsRes.success && colsRes.success) {
      setStorageError(null)
    }

    setLoading(false)
  }, [])

  const handleCreate = useCallback(
    (input: Parameters<typeof createInspiration>[0]) => {
      const res = createInspiration(input)
      if (res.success) {
        reloadAll()
        return res
      } else {
        setStorageError(res.error.message)
        return res
      }
    },
    [reloadAll],
  )

  const handleUpdate = useCallback(
    (id: string, patch: Parameters<typeof updateInspiration>[1]) => {
      const res = updateInspiration(id, patch)
      if (res.success) {
        reloadAll()
        return res
      } else {
        setStorageError(res.error.message)
        return res
      }
    },
    [reloadAll],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const res = await deleteInspiration(id)
      if (res.success) {
        reloadAll()
        return res
      } else {
        setStorageError(res.error.message)
        return res
      }
    },
    [reloadAll],
  )

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const res = toggleFavorite(id)
      if (res.success) {
        reloadAll()
        return res
      } else {
        setStorageError(res.error.message)
        return res
      }
    },
    [reloadAll],
  )

  // Collections Operations
  const handleCreateCollection = useCallback(
    (input: Parameters<typeof createCollection>[0]) => {
      const res = createCollection(input)
      if (res.success) {
        reloadAll()
        return res
      } else {
        setStorageError(res.error.message)
        return res
      }
    },
    [reloadAll],
  )

  const handleUpdateCollection = useCallback(
    (id: string, patch: Parameters<typeof updateCollection>[1]) => {
      const res = updateCollection(id, patch)
      if (res.success) {
        reloadAll()
        return res
      } else {
        setStorageError(res.error.message)
        return res
      }
    },
    [reloadAll],
  )

  const handleDeleteCollection = useCallback(
    (id: string) => {
      const res = deleteCollection(id)
      if (res.success) {
        reloadAll()
        return res
      } else {
        setStorageError(res.error.message)
        return res
      }
    },
    [reloadAll],
  )

  return {
    items,
    collections,
    loading,
    storageError,
    opfsAvailable,
    clearError: () => setStorageError(null),
    reloadItems: reloadAll,
    createInspiration: handleCreate,
    updateInspiration: handleUpdate,
    deleteInspiration: handleDelete,
    toggleFavorite: handleToggleFavorite,
    createCollection: handleCreateCollection,
    updateCollection: handleUpdateCollection,
    deleteCollection: handleDeleteCollection,
  }
}

