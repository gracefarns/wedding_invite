import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'

/**
 * Smooth scrolling (Lenis), driven by GSAP's ticker so ScrollTrigger stays in step.
 * Under prefers-reduced-motion Lenis is never created and the browser scrolls natively.
 */
let lenis: Lenis | null = null
const locks = new Set<string>()

export function initScroll() {
  if (lenis || prefersReducedMotion()) return
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  if (locks.size) lenis.stop()
}

export function destroyScroll() {
  lenis?.destroy()
  lenis = null
}

function apply() {
  const locked = locks.size > 0
  document.documentElement.classList.toggle('is-locked', locked)
  if (locked) lenis?.stop()
  else lenis?.start()
}

/** Scroll locks are keyed, so the intro, menu and lightbox can overlap safely. */
export function lockScroll(key: string) {
  locks.add(key)
  apply()
}
export function unlockScroll(key: string) {
  locks.delete(key)
  apply()
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function scrollToElement(el: Element) {
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -104 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}
