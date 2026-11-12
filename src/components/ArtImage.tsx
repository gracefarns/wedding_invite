import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { images, type ImageSlot, type SlotName } from '../content/images'
import { fileUrl, raster, showPlaceholderLabels, srcSet } from '../lib/images'

type Props = {
  /** A named slot from src/content/images.ts … */
  slot?: SlotName
  /** … or an ad-hoc image (gallery, story), described inline. */
  image?: ImageSlot
  /** Fill the positioned parent and crop to cover it. */
  fill?: boolean
  /** Use the picture's own proportions instead of the slot's (default for cutouts with alpha). */
  natural?: boolean
  /** Override the slot ratio, e.g. a different crop on phones. */
  ratio?: [number, number]
  sizes?: string
  /** Above-the-fold images: load eagerly with high priority. */
  priority?: boolean
  position?: string
  className?: string
  style?: CSSProperties
  alt?: string
  /** Hide the placeholder label (for pieces of a composed scene that is labelled as a whole). */
  quiet?: boolean
  /** Where the placeholder label sits, when live text occupies the centre. */
  labelAt?: 'top' | 'bottom'
}

/**
 * Renders an image slot.
 *  - file present  → responsive <picture> (AVIF, WebP, original), lazy, with a blur-up
 *  - file missing  → a soft paper block of the right proportions; in development (or with
 *                    ?placeholders=1) it carries a small label naming the file to add
 */
export function ArtImage({ slot, image, fill, natural, ratio, sizes, priority, position, className, style, alt, quiet, labelAt }: Props) {
  const def = image ?? (slot ? images[slot] : undefined)
  if (!def) throw new Error('ArtImage needs a slot or an image')

  const entry = raster(def.file)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true)
  }, [entry])

  const [rw, rh] = ratio ?? def.ratio
  const classes = ['art', fill && 'art--fill', className].filter(Boolean).join(' ')

  if (!entry) {
    if (def.missing === 'hide' && !showPlaceholderLabels) return null
    const label = `Replace · images/${def.file} · ${rw}:${rh}${def.hint ? ` · ${def.hint}` : ''}`
    return (
      <span
        className={`${classes} art--missing art--tone-${def.tone ?? 'linen'} art--shape-${def.shape ?? 'rect'}${
          def.missing === 'hide' ? ' art--ghost' : ''
        }`}
        style={{ ...(fill ? null : { aspectRatio: `${rw} / ${rh}` }), ...style }}
        role={def.alt ? 'img' : undefined}
        aria-label={def.alt || undefined}
        aria-hidden={def.alt ? undefined : true}
        data-missing={def.file}
      >
        {showPlaceholderLabels && !quiet && (
          <span className={`art__label${labelAt ? ` art__label--${labelAt}` : ''}`}>{label}</span>
        )}
      </span>
    )
  }

  const useNatural = natural ?? entry.alpha
  const box = fill ? null : { aspectRatio: useNatural ? `${entry.w} / ${entry.h}` : `${rw} / ${rh}` }
  const cover = fill || !useNatural
  const text = alt ?? def.alt

  return (
    <span
      className={`${classes} ${entry.alpha ? 'art--cutout' : 'art--photo'}${loaded ? ' is-loaded' : ''}`}
      style={{
        ...box,
        ...(entry.blur && !loaded ? { backgroundImage: `url(${entry.blur})` } : null),
        ...style,
      }}
      aria-hidden={text ? undefined : true}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(def.file, entry, 'avif')} sizes={sizes ?? defaultSizes} />
        <source type="image/webp" srcSet={srcSet(def.file, entry, 'webp')} sizes={sizes ?? defaultSizes} />
        <img
          ref={ref}
          src={fileUrl(def.file)}
          alt={text}
          width={entry.w}
          height={entry.h}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{ objectFit: cover ? 'cover' : 'contain', objectPosition: position }}
        />
      </picture>
    </span>
  )
}

const defaultSizes = '(min-width: 640px) 560px, 100vw'
