import { useEffect, useState } from 'react'
import { Monogram } from './Monogram'
import { images, type SlotName } from '../content/images'
import { preloadImage } from '../lib/images'

const FONTS = ['1em "Monsieur La Doulaise"', '300 1em "Jost"', '400 1em "Jost"', '400 1em "Cormorant Garamond"', 'italic 400 1em "Cormorant Garamond"']
const MIN_MS = 900
const MAX_MS = 7000

type Props = {
  /** Image slots to have decoded before the loader lifts. */
  slots: SlotName[]
  onDone: () => void
}

/** The monogram over a thin progress hairline. Holds until fonts and key images are ready. */
export function Loader({ slots, onDone }: Props) {
  const [progress, setProgress] = useState(0)
  // already true when index.html's own loader has shown the monogram, so it never re-fades
  const [fontsReady, setFontsReady] = useState(() => [...document.fonts].some((f) => f.family.includes('Monsieur') && f.status === 'loaded'))
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const started = performance.now()
    const jobs: Promise<unknown>[] = [
      Promise.all(FONTS.map((f) => document.fonts.load(f).catch(() => undefined))).then(() => {
        if (!cancelled) setFontsReady(true)
      }),
      ...slots.map((name) => preloadImage(images[name].file, window.innerWidth > 900 ? 1600 : 960)),
    ]
    let finished = 0
    jobs.forEach((job) =>
      job.finally(() => {
        finished++
        if (!cancelled) setProgress(finished / jobs.length)
      }),
    )

    const finish = () => {
      if (cancelled) return
      cancelled = true
      setProgress(1)
      const wait = Math.max(0, MIN_MS - (performance.now() - started))
      window.setTimeout(() => {
        setLeaving(true)
        onDone()
        window.setTimeout(() => setGone(true), 900)
      }, wait)
    }
    Promise.all(jobs).then(finish)
    const timeout = window.setTimeout(finish, MAX_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div className={`loader paper${leaving ? ' is-leaving' : ''}`} role="status" aria-live="polite">
      <span className="sr-only">Loading the invitation</span>
      <Monogram className={`loader__mark${fontsReady ? ' is-ready' : ''}`} />
      <span className="loader__track" aria-hidden="true">
        <span className="loader__bar" style={{ transform: `scaleX(${progress})` }} />
      </span>
    </div>
  )
}
