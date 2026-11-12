import { ArtImage } from '../components/ArtImage'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { TLink } from '../components/TLink'
import { site } from '../content/site.config'
import { usePageTitle } from '../lib/hooks'

export default function Story() {
  const s = site.story
  usePageTitle(s.title)
  return (
    <div className="page story">
      <PageHeader title={s.title} intro={s.intro} />
      <ol className="story__list col">
        {s.chapters.map((c, i) => (
          <li key={c.title} className={`story__item story__item--${i % 2 ? 'b' : 'a'}`}>
            <Reveal variant="soft" className="story__photo">
              <div className={`mat mat--${c.mat} paper paper--linen`}>
                <ArtImage
                  image={{ file: c.image, alt: c.alt, ratio: [4, 5], shape: c.mat, tone: 'eggshell', hint: 'photo' }}
                  sizes="(min-width: 640px) 380px, 70vw"
                />
              </div>
            </Reveal>
            <Reveal className="story__text center" delay={150}>
              <p className="caps">{c.when}</p>
              <h2 className="serif story__title">{c.title}</h2>
              <p>{c.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <section className="story__closing col center">
        <div className="story__rose" aria-hidden="true">
          <ArtImage slot="rose" sizes="160px" className="sway" />
        </div>
        <Reveal as="p" className="serif serif--it story__last">
          {s.closing}
        </Reveal>
        <Reveal delay={200}>
          <TLink to="/details" className="link-caps">
            The details
          </TLink>
        </Reveal>
      </section>
    </div>
  )
}
