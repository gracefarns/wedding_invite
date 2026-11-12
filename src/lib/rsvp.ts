import { site } from '../content/site.config'

export interface RsvpPayload {
  submittedAt: string
  name: string
  email: string
  attending: 'yes' | 'no'
  guests: number
  /** "Clara Example; Sam Example" */
  guestNames: string
  /** "Clara Example: Spring lamb; Sam Example: Garden risotto" */
  meals: string
  dietary: string
  song: string
  note: string
}

export const rsvpConfigured = () => site.rsvp.endpoint.trim().length > 0

/**
 * Sends one RSVP to the endpoint in site.config.ts.
 *
 * Google Apps Script: the body is sent as text/plain so the browser makes a "simple" request
 * (Apps Script web apps cannot answer a CORS preflight). The script replies {"result":"success"}.
 * Formspree: a normal JSON post.
 */
export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  const { provider, endpoint } = site.rsvp
  if (!rsvpConfigured()) throw new Error('RSVP endpoint is not configured')

  if (provider === 'formspree') {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, _subject: `RSVP from ${payload.name}` }),
    })
    if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
    return
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`Apps Script responded ${res.status}`)
  const data = (await res.json().catch(() => null)) as { result?: string; error?: string } | null
  if (!data || data.result !== 'success') throw new Error(data?.error || 'Unexpected response from Apps Script')
}
