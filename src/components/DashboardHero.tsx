import { Icon } from './icons'

type DashboardHeroProps = {
  eyebrow: string
  title: string
  description: string
  savedCount: number
  favoritesCount: number
  collectionsCount: number
  isLibraryEmpty: boolean
  onOpenAddModal: () => void
}

export function DashboardHero({
  eyebrow,
  title,
  description,
  savedCount,
  favoritesCount,
  collectionsCount,
  isLibraryEmpty,
  onOpenAddModal,
}: DashboardHeroProps) {
  return (
    <section className="dashboard-hero" aria-labelledby="dashboard-hero-title">
      <div className="dashboard-hero__inner">
        <div className="dashboard-hero__content">
          <p className="dashboard-hero__eyebrow">
            <Icon name="spark" size={12} />
            <span>{eyebrow}</span>
          </p>

          <h1 className="dashboard-hero__title" id="dashboard-hero-title">
            {title}
          </h1>

          <p className="dashboard-hero__description">{description}</p>

          <div className="dashboard-hero__actions">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={onOpenAddModal}
            >
              <Icon name="plus" size={16} />
              <span>
                {isLibraryEmpty ? 'Add your first inspiration' : 'Add inspiration'}
              </span>
            </button>
          </div>
        </div>

        <div className="dashboard-hero__visual" aria-hidden="true">
          <span className="dashboard-hero__orbit dashboard-hero__orbit--outer" />
          <span className="dashboard-hero__orbit dashboard-hero__orbit--inner" />
          <span className="dashboard-hero__spark">
            <Icon name="spark" size={26} />
          </span>
        </div>
      </div>

      <div className="dashboard-hero__footer">
        <dl className="dashboard-hero__stats">
          <div className="dashboard-hero__stat">
            <dt className="dashboard-hero__stat-label">Saved</dt>
            <dd className="dashboard-hero__stat-value">{savedCount}</dd>
          </div>
          <div className="dashboard-hero__stat">
            <dt className="dashboard-hero__stat-label">Favorites</dt>
            <dd className="dashboard-hero__stat-value">{favoritesCount}</dd>
          </div>
          <div className="dashboard-hero__stat">
            <dt className="dashboard-hero__stat-label">Collections</dt>
            <dd className="dashboard-hero__stat-value">{collectionsCount}</dd>
          </div>
        </dl>

        <p className="dashboard-hero__local">
          <Icon name="shield" size={13} />
          <span>Stored on this device</span>
        </p>
      </div>
    </section>
  )
}
