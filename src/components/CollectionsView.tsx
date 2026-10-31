import { useState, useMemo } from 'react'
import { Icon } from './icons'
import { InspirationCard } from './InspirationCard'
import { FilterToolbar } from './FilterToolbar'
import { filterAndSortItems, type SortOption } from '../lib/libraryFilters'
import { CollectionModal } from './CollectionModal'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import type { CollectionRecord, InspirationRecord } from '../lib/storageTypes'

type CollectionsViewProps = {
  collections: CollectionRecord[]
  items: InspirationRecord[]
  selectedCollectionId?: string
  searchQuery: string
  selectedCategory: string
  selectedTag: string
  availableTags: { tag: string; count: number }[]
  sort: SortOption
  onSelectCategory: (categoryId: string) => void
  onSelectTag: (tag: string) => void
  onSortChange: (sort: SortOption) => void
  onClearFilters: () => void
  onOpenAddModal: (collectionId?: string) => void
  onToggleFavorite: (id: string) => void
  onSelectRecord: (item: InspirationRecord) => void
  onEditRecord: (item: InspirationRecord) => void
  onDeleteRecord: (item: InspirationRecord) => void
  onRemoveFromCollection: (item: InspirationRecord) => void
  onCreateCollection: (data: { name: string; description?: string }) => { success: boolean; error?: Error }
  onUpdateCollection: (id: string, data: { name: string; description?: string }) => { success: boolean; error?: Error }
  onDeleteCollection: (id: string) => { success: boolean; error?: Error }
}

