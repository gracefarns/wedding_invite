import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArtImage } from '../components/ArtImage'
import { Countdown } from '../components/Countdown'
import { Monogram } from '../components/Monogram'
import { OvalPortrait } from '../components/OvalPortrait'
import { Reveal } from '../components/Reveal'
import { RibbonTie } from '../components/RibbonTie'
import { Stationery } from '../components/Stationery'
import { TLink } from '../components/TLink'
import { site } from '../content/site.config'
import { useApp } from '../lib/app'
import { ceremonyTime, weddingDate } from '../lib/dates'
import { usePageTitle } from '../lib/hooks'
import { hasSlot } from '../lib/images'
import { gsap, useReducedMotion } from '../lib/motion'

/** Which photograph backs the hero: the garden or the couple, whichever is asked for and present. */
export function heroSlots(): { wide: 'gardenBlur' | 'coupleHero'; tall: 'gardenBlur' | 'coupleHero' | 'coupleHeroPortrait' } {
  const couple = hasSlot('coupleHero')
  const garden = hasSlot('gardenBlur')
  const useCouple = site.home.heroImage === 'couple' ? couple || !garden : couple && !garden
  if (!useCouple) return { wide: 'gardenBlur', tall: 'gardenBlur' }
  return { wide: 'coupleHero', tall: hasSlot('coupleHeroPortrait') ? 'coupleHeroPortrait' : 'coupleHero' }
}

function Hero() {
  const { phase, setPhase } = useApp()
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [mode, setMode] = useState<'waiting' | 'arriving' | 'arrived' | 'still'>(phase === 'ready' ? 'still' : 'waiting')
  const slots = heroSlots()

  // Arrival, handed over from the intro's bloom.
  useLayoutEffect(() => {
    if (phase === 'ready') {
      // 'arrived' after the animated entrance, 'still' when the intro was skipped or not played
      setMode((m) => (m === 'arriving' || m === 'arrived' ? 'arrived' : 'still'))
      return
    }
    if (phase !== 'hero') return
    setMode('arriving')
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'softOut' }, onComplete: () => setPhase('ready') })
        .fromTo('.hero__photo', { opacity: 0, scale: 1.1, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2.6 }, 0)
        .fromTo('.hero__wreath', { opacity: 0, scale: 1.08, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.6 }, 0.9)
        .fromTo('.hero__monogram', { opacity: 0, y: 10, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5 }, 1.15)
        .fromTo('.hero__date', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.9 }, 1.9)
        .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.9 }, 2.4)
    }, root)
    return () => ctx.revert()
  }, [phase, setPhase])

  // Departure: as the wash rises, the monogram lifts away and the photograph eases back.
  useEffect(() => {
    if ((mode !== 'arrived' && mode !== 'still') || reduced || !root.current) return
    const ctx = gsap.context(() => {
      const trigger = { trigger: root.current!.parentElement, start: 'top top', end: () => `+=${window.innerHeight * 0.85}`, scrub: true }
      gsap.fromTo('.hero__center', { opacity: 1, yPercent: 0 }, { opacity: 0, yPercent: -18, ease: 'none', scrollTrigger: trigger })
      gsap.fromTo('.hero__photo', { scale: 1 }, { scale: 1.07, ease: 'none', scrollTrigger: trigger })
      gsap.fromTo('.hero__cue', { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: { ...trigger, end: () => `+=${window.innerHeight * 0.25}` } })
    }, root)
    return () => ctx.revert()
  }, [mode, reduced])

  return (
    <section ref={root} className={`hero hero--${mode}`} aria-label="Welcome">
      <div className="hero__photo hero__fx">
        <ArtImage slot={slots.wide} fill priority sizes="100vw" className="hero__img hero__img--wide" labelAt="top" />
        <ArtImage slot={slots.tall} fill priority sizes="100vw" className="hero__img hero__img--tall" labelAt="top" />
      </div>
      <div className="hero__fog" aria-hidden="true" />
      <div className="hero__center">
        <div className="hero__mark">
          <div className="hero__wreath hero__fx" aria-hidden="true">
            <ArtImage slot="wreath" priority sizes="(min-width: 640px) 420px, 76vw" labelAt="bottom" />
          </div>
          <Monogram className="hero__monogram hero__fx" />
        </div>
        <p className="hero__date caps hero__fx">{weddingDate.long}</p>
      </div>
      <div className="hero__scroll hero__fx" aria-hidden="true">
        <div className="hero__cue">
          <span className="caps">{site.intro.scroll}</span>
          <i className="hero__line" />
        </div>
      </div>
    </section>
  )
}

