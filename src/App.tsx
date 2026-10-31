import { useMemo, useState } from 'react'
import { SidebarNav } from './components/SidebarNav'
import { MobileNavDrawer } from './components/MobileNavDrawer'
import { AppHeader } from './components/AppHeader'
import { EntryHero } from './components/EntryHero'
import { PublicLayout } from './components/PublicLayout'
import { FeaturesPage } from './components/FeaturesPage'
import { AboutPage } from './components/AboutPage'
import { DashboardView } from './components/DashboardView'
import { CollectionsView } from './components/CollectionsView'
import { SectionPlaceholder } from './components/SectionPlaceholder'
import { InspirationFormModal } from './components/InspirationFormModal'
import { InspirationDetailModal } from './components/InspirationDetailModal'
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal'
import { Icon } from './components/icons'
import { useHashRoute } from './lib/useHashRoute'
import { routeMeta } from './lib/routes'
import { extractUniqueTags, filterAndSortItems, type SortOption } from './lib/libraryFilters'
import {
  clearLocalLibraryData,
  exportLibraryCsv,
  exportLibraryJson,
  importLibraryFromJson,
} from './lib/localVaultStorage'
import {
  exportFullLocalBackup,
  restoreLocalBackup,
  type BackupRestoreMode,
  type BackupRestoreResult,
  type ParsedLocalBackup,
} from './lib/localBackup'
import type { StorageResult } from './lib/storageTypes'
import { useLocalVault } from './lib/useLocalVault'
import type { InspirationRecord } from './lib/storageTypes'
import { useDocumentTitle } from './lib/useDocumentTitle'

