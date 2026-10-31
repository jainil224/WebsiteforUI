import { useEffect, useState } from 'react'
import { ModalDialog } from './ModalDialog'
import { Icon } from './icons'
import { getCategoryLabel } from '../data/categories'
import { readLocalImageObjectURL } from '../lib/opfsStorage'
import type { CollectionRecord, InspirationRecord } from '../lib/storageTypes'

type InspirationDetailModalProps = {
  item: InspirationRecord | null
  collections?: CollectionRecord[]
  onClose: () => void
  onEdit: (item: InspirationRecord) => void
  onDelete: (item: InspirationRecord) => void
  onToggleFavorite: (id: string) => void
}

export function InspirationDetailModal({
  item,
  collections = [],
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
}: InspirationDetailModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let createdUrl: string | null = null

    if (!item?.imageFileName) {
      return
    }

    readLocalImageObjectURL(item.imageFileName).then((res) => {
      if (active && res.success) {
        createdUrl = res.data
        setImageUrl(res.data)
      }
    })

    return () => {
      active = false
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl)
      }
    }
  }, [item?.imageFileName])

  if (!item) return null

  const formattedCreated = new Date(item.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const formattedUpdated =
    item.updatedAt && item.updatedAt !== item.createdAt
      ? new Date(item.updatedAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null

  return (
    <ModalDialog
      open={Boolean(item)}
      onClose={onClose}
      labelledBy="detail-dialog-title"
      className="detail-dialog"
    >
      <div className="detail-dialog__media-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="detail-dialog__image"
          />
        ) : (
          <div className="detail-dialog__placeholder">
            <Icon name="image" size={32} />
            <span>No preview image uploaded</span>
          </div>
        )}
      </div>

      <div className="dialog__header detail-dialog__header">
        <div className="dialog__title-group">
          <div className="detail-dialog__meta-row">
            <span className="chip chip--tag">{getCategoryLabel(item.categoryId)}</span>
            <span className="detail-dialog__domain">{item.domain}</span>
          </div>
          <h2 id="detail-dialog-title" className="dialog__title detail-dialog__title">
            {item.title}
          </h2>
        </div>
        <div className="detail-dialog__header-actions">
          <button
            type="button"
            className={`btn btn--ghost btn--icon ${item.favorite ? 'detail-fav-btn--active' : ''}`}
            onClick={() => onToggleFavorite(item.id)}
            aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={item.favorite}
          >
            <Icon name="heart" size={18} />
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--icon dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
      </div>

      <div className="dialog__body detail-dialog__body">
        {item.note && (
          <div className="detail-dialog__section">
            <h3 className="detail-dialog__section-label">Why I saved it</h3>
            <p className="detail-dialog__note-text">{item.note}</p>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="detail-dialog__section">
            <h3 className="detail-dialog__section-label">Tags</h3>
            <div className="detail-dialog__tags">
              {item.tags.map((tag) => (
                <span key={tag} className="chip chip--tag detail-dialog__tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="detail-dialog__info-grid">
          {item.collectionId && (
            <div className="detail-dialog__info-item">
              <span className="detail-dialog__info-label">Collection</span>
              <span className="detail-dialog__info-value">
                {collections.find((c) => c.id === item.collectionId)?.name || 'Custom Collection'}
              </span>
            </div>
          )}
          <div className="detail-dialog__info-item">
            <span className="detail-dialog__info-label">Saved</span>
            <span className="detail-dialog__info-value">{formattedCreated}</span>
          </div>
          {formattedUpdated && (
            <div className="detail-dialog__info-item">
              <span className="detail-dialog__info-label">Updated</span>
              <span className="detail-dialog__info-value">{formattedUpdated}</span>
            </div>
          )}
          <div className="detail-dialog__info-item">
            <span className="detail-dialog__info-label">Storage</span>
            <span className="detail-dialog__info-value">100% Local (Browser)</span>
          </div>
        </div>
      </div>

      <div className="dialog__footer detail-dialog__footer">
        <button
          type="button"
          className="btn btn--destructive btn--sm"
          onClick={() => onDelete(item)}
        >
          <Icon name="trash" size={14} />
          <span>Delete</span>
        </button>

        <div className="detail-dialog__footer-right">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => onEdit(item)}
          >
            <Icon name="edit" size={14} />
            <span>Edit</span>
          </button>
          <a
            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--sm"
          >
            <span>Open Original Website</span>
            <Icon name="arrow-right" size={14} />
          </a>
        </div>
      </div>
    </ModalDialog>
  )
}
