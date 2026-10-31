import { useState, type FormEvent } from 'react'
import { ModalDialog } from './ModalDialog'
import { Icon } from './icons'
import type { CollectionRecord } from '../lib/storageTypes'

type CollectionModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  collection?: CollectionRecord | null
  existingCollections: CollectionRecord[]
  onClose: () => void
  onSave: (data: { name: string; description?: string }) => { success: boolean; error?: Error }
}

export function CollectionModal({
  open,
  mode,
  collection,
  existingCollections,
  onClose,
  onSave,
}: CollectionModalProps) {
  const [name, setName] = useState(() => (mode === 'edit' && collection ? collection.name : ''))
  const [description, setDescription] = useState(() =>
    mode === 'edit' && collection?.description ? collection.description : '',
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('A collection name is required.')
      return
    }

    // Check duplicate name
    const isDuplicate = existingCollections.some(
      (col) =>
        col.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
        col.id !== collection?.id,
    )
    if (isDuplicate) {
      setError(`A collection named "${trimmedName}" already exists.`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    const res = onSave({
      name: trimmedName,
      description: description.trim() || undefined,
    })

    setIsSubmitting(false)
    if (res.success) {
      onClose()
    } else {
      setError(res.error?.message || 'Failed to save collection.')
    }
  }

  if (!open) return null

  return (
    <ModalDialog
      open={open}
      onClose={isSubmitting ? () => {} : onClose}
      labelledBy="collection-modal-title"
      className="collection-dialog"
    >
      <div className="dialog__header">
        <div className="dialog__title-group">
          <p className="dialog__kicker">
            {mode === 'create' ? 'Organize Library' : 'Manage Collection'}
          </p>
          <h2 id="collection-modal-title" className="dialog__title">
            {mode === 'create' ? 'Create New Collection' : `Edit "${collection?.name}"`}
          </h2>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--icon dialog__close"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="dialog__body">
          {error && (
            <div className="form-error-banner" role="alert">
              <Icon name="close" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="field">
            <label htmlFor="collection-name" className="field__label">
              <span>Collection Name</span>
              <span className="field__optional">Required</span>
            </label>
            <input
              id="collection-name"
              type="text"
              className="input"
              placeholder="e.g. Portfolio Redesign, 3D Planet Ideas"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError(null)
              }}
              autoFocus
              disabled={isSubmitting}
              maxLength={80}
            />
          </div>

          <div className="field">
            <label htmlFor="collection-description" className="field__label">
              <span>Description</span>
              <span className="field__optional">Optional</span>
            </label>
            <textarea
              id="collection-description"
              className="textarea"
              placeholder="Brief context or goals for this group of references..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              maxLength={300}
            />
          </div>
        </div>

        <div className="dialog__footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting || !name.trim()}
          >
            <Icon name="spark" size={15} />
            <span>{mode === 'create' ? 'Create Collection' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