export function CollectionsView({
  collections,
  items,
  selectedCollectionId: initialSelectedCollectionId,
  searchQuery,
  selectedCategory,
  selectedTag,
  availableTags,
  sort,
  onSelectCategory,
  onSelectTag,
  onSortChange,
  onClearFilters,
  onOpenAddModal,
  onToggleFavorite,
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
  onRemoveFromCollection,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
}: CollectionsViewProps) {
  // If an initial collection ID was passed (or user clicked a collection), we display that collection's detail view
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
    initialSelectedCollectionId || null,
  )

  // Modals for Collection Management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<CollectionRecord | null>(null)
  const [collectionToDelete, setCollectionToDelete] = useState<CollectionRecord | null>(null)
  const [isDeletingCol, setIsDeletingCol] = useState(false)

  // Active collection object if in detail view
  const currentCollection = useMemo(() => {
    if (!activeCollectionId) return null
    return collections.find((col) => col.id === activeCollectionId) || null
  }, [collections, activeCollectionId])

  // Map of collection ID to assigned items
  const collectionItemsMap = useMemo(() => {
    const map = new Map<string, InspirationRecord[]>()
    for (const item of items) {
      if (item.collectionId) {
        const list = map.get(item.collectionId) || []
        list.push(item)
        map.set(item.collectionId, list)
      }
    }
    return map
  }, [items])

  // Filtered items when inside a Collection Detail view
  const filteredCollectionItems = useMemo(() => {
    if (!activeCollectionId) return []
    return filterAndSortItems(items, {
      query: searchQuery,
      categoryId: selectedCategory,
      selectedTag,
      collectionId: activeCollectionId,
      sort,
      collections,
    })
  }, [items, searchQuery, selectedCategory, selectedTag, activeCollectionId, sort, collections])

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory || selectedTag)

  const handleConfirmDeleteCollection = () => {
    if (!collectionToDelete) return
    setIsDeletingCol(true)
    try {
      const res = onDeleteCollection(collectionToDelete.id)
      if (res.success) {
        if (activeCollectionId === collectionToDelete.id) {
          setActiveCollectionId(null)
        }
        setCollectionToDelete(null)
      }
    } finally {
      setIsDeletingCol(false)
    }
  }

  // -------------------------------------------------------------------------
  // 1. COLLECTION DETAIL VIEW (When a collection is opened)
  // -------------------------------------------------------------------------
  if (currentCollection) {
    const totalAssigned = (collectionItemsMap.get(currentCollection.id) || []).length
    const isFilteredEmpty = filteredCollectionItems.length === 0 && totalAssigned > 0

    return (
      <div className="collection-detail-view" aria-label={`Collection ${currentCollection.name}`}>
        {/* Navigation Breadcrumb / Back Button */}
        <div className="collection-detail-header">
          <div className="collection-breadcrumb">
            <button
              type="button"
              className="btn btn--ghost btn--sm collection-back-btn"
              onClick={() => setActiveCollectionId(null)}
              aria-label="Back to all collections"
            >
              <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
                <Icon name="arrow-right" size={14} />
              </span>
              <span>All Collections</span>
            </button>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            <span className="breadcrumb-current">{currentCollection.name}</span>
          </div>

          <div className="collection-header-actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setEditingCollection(currentCollection)}
            >
              <Icon name="edit" size={14} />
              <span>Edit Collection</span>
            </button>
            <button
              type="button"
              className="btn btn--destructive btn--sm"
              onClick={() => setCollectionToDelete(currentCollection)}
            >
              <Icon name="trash" size={14} />
              <span>Delete</span>
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => onOpenAddModal(currentCollection.id)}
            >
              <Icon name="plus" size={14} />
              <span>Add Inspiration Here</span>
            </button>
          </div>
        </div>

        {/* Collection Overview Banner */}
        <div className="card collection-info-banner">
          <div className="collection-info-banner__icon" aria-hidden="true">
            <Icon name="folder" size={24} />
          </div>
          <div className="collection-info-banner__body">
            <h1 className="collection-info-banner__title">{currentCollection.name}</h1>
            {currentCollection.description && (
              <p className="collection-info-banner__desc">{currentCollection.description}</p>
            )}
            <div className="collection-info-banner__meta">
              <span className="chip chip--tag">
                {totalAssigned} {totalAssigned === 1 ? 'inspiration' : 'inspirations'}
              </span>
              <span className="collection-meta-text">
                Created {new Date(currentCollection.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Filter and sorting toolbar within the collection */}
        {totalAssigned > 0 && (
          <FilterToolbar
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            selectedTag={selectedTag}
            onSelectTag={onSelectTag}
            availableTags={availableTags}
            sort={sort}
            onSortChange={onSortChange}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
            resultCount={filteredCollectionItems.length}
          />
        )}

        {/* Inspirations inside Collection */}
        {totalAssigned === 0 ? (
          <section className="empty-state collection-empty-state" aria-label="Empty collection">
            <div className="empty-state__icon" aria-hidden="true">
              <Icon name="spark" size={24} />
            </div>
            <h2 className="empty-state__title">This collection is empty</h2>
            <p className="empty-state__text">
              Save new inspiration references directly to &ldquo;{currentCollection.name}&rdquo; or edit existing references to assign them to this collection.
            </p>
            <div className="empty-state__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onOpenAddModal(currentCollection.id)}
              >
                <Icon name="plus" size={16} />
                <span>Add Inspiration</span>
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setActiveCollectionId(null)}
              >
                View Other Collections
              </button>
            </div>
          </section>
        ) : isFilteredEmpty ? (
          <section className="empty-state collection-empty-state" aria-label="No matching inspirations">
            <div className="empty-state__icon" aria-hidden="true">
              <Icon name="search" size={24} />
            </div>
            <h2 className="empty-state__title">No inspirations match your filters</h2>
            <p className="empty-state__text">
              None of the {totalAssigned} references in &ldquo;{currentCollection.name}&rdquo; match your current search or filters.
            </p>
            <div className="empty-state__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={onClearFilters}
              >
                Reset filters
              </button>
            </div>
          </section>
        ) : (
          <div className="inspirations-grid">
            {filteredCollectionItems.map((item) => (
              <InspirationCard
                key={item.id}
                item={item}
                onSelect={onSelectRecord}
                onEdit={onEditRecord}
                onDelete={onDeleteRecord}
                onFavoriteClick={onToggleFavorite}
                onRemoveFromCollection={onRemoveFromCollection}
              />
            ))}
          </div>
        )}

        {/* Edit Collection Modal */}
        {editingCollection && (
          <CollectionModal
            open={Boolean(editingCollection)}
            mode="edit"
            collection={editingCollection}
            existingCollections={collections}
            onClose={() => setEditingCollection(null)}
            onSave={(data) => onUpdateCollection(editingCollection.id, data)}
          />
        )}

        {/* Delete Collection Confirmation Modal */}
        {collectionToDelete && (
          <ConfirmDeleteModal
            open={Boolean(collectionToDelete)}
            title={collectionToDelete.name}
            dialogTitle="Delete Collection?"
            confirmLabel="Delete Collection"
            message={`Are you sure you want to delete the collection "${collectionToDelete.name}"? All ${
              (collectionItemsMap.get(collectionToDelete.id) || []).length
            } saved inspiration records will remain safely in your library as ungrouped references.`}
            isDeleting={isDeletingCol}
            onClose={() => setCollectionToDelete(null)}
            onConfirm={handleConfirmDeleteCollection}
          />
        )}
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // 2. MAIN COLLECTIONS LIST VIEW
  // -------------------------------------------------------------------------
  return (
    <div className="collections-view">
      <div className="collections-header-row">
        <div>
          <h2 className="section-title">Your Collections</h2>
          <span className="section-subtitle">
            {collections.length} {collections.length === 1 ? 'collection' : 'collections'} organized locally
          </span>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Icon name="plus" size={16} />
          <span>New Collection</span>
        </button>
      </div>

      {collections.length === 0 ? (
        <section className="empty-state collections-empty-state" aria-label="No collections created">
          <div className="empty-state__icon" aria-hidden="true">
            <Icon name="folder" size={24} />
          </div>
          <h2 className="empty-state__title">Group your ideas into collections</h2>
          <p className="empty-state__text">
            Collections help you organize sparks by project, theme, or concept (e.g. &ldquo;Portfolio Redesign&rdquo;, &ldquo;3D Animations&rdquo;, or &ldquo;E-commerce Ideas&rdquo;).
          </p>
          <div className="empty-state__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Icon name="plus" size={16} />
              <span>Create First Collection</span>
            </button>
          </div>
        </section>
      ) : (
        <div className="collections-grid" role="list" aria-label="Collections list">
          {collections.map((col) => {
            const assigned = collectionItemsMap.get(col.id) || []
            const previewItem = assigned.find((r) => r.imageFileName) || assigned[0]

            return (
              <article
                key={col.id}
                className="card card--interactive collection-card"
                role="listitem"
                onClick={() => setActiveCollectionId(col.id)}
              >
                {/* Visual Preview / Thumbnail Stack */}
                <div className="collection-card__preview">
                  {previewItem && previewItem.imageFileName ? (
                    <div className="collection-card__preview-wrapper">
                      <span className="collection-card__preview-badge">
                        <Icon name="image" size={13} />
                        <span>Preview</span>
                      </span>
                    </div>
                  ) : (
                    <div className="collection-card__placeholder">
                      <Icon name="folder" size={28} />
                    </div>
                  )}
                  <span className="chip chip--tag collection-card__count">
                    {assigned.length} {assigned.length === 1 ? 'spark' : 'sparks'}
                  </span>
                </div>

                <div className="collection-card__body">
                  <div className="collection-card__title-row">
                    <h3 className="collection-card__title">{col.name}</h3>
                  </div>

                  <p className="collection-card__desc">
                    {col.description || 'No description provided.'}
                  </p>

                  <div
                    className="collection-card__footer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm collection-card__open-btn"
                      onClick={() => setActiveCollectionId(col.id)}
                    >
                      <span>Open Collection</span>
                      <Icon name="arrow-right" size={12} />
                    </button>

                    <div className="collection-card__actions">
                      <button
                        type="button"
                        className="btn btn--ghost btn--icon btn--sm"
                        onClick={() => setEditingCollection(col)}
                        aria-label={`Edit ${col.name}`}
                        title="Edit Collection"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost btn--icon btn--sm"
                        onClick={() => setCollectionToDelete(col)}
                        aria-label={`Delete ${col.name}`}
                        title="Delete Collection"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Create Collection Modal */}
      {isCreateModalOpen && (
        <CollectionModal
          open={isCreateModalOpen}
          mode="create"
          existingCollections={collections}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={onCreateCollection}
        />
      )}

      {/* Edit Collection Modal */}
      {editingCollection && (
        <CollectionModal
          open={Boolean(editingCollection)}
          mode="edit"
          collection={editingCollection}
          existingCollections={collections}
          onClose={() => setEditingCollection(null)}
          onSave={(data) => onUpdateCollection(editingCollection.id, data)}
        />
      )}

      {/* Delete Collection Confirmation Modal */}
      {collectionToDelete && (
        <ConfirmDeleteModal
          open={Boolean(collectionToDelete)}
          title={collectionToDelete.name}
          dialogTitle="Delete Collection?"
          confirmLabel="Delete Collection"
          message={`Are you sure you want to delete the collection "${collectionToDelete.name}"? All ${
            (collectionItemsMap.get(collectionToDelete.id) || []).length
          } saved inspirations inside it will be kept safely in your library as ungrouped references.`}
          isDeleting={isDeletingCol}
          onClose={() => setCollectionToDelete(null)}
          onConfirm={handleConfirmDeleteCollection}
        />
      )}
    </div>
  )
}
