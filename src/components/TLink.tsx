import { type MouseEvent, type ReactNode } from 'react'
import { useHref, useLocation } from 'react-router-dom'
import { useApp } from '../lib/app'

type Props = {
  to: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
  'aria-label'?: string
}

/** An internal link that changes page through the paper veil. */
export function TLink({ to, children, className, onNavigate, ...rest }: Props) {
  const { go } = useApp()
  const href = useHref(to)
  const { pathname } = useLocation()
  const current = pathname === to

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onNavigate?.()
    go(to)
  }

  return (
    <a href={href} onClick={onClick} className={className} aria-current={current ? 'page' : undefined} {...rest}>
      {children}
    </a>
  )
}
