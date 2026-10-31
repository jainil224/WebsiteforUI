import type { ReactNode } from 'react'
import { Icon } from './icons'
import type { RoutePath } from '../lib/routes'

type PublicLayoutProps = {
  path: RoutePath
  onEnter: () => void
  children: ReactNode
}

const links: { path: RoutePath; label: string }[] = [
  { path: '/features', label: 'Features' },
  { path: '/about', label: 'About' },
]

export function PublicLayout({
  path,
  onEnter,
  children,
}: PublicLayoutProps) {
  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand site-header__brand" href="#/" aria-label="InspoVault home">
            <span className="brand-mark" aria-hidden="true">
              <Icon name="spark" size={18} />
            </span>
            <span className="brand-name">InspoVault</span>
          </a>

          <nav className="site-nav" aria-label="Main">
            {links.map((link) => (
              <a
                key={link.path}
                className="site-nav__link"
                href={`#${link.path}`}
                aria-current={path === link.path ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
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

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__brand">InspoVault</p>
          <nav className="site-footer__nav" aria-label="Footer">
            <a href="#/">Home</a>
            <a href="#/features">Features</a>
            <a href="#/about">About</a>
          </nav>
          <p className="site-footer__note">Local-first · No account · No cloud</p>
        </div>
      </footer>
    </div>
  )
}