function Wash() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || !root.current) return
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('.wash__lead .art', { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.wash__tail .art', { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [reduced])
  return (
    <div ref={root} className="wash" aria-hidden="true">
      <div className="wash__lead">
        <ArtImage slot="watercolorWash" fill natural={false} sizes="100vw" />
      </div>
      <div className="wash__tail">
        <ArtImage slot="watercolorWash" fill natural={false} sizes="100vw" />
      </div>
    </div>
  )
}

export default function Home() {
  usePageTitle()
  const { first, joiner, second } = site.couple
  const h = site.home

  return (
    <div className="home">
      <div className="home-top">
        <Hero />
        <Wash />
      </div>

      <section className="invite center" aria-labelledby="names">
        <div className="home__floral home__floral--left" aria-hidden="true">
          <ArtImage slot="cornerLeft" sizes="(min-width: 1100px) 30vw, 0px" className="sway" />
        </div>
        <div className="home__floral home__floral--right" aria-hidden="true">
          <ArtImage slot="cornerRight" sizes="(min-width: 1100px) 30vw, 0px" className="sway" />
        </div>
        <Reveal as="p" variant="fade" className="caps caps--lg invite__kicker">
          {h.kicker[0]}
          <br />
          {h.kicker[1]}
        </Reveal>
        <h1 id="names" className="invite__names script">
          <Reveal as="span" variant="wipe" delay={200}>
            {first} {joiner} {second}
          </Reveal>
        </h1>
        <Reveal as="p" delay={900} className="invite__when">
          <span>{weddingDate.long}</span>
          <span className="invite__bar" aria-hidden="true" />
          <span>At {ceremonyTime}</span>
        </Reveal>
        <Reveal as="p" delay={1050} className="invite__where muted">
          {site.venue.name}, {site.venue.locality}
        </Reveal>
      </section>

      <section className="portrait paper paper--linen" aria-label="A portrait of the couple">
        <Reveal variant="soft" className="portrait__inner">
          <OvalPortrait caption={h.portraitCaption} />
        </Reveal>
      </section>

      <section className="countdown" aria-label="Countdown to the wedding">
        <div className="countdown__band" aria-hidden="true">
          <ArtImage slot="toileNapkin" fill sizes="100vw" labelAt="top" />
        </div>
        <div className="countdown__rim" aria-hidden="true" />
        <div className="countdown__candle countdown__candle--left" aria-hidden="true">
          <ArtImage slot="taperCandle" sizes="120px" />
          <i className="countdown__flame" />
        </div>
        <div className="countdown__candle countdown__candle--right" aria-hidden="true">
          <ArtImage slot="taperCandle" sizes="120px" />
          <i className="countdown__flame" />
        </div>
        <Reveal variant="soft" className="countdown__setting">
          <div className="countdown__plate" aria-hidden="true">
            <ArtImage slot="goldRimPlate" quiet sizes="(min-width: 640px) 520px, 100vw" />
          </div>
          <div className="countdown__card">
            <div className="countdown__paper" aria-hidden="true">
              <ArtImage slot="ovalDetailsCard" fill natural={false} sizes="(min-width: 640px) 360px, 80vw" quiet />
            </div>
            <div className="countdown__text">
              <p className="caps">{h.countdownKicker}</p>
              <p className="script countdown__script">{h.countdownScript}</p>
              <Countdown />
            </div>
            <RibbonTie className="countdown__tie" />
          </div>
        </Reveal>
      </section>

      <section className="cta section col center" aria-labelledby="cta-title">
        <div className="cta__floral" aria-hidden="true">
          <ArtImage slot="rose" sizes="160px" className="sway" />
        </div>
        <Reveal as="h2" variant="wipe" id="cta-title" className="script cta__title">
          {h.ctaTitle}
        </Reveal>
        <Reveal variant="fade" delay={400}>
          <hr className="rule" />
        </Reveal>
        <Reveal as="p" delay={500} className="cta__text">
          {h.ctaText}
        </Reveal>
        <Reveal delay={650}>
          <TLink to="/rsvp" className="btn">
            {h.ctaButton}
          </TLink>
        </Reveal>
      </section>

      <section className="quick section" aria-label="More about the day">
        <ul className="quick__grid">
          {h.quickLinks.map((link, i) => (
            <Reveal as="li" key={link.to} delay={(i % 3) * 120}>
              <Stationery to={link.to} className="quick__card" tilt={i % 2 ? 4 : -4}>
                <span className="caps quick__kicker">{link.kicker}</span>
                <span className="serif serif--it quick__title">{link.title}</span>
              </Stationery>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  )
}