export function App() {
  const { path, category, navigate } = useHashRoute()
  const {
    items,
    collections,
    categories: vaultCategories,
    loading,
    storageError,
    opfsAvailable,
    clearError,
    reloadItems,
    createInspiration,
    updateInspiration,
    deleteInspiration,
    toggleFavorite,
    createCollection,
    updateCollection,
    deleteCollection,
    createCategory,
    deleteCategory,
  } = useLocalVault()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(category || '')
  const [selectedTag, setSelectedTag] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [presetCollectionId, setPresetCollectionId] = useState<string | undefined>(undefined)
  const [editingRecord, setEditingRecord] = useState<InspirationRecord | null>(null)
  const [viewingRecord, setViewingRecord] = useState<InspirationRecord | null>(null)
  const [recordToDelete, setRecordToDelete] = useState<InspirationRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const meta = routeMeta[path] || routeMeta['/dashboard']
  const isPublicRoute = path === '/' || path === '/features' || path === '/about'

  useDocumentTitle(
    isPublicRoute
      ? `${routeMeta[path].title} — InspoVault`
      : `${meta.title} — InspoVault`,
  )

  // Dynamically extract all unique tags from currently saved library records
  const availableTags = useMemo(() => {
    return extractUniqueTags(items)
  }, [items])

  // Filtered items for Dashboard / All Inspirations
  const filteredItems = useMemo(() => {
    return filterAndSortItems(items, {
      query: searchQuery,
      categoryId: selectedCategory,
      selectedTag,
      onlyFavorites: false,
      sort,
      collections,
    })
  }, [items, searchQuery, selectedCategory, selectedTag, sort, collections])

  // Filtered items for Favorites view
  const filteredFavorites = useMemo(() => {
    return filterAndSortItems(items, {
      query: searchQuery,
      categoryId: selectedCategory,
      selectedTag,
      onlyFavorites: true,
      sort,
      collections,
    })
  }, [items, searchQuery, selectedCategory, selectedTag, sort, collections])

  // Keep viewingRecord in sync if it gets updated (e.g. favorite toggle)
  const activeViewingRecord = useMemo(() => {
    if (!viewingRecord) return null
    return items.find((item) => item.id === viewingRecord.id) || viewingRecord
  }, [items, viewingRecord])

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedTag('')
    setSort('newest')
  }

  const handleSelectCategoryFromView = (catId: string) => {
    setSelectedCategory(catId)
    navigate('/dashboard')
  }

  const handleOpenAddModal = (colId?: string) => {
    setPresetCollectionId(colId)
    setIsAddModalOpen(true)
  }

  const handleRemoveFromCollection = (item: InspirationRecord) => {
    const { collectionId: _, ...rest } = item
    updateInspiration(item.id, {
      ...rest,
      collectionId: undefined,
    })
  }

  const handleSaveInspiration = async (recordData: {
    url: string
    title: string
    note: string
    categoryId: string
    tags: string[]
    favorite: boolean
    collectionId?: string
    imageFileName?: string
  }) => {
    if (editingRecord) {
      const res = updateInspiration(editingRecord.id, recordData)
      if (res.success) {
        setEditingRecord(null)
        if (viewingRecord?.id === editingRecord.id) {
          setViewingRecord(res.data)
        }
        return { success: true }
      }
      return { success: false, error: res.error }
    } else {
      const res = createInspiration(recordData)
      if (res.success) {
        setIsAddModalOpen(false)
        setPresetCollectionId(undefined)
        return { success: true }
      }
      return { success: false, error: res.error }
    }
  }

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteInspiration(recordToDelete.id)
      if (res.success) {
        setRecordToDelete(null)
        if (viewingRecord?.id === recordToDelete.id) {
          setViewingRecord(null)
        }
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    const res = exportLibraryJson()
    if (!res.success) {
      window.alert(res.error.message)
      return
    }

    downloadFile(res.data, `inspovault-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json')
  }

  const handleExportFullBackup = async (
    onProgress: (message: string) => void,
  ): Promise<StorageResult<{ summary: { inspirations: number; collections: number; screenshots: number; missingScreenshots: number }; warnings: string[] }>> => {
    const result = await exportFullLocalBackup(onProgress)
    if (!result.success) return result

    const url = URL.createObjectURL(result.data.blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `inspovault-full-backup-${new Date().toISOString().slice(0, 10)}.zip`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    return {
      success: true,
      data: { summary: result.data.summary, warnings: result.data.warnings },
    }
  }

  const handleRestoreBackup = async (
    backup: ParsedLocalBackup,
    mode: BackupRestoreMode,
    onProgress: (message: string) => void,
  ): Promise<StorageResult<BackupRestoreResult>> => {
    const result = await restoreLocalBackup(backup, mode, onProgress)
    if (result.success) reloadItems()
    return result
  }

  const handleExportCsv = () => {
    const res = exportLibraryCsv(items)
    if (!res.success) {
      window.alert(res.error.message)
      return
    }

    downloadFile(res.data, `inspovault-export-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;')
  }

  const handleImportJson = async (file: File) => {
    const text = await file.text()
    const res = importLibraryFromJson(text)

    if (!res.success) {
      return { success: false, error: res.error }
    }

    reloadItems()
    return { success: true }
  }

  const handleClearData = async () => {
    const confirmed = window.confirm(
      'Clear all locally saved inspirations and collections? This cannot be undone.',
    )

    if (!confirmed) {
      return { success: false, error: new Error('Cancelled by user.') }
    }

    const res = await clearLocalLibraryData()
    if (res.success) {
      reloadItems()
      return { success: true }
    }

    return { success: false, error: res.error }
  }

  if (isPublicRoute) {
    return (
      <PublicLayout
        path={path}
        onEnter={() => navigate('/dashboard')}
      >
        {path === '/' && <EntryHero onEnter={() => navigate('/dashboard')} />}
        {path === '/features' && (
          <FeaturesPage onEnter={() => navigate('/dashboard')} />
        )}
        {path === '/about' && <AboutPage onEnter={() => navigate('/dashboard')} />}
      </PublicLayout>
    )
  }

  return (
    <div className="app" id="top">
      <a className="skip-link btn btn--primary" href="#main-content">
        Skip to content
      </a>

      {/* Desktop Sidebar */}
      <SidebarNav currentPath={path} />

      {/* Mobile Drawer */}
      <MobileNavDrawer
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentPath={path}
      />

      {/* Main Content Area */}
      <div className="app-main-container">
        {storageError && (
          <div className="storage-error-banner" role="alert">
            <span className="storage-error-banner__icon">
              <Icon name="close" size={16} />
            </span>
            <div className="storage-error-banner__text">
              <strong>Local Storage Notice:</strong> {storageError}
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={clearError}
              aria-label="Dismiss error notice"
            >
              Dismiss
            </button>
          </div>
        )}

        <AppHeader
          title={meta.title}
          eyebrow={meta.eyebrow}
          description={meta.description}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => handleOpenAddModal()}
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
          totalCount={items.length}
          showIntro={path !== '/dashboard'}
        />

        <main id="main-content" className="app-main">
          {loading ? (
            <div className="vault-loading-skeleton" aria-label="Loading local vault">
              <div className="skeleton skeleton--media" />
              <div className="skeleton skeleton--text" />
              <div className="skeleton skeleton--text-sm" />
            </div>
          ) : path === '/dashboard' || path === '/inspirations' ? (
            <DashboardView
              items={items}
              categories={vaultCategories}
              filteredItems={filteredItems}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              availableTags={availableTags}
              sort={sort}
              onSelectCategory={setSelectedCategory}
              onSelectTag={setSelectedTag}
              onSortChange={setSort}
              onClearFilters={handleClearFilters}
              onOpenAddModal={() => handleOpenAddModal()}
              onToggleFavorite={toggleFavorite}
              onSelectRecord={setViewingRecord}
              onEditRecord={setEditingRecord}
              onDeleteRecord={setRecordToDelete}
            />
          ) : path === '/collections' ? (
            <CollectionsView
              collections={collections}
              items={items}
              categories={vaultCategories}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              availableTags={availableTags}
              sort={sort}
              onSelectCategory={setSelectedCategory}
              onSelectTag={setSelectedTag}
              onSortChange={setSort}
              onClearFilters={handleClearFilters}
              onOpenAddModal={handleOpenAddModal}
              onToggleFavorite={toggleFavorite}
              onSelectRecord={setViewingRecord}
              onEditRecord={setEditingRecord}
              onDeleteRecord={setRecordToDelete}
              onRemoveFromCollection={handleRemoveFromCollection}
              onCreateCollection={createCollection}
              onUpdateCollection={updateCollection}
              onDeleteCollection={deleteCollection}
            />
          ) : (
            <SectionPlaceholder
              path={path}
              items={items}
              categories={vaultCategories}
              filteredFavorites={filteredFavorites}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              availableTags={availableTags}
              sort={sort}
              onSelectCategory={handleSelectCategoryFromView}
              onSelectTag={setSelectedTag}
              onSortChange={setSort}
              onClearFilters={handleClearFilters}
              onOpenAddModal={() => handleOpenAddModal()}
              onToggleFavorite={toggleFavorite}
              onSelectRecord={setViewingRecord}
              onEditRecord={setEditingRecord}
              onDeleteRecord={setRecordToDelete}
              onCreateCategory={createCategory}
              onDeleteCategory={deleteCategory}
              onExportJson={handleExportJson}
              onExportFullBackup={handleExportFullBackup}
              onRestoreBackup={handleRestoreBackup}
              onImportJson={handleImportJson}
              onExportCsv={handleExportCsv}
              onClearData={handleClearData}
              opfsAvailable={opfsAvailable}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>No feed. No database. 100% local ideas worth keeping.</p>
          <div className="footer-end">
            <p className="footer-note">InspoVault</p>
            <a className="back-to-top btn btn--ghost" href="#top">
              <span className="back-to-top__icon" aria-hidden="true">
                <Icon name="arrow-right" size={12} />
              </span>
              Back to top
            </a>
          </div>
        </footer>
      </div>

      {/* Add / Edit Inspiration Modal */}
      {(isAddModalOpen || editingRecord) && (
        <InspirationFormModal
          open={isAddModalOpen || Boolean(editingRecord)}
          mode={editingRecord ? 'edit' : 'add'}
          initialRecord={editingRecord}
          existingRecords={items}
          collections={collections}
          categories={vaultCategories}
          initialCollectionId={presetCollectionId}
          onClose={() => {
            setIsAddModalOpen(false)
            setEditingRecord(null)
            setPresetCollectionId(undefined)
          }}
          onSave={handleSaveInspiration}
        />
      )}

      {/* Detail Modal */}
      {activeViewingRecord && (
        <InspirationDetailModal
          item={activeViewingRecord}
          collections={collections}
          onClose={() => setViewingRecord(null)}
          onEdit={(item) => {
            setViewingRecord(null)
            setEditingRecord(item)
          }}
          onDelete={(item) => {
            setRecordToDelete(item)
          }}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Confirm Delete Modal */}
      {recordToDelete && (
        <ConfirmDeleteModal
          open={Boolean(recordToDelete)}
          title={recordToDelete.title}
          isDeleting={isDeleting}
          onClose={() => setRecordToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

export default App
