/**
 * Image pipeline.
 *
 * Reads every file under public/images (except _gen), and for each raster image writes
 * responsive AVIF + WebP variants to public/images/_gen and a tiny blur-up placeholder.
 * The result is an inventory, src/content/images.generated.json, which tells <ArtImage>
 * which files exist (so missing ones render a placeholder without a network request).
 *
 * Runs automatically before `npm run dev` and `npm run build`, and again in dev whenever
 * a file under public/images changes. Unchanged files are skipped via a small cache.
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'public/images')
const GEN = join(SRC, '_gen')
const OUT = join(ROOT, 'src/content/images.generated.json')
const CACHE = join(GEN, 'cache.json')
const VERSION = 3

const WIDTHS = [480, 960, 1600, 2400]
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const OTHER = new Set(['.webm', '.mp4', '.svg', '.gif'])

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === '_gen') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

async function processImage(file, key) {
  const image = sharp(file, { failOn: 'none' }).rotate()
  const meta = await image.metadata()
  const turned = (meta.orientation ?? 1) >= 5
  const w = turned ? meta.height : meta.width
  const h = turned ? meta.width : meta.height
  const alpha = Boolean(meta.hasAlpha)

  const widths = [...new Set(WIDTHS.map((x) => Math.min(x, w)))].sort((a, b) => a - b)
  const base = key.slice(0, -extname(key).length)
  await mkdir(dirname(join(GEN, base)), { recursive: true })

  for (const width of widths) {
    const resized = image.clone().resize({ width, withoutEnlargement: true })
    await resized.clone().webp({ quality: alpha ? 84 : 78, alphaQuality: 90, effort: 5 }).toFile(join(GEN, `${base}-${width}.webp`))
    await resized.clone().avif({ quality: alpha ? 60 : 52, effort: 4 }).toFile(join(GEN, `${base}-${width}.avif`))
  }

  let blur
  if (!alpha) {
    const tiny = await image.clone().resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer()
    blur = `data:image/webp;base64,${tiny.toString('base64')}`
  }
  return { w, h, alpha, widths, blur }
}

export async function buildImages({ quiet = false } = {}) {
  await mkdir(GEN, { recursive: true })
  let cache = { version: VERSION, files: {} }
  if (existsSync(CACHE)) {
    try {
      const parsed = JSON.parse(await readFile(CACHE, 'utf8'))
      if (parsed.version === VERSION) cache = parsed
    } catch {
      /* rebuild */
    }
  }

  const inventory = {}
  const nextCache = { version: VERSION, files: {} }
  let built = 0

  for (const file of (await walk(SRC)).sort()) {
    const key = relative(SRC, file).split('\\').join('/')
    const ext = extname(file).toLowerCase()
    if (OTHER.has(ext)) {
      inventory[key] = { file: true }
      continue
    }
    if (!RASTER.has(ext)) continue

    const info = await stat(file)
    const stamp = `${info.size}:${Math.round(info.mtimeMs)}`
    const hit = cache.files[key]
    if (hit && hit.stamp === stamp) {
      inventory[key] = hit.entry
    } else {
      try {
        inventory[key] = await processImage(file, key)
        built++
        if (!quiet) console.log(`  optimised ${key}`)
      } catch (err) {
        console.warn(`  skipped ${key}: ${err.message}`)
        continue
      }
    }
    nextCache.files[key] = { stamp, entry: inventory[key] }
  }

  // Drop generated variants whose source image has been removed.
  for (const key of Object.keys(cache.files)) {
    if (nextCache.files[key]) continue
    const base = key.slice(0, -extname(key).length)
    for (const width of cache.files[key].entry.widths ?? []) {
      await rm(join(GEN, `${base}-${width}.webp`), { force: true })
      await rm(join(GEN, `${base}-${width}.avif`), { force: true })
    }
  }

  await writeFile(CACHE, JSON.stringify(nextCache))
  const json = JSON.stringify(inventory, null, 2) + '\n'
  const previous = existsSync(OUT) ? await readFile(OUT, 'utf8') : ''
  if (previous !== json) await writeFile(OUT, json)
  if (!quiet) console.log(`images: ${Object.keys(inventory).length} found, ${built} optimised`)
  return inventory
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildImages().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
