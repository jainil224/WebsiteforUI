import { Icon, type IconName } from './icons'
import { FeatherSphere } from './FeatherSphere'
import { routeMeta } from '../lib/routes'

type EntryHeroProps = {
  onEnter: () => void
}

const meta = routeMeta['/']

type Feature = {
  icon: IconName
  title: string
  text: string
  wide?: boolean
}

const features: Feature[] = [
  {
    icon: 'library',
    title: 'Screenshot-first library',
    text: 'Every reference leads with its preview, so you recognise the idea before you read a single word.',
    wide: true,
  },
  {
    icon: 'edit',
    title: 'Notes that explain why',
    text: 'Save the reason, not only the URL. The note that seemed obvious last month is still there next year.',
    wide: true,
  },
  {
    icon: 'folder',
    title: 'Tags, categories, collections',
    text: 'Group references by the project, the pattern, or the mood they belong to.',
  },
  {
    icon: 'search',
    title: 'Search that finds it',
    text: 'Filter by title, domain, note, tag, or category. Sort the way your brain works.',
  },
  {
    icon: 'shield',
    title: 'Local-first by default',
    text: 'Your library lives in this browser. No account, no feed, no silent upload.',
  },
]

type Value = {
  icon: IconName
  title: string
  text: string
}

const values: Value[] = [
  {
    icon: 'shield',
    title: 'Local-first',
    text: 'Your references, previews, and notes stay in this browser. No account, no analytics, no cloud.',
  },
  {
    icon: 'library',
    title: 'Visual-first',
    text: 'Previews lead the interface. The library stays quiet so the screenshots can do the talking.',
  },
  {
    icon: 'spark',
    title: 'Calm by design',
    text: 'Fast feedback, restrained motion, and no infinite feed trying to pull you back in.',
  },
]

