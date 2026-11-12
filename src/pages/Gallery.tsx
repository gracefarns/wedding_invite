import { useState } from 'react'
import { ArtImage } from '../components/ArtImage'
import { Lightbox } from '../components/Lightbox'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { gallery } from '../content/gallery'
import { site } from '../content/site.config'
import { usePageTitle } from '../lib/hooks'

export default function Gallery() {
  usePageTitle(site.gallery.title)
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="page gallery">
      <div className="gallery__floral gallery__floral--left" aria-hidden="true">
        <ArtImage slot="cornerLeft" sizes="(min-width: 1100px) 24vw, 0px" className="sway" />
      </div>
      <div className="gallery__floral gallery__floral--right" aria-hidden="true">
        <ArtImage slot="cornerRight" sizes="(min-width: 1100px) 24vw, 0px" className="sway" />
      </div>
      <PageHeader title={site.gallery.title} intro={site.gallery.intro} />
      <ul className="gallery__grid">
        {gallery.map((item, i) => (
          <Reveal as="li" key={item.file} delay={(i % 3) * 110} className="gallery__cell">
            <button
              type="button"
              className={`gallery__item mat mat--${item.mat} paper paper--linen`}
              onClick={() => setOpen(i)}
              aria-label={`Open photograph ${i + 1}: ${item.alt}`}
            >
              <ArtImage
                image={{ file: item.file, alt: '', ratio: item.ratio, shape: item.mat, tone: 'eggshell' }}
                sizes="(min-width: 960px) 320px, 46vw"
              />
            </button>
          </Reveal>
        ))}
      </ul>
      {open !== null && <Lightbox items={gallery} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  )
}
