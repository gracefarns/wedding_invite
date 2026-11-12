import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../content/site.config'
import { useApp } from '../lib/app'
import { useFocusTrap } from '../lib/hooks'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { weddingDate } from '../lib/dates'
import { ArtImage } from './ArtImage'
import { Monogram } from './Monogram'
import { TLink } from './TLink'

export function Nav() {
  const { pathname } = useLocation()
  const { phase } = useApp()
  const [open, setOpen] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const names = `${site.couple.first} ${site.couple.joiner} ${site.couple.second}`

  // On Home the bar stays out of the way until the wash has carried the hero off.
  const isHome = pathname === '/'
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (open) lockScroll('menu')
    else unlockScroll('menu')
    return () => unlockScroll('menu')
  }, [open])
  useFocusTrap(menu, open, () => setOpen(false))

  const hidden = phase !== 'ready' || (isHome && !pastHero && !open)

  return (
    <>
      <header className={`nav${hidden ? ' is-hidden' : ''}${open ? ' is-open' : ''}`}>
        <div className="nav__inner">
          <TLink to="/" className="nav__mark" aria-label={`${names}, home`}>
            <Monogram />
          </TLink>
          <nav className="nav__links" aria-label="Primary">
            {site.nav.map((item) => (
              <TLink key={item.to} to={item.to} className="nav__link">
                {item.label}
              </TLink>
            ))}
          </nav>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="caps">{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menu}
        className={`menu paper${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        inert={!open}
      >
        <button type="button" className="menu__close" onClick={() => setOpen(false)}>
          <span className="caps">Close</span>
        </button>
        <nav aria-label="Menu">
          <ol className="menu__list">
            {site.nav.map((item, i) => (
              <li key={item.to} style={{ ['--i' as string]: i }}>
                <TLink to={item.to} className="menu__link serif" onNavigate={() => setOpen(false)}>
                  {item.label}
                </TLink>
              </li>
            ))}
          </ol>
        </nav>
        <p className="menu__date caps" style={{ ['--i' as string]: site.nav.length }}>
          {weddingDate.medium} · {site.venue.name}
        </p>
        <div className="menu__floral" aria-hidden="true">
          <ArtImage slot="cornerRight" sizes="60vw" className="sway" />
        </div>
      </div>
    </>
  )
}
