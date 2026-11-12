import { useEffect, useRef } from 'react'
import { hasSlot, showPlaceholderLabels } from '../lib/images'
import { gsap, useReducedMotion } from '../lib/motion'
import { ArtImage } from './ArtImage'

/**
 * An olive envelope whose venue watercolour slides out as the page scrolls.
 * Four images, stacked back to front: envelope back, open flap, the card, envelope front.
 */
export function Envelope({ caption }: { caption: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // Without the envelope images there is nothing to slide out of: show the watercolour on its
  // own if it exists, otherwise nothing. (In development the placeholders stand in.)
  const complete = (hasSlot('envelopeBack') && hasSlot('envelopeFront')) || showPlaceholderLabels

  useEffect(() => {
    if (reduced || !complete || !root.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.envelope__card',
        { yPercent: 0 },
        {
          yPercent: -64,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 88%', end: 'center 42%', scrub: 0.6 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [reduced, complete])

  if (!complete) {
    if (!hasSlot('venueWatercolor')) return null
    return (
      <figure className="envelope envelope--plain">
        <div className="envelope__plain">
          <ArtImage slot="venueWatercolor" sizes="(min-width: 640px) 420px, 86vw" />
        </div>
        <figcaption className="caps envelope__caption">{caption}</figcaption>
      </figure>
    )
  }

  return (
    <figure ref={root} className={`envelope${reduced ? ' envelope--open' : ''}`}>
      <div className="envelope__stage">
        <div className="envelope__flap" aria-hidden="true">
          <ArtImage slot="envelopeFlap" quiet sizes="(min-width: 640px) 420px, 86vw" />
        </div>
        <div className="envelope__back" aria-hidden="true">
          <ArtImage slot="envelopeBack" quiet sizes="(min-width: 640px) 420px, 86vw" />
        </div>
        <div className="envelope__card">
          <ArtImage slot="venueWatercolor" sizes="(min-width: 640px) 380px, 76vw" />
        </div>
        <div className="envelope__front" aria-hidden="true">
          <ArtImage slot="envelopeFront" labelAt="bottom" sizes="(min-width: 640px) 420px, 86vw" />
        </div>
      </div>
      <figcaption className="caps envelope__caption">{caption}</figcaption>
    </figure>
  )
}
