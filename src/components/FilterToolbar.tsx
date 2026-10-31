import { categories as defaultCategories } from '../data/categories'
import { sortOptions, type SortOption } from '../lib/libraryFilters'
import { Icon } from './icons'
import type { CategoryRecord } from '../lib/storageTypes'

type FilterToolbarProps = {
  categories?: CategoryRecord[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  selectedTag: string
  onSelectTag: (tag: string) => void
  availableTags: { tag: string; count: number }[]
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  resultCount: number
}

export function FilterToolbar({
  categories = defaultCategories,
  selectedCategory,
  onSelectCategory,
  selectedTag,
  onSelectTag,
  availableTags = [],
  sort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}: FilterToolbarProps) {
  return (
    <div className="filter-toolbar" aria-label="Library filters and sorting">
      {/* Category Chips Bar */}
      <div className="filter-toolbar__chips-container">
        <div className="filter-toolbar__chips" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`chip ${!selectedCategory ? 'chip--active' : ''}`}
            aria-pressed={!selectedCategory}
            onClick={() => onSelectCategory('')}
          >
            All categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`chip ${selectedCategory === cat.id ? 'chip--active' : ''}`}
              aria-pressed={selectedCategory === cat.id}
              onClick={() =>
                onSelectCategory(selectedCategory === cat.id ? '' : cat.id)
              }
            >
              <Icon name={(cat.icon as any) || 'categories'} size={14} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags Chips Bar (shown when tags exist in library) */}
      {availableTags.length > 0 && (
        <div className="filter-toolbar__tags-container">
          <span className="filter-toolbar__tags-label">Tags:</span>
          <div className="filter-toolbar__tags-list" role="group" aria-label="Filter by tag">
            {availableTags.map(({ tag, count }) => {
              const isActive = selectedTag.toLowerCase() === tag.toLowerCase()
              return (
                <button
                  key={tag}
                  type="button"
                  className={`chip chip--tag ${isActive ? 'chip--active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => onSelectTag(isActive ? '' : tag)}
                  title={`Filter by tag #${tag} (${count})`}
                >
                  <span>#{tag}</span>
                  <span className="chip__count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom Actions Bar (Clear Filters + Sort Control + Results Count) */}
      <div className="filter-toolbar__actions">
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn--ghost btn--sm filter-toolbar__clear"
            onClick={onClearFilters}
          >
            <Icon name="close" size={13} />
            <span>Reset filters</span>
          </button>
        )}

        <div className="sort-control">
          <label htmlFor="library-sort-select" className="sort-control__label">
            Sort:
          </label>
          <select
            id="library-sort-select"
            className="select select--sm sort-control__select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <span className="filter-toolbar__count" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'item' : 'items'}
        </span>
      </div>
    </div>
  )
}
