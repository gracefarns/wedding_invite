import { useEffect, useRef } from 'react'
import { site } from '../content/site.config'
import { gsap, useReducedMotion } from '../lib/motion'
import { ArtImage } from './ArtImage'
import { Reveal } from './Reveal'

/**
 * The order of events: a dashed line with steps alternating either side. A photographed
 * ranunculus rides the line, tied to scroll position, turning slowly as it goes.
 */
export function EventsTimeline() {
  const track = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const events = site.details.events

  useEffect(() => {
    const el = track.current
    if (reduced || !el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.events__flower',
        { y: 0, rotation: -24 },
        {
          y: () => el.offsetHeight,
          rotation: 130,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 52%', end: 'bottom 52%', scrub: 0.7, invalidateOnRefresh: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={track} className="events__track">
      <span className="events__line" aria-hidden="true" />
      <div className="events__flower" aria-hidden="true">
        <ArtImage slot="ranunculus" quiet sizes="160px" />
      </div>
      <ol className="events__list">
        {events.map((event, i) => (
          <li key={event.title} className={`events__step events__step--${i % 2 ? 'right' : 'left'}`}>
            <Reveal>
              <p className="caps events__when">
                <span>Step {String(i + 1).padStart(2, '0')}</span>
                <span className="events__time">{event.time}</span>
              </p>
              <h3 className="serif serif--caps events__title">{event.title}</h3>
              <p className="events__note">{event.note}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )
}
