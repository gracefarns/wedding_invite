import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { type GalleryItem } from '../content/gallery'
import { useFocusTrap } from '../lib/hooks'
import { raster } from '../lib/images'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { ArtImage } from './ArtImage'

type Props = {
  items: GalleryItem[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}

/** Full-screen viewer on paper: captions, arrow keys, swipe, Escape, and a focus trap. */
export function Lightbox({ items, index, onChange, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const touch = useRef<number | null>(null)
  const item = items[index]
  const step = useCallback((by: number) => onChange((index + by + items.length) % items.length), [index, items.length, onChange])

  useFocusTrap(root, true, onClose)
  useEffect(() => {
    lockScroll('lightbox')
    return () => unlockScroll('lightbox')
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [step])

  const real = raster(item.file)
  const [w, h] = real ? [real.w, real.h] : item.ratio

  // Rendered at the end of <body>, so nothing in the page can size or clip it.
  return createPortal(
    <div
      ref={root}
      className="lightbox paper"
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${index + 1} of ${items.length}`}
      tabIndex={-1}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1)
      }}
    >
      <button type="button" className="lightbox__close link-caps" onClick={onClose}>
        Close
      </button>
      <figure className="lightbox__figure" key={item.file}>
        <div className="lightbox__frame" style={{ ['--w' as string]: w, ['--h' as string]: h }}>
          <ArtImage image={{ file: item.file, alt: item.alt, ratio: item.ratio, tone: 'linen' }} natural priority sizes="92vw" />
        </div>
        <figcaption className="lightbox__caption" aria-live="polite">
          {item.caption && <span className="serif serif--it">{item.caption}</span>}
          <span className="caps">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
      <div className="lightbox__nav">
        <button type="button" className="link-caps" onClick={() => step(-1)} aria-label="Previous photograph">
          Previous
        </button>
        <button type="button" className="link-caps" onClick={() => step(1)} aria-label="Next photograph">
          Next
        </button>
      </div>
    </div>,
    document.body,
  )
}
