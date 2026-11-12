import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

/** The two house eases. Nothing on the site is linear, bouncy or springy. */
export const SOFT_OUT = CustomEase.create('softOut', '0.22, 1, 0.36, 1')
export const SOFT_IN_OUT = CustomEase.create('softInOut', '0.65, 0, 0.35, 1')
gsap.defaults({ ease: 'softOut', duration: 1.2 })

const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

export const prefersReducedMotion = () => Boolean(query?.matches)

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    if (!query) return
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export { gsap, ScrollTrigger }
