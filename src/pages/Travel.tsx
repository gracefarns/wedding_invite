import { ArtImage } from '../components/ArtImage'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { site } from '../content/site.config'
import { directionsUrl } from '../lib/dates'
import { usePageTitle } from '../lib/hooks'

export default function Travel() {
  const t = site.travel
  usePageTitle(t.title)
  return (
    <div className="page travel">
      <PageHeader title={t.title} intro={t.intro} />

      <section className="col" aria-labelledby="stay">
        <Reveal as="h2" id="stay" className="serif serif--it section-title center">
          {t.hotelsTitle}
        </Reveal>
        <ul className="hotels">
          {t.hotels.map((hotel, i) => (
            <Reveal as="li" key={hotel.name} delay={i * 80}>
              <article className="hotel paper paper--linen">
                <p className="caps hotel__distance">{hotel.distance}</p>
                <h3 className="serif hotel__name">{hotel.name}</h3>
                <p className="hotel__notes">{hotel.notes}</p>
                <div className="hotel__foot">
                  {hotel.blockCode && (
                    <p className="hotel__code">
                      <span className="caps">Block code</span>
                      <strong>{hotel.blockCode}</strong>
                    </p>
                  )}
                  <a className="link-caps" href={hotel.url} target="_blank" rel="noreferrer noopener">
                    Book a room<span className="sr-only"> at {hotel.name}</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="travel__block col center" aria-labelledby="airport">
        <Reveal as="h2" variant="fade" id="airport" className="caps details__label">
          {t.airportTitle}
        </Reveal>
        <Reveal>
          <p className="serif serif--it details__big travel__airport">{t.airportName}</p>
          <p>{t.airportText}</p>
        </Reveal>
      </section>

      <hr className="rule rule--wide col" />

      <section className="travel__block col" aria-labelledby="getting-there">
        <Reveal as="h2" id="getting-there" className="serif serif--it section-title center">
          {t.gettingThereTitle}
        </Reveal>
        <dl className="ways">
          {t.gettingThere.map((way, i) => (
            <Reveal key={way.mode} delay={i * 80} className="ways__row">
              <dt className="caps">{way.mode}</dt>
              <dd>{way.text}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal className="center travel__map">
          <a className="btn btn--ghost" href={directionsUrl()} target="_blank" rel="noreferrer noopener">
            {site.details.directionsLabel}
          </a>
        </Reveal>
      </section>

      <div className="travel__candle" aria-hidden="true">
        <ArtImage slot="taperCandle" sizes="100px" />
      </div>
    </div>
  )
}
