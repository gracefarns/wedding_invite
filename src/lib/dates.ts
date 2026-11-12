import { site } from '../content/site.config'

/** Converts a wall-clock time in an IANA timezone to the matching UTC instant. */
export function zonedToUtc(date: string, time: string, timeZone: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const guess = Date.UTC(y, m - 1, d, hh, mm)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).formatToParts(new Date(guess))
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const shown = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return new Date(guess - (shown - guess))
}

const { date, ceremonyStart, dayEnds, timezone } = site.wedding

export const ceremonyAt = zonedToUtc(date, ceremonyStart, timezone)
export const dayEndsAt = zonedToUtc(date, dayEnds, timezone)

const utcNoon = (iso: string) => new Date(`${iso}T12:00:00Z`)
const fmt = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(utcNoon(iso))

function ordinal(n: number) {
  const rem = n % 100
  if (rem >= 11 && rem <= 13) return 'th'
  return ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'
}

export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const hour = ((h + 11) % 12) + 1
  return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ':00'} ${h < 12 ? 'AM' : 'PM'}`
}

/** Display forms of a date, all derived from one ISO string so they can never disagree. */
export function dateParts(iso: string) {
  const day = Number(iso.slice(8, 10))
  return {
    /** Saturday, 24 April 2027 */
    long: `${fmt(iso, { weekday: 'long' })}, ${day} ${fmt(iso, { month: 'long' })} ${fmt(iso, { year: 'numeric' })}`,
    /** 24 April 2027 */
    medium: `${day} ${fmt(iso, { month: 'long' })} ${fmt(iso, { year: 'numeric' })}`,
    /** 24 · 04 · 2027 */
    dotted: `${iso.slice(8, 10)} · ${iso.slice(5, 7)} · ${iso.slice(0, 4)}`,
    weekday: fmt(iso, { weekday: 'long' }),
    day,
    ordinal: ordinal(day),
    month: fmt(iso, { month: 'long' }),
    year: fmt(iso, { year: 'numeric' }),
  }
}

export const weddingDate = dateParts(date)
export const rsvpDeadline = dateParts(site.rsvp.deadline)
export const ceremonyTime = formatTime(ceremonyStart)

// ── Calendar ─────────────────────────────────────────────────────────────

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const escapeIcs = (text: string) => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

const eventTitle = `The wedding of ${site.couple.first} ${site.couple.joiner} ${site.couple.second}`
const eventLocation = [site.venue.name, ...site.venue.addressLines].join(', ')
const eventDetails = `Ceremony at ${ceremonyTime}. ${site.wedding.attire} attire.`

export function buildIcs() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Clara and Clark//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${date}@clara-and-clark`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(ceremonyAt)}`,
    `DTEND:${stamp(dayEndsAt)}`,
    `SUMMARY:${escapeIcs(eventTitle)}`,
    `LOCATION:${escapeIcs(eventLocation)}`,
    `DESCRIPTION:${escapeIcs(eventDetails)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n') + '\r\n'
}

export function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${site.couple.first}-and-${site.couple.second}-wedding.ics`.toLowerCase()
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export const googleCalendarUrl = () =>
  'https://calendar.google.com/calendar/render?' +
  new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle,
    dates: `${stamp(ceremonyAt)}/${stamp(dayEndsAt)}`,
    details: eventDetails,
    location: eventLocation,
  }).toString()

export const directionsUrl = () =>
  site.venue.mapUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`
