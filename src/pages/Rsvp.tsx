import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArtImage } from '../components/ArtImage'
import { Monogram } from '../components/Monogram'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { RibbonTie } from '../components/RibbonTie'
import { site } from '../content/site.config'
import { rsvpDeadline } from '../lib/dates'
import { usePageTitle } from '../lib/hooks'
import { rsvpConfigured, submitRsvp, type RsvpPayload } from '../lib/rsvp'
import { scrollToElement } from '../lib/scroll'

type Guest = { name: string; meal: string }
type Status = 'idle' | 'sending' | 'sent' | 'error'
type Errors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** ?preview=1 shows the form before an endpoint is configured; nothing is sent. */
const previewing = () => new URLSearchParams(window.location.search).has('preview')

function SealedCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="sealed" role="status" aria-live="polite" tabIndex={-1}>
      <div className="sealed__paper" aria-hidden="true">
        <ArtImage slot="ovalDetailsCard" fill natural={false} quiet sizes="(min-width: 640px) 380px, 84vw" />
      </div>
      <div className="sealed__text">
        <Monogram className="sealed__mark" />
        <h2 className="script sealed__title">{title}</h2>
        <div className="sealed__body">{children}</div>
      </div>
      <RibbonTie className="sealed__tie" />
    </div>
  )
}

