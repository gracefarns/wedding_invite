import inventory from '../content/images.generated.json'
import { images, type ImageSlot, type SlotName } from '../content/images'

export interface RasterEntry {
  w: number
  h: number
  alpha: boolean
  widths: number[]
  blur?: string
}
type Entry = RasterEntry | { file: true }

const files = inventory as Record<string, Entry>
const BASE = import.meta.env.BASE_URL

/** Labels on placeholders show in development, or on the live site with ?placeholders=1. */
export const showPlaceholderLabels: boolean = (() => {
  if (import.meta.env.DEV) return !new URLSearchParams(window.location.search).has('noplaceholders')
  try {
    if (new URLSearchParams(window.location.search).has('placeholders')) {
      sessionStorage.setItem('cc-placeholders', '1')
    }
    return sessionStorage.getItem('cc-placeholders') === '1'
  } catch {
    return false
  }
})()

export const fileUrl = (file: string) => `${BASE}images/${file}`

/** True when the file exists under public/images (any type). */
export const hasFile = (file: string) => file in files

export function raster(file: string): RasterEntry | undefined {
  const entry = files[file]
  return entry && 'w' in entry ? entry : undefined
}

export const slotOf = (name: SlotName): ImageSlot => images[name]
export const hasSlot = (name: SlotName) => hasFile(images[name].file)

const stem = (file: string) => file.replace(/\.[^.]+$/, '')

export function srcSet(file: string, entry: RasterEntry, format: 'avif' | 'webp') {
  return entry.widths.map((w) => `${BASE}images/_gen/${stem(file)}-${w}.${format} ${w}w`).join(', ')
}

/** A single optimised URL close to the wanted width, for CSS backgrounds and preloading. */
export function variantUrl(file: string, wanted = 960, format: 'avif' | 'webp' = 'webp') {
  const entry = raster(file)
  if (!entry) return undefined
  const width = entry.widths.find((w) => w >= wanted) ?? entry.widths[entry.widths.length - 1]
  return `${BASE}images/_gen/${stem(file)}-${width}.${format}`
}

/** Resolves when the image is decoded (or fails); used by the loader. */
export function preloadImage(file: string, wanted?: number): Promise<void> {
  const url = variantUrl(file, wanted)
  if (!url) return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = url
  })
}
