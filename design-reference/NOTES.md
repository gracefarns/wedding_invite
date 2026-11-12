# Design reference notes

Reference only. Nothing in this folder is imported, copied into `public/`, or shipped.

## colors.jpeg — the palette (mandatory)

Five flat swatches on a warm off-white, labelled in a tall, light, high-contrast serif with a small
monospaced hex beside each.

| Token | Hex | What I take from it |
|---|---|---|
| eggshell | `#EDE7DB` | The paper. Warm, not white. Dominant surface (~45%). |
| linen | `#DDCCB7` | A pinker, deeper cream. Secondary surfaces, cards, mats (~25%). |
| olive | `#9B9879` | A greyed sage. Ribbon, hairlines, borders (~15%). Too light for text. |
| moss | `#6A6A53` | Headings, bands, nav (~10–12%). Large text only on eggshell. |
| mahogany | `#4D342D` | Accent only (≤5%): signature, hover, tiny numerals. |

- The label serif (tall, light, wide caps) is the cue for the display face: Cormorant Garamond, light.
- Text on olive/moss in the swatch card is linen/eggshell — the same pairing is used for dark bands.

## inviteRibbon.jpeg — the primary look

- Heavy cream cotton stock, shot from above on a warm taupe surface, with a soft directional shadow.
- **Blind emboss**: the floral border has no ink at all. It is visible only as highlight and shadow,
  so it must be a photograph or scan. It cannot be faked with strokes.
- **Oval inset card**: slightly darker cream than the outer card, a thin single inner rule a few
  millimetres in from the edge, script title at the top, small tracked caps underneath.
- **Ribbon**: hand-torn olive silk with frayed, feathered edges, matte with a soft sheen, tied in a
  loose asymmetric bow, tails cut on the diagonal. The band crosses the card at a slight angle.
- Layering order from the back: surface → embossed card → oval card → ribbon band → tails → knot.
- Takeaways for the build: the intro suite uses exactly this stack; cards elsewhere use an oval or
  deckled paper image with a ribbon accent; shadows are soft and stacked, never a single hard drop.

## florals.jpeg — flowers, light and table

- White garden roses, white ranunculus, lime-and-white hydrangea, one trailing green amaranthus,
  tulip foliage. Loose and garden-gathered, not a tight dome. Greens are yellow-green, not blue.
- Dusk light: cool white linens, with warm pools of light around each taper and votive.
- Table details reused as motifs: ivory tapers in brass holders, a green toile napkin, a gold-rimmed
  toile plate, an oval table number with a script heading on a small stand.
- Takeaways: floral cutouts sit at corners and trail off the edge; the amaranthus is the vertical
  accent; the candle glow becomes a slow, irregular radial light on the intro; the toile napkin
  becomes the countdown band; the gold rim becomes a thin olive hairline frame.

## video-frames — the bar for elegance and motion

| Frame | Time | What happens | What I take |
|---|---|---|---|
| 01 | 0.2s | Closed gatefold, sepia pencil landscape, photographed olive wax seal with a real shadow | The opening object is a photograph of a physical thing, full-bleed, with one focal point |
| 02 | 1.3s | Halves part vertically, seal travels with the top half, pocket revealed | Parts move as rigid physical pieces with believable depth |
| 03 | 2.0s | Everything blooms to white | A bloom to paper-white bridges the two scenes |
| 04 | 4.2s | Hazy painted meadow fades in, monogram and wreath at low opacity | Soft-focus image, low contrast, monogram arrives late |
| 05 | 5.4s | Monogram settled, crisp cream on the haze | Cream monogram in a fine ornamental wreath, centred slightly below the middle |
| 06 | 7.4s | Scroll: meadow gives way to a dark moss wash | Scroll drives a wash, the monogram is gone by then |
| 07 | 8.6s | Wash dissolves into white paper, small caps appear, script names enter from below | Grainy wash edge, tiny tracked caps, lots of air |
| 08 | 9.6s | Names in huge flourished script, date and address beneath | Script spans the full width, hairline strokes; date in a clean sans, address lighter |
| 09 | 10.8s | B&W couple photo in an oval blind-embossed lace frame on a grey-cream band | Photo is B&W, frame is a real emboss, band is a different paper tone |
| 10 | 11.4s | "Wedding Details" script, short rule, tracked paragraph | Section pattern: script title → short hairline → one short paragraph |
| 11 | 13.4s | WHEN / WHERE blocks, underlined caps links, olive envelope rising at the bottom | Serif italic for date and venue, labels in tiny caps, links are underlined caps |
| 12 | 16.0s | "Order of Events", dashed centre line, alternating steps, a real white flower on the line | The flower is a photographed cutout with its own shadow; it rides the line with scroll |
| 13 | 17.4s | Flower further down; countdown card on a dark band edged with pearls | Countdown is a physical card on a textured band with a real trim |
| 14–16 | 19–22s | "Will you join us?", form with radio cards and a pill button, honeymoon note | Fields are hairline boxes, labels tiny caps, selected radio is a tinted card |

Common thread: every decorative element is a real image, code only layers and moves it; type is
minimal and crisp; motion is slow and soft and nothing bounces.

## How ours differs

- The opening object is the `inviteRibbon` suite (card, oval, ribbon), not a gatefold and seal.
- The transition is "falling into the oval card", then a garden photograph instead of a painted meadow.
- The countdown sits on a toile napkin band with an olive hairline, not pearls and velvet.
- Greens come from the palette (olive, moss), which is warmer and greyer than the video's forest green.

## Build plan

1. Tokens, fonts, base styles, paper grain.
2. Image system: manifest (`src/content/images.ts`), optimiser and inventory script, `ArtImage`
   with placeholders, `IMAGES.md`.
3. Intro: loader → closed suite → untie → lift → bloom → monogram hero → wash hand-off.
4. Home.
5. Our Story, Details, Gallery, Travel & Stay, Registry, FAQ.
6. RSVP form and endpoint wiring, `RSVP_SETUP.md`.
7. Polish: page veil, reduced motion, accessibility, meta, deploy workflow, README.

Screenshots at 390×844 and 1440×900 after each stage, compared against the frames above.
