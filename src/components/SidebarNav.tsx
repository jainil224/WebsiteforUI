import { Icon } from './icons'
import { NavigationList, VaultStatus } from './NavigationList'
import type { RoutePath } from '../lib/routes'

type SidebarNavProps = {
  currentPath: RoutePath
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
  return (
    <aside className="sidebar" aria-label="InspoVault sidebar">
      <a
        className="brand sidebar__brand"
        href="#/dashboard"
        aria-label="InspoVault dashboard"
      >
        <span className="brand-mark" aria-hidden="true">
          <Icon name="spark" size={18} />
        </span>
        <span className="brand-name">InspoVault</span>
      </a>

      <NavigationList currentPath={currentPath} />

      <div className="sidebar__footer">
        <VaultStatus />
        <p className="sidebar__note">
          Save the spark.
          <br />
          Find it when you need it.
        </p>
      </div>
    </aside>
  )
}
