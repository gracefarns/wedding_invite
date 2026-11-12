import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Intro } from './components/Intro'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { type SlotName } from './content/images'
import { AppContext, introSeen, markIntroSeen, type AppState, type Phase } from './lib/app'
import { ScrollTrigger, useReducedMotion } from './lib/motion'
import { destroyScroll, initScroll, lockScroll, scrollToTop, unlockScroll } from './lib/scroll'
import Details from './pages/Details'
import Faq from './pages/Faq'
import Gallery from './pages/Gallery'
import Home, { heroSlots } from './pages/Home'
import NotFound from './pages/NotFound'
import Registry from './pages/Registry'
import Rsvp from './pages/Rsvp'
import Story from './pages/Story'
import Travel from './pages/Travel'

const VEIL_MS = 300

const INTRO_SLOTS: SlotName[] = [
  'linenSurface',
  'embossedCard',
  'ovalDetailsCard',
  'ribbonBand',
  'ribbonKnot',
  'ribbonTailLeft',
  'ribbonTailRight',
  'hydrangea',
  'amaranthus',
  'wreath',
]

function Shell() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduced = useReducedMotion()
  const main = useRef<HTMLElement>(null)

  // The intro plays once per session, only when arriving on Home, never under reduced motion.
  const [playIntro] = useState(() => location.pathname === '/' && !introSeen() && !reduced)
  const [phase, setPhase] = useState<Phase>('loading')
  const [intro, setIntro] = useState(false)
  const [veil, setVeil] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (reduced) destroyScroll()
    else initScroll()
  }, [reduced])

  useEffect(() => {
    if (phase === 'ready') unlockScroll('intro')
    else lockScroll('intro')
  }, [phase])

  const onLoaded = useCallback(() => {
    setIntro(playIntro)
    setPhase(playIntro ? 'intro' : 'ready')
  }, [playIntro])

  const go = useCallback(
    (to: string) => {
      if (to === location.pathname) {
        scrollToTop(false)
        return
      }
      timers.current.forEach(window.clearTimeout)
      setVeil(true)
      timers.current = [
        window.setTimeout(() => {
          navigate(to)
          scrollToTop(true)
          timers.current.push(window.setTimeout(() => setVeil(false), 60))
        }, VEIL_MS),
      ]
    },
    [location.pathname, navigate],
  )

  const replayIntro = useCallback(() => {
    markIntroSeen(false)
    setVeil(true)
    window.setTimeout(() => {
      if (location.pathname !== '/') navigate('/')
      scrollToTop(true)
      if (reduced) {
        // No animation to replay: simply return to the still monogram.
        setVeil(false)
        return
      }
      setPhase('intro')
      setIntro(true)
      window.setTimeout(() => setVeil(false), 60)
    }, VEIL_MS)
  }, [location.pathname, navigate, reduced])

  // After each page change: top of the page, focus on the content, fresh scroll measurements.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    scrollToTop(true)
    main.current?.focus({ preventScroll: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [location.pathname])

  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const state = useMemo<AppState>(() => ({ phase, setPhase, go, replayIntro }), [phase, go, replayIntro])
  const hero = heroSlots()
  const loaderSlots: SlotName[] = playIntro ? [...INTRO_SLOTS, hero.wide, hero.tall] : location.pathname === '/' ? [hero.wide, hero.tall, 'wreath'] : []
  const busy = phase === 'loading' || phase === 'intro'

  return (
    <AppContext.Provider value={state}>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); main.current?.focus() }}>
        Skip to content
      </a>
      <div className="site" inert={busy}>
        <Nav />
        <main id="main" ref={main} tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/our-story" element={<Story />} />
            <Route path="/details" element={<Details />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/registry" element={<Registry />} />
            <Route path="/rsvp" element={<Rsvp />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>

      <div className={`veil paper${veil ? ' is-on' : ''}`} aria-hidden="true" />

      {intro && (
        <Intro
          onReveal={() => setPhase('hero')}
          onDone={() => setIntro(false)}
          onSkip={() => {
            setIntro(false)
            setPhase('ready')
          }}
        />
      )}
      <Loader slots={loaderSlots} onDone={onLoaded} />
    </AppContext.Provider>
  )
}

export default function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return (
    <BrowserRouter basename={base || undefined}>
      <Shell />
    </BrowserRouter>
  )
}
