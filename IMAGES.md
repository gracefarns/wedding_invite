# Images checklist

Every image on the site is a file under `public/images/`. To add one, save it at the exact path
below and it appears: the site builds responsive AVIF and WebP versions and a blur-up for you.
No code changes are needed. Paths and alt text live in [`src/content/images.ts`](src/content/images.ts).

- **Missing images** show as soft paper placeholders. In development (`npm run dev`), or on the
  live site with `?placeholders=1` added to the address, each placeholder names the file it wants.
- **Format**: `.jpg` for photographs, `.png` with a transparent background for cutouts
  (flowers, ribbon, cards). Keep the file name and extension exactly as listed.
- **Size**: the widths below are the longest edge to aim for. Bigger is fine, the site scales down.
- **Never** copy anything from `design-reference/` into `public/`. Those files are reference only.

Status key: ☐ needed · ◐ starter shipped (looks fine, replace when you have something better)

## Couple photographs (yours)

| | File | Size | Ratio | What it should look like | Used on |
|---|---|---|---|---|---|
| ☐ | `couple/hero.jpg` | 2400 px wide | 3:2 landscape | The two of you, with calm space around you. The monogram sits over the centre, so keep faces off the exact middle or choose a wide, atmospheric shot. Only used if `home.heroImage` is `'couple'` in `site.config.ts`, or if there is no garden photo. | Intro reveal, Home hero (desktop) |
| ☐ | `couple/hero-portrait.jpg` | 1400 px wide | 9:16 portrait | A portrait crop of the same moment for phones. Optional: without it the landscape photo is cropped. | Home hero (phones) |
| ☐ | `couple/oval-portrait.jpg` | 1200 px wide | 4:5 portrait | A close portrait, faces in the upper-middle. **Upload it in colour**: the site shows it black-and-white. | Home, in the embossed oval frame |
| ☐ | `couple/story-1.jpg` … `story-4.jpg` | 1200 px wide | 4:5 portrait | One per chapter of Our Story. They sit in arched and oval mats, so keep the subject central. | Our Story |
| ☐ | `gallery/01.jpg` … `09.jpg` | 1600 px longest edge | any | Your favourites. Add or remove entries in [`src/content/gallery.ts`](src/content/gallery.ts), where each one also gets a caption, alt text and a mat shape. | Gallery |

## Paper and stationery

| | File | Size | Ratio | What it should look like | Used on |
|---|---|---|---|---|---|
| ◐ | `paper/linen-surface.jpg` | 2400 px wide | 4:3 | A tabletop seen from above: natural linen or warm taupe cloth, evenly lit, nothing on it. | Intro, behind the card |
| ◐ | `paper/embossed-card.png` | 1400 px tall | 5:7 portrait, alpha | A cream cotton card with deckled edges and a **blind-embossed floral border** (no ink, just relief), photographed flat from above and cut out. The starter has a plain embossed panel instead of florals. | Intro |
| ◐ | `paper/oval-details-card.png` | 1200 px tall | 3:4 portrait, alpha | A blank oval card, a shade deeper than the outer card, with one thin printed rule just inside the edge. No text: the site sets the names on it. | Intro, countdown, RSVP messages |
| ☐ | `paper/embossed-oval-frame.png` | 1500 px tall | 4:5 portrait, alpha | A sheet of pale paper with an embossed lace or floral oval border and a **transparent oval hole** in the middle (about 62% of the width and 68% of the height). The portrait shows through. Without it, the portrait sits in a plain oval mat. | Home portrait |
| ◐ | `paper/deckle-card.png` | 1000 px tall | 4:5 portrait, alpha | A plain cream card with torn (deckled) edges, blank. | Home quick links, Registry cards |
| ◐ | `paper/grain.png` | 512 px | 1:1, tileable | Fine paper grain, near-white, that repeats without a visible seam. | Every paper surface |
| ◐ | `paper/watercolor-wash.png` | 1600 px tall | 4:5 portrait, alpha | An olive watercolour wash: dense pigment along the **top**, breaking into a ragged wet edge and clear (transparent) by the **bottom** third. | Home, between the hero and the invitation |
| ☐ | `paper/envelope-back.png` | 1400 px wide | 7:5 landscape, alpha | The inside back panel of an open olive envelope, seen from the front. Slightly darker than the front. | Details |
| ☐ | `paper/envelope-front.png` | 1400 px wide | 7:5 landscape, alpha | The front pocket of the same envelope, **exactly the same size and position** as the back, with the V-shaped opening transparent at the top. | Details |
| ☐ | `paper/envelope-flap.png` | 1400 px wide | 7:4 landscape, alpha | The open flap, **pointing up** (a triangle with its base along the bottom), lining side showing. | Details |
| ☐ | `paper/venue-watercolor.jpg` | 1400 px wide | 7:5 landscape | A watercolour illustration of Larkspur House on cream paper. This is the card that slides out of the envelope. | Details |

## Ribbon

Frayed olive silk, as in `inviteRibbon.jpeg`. Ideally all four pieces come from one photograph of
one ribbon, so the colour and light match.

