import { useEffect, useRef } from 'react'
import { hasSlot } from '../lib/images'
import { gsap, useReducedMotion } from '../lib/motion'
import { ArtImage } from './ArtImage'

/**
 * The couple's portrait behind an embossed oval frame.
 * The photograph (shown black-and-white by a CSS filter) sits in an oval window; the frame
 * image, with its transparent centre, lies on top. They drift at slightly different speeds.
 */
export function OvalPortrait({ caption }: { caption?: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const framed = hasSlot('embossedOvalFrame')

  useEffect(() => {
    if (reduced || !root.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.oval-portrait__photo',
        { yPercent: -5 },
        { yPercent: 5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.fromTo(
        '.oval-portrait__frame',
        { yPercent: 1.5 },
        { yPercent: -1.5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <figure ref={root} className={`oval-portrait${framed ? '' : ' oval-portrait--bare paper'}`}>
      <div className="oval-portrait__window">
        <div className="oval-portrait__photo">
          <ArtImage slot="ovalPortrait" fill sizes="(min-width: 640px) 420px, 76vw" />
        </div>
      </div>
      <div className="oval-portrait__frame" aria-hidden="true">
        <ArtImage slot="embossedOvalFrame" natural={false} quiet sizes="(min-width: 640px) 560px, 100vw" />
      </div>
      {caption && <figcaption className="caps oval-portrait__caption">{caption}</figcaption>}
    </figure>
  )
}
