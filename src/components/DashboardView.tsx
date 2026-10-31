import { Icon } from './icons'
import { FilterToolbar } from './FilterToolbar'
import { InspirationCard } from './InspirationCard'
import type { SortOption } from '../lib/libraryFilters'
import type { CategoryRecord, InspirationRecord } from '../lib/storageTypes'

type DashboardViewProps = {
  items: InspirationRecord[]
  categories?: CategoryRecord[]
  filteredItems: InspirationRecord[]
  searchQuery: string
  selectedCategory: string
  selectedTag: string
  availableTags: { tag: string; count: number }[]
  sort: SortOption
  onSelectCategory: (categoryId: string) => void
  onSelectTag: (tag: string) => void
  onSortChange: (sort: SortOption) => void
  onClearFilters: () => void
  onOpenAddModal: () => void
  onToggleFavorite?: (id: string) => void
  onSelectRecord?: (item: InspirationRecord) => void
  onEditRecord?: (item: InspirationRecord) => void
  onDeleteRecord?: (item: InspirationRecord) => void
}

export function DashboardView({
  items,
  categories,
  filteredItems,
  searchQuery,
  selectedCategory,
  selectedTag,
  availableTags = [],
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
}: DashboardViewProps) {
  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCategory || selectedTag,
  )
  const isLibraryEmpty = items.length === 0
  const isSearchNoResults = !isLibraryEmpty && filteredItems.length === 0

  return (
    <div className="dashboard-view">
      <h1 className="sr-only">My Inspiration Library</h1>

      {/* Filter and sorting toolbar */}
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
        resultCount={filteredItems.length}
      />

      {/* Main Content Area */}
      {isLibraryEmpty ? (
        <section className="empty-state dashboard-empty-state" aria-label="Empty library">
          <div className="empty-state__icon" aria-hidden="true">
            <Icon name="spark" size={24} />
          </div>
          <h2 className="empty-state__title">Your vault is ready for its first spark</h2>
          <p className="empty-state__text">
            InspoVault keeps website references, visual previews, and the exact reasons
            why they inspired you. Saved references are stored 100% locally on your computer.
          </p>
          <div className="empty-state__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={onOpenAddModal}
            >
              <Icon name="plus" size={16} />
              <span>Add First Inspiration</span>
            </button>
            <a href="#/inspirations" className="btn btn--secondary">
              Browse All Sections
            </a>
          </div>
        </section>
      ) : isSearchNoResults ? (
        <section className="empty-state dashboard-empty-state" aria-label="No results found">
          <div className="empty-state__icon" aria-hidden="true">
            <Icon name="search" size={24} />
          </div>
          <h2 className="empty-state__title">No inspirations match your filters</h2>
          <p className="empty-state__text">
            We couldn&rsquo;t find anything matching
            {searchQuery ? ` "${searchQuery}"` : ''}
            {selectedCategory ? ' in this category' : ''}
            {selectedTag ? ` with tag #${selectedTag}` : ''}.
            Try clearing your filters or broadening your search.
          </p>
          <div className="empty-state__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={onClearFilters}
            >
              Reset all filters
            </button>
          </div>
        </section>
      ) : (
        <section className="inspirations-section" aria-label="Saved inspirations">
          <div className="section-header">
            <h2 className="section-title">Saved Inspirations</h2>
            <span className="section-subtitle">
              Showing {filteredItems.length} of {items.length} references
            </span>
          </div>

          <div className="inspirations-grid">
            {filteredItems.map((item) => (
              <InspirationCard
                key={item.id}
                item={item}
                onSelect={onSelectRecord}
                onEdit={onEditRecord}
                onDelete={onDeleteRecord}
                onFavoriteClick={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
