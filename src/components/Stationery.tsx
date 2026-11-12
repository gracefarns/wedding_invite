import { type CSSProperties, type ReactNode } from 'react'
import { ArtImage } from './ArtImage'
import { TLink } from './TLink'

type Props = {
  children: ReactNode
  className?: string
  /** Internal route (uses the paper veil) … */
  to?: string
  /** … or an external link. */
  href?: string
  tab?: boolean
  tilt?: number
  style?: CSSProperties
}

/**
 * A small deckled paper card with a ribbon tab. The paper and ribbon are images
 * (paper/deckle-card.png, ribbon/tab.png); this only stacks them behind the content.
 */
export function Stationery({ children, className, to, href, tab = true, tilt = -3, style }: Props) {
  const inner = (
    <>
      <span className="stationery__paper" aria-hidden="true">
        <ArtImage slot="deckleCard" fill natural={false} quiet sizes="(min-width: 640px) 280px, 50vw" />
      </span>
      {tab && (
        <span className="stationery__tab" aria-hidden="true" style={{ ['--tab-tilt' as string]: `${tilt}deg` }}>
          <ArtImage slot="ribbonTab" quiet sizes="40px" />
        </span>
      )}
      {children}
    </>
  )
  const classes = `stationery${className ? ` ${className}` : ''}`
  if (to) {
    return (
      <TLink to={to} className={classes}>
        {inner}
      </TLink>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer noopener" style={style}>
        {inner}
      </a>
    )
  }
  return (
    <div className={classes} style={style}>
      {inner}
    </div>
  )
}
