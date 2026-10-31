import type { ReactNode } from 'react'
import { Icon } from './icons'
import type { RoutePath } from '../lib/routes'

type PublicLayoutProps = {
  path: RoutePath
  onEnter: () => void
  children: ReactNode
}

export function PublicLayout({
  path,
  onEnter,
  children,
}: PublicLayoutProps) {
  const scrollTo = (id: string) => {
    if (path !== '/') {
      window.location.hash = '#/'
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    if (path !== '/') {
      window.location.hash = '#/'
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header__inner">
          <a
            className="brand site-header__brand"
            href="#/"
            onClick={(e) => {
              e.preventDefault()
              scrollToTop()
            }}
            aria-label="InspoVault home"
          >
            <span className="brand-mark" aria-hidden="true">
              <Icon name="spark" size={18} />
            </span>
            <span className="brand-name">InspoVault</span>
          </a>

          <nav className="site-nav" aria-label="Main">
            <button
              type="button"
              className="site-nav__link"
              style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              onClick={() => scrollTo('features')}
            >
              Features
            </button>
            <button
              type="button"
              className="site-nav__link"
              style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              onClick={() => scrollTo('about')}
            >
              About
            </button>
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className="btn btn--secondary site-header__enter"
              onClick={onEnter}
              aria-label="Enter dashboard"
            >
              <span>Enter dashboard</span>
              <Icon name="arrow-right" size={15} />
            </button>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}
