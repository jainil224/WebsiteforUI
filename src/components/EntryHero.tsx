import { Icon } from './icons'
import { routeMeta } from '../lib/routes'
import type { AppTheme } from '../lib/theme'

type EntryHeroProps = {
  theme: AppTheme
  onToggleTheme: () => void
  onEnter: () => void
}

const meta = routeMeta['/']

export function EntryHero({ theme, onToggleTheme, onEnter }: EntryHeroProps) {
  return (
    <div className="entry-hero">
      <header className="entry-hero__bar">
        <a className="brand entry-hero__brand" href="#/" aria-label="InspoVault home">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="spark" size={18} />
          </span>
          <span className="brand-name">InspoVault</span>
        </a>

        <button
          type="button"
          className="btn btn--secondary theme-toggle entry-hero__theme"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </header>

      <main className="entry-hero__main">
        <div className="entry-hero__content">
          <p className="entry-hero__eyebrow">
            <Icon name="spark" size={12} />
            <span>{meta.eyebrow}</span>
          </p>

          <h1 className="entry-hero__title">
            Save the spark.
            <span className="entry-hero__title-accent">
              Find it when you need it.
            </span>
          </h1>

          <p className="entry-hero__description">{meta.description}</p>

          <div className="entry-hero__actions">
            <button
              type="button"
              className="btn btn--primary btn--lg entry-hero__enter"
              onClick={onEnter}
            >
              <span>Enter the dashboard</span>
              <Icon name="arrow-right" size={16} />
            </button>
          </div>

          <p className="entry-hero__note">
            <Icon name="shield" size={13} />
            <span>100% local · no account needed</span>
          </p>
        </div>

        <div className="entry-hero__visual" aria-hidden="true">
          <span className="entry-hero__orbit entry-hero__orbit--outer" />
          <span className="entry-hero__orbit entry-hero__orbit--mid" />
          <span className="entry-hero__orbit entry-hero__orbit--inner" />

          <span className="entry-hero__spark">
            <Icon name="spark" size={34} />
          </span>

          <span className="entry-hero__tag entry-hero__tag--top">
            <Icon name="hero" size={14} />
            Hero sections
          </span>
          <span className="entry-hero__tag entry-hero__tag--right">
            <Icon name="cursor" size={14} />
            Micro-interactions
          </span>
          <span className="entry-hero__tag entry-hero__tag--bottom">
            <Icon name="typography" size={14} />
            Typography
          </span>
        </div>
      </main>

      <footer className="entry-hero__footer">
        <p className="entry-hero__footer-note">
          No feed. No cloud. Just ideas worth keeping.
        </p>
      </footer>
    </div>
  )
}
