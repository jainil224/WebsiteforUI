import { useState, type FormEvent } from 'react'
import { ModalDialog } from './ModalDialog'
import { Icon, type IconName } from './icons'
import type { CategoryRecord } from '../lib/storageTypes'

type CategoryModalProps = {
  open: boolean
  existingCategories: CategoryRecord[]
  onClose: () => void
  onSave: (data: { label: string; icon?: string }) => { success: boolean; error?: Error }
}

const AVAILABLE_ICONS: { name: IconName; label: string }[] = [
  { name: 'categories', label: 'Default' },
  { name: 'spark', label: 'Spark' },
  { name: 'cube', label: '3D' },
  { name: 'cursor', label: 'Interaction' },
  { name: 'hero', label: 'Hero' },
  { name: 'background', label: 'Background' },
  { name: 'button', label: 'Button' },
  { name: 'card', label: 'Card' },
  { name: 'navigation', label: 'Navigation' },
  { name: 'typography', label: 'Typography' },
  { name: 'layout', label: 'Layout' },
  { name: 'scroll', label: 'Scroll' },
  { name: 'transition', label: 'Transition' },
  { name: 'image', label: 'Media' },
  { name: 'library', label: 'Library' },
  { name: 'more', label: 'Other' },
]

export function CategoryModal({
  open,
  existingCategories,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [label, setLabel] = useState('')
  const [icon, setIcon] = useState<IconName>('categories')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) {
      setError('A category name is required.')
      return
    }

    const isDuplicate = existingCategories.some(
      (cat) => cat.label.trim().toLowerCase() === trimmed.toLowerCase(),
    )
    if (isDuplicate) {
      setError(`A category named "${trimmed}" already exists.`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    const res = onSave({ label: trimmed, icon })
    if (res.success) {
      setLabel('')
      setIcon('categories')
      setIsSubmitting(false)
      onClose()
    } else {
      setIsSubmitting(false)
      setError(res.error?.message || 'Failed to save category.')
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    setLabel('')
    setError(null)
    onClose()
  }

  if (!open) return null

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      labelledBy="category-modal-title"
      className="category-dialog"
    >
      <div className="dialog__header">
        <div className="dialog__title-group">
          <p className="dialog__kicker">Organize Library</p>
          <h2 id="category-modal-title" className="dialog__title">
            Add New Category
          </h2>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--icon dialog__close"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="dialog__body" noValidate>
        {error && (
          <div className="alert alert--danger" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
            <Icon name="close" size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="field">
          <label className="field__label" htmlFor="cat-name-input">
            <span>Category Name</span>
            <span className="field__required" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="cat-name-input"
            type="text"
            className="input"
            placeholder="e.g. Footers, Pricing Tables, Modals"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value)
              if (error) setError(null)
            }}
            disabled={isSubmitting}
            autoFocus
            maxLength={60}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="cat-icon-select">
            <span>Category Icon</span>
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-teal)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <Icon name={icon} size={20} />
            </span>
            <select
              id="cat-icon-select"
              className="select"
              value={icon}
              onChange={(e) => setIcon(e.target.value as IconName)}
              disabled={isSubmitting}
            >
              {AVAILABLE_ICONS.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dialog__actions" style={{ marginTop: 'var(--space-5)' }}>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting || !label.trim()}>
            <Icon name="plus" size={16} />
            <span>{isSubmitting ? 'Saving...' : 'Create Category'}</span>
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
