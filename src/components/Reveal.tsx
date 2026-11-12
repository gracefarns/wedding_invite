import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children?: ReactNode
  as?: string
  /** rise (default), fade, soft (fades from a light blur) or wipe (left-to-right clip). */
  variant?: 'rise' | 'fade' | 'soft' | 'wipe'
  /** Delay in milliseconds, for gentle staggering. */
  delay?: number
  className?: string
  style?: CSSProperties
  [key: `aria-${string}`]: string | boolean | undefined
  id?: string
}

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, as = 'div', variant = 'rise', delay = 0, className, style, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (!('IntersectionObserver' in window)) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  return createElement(
    as,
    {
      ref,
      className: ['reveal', variant !== 'rise' && `reveal--${variant}`, seen && 'is-in', className].filter(Boolean).join(' '),
      style: delay ? { ...style, ['--delay' as string]: `${delay}ms` } : style,
      ...rest,
    },
    children,
  )
}
