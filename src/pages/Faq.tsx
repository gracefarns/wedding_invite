import { useId, useState } from 'react'
import { ArtImage } from '../components/ArtImage'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { TLink } from '../components/TLink'
import { site } from '../content/site.config'
import { usePageTitle } from '../lib/hooks'

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <div className={`faq__item${open ? ' is-open' : ''}`}>
      <h2 className="faq__q">
        <button type="button" aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} onClick={onToggle}>
          <span className="serif">{q}</span>
          <span className="faq__mark" aria-hidden="true">
            +
          </span>
        </button>
      </h2>
      <div className="faq__a" id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} inert={!open}>
        <div className="faq__a-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const f = site.faq
  usePageTitle(f.title)
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="page faq">
      <PageHeader title={f.title} intro={f.intro} />
      <div className="faq__list col">
        {f.items.map((item, i) => (
          <Reveal key={item.q} delay={Math.min(i, 5) * 60}>
            <Item {...item} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          </Reveal>
        ))}
      </div>
      <section className="faq__more col center">
        <div className="faq__sprig" aria-hidden="true">
          <ArtImage slot="hydrangea" sizes="200px" className="sway" />
        </div>
        <Reveal>
          <p className="serif serif--it faq__still">Still wondering about something?</p>
          <a className="link-caps" href={`mailto:${site.rsvp.contactEmail}`}>
            Write to us
          </a>
          <span className="faq__or caps">or</span>
          <TLink to="/rsvp" className="link-caps">
            RSVP
          </TLink>
        </Reveal>
      </section>
    </div>
  )
}
