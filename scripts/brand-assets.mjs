/**
 * Renders the monogram favicon set and the starter Open Graph image from the site's own
 * fonts and paper grain.   node scripts/brand-assets.mjs
 * Replace public/images/og.jpg with a photograph (1200×630) whenever you like.
 */
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  ;({ chromium } = require('/opt/node-tools/node_modules/playwright'))
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const b64 = (p) => readFileSync(resolve(root, p)).toString('base64')
const font = (name, file, weight = 400, style = 'normal') =>
  `@font-face{font-family:'${name}';font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${b64(`node_modules/@fontsource/${file}`)})}`
const css = `
${font('Script', 'monsieur-la-doulaise/files/monsieur-la-doulaise-latin-400-normal.woff2')}
${font('Jost', 'jost/files/jost-latin-400-normal.woff2')}
*{margin:0;box-sizing:border-box}
body{background:#EDE7DB;color:#6A6A53;display:grid;place-items:center;height:100vh;overflow:hidden;
  background-image:linear-gradient(rgba(237,231,219,.35),rgba(237,231,219,.35)),url(data:image/png;base64,${b64('public/images/paper/grain.png')});
  background-size:auto,420px;background-blend-mode:normal,multiply}
.m{font-family:Script;white-space:nowrap;line-height:1}
.amp{font-size:.62em;margin:0 .1em 0 .2em;position:relative;top:-.08em}
.caps{font-family:Jost;text-transform:uppercase;letter-spacing:.34em;color:#4A4A3A}
`
const page = (body) => `<!doctype html><meta charset="utf-8"><style>${css}</style>${body}`

const browser = await chromium.launch()

// Favicon: the first initial alone, so it stays legible at 16px.
const icon = await browser.newPage({ viewport: { width: 512, height: 512 } })
await icon.setContent(page(`<div class="m" style="font-size:430px;transform:translate(-4%,3%)">C</div>`))
await icon.evaluate(() => document.fonts.ready)
const iconPng = await icon.screenshot()
for (const [name, size] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  await sharp(iconPng).resize(size, size).png().toFile(resolve(root, 'public', name))
}

// Open Graph: monogram, names, date.
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await og.setContent(
  page(`<div style="text-align:center">
    <div class="m" style="font-size:210px">Clara <span class="amp">&amp;</span> Clark</div>
    <div style="width:70px;height:1px;background:#9B9879;margin:34px auto 30px"></div>
    <div class="caps" style="font-size:19px">Saturday, 24 April 2027 &nbsp;·&nbsp; Larkspur House</div>
  </div>
  <div style="position:fixed;inset:22px;border:1px solid rgba(155,152,121,.7)"></div>`),
)
await og.evaluate(() => document.fonts.ready)
await sharp(await og.screenshot()).jpeg({ quality: 88, mozjpeg: true }).toFile(resolve(root, 'public/images/og.jpg'))

await browser.close()
console.log('favicon-32.png, favicon-192.png, apple-touch-icon.png and images/og.jpg written')