export default function Rsvp() {
  const r = site.rsvpPage
  const cfg = site.rsvp
  usePageTitle('RSVP')

  const preview = previewing()
  const live = rsvpConfigured()
  const form = useRef<HTMLFormElement>(null)
  const result = useRef<HTMLDivElement>(null)

  const [email, setEmail] = useState('')
  const [attending, setAttending] = useState<'' | 'yes' | 'no'>('')
  const [guests, setGuests] = useState<Guest[]>([{ name: '', meal: '' }])
  const [dietary, setDietary] = useState('')
  const [song, setSong] = useState('')
  const [note, setNote] = useState('')
  const [trap, setTrap] = useState('') // honeypot: real guests never see or fill this
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const setCount = (n: number) =>
    setGuests((list) => Array.from({ length: n }, (_, i) => list[i] ?? { name: '', meal: '' }))
  const setGuest = (i: number, patch: Partial<Guest>) =>
    setGuests((list) => list.map((g, j) => (j === i ? { ...g, ...patch } : g)))
  const clear = (key: string) => setErrors((e) => (e[key] ? { ...e, [key]: '' } : e))

  function validate(): Errors {
    const next: Errors = {}
    if (!guests[0].name.trim()) next['name-0'] = 'Please tell us your name.'
    if (!email.trim()) next.email = 'Please add an email address so we can confirm.'
    else if (!EMAIL.test(email.trim())) next.email = 'That email address does not look quite right.'
    if (!attending) next.attending = 'Please let us know whether you can join us.'
    if (attending === 'yes') {
      guests.forEach((g, i) => {
        if (i > 0 && !g.name.trim()) next[`name-${i}`] = `Please add the name of guest ${i + 1}.`
        if (!g.meal) next[`meal-${i}`] = 'Please choose a meal.'
      })
    }
    return next
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    const found = validate()
    setErrors(found)
    const firstBad = Object.keys(found)[0]
    if (firstBad) {
      const field = form.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`)
      field?.focus()
      return
    }
    if (trap) {
      setStatus('sent') // quietly drop bots
      return
    }

    const coming = attending === 'yes'
    const party = coming ? guests : guests.slice(0, 1)
    const payload: RsvpPayload = {
      submittedAt: new Date().toISOString(),
      name: guests[0].name.trim(),
      email: email.trim(),
      attending: coming ? 'yes' : 'no',
      guests: coming ? party.length : 0,
      guestNames: party.map((g) => g.name.trim()).join('; '),
      meals: coming ? party.map((g) => `${g.name.trim()}: ${g.meal}`).join('; ') : '',
      dietary: coming ? dietary.trim() : '',
      song: coming ? song.trim() : '',
      note: note.trim(),
    }

    setStatus('sending')
    try {
      if (live) await submitRsvp(payload)
      else await new Promise((done) => setTimeout(done, 900)) // preview only
      setStatus('sent')
      requestAnimationFrame(() => {
        if (result.current) scrollToElement(result.current)
        result.current?.querySelector<HTMLElement>('.sealed')?.focus({ preventScroll: true })
      })
    } catch (err) {
      console.warn('RSVP failed', err)
      setStatus('error')
    }
  }

  const err = (key: string) =>
    errors[key] ? (
      <p className="field__error" id={`${key}-error`}>
        {errors[key]}
      </p>
    ) : null
  const aria = (key: string) => ({
    'data-field': key,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  })

  const header = (
    <PageHeader title={r.title} intro={<>Kindly respond by {rsvpDeadline.medium}</>} />
  )

  // ── Not configured yet ───────────────────────────────────────────────
  if (!live && !preview) {
    return (
      <div className="page rsvp">
        {header}
        <Reveal variant="soft" className="rsvp__result col">
          <SealedCard title={r.soonTitle}>
            <p>{r.soonText}</p>
            <a className="link-caps" href={`mailto:${cfg.contactEmail}`}>
              Write to us
            </a>
          </SealedCard>
        </Reveal>
      </div>
    )
  }

  // ── Sent ─────────────────────────────────────────────────────────────
  if (status === 'sent') {
    return (
      <div className="page rsvp">
        {header}
        <div ref={result} className="rsvp__result col">
          <SealedCard title={r.successTitle}>
            <p>{attending === 'yes' ? r.successAccept : r.successDecline}</p>
          </SealedCard>
        </div>
        <p className="rsvp__honeymoon col center">{r.honeymoonNote}</p>
      </div>
    )
  }

  const coming = attending === 'yes'

  return (
    <div className="page rsvp">
      {header}
      <Reveal className="col">
        <form ref={form} className="form paper" onSubmit={onSubmit} noValidate>
          {!live && (
            <p className="form__preview caps" role="note">
              Preview only · replies are not being saved yet
            </p>
          )}
          <p className="form__intro">{r.intro}</p>

          <div className="field">
            <label htmlFor="name-0" className="caps">
              Full name
            </label>
            <input
              id="name-0"
              type="text"
              autoComplete="name"
              required
              value={guests[0].name}
              onChange={(e) => {
                setGuest(0, { name: e.target.value })
                clear('name-0')
              }}
              {...aria('name-0')}
            />
            {err('name-0')}
          </div>

          <div className="field">
            <label htmlFor="email" className="caps">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clear('email')
              }}
              {...aria('email')}
            />
            {err('email')}
          </div>

          <fieldset className="field" aria-describedby={errors.attending ? 'attending-error' : undefined}>
            <legend className="caps">Will you be attending?</legend>
            <div className="choices">
              {(
                [
                  ['yes', 'Joyfully accepts'],
                  ['no', 'Regretfully declines'],
                ] as const
              ).map(([value, label], i) => (
                <label key={value} className={`choice${attending === value ? ' is-on' : ''}`}>
                  <input
                    type="radio"
                    name="attending"
                    value={value}
                    checked={attending === value}
                    onChange={() => {
                      setAttending(value)
                      clear('attending')
                    }}
                    required
                    data-field={i === 0 ? 'attending' : undefined}
                  />
                  <span className="choice__dot" aria-hidden="true" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {err('attending')}
          </fieldset>

          <div className={`form__more${coming ? ' is-open' : ''}`} inert={!coming}>
            <div className="form__more-inner">
              <div className="field">
                <label htmlFor="count" className="caps">
                  Number of guests (including yourself)
                </label>
                <select id="count" value={guests.length} onChange={(e) => setCount(Number(e.target.value))}>
                  {Array.from({ length: cfg.maxGuests }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {guests.map((guest, i) => (
                <fieldset key={i} className="field party">
                  <legend className="caps">{i === 0 ? 'Your meal' : `Guest ${i + 1}`}</legend>
                  {i > 0 && (
                    <div className="party__name">
                      <label htmlFor={`name-${i}`} className="sr-only">
                        Guest {i + 1} full name
                      </label>
                      <input
                        id={`name-${i}`}
                        type="text"
                        placeholder="Full name"
                        value={guest.name}
                        onChange={(e) => {
                          setGuest(i, { name: e.target.value })
                          clear(`name-${i}`)
                        }}
                        {...aria(`name-${i}`)}
                      />
                      {err(`name-${i}`)}
                    </div>
                  )}
                  <label htmlFor={`meal-${i}`} className="sr-only">
                    {i === 0 ? 'Your meal choice' : `Guest ${i + 1} meal choice`}
                  </label>
                  <select
                    id={`meal-${i}`}
                    value={guest.meal}
                    onChange={(e) => {
                      setGuest(i, { meal: e.target.value })
                      clear(`meal-${i}`)
                    }}
                    {...aria(`meal-${i}`)}
                  >
                    <option value="">Choose a meal</option>
                    {cfg.meals.map((meal) => (
                      <option key={meal} value={meal}>
                        {meal}
                      </option>
                    ))}
                  </select>
                  {err(`meal-${i}`)}
                </fieldset>
              ))}

              <div className="field">
                <label htmlFor="dietary" className="caps">
                  Dietary needs
                </label>
                <textarea id="dietary" rows={2} value={dietary} onChange={(e) => setDietary(e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="song" className="caps">
                  A song to get you dancing
                </label>
                <input id="song" type="text" value={song} onChange={(e) => setSong(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="note" className="caps">
              A note for the couple
            </label>
            <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="form__trap" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
          </div>

          <button type="submit" className="btn btn--wide" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending' : 'Send RSVP'}
          </button>

          <div className="form__status" role="status" aria-live="polite">
            {status === 'sending' && <p>Sending your reply…</p>}
            {status === 'error' && (
              <p className="form__error">
                {r.errorText}{' '}
                <a className="link-text" href={`mailto:${cfg.contactEmail}`}>
                  {cfg.contactEmail}
                </a>
                .
              </p>
            )}
            {Object.values(errors).some(Boolean) && <p className="sr-only">Please check the highlighted fields.</p>}
          </div>
        </form>
      </Reveal>
      <p className="rsvp__honeymoon col center">{r.honeymoonNote}</p>
    </div>
  )
}
