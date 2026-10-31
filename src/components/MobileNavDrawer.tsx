import { useEffect, useRef } from 'react'
import { NavigationList, VaultStatus } from './NavigationList'
import { Icon } from './icons'
import type { RoutePath } from '../lib/routes'

type MobileNavDrawerProps = {
  open: boolean
  onClose: () => void
  currentPath: RoutePath
}

export function MobileNavDrawer({
  open,
  onClose,
  currentPath,
}: MobileNavDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="mobile-nav-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="mobile-nav-panel__header">
          <a
            className="brand"
            href="#/dashboard"
            aria-label="InspoVault dashboard"
            onClick={onClose}
          >
            <span className="brand-mark" aria-hidden="true">
              <Icon name="spark" size={18} />
            </span>
            <span className="brand-name">InspoVault</span>
          </a>
          <button
            ref={closeButtonRef}
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="mobile-nav-panel__body">
          <NavigationList currentPath={currentPath} onNavigate={onClose} />
        </div>

        <div className="mobile-nav-panel__footer">
          <VaultStatus />
          <p className="sidebar__note">
            Save the spark.
            <br />
            Find it when you need it.
          </p>
        </div>
      </div>
    </div>
  )
}
