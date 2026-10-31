import { Icon, type IconName } from './icons'

type AboutPageProps = {
  onEnter: () => void
}

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

export function AboutPage({ onEnter }: AboutPageProps) {
  return (
    <main className="public-page" id="main-content">
      <section className="public-hero">
        <p className="public-hero__eyebrow">
          <Icon name="spark" size={12} />
          <span>About</span>
        </p>
        <h1 className="public-hero__title">
          Built for the ideas you almost forgot.
        </h1>
        <p className="public-hero__text">
          A personal archive for the websites that made you stop scrolling — and
          the reasons they did.
        </p>
      </section>

      <section className="about-story" aria-labelledby="about-story-title">
        <h2 className="about-story__title" id="about-story-title">
          Bookmarks remember the link. They forget the idea.
        </h2>
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
      </section>

      <section className="about-values" aria-label="Principles">
        {values.map((value) => (
          <article key={value.title} className="about-value">
            <span className="about-value__icon" aria-hidden="true">
              <Icon name={value.icon} size={18} />
            </span>
            <h2 className="about-value__title">{value.title}</h2>
            <p className="about-value__text">{value.text}</p>
          </article>
        ))}
      </section>

      <section className="about-statement" aria-label="No accounts, no feed, no cloud">
        <p className="about-statement__title">No accounts. No feed. No cloud.</p>
        <p className="about-statement__text">
          Export a backup whenever you want and take it somewhere else. The vault
          is yours, on your device.
        </p>
      </section>

      <section className="public-cta" aria-label="Enter the vault">
        <div>
          <h2 className="public-cta__title">Keep the next idea worth remembering.</h2>
          <p className="public-cta__text">
            The dashboard is already running in your browser.
          </p>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={onEnter}>
          <span>Enter the vault</span>
          <Icon name="arrow-right" size={16} />
        </button>
      </section>
    </main>
  )
}
