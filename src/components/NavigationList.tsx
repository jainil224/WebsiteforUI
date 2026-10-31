import { Icon, type IconName } from './icons'
import { navGroups, routeMeta, type RoutePath } from '../lib/routes'

const navIcons: Record<RoutePath, IconName> = {
  '/': 'spark',
  '/features': 'library',
  '/about': 'shield',
  '/dashboard': 'dashboard',
  '/inspirations': 'library',
  '/favorites': 'heart',
  '/collections': 'folder',
  '/categories': 'categories',
  '/settings': 'settings',
}

type NavigationListProps = {
  currentPath: RoutePath
  onNavigate?: () => void
}

export function NavigationList({
  currentPath,
  onNavigate,
}: NavigationListProps) {
  const renderLink = (path: RoutePath) => {
    const isCurrent = path === currentPath

    return (
      <li key={path}>
        <a
          className="nav-link"
          href={`#${path}`}
          aria-current={isCurrent ? 'page' : undefined}
          onClick={onNavigate}
        >
          <span className="nav-link__indicator" aria-hidden="true" />
          <Icon name={navIcons[path]} size={19} />
          <span>{routeMeta[path].navLabel}</span>
        </a>
      </li>
    )
  }

  return (
    <nav className="sidebar-nav" aria-label="Primary navigation">
      {navGroups.map((group) => (
        <div className="nav-section" key={group.label}>
          <p className="nav-label">{group.label}</p>
          <ul className="nav-list">{group.paths.map(renderLink)}</ul>
        </div>
      ))}
      <div className="nav-section">
        <p className="nav-label">More</p>
        <ul className="nav-list">{renderLink('/settings')}</ul>
      </div>
    </nav>
  )
}

export function VaultStatus() {
  return (
    <p className="status-chip sidebar-status">
      <span className="status-dot" aria-hidden="true" />
      Local-first &middot; No account
    </p>
  )
}
