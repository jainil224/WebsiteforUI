import { Icon } from './icons'
import type { AppTheme } from '../lib/theme'

type AppHeaderProps = {
  title: string
  eyebrow?: string
  description?: string
  searchQuery: string
  onSearchChange: (query: string) => void
  onOpenAddModal: () => void
  onToggleMobileNav: () => void
  totalCount?: number
  theme?: AppTheme
  onToggleTheme?: () => void
  showIntro?: boolean
}

export function AppHeader({
  title,
  eyebrow,
  description,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onToggleMobileNav,
  totalCount = 0,
  theme,
  onToggleTheme,
  showIntro = true,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__top">
        <button
          type="button"
          className="btn btn--secondary btn--icon mobile-menu-btn"
          onClick={onToggleMobileNav}
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>

        <div className="app-header__search-wrapper">
          <label htmlFor="library-search-input" className="sr-only">
            Search inspiration library
          </label>
          <div className="search-box">
            <span className="search-box__icon" aria-hidden="true">
              <Icon name="search" size={17} />
            </span>
            <input
              id="library-search-input"
              type="search"
              className="input search-box__input"
              placeholder="Search by title, domain, note, or tag..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn--ghost search-box__clear"
                onClick={() => onSearchChange('')}
                aria-label="Clear search input"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="app-header__actions">
          <button
            type="button"
            className="btn btn--primary add-inspiration-btn"
            onClick={onOpenAddModal}
            aria-label="Add Inspiration"
            title="Add Inspiration"
          >
            <Icon name="plus" size={16} />
            <span>Add Inspiration</span>
          </button>
        </div>
      </div>

      {showIntro && (
        <div className="app-header__intro">
          <div className="app-header__titles">
            {eyebrow && (
              <p className="app-header__eyebrow">
                <span className="eyebrow-rule" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            <div className="app-header__title-row">
              <h1 className="app-header__title">{title}</h1>
              {totalCount > 0 && (
                <span className="chip chip--tag app-header__count" aria-label={`${totalCount} items saved`}>
                  {totalCount} saved
                </span>
              )}
            </div>
            {description && (
              <p className="app-header__description">{description}</p>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
