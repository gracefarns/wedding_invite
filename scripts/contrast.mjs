/**
 * Checks every text/background pairing used on the site against WCAG 2.1.
 *   node scripts/contrast.mjs
 * AA needs 4.5:1 for body text and 3:1 for large text (24px+, or 18.66px+ bold) and UI.
 */
const palette = {
  eggshell: '#EDE7DB',
  linen: '#DDCCB7',
  olive: '#9B9879',
  moss: '#6A6A53',
  mahogany: '#4D342D',
  ink: '#4A4A3A',
}

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(palette[a]), lum(palette[b])].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, where it is used, minimum ratio]
const pairs = [
  ['ink', 'eggshell', 'body text, small caps, links', 4.5],
  ['ink', 'linen', 'body text on linen bands, cards and the footer', 4.5],
  ['eggshell', 'ink', 'button labels', 4.5],
  ['eggshell', 'mahogany', 'button labels on hover', 4.5],
  ['mahogany', 'eggshell', 'form errors, hover states, tiny numerals', 4.5],
  ['mahogany', 'linen', 'footer signature', 4.5],
  ['moss', 'eggshell', 'script titles and large headings (large text only)', 3],
  ['moss', 'linen', 'monogram on linen (large text only)', 3],
  ['eggshell', 'moss', 'hero monogram and date over the fogged photograph', 3],
  ['ink', 'olive', 'placeholder labels on olive blocks (development only)', 3],
]

let failed = false
for (const [fg, bg, use, min] of pairs) {
  const r = ratio(fg, bg)
  const ok = r >= min
  if (!ok) failed = true
  console.log(`${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (needs ${min})  ${fg} on ${bg} — ${use}`)
}
console.log(`\nolive on eggshell is ${ratio('olive', 'eggshell').toFixed(2)}:1, so olive is used for rules, borders and ribbon only, never for text.`)
process.exitCode = failed ? 1 : 0
