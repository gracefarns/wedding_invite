import { ArtImage } from '../components/ArtImage'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Stationery } from '../components/Stationery'
import { site } from '../content/site.config'
import { usePageTitle } from '../lib/hooks'

export default function Registry() {
  const r = site.registry
  usePageTitle(r.title)
  return (
    <div className="page registry">
      <PageHeader title={r.title} intro={r.intro} />
      <ul className="registry__grid col">
        {r.cards.map((card, i) => (
          <Reveal as="li" key={card.name} delay={i * 120}>
            <Stationery href={card.url} className="registry__card" tilt={i % 2 ? 4 : -4}>
              <span className="serif serif--it registry__name">{card.name}</span>
              <span className="registry__note">{card.note}</span>
              <span className="link-caps registry__visit">
                {r.visitLabel}
                <span className="sr-only"> at {card.name} (opens in a new tab)</span>
              </span>
            </Stationery>
          </Reveal>
        ))}
      </ul>

      {r.honeymoon.show && (
        <section className="honeymoon col center" aria-labelledby="honeymoon">
          <div className="honeymoon__trail" aria-hidden="true">
            <ArtImage slot="amaranthus" sizes="120px" className="sway" />
          </div>
          <Reveal>
            <hr className="rule" />
            <h2 id="honeymoon" className="serif serif--it section-title">
              {r.honeymoon.title}
            </h2>
            <p>{r.honeymoon.text}</p>
          </Reveal>
          <Reveal delay={150}>
            <a className="btn btn--ghost" href={r.honeymoon.url} target="_blank" rel="noreferrer noopener">
              {r.honeymoon.label}
            </a>
          </Reveal>
        </section>
      )}
    </div>
  )
}
