import { Icon, type IconName } from './icons'

type FeaturesPageProps = {
  onEnter: () => void
}

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

export function FeaturesPage({ onEnter }: FeaturesPageProps) {
  return (
    <main className="public-page" id="main-content">
      <section className="public-hero">
        <p className="public-hero__eyebrow">
          <Icon name="spark" size={12} />
          <span>Features</span>
        </p>
        <h1 className="public-hero__title">
          Everything the vault remembers for you.
        </h1>
        <p className="public-hero__text">
          InspoVault is built around one idea: a saved reference is only useful if
          you can still remember why it mattered.
        </p>
      </section>

      <section className="feature-bento" aria-label="What InspoVault does">
        {features.map((feature) => (
          <article
            key={feature.title}
            className={`feature-card${feature.wide ? ' feature-card--wide' : ''}`}
          >
            <span className="feature-card__icon" aria-hidden="true">
              <Icon name={feature.icon} size={18} />
            </span>
            <h2 className="feature-card__title">{feature.title}</h2>
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
      </section>

      <section className="public-cta" aria-label="Start your library">
        <div>
          <h2 className="public-cta__title">Start your library in under a minute.</h2>
          <p className="public-cta__text">
            Add a URL, a title, and the reason you saved it. That&rsquo;s the whole flow.
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={onEnter}>
          <span>Enter the dashboard</span>
          <Icon name="arrow-right" size={16} />
        </button>
      </section>
    </main>
  )
}
