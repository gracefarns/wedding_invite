import { useEffect, useState } from 'react'
import { site } from '../content/site.config'
import { ceremonyAt } from '../lib/dates'

const pad = (n: number) => String(n).padStart(2, '0')

function remaining(now: number) {
  const ms = Math.max(0, ceremonyAt.getTime() - now)
  const s = Math.floor(ms / 1000)
  return { done: ms === 0, days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, mins: Math.floor(s / 60) % 60, secs: s % 60 }
}

/** Live numerals to the ceremony, in the venue's timezone. */
export function Countdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const t = remaining(now)

  if (t.done) return <p className="countdown__done serif serif--it">{site.home.countdownDone}</p>

  const cells: [string, string][] = [
    [String(t.days), 'Days'],
    [pad(t.hours), 'Hours'],
    [pad(t.mins), 'Min'],
    [pad(t.secs), 'Sec'],
  ]
  return (
    <>
      <p className="sr-only">
        {t.days} days until the wedding of {site.couple.first} and {site.couple.second}
      </p>
      <dl className="countdown__grid" aria-hidden="true">
        {cells.map(([value, label]) => (
          <div key={label} className="countdown__cell">
            <dd className="serif">{value}</dd>
            <dt className="caps">{label}</dt>
          </div>
        ))}
      </dl>
    </>
  )
}
