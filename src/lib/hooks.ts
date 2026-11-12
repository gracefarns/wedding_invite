import { useEffect, type RefObject } from 'react'
import { site } from '../content/site.config'

export function usePageTitle(title?: string) {
  useEffect(() => {
    const names = `${site.couple.first} ${site.couple.joiner} ${site.couple.second}`
    document.title = title ? `${title} · ${names}` : site.meta.title
  }, [title])
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Keeps Tab inside `ref` while active, closes on Escape, and restores focus afterwards. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape?: () => void) {
  useEffect(() => {
    const el = ref.current
    if (!active || !el) return
    const previous = document.activeElement as HTMLElement | null
    const items = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null)
    const first = items()[0]
    ;(first ?? el).focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.()
        return
      }
      if (e.key !== 'Tab') return
      const list = items()
      if (!list.length) return
      const head = list[0]
      const tail = list[list.length - 1]
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault()
        tail.focus()
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault()
        head.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus?.({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
