import { Envelope } from '../components/Envelope'
import { EventsTimeline } from '../components/EventsTimeline'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { site } from '../content/site.config'
import { ceremonyTime, directionsUrl, downloadIcs, googleCalendarUrl, weddingDate } from '../lib/dates'
import { usePageTitle } from '../lib/hooks'

const SWATCHES = [
  ['Eggshell', 'var(--eggshell)'],
  ['Linen', 'var(--linen)'],
  ['Olive', 'var(--olive)'],
  ['Moss', 'var(--moss)'],
  ['Mahogany', 'var(--mahogany)'],
]

export default function Details() {
  const d = site.details
  usePageTitle(d.title)
  return (
    <div className="page details">
      <PageHeader title={d.title} intro={d.intro} />

      <section className="details__block col center" aria-labelledby="when">
        <Reveal as="h2" variant="fade" id="when" className="caps details__label">
          {d.whenLabel}
        </Reveal>
        <Reveal>
          <p className="caps details__weekday">{weddingDate.weekday}</p>
          <p className="serif serif--it details__big">
            {weddingDate.day}
            <sup>{weddingDate.ordinal}</sup> {weddingDate.month}
          </p>
          <p className="details__year">{weddingDate.year}</p>
          <hr className="rule details__rule" />
          <p>Ceremony at {ceremonyTime}</p>
        </Reveal>
        <Reveal delay={150} className="details__links">
          <button type="button" className="link-caps" onClick={downloadIcs}>
            {d.calendarLabel}
          </button>
          <a className="link-caps" href={googleCalendarUrl()} target="_blank" rel="noreferrer noopener">
            {d.googleCalendarLabel}
          </a>
        </Reveal>
      </section>

      <hr className="rule rule--wide col" />

      <section className="details__block col center" aria-labelledby="where">
        <Reveal as="h2" variant="fade" id="where" className="caps details__label">
          {d.whereLabel}
        </Reveal>
        <Reveal>
          <p className="serif serif--it details__big">{site.venue.name}</p>
          <address className="details__address">
            {site.venue.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </Reveal>
        <Reveal delay={150} className="details__links">
          <a className="link-caps" href={directionsUrl()} target="_blank" rel="noreferrer noopener">
            {d.directionsLabel}
          </a>
        </Reveal>
      </section>

      <Envelope caption={d.envelopeCaption} />

      <section className="events col center" aria-labelledby="events">
        <Reveal as="h2" variant="wipe" id="events" className="script events__heading">
          {d.eventsTitle}
        </Reveal>
        <Reveal variant="fade" delay={400}>
          <hr className="rule" />
        </Reveal>
        <EventsTimeline />
      </section>

      <section className="details__note paper paper--linen" aria-labelledby="attire">
        <div className="col center">
          <Reveal as="h2" id="attire" className="serif serif--it details__heading">
            {d.attireTitle}
          </Reveal>
          <Reveal as="p" className="caps details__attire">
            {site.wedding.attire}
          </Reveal>
          <Reveal as="p" delay={100}>
            {d.attireText}
          </Reveal>
          <Reveal delay={200}>
            <ul className="swatches" aria-label={d.attirePaletteNote}>
              {SWATCHES.map(([name, color]) => (
                <li key={name}>
                  <i style={{ background: color }} />
                  <span className="caps">{name}</span>
                </li>
              ))}
            </ul>
            <p className="caps swatches__note">{d.attirePaletteNote}</p>
          </Reveal>
        </div>
      </section>

      <section className="details__block details__block--last col center" aria-labelledby="parking">
        <Reveal as="h2" id="parking" className="serif serif--it details__heading">
          {d.parkingTitle}
        </Reveal>
        <Reveal as="p" delay={100}>
          {d.parkingText}
        </Reveal>
      </section>
    </div>
  )
}
