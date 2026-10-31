import { Icon } from './icons'
import { HeroShowcase } from './HeroShowcase'
import { routeMeta } from '../lib/routes'

type EntryHeroProps = {
  onEnter: () => void
}

const meta = routeMeta['/']

export function EntryHero({ onEnter }: EntryHeroProps) {
  return (
    <main className="entry-hero" id="main-content">
      <div className="entry-hero__main">
        <div className="entry-hero__content">
          <p className="entry-hero__eyebrow">
            <Icon name="spark" size={12} />
            <span>{meta.eyebrow}</span>
          </p>

          <h1 className="entry-hero__title">
            Save the spark.
            <span className="entry-hero__title-accent">
              Find it when you need it.
            </span>
          </h1>

          <p className="entry-hero__description">{meta.description}</p>

          <div className="entry-hero__actions">
            <button
              type="button"
              className="btn btn--primary btn--lg entry-hero__enter"
              onClick={onEnter}
            >
              <span>Enter the dashboard</span>
              <Icon name="arrow-right" size={16} />
            </button>
          </div>

          <p className="entry-hero__note">
            <Icon name="shield" size={13} />
            <span>100% local · no account needed</span>
          </p>
        </div>

        <HeroShowcase />
      </div>
    </main>
  )
}
