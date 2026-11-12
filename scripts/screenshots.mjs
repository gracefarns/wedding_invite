/**
 * Visual review helper. With the dev server (or `npm run preview`) running:
 *
 *   node scripts/screenshots.mjs [baseUrl] [outDir]
 *
 * Captures the intro sequence frame by frame (with timings) and every page at
 * 390×844 and 1440×900, and reports any console errors.
 */
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  ;({ chromium } = require('/opt/node-tools/node_modules/playwright'))
}

const base = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '')
const out = process.argv[3] || 'docs/screenshots'
const only = process.argv[4]
const sizes = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]
const pages = [
  ['home', '/'],
  ['our-story', '/our-story'],
  ['details', '/details'],
  ['gallery', '/gallery'],
  ['travel', '/travel'],
  ['registry', '/registry'],
  ['rsvp', '/rsvp'],
  ['faq', '/faq'],
]

await mkdir(out, { recursive: true })
const browser = await chromium.launch()
const errors = []

for (const size of sizes) {
  const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  page.on('console', (m) => m.type() === 'error' && errors.push(`${size.name}: ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`${size.name}: ${e.message}`))

  // ── Intro sequence, timed from the tap ──────────────────────────────────
  if (!only || only === 'intro') {
    await page.goto(base + '/')
    await page.waitForSelector('.intro.is-idle', { timeout: 15000 })
    await page.waitForTimeout(1800)
    await page.screenshot({ path: `${out}/intro-${size.name}-0-closed.png` })
    const t0 = Date.now()
    await page.click('.suite')
    for (const [label, at] of [['1-untie', 900], ['2-lift', 2300], ['3-bloom', 3400], ['4-garden', 4700], ['5-monogram', 6100]]) {
      await page.waitForTimeout(Math.max(0, at - (Date.now() - t0)))
      await page.screenshot({ path: `${out}/intro-${size.name}-${label}.png` })
    }
    await page.waitForFunction(() => !document.documentElement.classList.contains('is-locked'), null, { timeout: 15000 })
    const total = Date.now() - t0
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${out}/intro-${size.name}-6-settled.png` })
    console.log(`${size.name}: intro ran ${(total / 1000).toFixed(1)}s from tap to scroll unlock`)
  }

  // ── Pages (intro already seen in this session) ──────────────────────────
  for (const [name, path] of pages) {
    if (only && only !== name) continue
    await page.goto(base + path)
    await page.waitForFunction(() => !document.querySelector('.loader') || document.querySelector('.loader.is-leaving'), null, { timeout: 15000 })
    await page.waitForTimeout(700)
    // walk the page so scroll reveals have fired, then capture the whole thing
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += size.height * 0.6) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(260)
    }
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${out}/${name}-${size.name}.png`, fullPage: true })
  }
  await context.close()
}

await browser.close()
if (errors.length) {
  console.log('Console errors:\n' + [...new Set(errors)].join('\n'))
  process.exitCode = 1
} else {
  console.log('No console errors.')
}