| | File | Size | Ratio | What it should look like | Used on |
|---|---|---|---|---|---|
| ☐ | `ribbon/bow-knot.png` | 800 px wide | about 2:1, alpha | The bow itself: the two loops and the knot between them, no tails. | Intro, countdown, RSVP messages |
| ☐ | `ribbon/tail-left.png` | 400 px wide | about 1:2, alpha | One hanging tail, frayed, cut on the diagonal at the bottom. The **top** is where it leaves the knot. | Same |
| ☐ | `ribbon/tail-right.png` | 400 px wide | about 1:2, alpha | The other tail, a little different in length. | Same |
| ☐ | `ribbon/band.png` | 1600 px wide | about 8:1, alpha | A flat strip of the ribbon, long enough to cross the card, frayed along both long edges. | Same |
| ☐ | `ribbon/tab.png` | 200 px wide | about 1:2, alpha | A short offcut of the same ribbon. A crop of a tail works well. | Quick-link and Registry cards |
| ☐ | `intro/ribbon-untie.webm` | 1000 px wide | 5:7, alpha video | **Optional.** A 1.5–2.5 second transparent video (VP9 with alpha) of the bow coming undone and the ribbon leaving the frame, framed to the card with 20% spare room on every side. If present it replaces the layered ribbon animation. | Intro |

## Florals

In the spirit of `florals.jpeg`: white garden roses, white ranunculus, lime-and-white hydrangea,
hanging green amaranthus, tulip foliage. Cutouts need a soft natural shadow removed (the site adds its own).

| | File | Size | Ratio | What it should look like | Used on |
|---|---|---|---|---|---|
| ☐ | `florals/garden-blur.jpg` | 2400 px wide | 3:2 landscape | A soft-focus photograph of white and green flowers filling the frame. Low contrast, nothing sharp in the centre, where the monogram sits. | Intro reveal, Home hero |
| ☐ | `florals/hydrangea-sprig.png` | 900 px | about 1:1, alpha | A single lime-and-white hydrangea head with a few leaves, seen from above. | Intro (corner of the card), FAQ |
| ☐ | `florals/amaranthus-trail.png` | 900 px tall | about 1:3, alpha | One trailing stem of green amaranthus, hanging straight down, attached end at the top. | Intro, Registry |
| ☐ | `florals/ranunculus-single.png` | 600 px | 1:1, alpha | One open white ranunculus seen from directly above, centred. **This is the flower that travels down the Order of Events line.** | Details |
| ☐ | `florals/rose-single.png` | 600 px | 1:1, alpha | One white garden rose, seen from above or three-quarters. | Home, Our Story |
| ☐ | `florals/corner-arrangement-left.png` | 1400 px tall | about 4:5, alpha | A loose arrangement that grows in from the **left** edge: flowers heaviest at the left and bottom, thinning to the right. | Home and Gallery on wide screens |
| ☐ | `florals/corner-arrangement-right.png` | 1400 px tall | about 4:5, alpha | The same idea from the **right** edge. A mirrored copy of the left works, a different arrangement is nicer. | Home and Gallery on wide screens, phone menu |

## Monogram and table

| | File | Size | Ratio | What it should look like | Used on |
|---|---|---|---|---|---|
| ☐ | `monogram/wreath.png` | 1000 px | 1:1, alpha | A fine ornamental or botanical wreath in **eggshell (`#EDE7DB`) on transparent**, open in the middle (the centre 55% clear) for the "C & C" the site sets inside it. | Home hero |
| ☐ | `table/toile-napkin.jpg` | 2400 px wide | 3:2 landscape | A green-on-cream toile fabric, flat, filling the frame, like the napkins in `florals.jpeg`. Mid-to-dark overall so the cream card stands out. | Home countdown band |
| ☐ | `table/gold-rim-plate.png` | 1200 px | 1:1, alpha | A gold-rimmed plate from directly above, cut out. The countdown card sits on it. Optional. | Home countdown |
| ☐ | `table/taper-candle.png` | 1200 px tall | about 1:4, alpha | A lit ivory taper in a brass holder, flame at the very top. The site adds the glow. Optional. | Home countdown (wide screens), Travel |
| ◐ | `og.jpg` | 1200 × 630 | 1.91:1 | The picture shown when the link is shared in messages. The starter is the names on paper. | Link previews |

## Where to find them

Search terms that work well on Canva, Unsplash, Freepik, Creative Market and Etsy:

- **Ribbon**: "frayed silk ribbon bow PNG", "hand torn silk ribbon olive", "chiffon ribbon bow transparent", "sage silk ribbon flat lay"
- **Embossed paper**: "blind embossed floral paper texture", "letterpress floral border cream", "embossed wedding invitation mockup top view", "deckled edge cotton paper PNG"
- **Oval frame**: "embossed oval frame paper", "vintage embossed lace frame PNG", "paper doily oval frame transparent"
- **Envelope**: "olive green envelope open mockup PNG", "sage envelope layered mockup", "envelope flap open top view"
- **Flowers**: "white hydrangea PNG transparent", "white ranunculus top view PNG", "green amaranthus hanging PNG", "white garden rose cutout", "white green floral corner arrangement PNG"
- **Garden**: "white garden flowers soft focus", "hydrangea bokeh green white", "blurred white roses background"
- **Wreath**: "ornamental wreath monogram frame PNG", "baroque crest frame white", "fine botanical wreath line PNG"
- **Table**: "green toile fabric texture", "toile de jouy green seamless", "gold rim plate top view PNG", "taper candle brass holder PNG"
- **Wash**: "olive watercolor wash PNG", "sage green watercolour texture transparent"
- **Venue**: commission a watercolour of the house (Etsy: "custom venue watercolor"), or scan one from your printed suite.

Tips

- For cutouts from your own photos, Canva's Background Remover or remove.bg gives a clean PNG.
- To recolour an asset to the palette, shift it toward olive `#9B9879` or moss `#6A6A53`.
- The ribbon video can be exported from After Effects or DaVinci Resolve as WebM, VP9 with alpha.

## Regenerating the starters

The ◐ paper files are generated, not downloaded. To rebuild them:

```bash
python3 scripts/starter-textures.py
```

```bash
node scripts/brand-assets.mjs
```
