import { useEffect, useRef } from 'react'

export function HeroShowcase() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    if (reducedMotion.matches || !finePointer.matches) return

    let frame = 0

    const handlePointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5

      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        stage.style.setProperty('--tilt-y', `${(offsetX * 6).toFixed(2)}deg`)
        stage.style.setProperty('--tilt-x', `${(-offsetY * 5).toFixed(2)}deg`)
        stage.style.setProperty('--shift-x', `${(offsetX * 14).toFixed(2)}px`)
        stage.style.setProperty('--shift-y', `${(offsetY * 10).toFixed(2)}px`)
      })
    }

    const handlePointerLeave = () => {
      window.cancelAnimationFrame(frame)
      stage.style.setProperty('--tilt-y', '0deg')
      stage.style.setProperty('--tilt-x', '0deg')
      stage.style.setProperty('--shift-x', '0px')
      stage.style.setProperty('--shift-y', '0px')
    }

    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div className="hero-showcase" aria-hidden="true">
      <div className="hero-showcase__stage" ref={stageRef}>
        <span className="hero-showcase__glow" />
        <span className="hero-showcase__floor" />

        <span className="hero-showcase__spark hero-showcase__spark--a" />
        <span className="hero-showcase__spark hero-showcase__spark--b" />
        <span className="hero-showcase__spark hero-showcase__spark--c" />

        <div className="hero-showcase__stack">
          {/* Back card — typography + palette */}
          <article className="show-card show-card--back">
            <div className="show-card__inner">
              <div className="show-card__chrome">
                <span className="show-card__dot" />
                <span className="show-card__dot" />
                <span className="show-card__dot" />
                <span className="show-card__url">type.gallery</span>
              </div>
              <div className="show-card__body show-card__body--type">
                <span className="show-card__aa">Aa</span>
                <span className="show-card__type-line" />
                <span className="show-card__type-line show-card__type-line--short" />
                <div className="show-card__swatches">
                  <span className="show-card__swatch show-card__swatch--teal" />
                  <span className="show-card__swatch show-card__swatch--cream" />
                  <span className="show-card__swatch show-card__swatch--deep" />
                  <span className="show-card__swatch show-card__swatch--soft" />
                </div>
              </div>
            </div>
          </article>

          {/* Middle card — component grid */}
          <article className="show-card show-card--mid">
            <div className="show-card__inner">
              <div className="show-card__chrome">
                <span className="show-card__dot" />
                <span className="show-card__dot" />
                <span className="show-card__dot" />
                <span className="show-card__url">components.dev</span>
              </div>
              <div className="show-card__body show-card__body--grid">
                <span className="show-card__grid-title" />
                <div className="show-card__tiles">
                  <span className="show-card__tile show-card__tile--lift" />
                  <span className="show-card__tile show-card__tile--teal" />
                  <span className="show-card__tile" />
                </div>
                <span className="show-card__type-line" />
              </div>
            </div>
          </article>

          {/* Front card — mini hero section */}
          <article className="show-card show-card--front">
            <div className="show-card__inner">
              <div className="show-card__chrome">
                <span className="show-card__dot" />
                <span className="show-card__dot" />
                <span className="show-card__dot" />
                <span className="show-card__url">hero-sections.io</span>
                <span className="show-card__live">Live</span>
              </div>
              <div className="show-card__body show-card__body--hero">
                <span className="show-card__eyebrow" />
                <span className="show-card__headline" />
                <span className="show-card__headline show-card__headline--short" />
                <div className="show-card__actions">
                  <span className="show-card__button" />
                  <span className="show-card__button show-card__button--ghost" />
                </div>
                <span className="show-card__cursor" />
              </div>
            </div>
          </article>
        </div>
      </div>

      <span className="hero-showcase__tag hero-showcase__tag--hero">
        Hero sections
      </span>
      <span className="hero-showcase__tag hero-showcase__tag--micro">
        Micro-interactions
      </span>
      <span className="hero-showcase__tag hero-showcase__tag--type">
        Typography
      </span>
    </div>
  )
}
