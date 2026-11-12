import { useCallback, useEffect, useRef, useState } from 'react'
import { images, type SlotName } from '../content/images'
import { site } from '../content/site.config'
import { markIntroSeen } from '../lib/app'
import { fileUrl, hasFile, hasSlot, showPlaceholderLabels } from '../lib/images'
import { gsap } from '../lib/motion'
import { ArtImage } from './ArtImage'

const SCENE: SlotName[] = ['embossedCard', 'ovalDetailsCard', 'ribbonBand', 'ribbonKnot', 'ribbonTailLeft', 'ribbonTailRight', 'hydrangea', 'amaranthus']

type Props = {
  /** Fired as the cream bloom covers the screen: the hero underneath may begin to arrive. */
  onReveal: () => void
  /** Fired when the overlay has fully dissolved. */
  onDone: () => void
  onSkip: () => void
}

/**
 * The invitation opening.
 *
 *   closed suite → untie → lift → bloom → (hands over to the Home hero)
 *
 * Every object on screen is an image slot (card, oval, ribbon, flowers, surface). This
 * component only layers them and moves them: transform, opacity, filter and clip-path.
 */
export function Intro({ onReveal, onDone, onSkip }: Props) {
  const root = useRef<HTMLDivElement>(null)
    const video = useRef<HTMLVideoElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [stage, setStage] = useState<'idle' | 'opening' | 'leaving'>('idle')
  const hasVideo = hasFile(images.ribbonUntieVideo.file)
  const { first, joiner, second } = site.couple

  useEffect(
    () => () => {
      timeline.current?.kill()
    },
    [],
  )

  const open = useCallback(() => {
    const el = root.current
    if (stage !== 'idle' || !el) return
    setStage('opening')
    markIntroSeen(true)

    const q = gsap.utils.selector(el)
    const oval = q('.suite__oval')[0] as HTMLElement
    const bloom = q('.intro__bloom')[0] as HTMLElement
    const tl = gsap.timeline({ defaults: { ease: 'softInOut' }, onComplete: onDone })
    timeline.current = tl

    tl.to(q('.intro__prompt'), { opacity: 0, y: 6, duration: 0.6, ease: 'softOut' }, 0)

    // ── 1 · Untie ────────────────────────────────────────────────────────
    let untieEnd = 1.7
    const film = video.current
    if (hasVideo && film) {
      // A transparent film of the real bow coming undone replaces the layered version.
      untieEnd = Math.min(Math.max(film.duration || 1.7, 1.2), 2.6)
      tl.set(q('.ribbon__layers'), { opacity: 0 }, 0)
        .set(film, { opacity: 1 }, 0)
        .call(() => void film.play().catch(() => undefined), [], 0)
        .to(film, { opacity: 0, duration: 0.6 }, untieEnd - 0.3)
    } else {
      tl.to(q('.ribbon__knot'), { scale: 1.12, rotation: 4, duration: 1.1 }, 0)
        .to(q('.ribbon__knot'), { opacity: 0, filter: 'blur(8px)', duration: 0.9 }, 0.3)
        .to(q('.ribbon__tail--left'), { xPercent: -170, yPercent: 26, rotation: -24, filter: 'blur(4px)', duration: 1.5 }, 0.25)
        .to(q('.ribbon__tail--right'), { xPercent: 170, yPercent: 26, rotation: 24, filter: 'blur(4px)', duration: 1.5 }, 0.3)
        .to(q('.ribbon__band--left'), { xPercent: -64, rotation: -6, filter: 'blur(3px)', duration: 1.5 }, 0.35)
        .to(q('.ribbon__band--right'), { xPercent: 64, rotation: 6, filter: 'blur(3px)', duration: 1.5 }, 0.4)
        // …and the whole ribbon slips off the card and falls out of frame
        .to(q('.suite__ribbon'), { y: () => window.innerHeight * 0.7, rotation: 5, duration: 1.25, ease: 'power2.in' }, 0.6)
        .to(q('.suite__ribbon'), { opacity: 0, duration: 0.6, ease: 'softOut' }, 1.2)
    }
    tl.to(q('.suite__floral'), { opacity: 0, xPercent: -8, yPercent: 10, filter: 'blur(6px)', duration: 1.4, stagger: 0.12 }, 0.6)

    // ── 2 · Lift ─────────────────────────────────────────────────────────
    const lift = untieEnd - 0.3
    tl.to(oval, { scale: 1.3, duration: 1.6 }, lift)
      .to(q('.suite__oval-shadow'), { scale: 1.5, yPercent: 8, opacity: 0.42, duration: 1.6 }, lift)
      .to(q('.suite__card'), { scale: 0.93, filter: 'blur(7px) brightness(0.95)', duration: 1.6 }, lift)
      .to(q('.intro__surface'), { scale: 1.05, filter: 'blur(5px)', duration: 1.6 }, lift)
      .to(q('.intro__glow'), { opacity: 0, duration: 1.2 }, lift)

    // ── 3 · Bloom: fall into the oval until its cream fills the screen ───
    const bloomAt = lift + 1.2
    const rect = oval.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const shape = { rx: (oval.offsetWidth / 2) * 1.3, ry: (oval.offsetHeight / 2) * 1.3 }
    const cover = Math.hypot(window.innerWidth, window.innerHeight)
    const paint = () => {
      bloom.style.clipPath = `ellipse(${shape.rx.toFixed(1)}px ${shape.ry.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`
    }
    tl.call(paint, [], bloomAt)
      .set(bloom, { visibility: 'visible' }, bloomAt)
      .to(bloom, { opacity: 1, duration: 0.7, ease: 'softOut' }, bloomAt)
      .to(q('.suite__text'), { opacity: 0, duration: 0.6, ease: 'softOut' }, bloomAt)
      .to(shape, { rx: cover, ry: cover, duration: 1.5, onUpdate: paint }, bloomAt + 0.1)
      .to(oval, { scale: 2.6, duration: 1.5 }, bloomAt + 0.1)

    // ── 4 · Hand over to the hero, then dissolve the cream ───────────────
    tl.call(onReveal, [], bloomAt + 1.3)
      .set(q('.intro__stage'), { visibility: 'hidden' }, bloomAt + 1.6)
      .set(q('.intro__skip'), { color: 'var(--eggshell)' }, bloomAt + 1.6)
      .to(bloom, { opacity: 0, duration: 1.5 }, bloomAt + 1.6)
  }, [stage, hasVideo, onReveal, onDone])

  const skip = useCallback(() => {
    if (stage === 'leaving') return
    setStage('leaving')
    markIntroSeen(true)
    timeline.current?.kill()
    gsap.to(root.current, { opacity: 0, duration: 0.6, ease: 'softInOut', onComplete: onSkip })
  }, [stage, onSkip])

  // Enter or Space opens the invitation from anywhere, without having to find the card first.
  useEffect(() => {
    if (stage !== 'idle') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      if (e.target instanceof HTMLElement && e.target.closest('button, a')) return
      e.preventDefault()
      open()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stage, open])

  const missing = SCENE.filter((name) => !hasSlot(name)).length

  return (
    <div
      ref={root}
      className={`intro is-${stage}`}
      role="dialog"
      aria-modal="true"
      aria-label={`An invitation to the wedding of ${first} and ${second}`}
    >
      <div className="intro__stage">
        <div className="intro__surface">
          <ArtImage slot="linenSurface" fill priority sizes="100vw" />
        </div>
        <div className="intro__glow intro__glow--a" />
        <div className="intro__glow intro__glow--b" />
        <div className="intro__vignette" />

        <button type="button" className="suite" onClick={open} disabled={stage !== 'idle'}>
          <span className="sr-only">Open the invitation</span>
          <span className="suite__breath" aria-hidden="true">
            <span className="suite__card">
              <ArtImage slot="embossedCard" quiet priority sizes="(min-width: 640px) 400px, 70vw" />
            </span>
            <span className="suite__oval-shadow" />
            <span className="suite__oval">
              <ArtImage slot="ovalDetailsCard" quiet priority sizes="(min-width: 640px) 280px, 48vw" />
              <span className="suite__text">
                <span className="suite__kicker">{site.intro.cardKicker}</span>
                <span className="suite__names">
                  <span>{first}</span>
                  <span className="suite__amp">{joiner}</span>
                  <span>{second}</span>
                </span>
              </span>
            </span>

            <span className="suite__ribbon">
              <span className="ribbon__layers">
                <span className="ribbon__band ribbon__band--left">
                  <ArtImage slot="ribbonBand" quiet priority natural={false} sizes="(min-width: 640px) 420px, 84vw" />
                </span>
                <span className="ribbon__band ribbon__band--right">
                  <ArtImage slot="ribbonBand" quiet priority natural={false} sizes="(min-width: 640px) 420px, 84vw" />
                </span>
                <span className="ribbon__tail ribbon__tail--left">
                  <ArtImage slot="ribbonTailLeft" quiet priority sizes="120px" />
                </span>
                <span className="ribbon__tail ribbon__tail--right">
                  <ArtImage slot="ribbonTailRight" quiet priority sizes="120px" />
                </span>
                <span className="ribbon__knot">
                  <ArtImage slot="ribbonKnot" quiet priority sizes="240px" />
                </span>
              </span>
              {hasVideo && (
                <video
                  ref={video}
                  className="ribbon__film"
                  src={fileUrl(images.ribbonUntieVideo.file)}
                  muted
                  playsInline
                  preload="auto"
                />
              )}
            </span>

            <span className="suite__floral suite__floral--amaranthus">
              <ArtImage slot="amaranthus" quiet priority sizes="120px" className="sway" />
            </span>
            <span className="suite__floral suite__floral--hydrangea">
              <ArtImage slot="hydrangea" quiet priority sizes="240px" className="sway" />
            </span>
          </span>
        </button>

        {showPlaceholderLabels && missing > 0 && (
          <p className="intro__legend" aria-hidden="true">
            Placeholders · {missing} intro images to add · see IMAGES.md
          </p>
        )}
        <p className="intro__prompt caps" aria-hidden="true">
          <span>{site.intro.prompt}</span>
        </p>
      </div>

      <div className="intro__bloom" aria-hidden="true" />

      <button type="button" className="intro__skip link-caps" onClick={skip}>
        {site.intro.skip}
      </button>
    </div>
  )
}
