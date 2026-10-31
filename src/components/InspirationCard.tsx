import { useEffect, useState } from 'react'
import { Icon } from './icons'
import { getCategoryLabel } from '../data/categories'
import type { InspirationRecord } from '../lib/storageTypes'
import { readLocalImageObjectURL } from '../lib/opfsStorage'

type InspirationCardProps = {
  item: InspirationRecord
  onSelect?: (item: InspirationRecord) => void
  onEdit?: (item: InspirationRecord) => void
  onDelete?: (item: InspirationRecord) => void
  onFavoriteClick?: (id: string) => void
  onRemoveFromCollection?: (item: InspirationRecord) => void
  isFavorite?: boolean
}

export function InspirationCard({
  item,
  onSelect,
  onEdit,
  onDelete,
  onFavoriteClick,
  onRemoveFromCollection,
  isFavorite,
}: InspirationCardProps) {
  const favoriteActive = isFavorite ?? item.favorite
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let createdUrl: string | null = null

    if (item.imageFileName) {
      readLocalImageObjectURL(item.imageFileName).then((res) => {
        if (active && res.success) {
          createdUrl = res.data
          setLocalImageUrl(res.data)
        }
      })
    }

    return () => {
      active = false
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl)
      }
    }
  }, [item.imageFileName])

  return (
    <article
      className="card card--interactive inspiration-card"
      aria-labelledby={`card-title-${item.id}`}
      onClick={() => onSelect?.(item)}
      role="region"
    >
      <div className="card__media">
        {localImageUrl ? (
          <img
            src={localImageUrl}
            alt={item.title}
            loading="lazy"
          />
        ) : (
          <div className="card__placeholder">
            <Icon name="image" size={24} />
            <span>Visual preview</span>
          </div>
        )}
        <button
          type="button"
          className={`card__fav-btn ${favoriteActive ? 'card__fav-btn--active' : ''}`}
          aria-label={favoriteActive ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
          aria-pressed={favoriteActive}
          onClick={(e) => {
            e.stopPropagation()
            onFavoriteClick?.(item.id)
          }}
        >
          <Icon name="heart" size={15} />
        </button>
      </div>

      <div className="card__body">
        <div className="card__top-meta">
          <span className="chip chip--tag card__category">
            {getCategoryLabel(item.categoryId)}
          </span>
          <span className="card__domain">{item.domain}</span>
        </div>

        <h3 id={`card-title-${item.id}`} className="card__title">
          {item.title}
        </h3>

        {item.note && <p className="card__note">{item.note}</p>}

        {item.tags.length > 0 && (
          <div className="card__tags" aria-label="Tags">
            {item.tags.map((tag) => (
              <span key={tag} className="card__tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="card__footer" onClick={(e) => e.stopPropagation()}>
          <a
            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary btn--sm card__link-btn"
            aria-label={`Open website for ${item.title} (opens in new tab)`}
          >
            <span>Open Website</span>
            <Icon name="arrow-right" size={12} />
          </a>

          <div className="card__quick-actions">
            {onRemoveFromCollection && item.collectionId && (
              <button
                type="button"
                className="btn btn--ghost btn--icon btn--sm"
                onClick={() => onRemoveFromCollection(item)}
                aria-label={`Remove ${item.title} from collection`}
                title="Remove from collection"
              >
                <Icon name="close" size={13} />
              </button>
            )}
            <button
              type="button"
              className="btn btn--ghost btn--icon btn--sm"
              onClick={() => onEdit?.(item)}
              aria-label={`Edit ${item.title}`}
              title="Edit"
            >
              <Icon name="edit" size={14} />
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--icon btn--sm"
              onClick={() => onDelete?.(item)}
              aria-label={`Delete ${item.title}`}
              title="Delete"
            >
              <Icon name="trash" size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