export function EntryHero({ onEnter }: EntryHeroProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="entry-hero" id="main-content">
      {/* 1. Main Hero Area */}
      <div
        className="entry-hero__main"
        style={{
          gap: 'clamp(1rem, 2.5vw, 2.5rem)',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(20rem, 1fr)',
        }}
      >
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

        <div
          className="entry-hero__showcase-wrap"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FeatherSphere showHint={false} />
        </div>
      </div>

      {/* Quick Nav Explore Bar that smoothly scrolls right down to the integrated sections */}
      <section className="entry-hero__explore" aria-label="Explore InspoVault sections">
        <div className="entry-hero__explore-inner">
          <p className="entry-hero__explore-label">Explore InspoVault</p>
          <div className="entry-hero__explore-grid">
            <button
              type="button"
              className="explore-card"
              style={{ textAlign: 'left', cursor: 'pointer', background: 'var(--color-surface)' }}
              onClick={() => scrollToSection('features')}
            >
              <span className="explore-card__icon" aria-hidden="true">
                <Icon name="library" size={18} />
              </span>
              <span className="explore-card__body">
                <span className="explore-card__title">Features</span>
                <span className="explore-card__text">
                  Screenshots, notes, tags, and search built for recall.
                </span>
              </span>
              <Icon name="arrow-right" size={16} className="explore-card__arrow" />
            </button>

            <button
              type="button"
              className="explore-card"
              style={{ textAlign: 'left', cursor: 'pointer', background: 'var(--color-surface)' }}
              onClick={() => scrollToSection('about')}
            >
              <span className="explore-card__icon" aria-hidden="true">
                <Icon name="shield" size={18} />
              </span>
              <span className="explore-card__body">
                <span className="explore-card__title">About</span>
                <span className="explore-card__text">
                  Why the vault stays local, visual, and quiet.
                </span>
              </span>
              <Icon name="arrow-right" size={16} className="explore-card__arrow" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Integrated Features Section */}
      <section id="features" className="public-page" style={{ paddingTop: 'var(--space-12)' }}>
        <div className="public-hero">
          <p className="public-hero__eyebrow">
            <Icon name="spark" size={12} />
            <span>Features</span>
          </p>
          <h2 className="public-hero__title" style={{ fontSize: 'var(--text-h1)' }}>
            Everything the vault remembers for you.
          </h2>
          <p className="public-hero__text">
            InspoVault is built around one idea: a saved reference is only useful if
            you can still remember why it mattered.
          </p>
        </div>

        <div className="feature-bento" aria-label="What InspoVault does">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`feature-card${feature.wide ? ' feature-card--wide' : ''}`}
            >
              <span className="feature-card__icon" aria-hidden="true">
                <Icon name={feature.icon} size={18} />
              </span>
              <h3 className="feature-card__title" style={{ fontSize: 'var(--text-h3)' }}>{feature.title}</h3>
              <p className="feature-card__text">{feature.text}</p>

              {feature.icon === 'library' && (
                <div className="feature-card__mock feature-card__mock--tiles" aria-hidden="true">
                  <span className="feature-mock-tile" />
                  <span className="feature-mock-tile feature-mock-tile--teal" />
                  <span className="feature-mock-tile feature-mock-tile--cream" />
                </div>
              )}

              {feature.icon === 'search' && (
                <div className="feature-card__mock feature-card__mock--search" aria-hidden="true">
                  <Icon name="search" size={14} />
                  <span>Search by note, tag, or domain…</span>
                </div>
              )}

              {feature.icon === 'shield' && (
                <div className="feature-card__mock feature-card__mock--local" aria-hidden="true">
                  <span className="feature-mock-dot" />
                  <span>Stored on this device</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* 3. Integrated About Section */}
      <section id="about" className="public-page" style={{ paddingTop: 'var(--space-12)' }}>
        <div className="public-hero">
          <p className="public-hero__eyebrow">
            <Icon name="spark" size={12} />
            <span>About</span>
          </p>
          <h2 className="public-hero__title" style={{ fontSize: 'var(--text-h1)' }}>
            Built for the ideas you almost forgot.
          </h2>
          <p className="public-hero__text">
            A personal archive for the websites that made you stop scrolling — and
            the reasons they did.
          </p>
        </div>

        <div className="about-story" aria-labelledby="about-story-title">
          <h3 className="about-story__title" id="about-story-title" style={{ fontSize: 'var(--text-h2)' }}>
            Bookmarks remember the link. They forget the idea.
          </h3>
          <p>
            Most saving tools stop at a URL. Six months later you own a folder of
            links that could be anything. InspoVault was built around a smaller,
            more useful promise: keep the screenshot, the note, and the one-click
            path back to the source.
          </p>
          <p>
            The library is deliberately quiet. No feed, no likes, no public profile.
            Just the references you chose, arranged the way you think about them.
          </p>
          <blockquote className="about-story__quote">
            <Icon name="spark" size={14} />
            <span>Save the spark. Find it when you need it.</span>
          </blockquote>
        </div>

        <div className="about-values" aria-label="Principles">
          {values.map((value) => (
            <article key={value.title} className="about-value">
              <span className="about-value__icon" aria-hidden="true">
                <Icon name={value.icon} size={18} />
              </span>
              <h3 className="about-value__title" style={{ fontSize: 'var(--text-h3)' }}>{value.title}</h3>
              <p className="about-value__text">{value.text}</p>
            </article>
          ))}
        </div>

        <div className="about-statement" aria-label="No accounts, no feed, no cloud">
          <p className="about-statement__title">No accounts. No feed. No cloud.</p>
          <p className="about-statement__text">
            Export a backup whenever you want and take it somewhere else. The vault
            is yours, on your device.
          </p>
        </div>

        <div className="public-cta" aria-label="Enter the vault" style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-12)' }}>
          <div>
            <h3 className="public-cta__title" style={{ fontSize: 'var(--text-h2)' }}>Keep the next idea worth remembering.</h3>
            <p className="public-cta__text">
              The dashboard is already running in your browser.
            </p>
          </div>
          <button type="button" className="btn btn--primary btn--lg" onClick={onEnter}>
            <span>Enter the dashboard</span>
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </section>
    </main>
  )
}
