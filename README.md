# Clara & Clark

The wedding website for Clara & Clark: a cinematic invitation opening, then Home, Our Story,
Details, Gallery, Travel & Stay, Registry, RSVP and FAQ.

Built with Vite, React and TypeScript. GSAP and ScrollTrigger drive the intro and scroll
choreography, Lenis smooths scrolling, and React Router handles the pages. It deploys as a
static site.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open the address it prints (usually `http://localhost:5173`).

| Command | What it does |
|---|---|
| `npm run dev` | Local site with live reload. Placeholders are labelled with the file they want. |
| `npm run build` | Optimises images, type-checks and builds to `dist/`. |
| `npm run preview` | Serves the built site locally. |
| `npm run screenshots` | Captures the intro sequence and every page at 390×844 and 1440×900 into `screenshots/` (needs the dev server running). |
| `node scripts/contrast.mjs` | Checks every text and background pairing against WCAG AA. |

## Three things you will want to do

### 1. Swap in your images

Save each file at the path listed in **[IMAGES.md](IMAGES.md)**, for example
`public/images/couple/oval-portrait.jpg`. That is all: the placeholder is replaced, and responsive
AVIF and WebP versions plus a blur-up are generated for you. No code changes.

- A missing image shows as a soft paper block. In development it is labelled with the file name,
  size and ratio it wants. On the live site, add `?placeholders=1` to the address to see the labels.
- Decorative pieces that are missing (flowers, ribbon, envelope) are simply left out on the live site.
- Gallery photos: drop them in `public/images/gallery/` and list them in
  [`src/content/gallery.ts`](src/content/gallery.ts) with a caption, alt text and mat shape.
- Alt text for every other image is in [`src/content/images.ts`](src/content/images.ts).
- The files in `design-reference/` are reference only and are never used by the site.

A few paper textures ship as starters (grain, linen tabletop, watercolour wash, plain cards) so
paper never looks flat. Replace them the same way whenever you have something better.

### 2. Edit the words and details

Everything is in **[`src/content/site.config.ts`](src/content/site.config.ts)**: names, date, times,
timezone, venue, map link, RSVP deadline, order of events, hotels, registries, FAQ and the story.

- Lines marked `// TODO confirm` are the facts given so far and need a final check.
- Blocks marked `PLACEHOLDER` are invented copy for you to rewrite.
- The date is entered once (`wedding.date`) and every display of it, the countdown and the calendar
  file are derived from it. Set `wedding.timezone` to the venue's timezone so they are correct.
- `home.heroImage` chooses between the garden photo and a photo of you two behind the monogram.

### 3. Turn on RSVP

Follow **[RSVP_SETUP.md](RSVP_SETUP.md)**. In short: create a Google Sheet, paste the provided
Apps Script, deploy it, and put its URL in `rsvp.endpoint`. Formspree works too. Until then the RSVP
page shows "Opening soon"; preview the form at `/rsvp?preview=1`.

## Deploy

### GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`.

1. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Merge to `main`. The site builds and publishes to `https://<user>.github.io/<repo>/`.

The base path is set automatically, including for a custom domain. Direct links such as `/rsvp`
work because the build copies `index.html` to `404.html`.

### Vercel

Import the repository. The defaults are right (build `npm run build`, output `dist`), and
`vercel.json` routes every page to the app.

### After the first deploy

Set `meta.url` in `site.config.ts` to the site's address (for example `https://claraandclark.com`).
Link previews in messages need an absolute image address, and this provides it.

## How it is put together

```
src/
  content/
    site.config.ts     every word and wedding fact
    images.ts          every image slot: path, alt text, ratio
    gallery.ts         the gallery list
  components/
    ArtImage.tsx       renders a slot: responsive picture, or a paper placeholder
    Intro.tsx          closed suite → untie → lift → bloom
    Loader.tsx         monogram and progress hairline while fonts and images arrive
    …                  nav, footer, countdown, envelope, timeline, lightbox
  pages/               one file per page
  styles/
    tokens.css         palette, type, easing, shadows
  lib/                 dates and calendar, RSVP sending, scrolling, motion
scripts/
  images.mjs           image optimiser and inventory (runs on dev and build)
  starter-textures.py  generates the starter paper textures
  brand-assets.mjs     generates the favicon and starter share image
  screenshots.mjs      visual review captures
  contrast.mjs         colour contrast check
```

### Design rules the code keeps to

- **Palette**: eggshell, linen, olive, moss and mahogany only, defined once in `tokens.css`.
  Mahogany is an accent (footer signature, hover states, form errors, the times in the order of
  events). Body text is a deepened moss, `#4A4A3A`, which is 7.3:1 on eggshell.
- **Real materials**: flowers, ribbon, paper, envelope and photographs are always image files.
  CSS only lays them out, masks them, moves them and gives them soft stacked shadows.
- **Motion**: slow and soft. Nothing under 500 ms, no linear easing, no bounce. Only `transform`,
  `opacity`, `filter` and `clip-path` are animated.
- **The intro** plays once per browser session, only when arriving on the home page. A Skip link
  is always visible, Enter or Space opens the invitation, and the footer has "Replay the invitation".
- **Reduced motion**: with the system setting on, the intro is skipped for a still monogram,
  smooth scrolling is off, and reveals are simple fades.
- **Fonts** are self-hosted through `@fontsource` (Monsieur La Doulaise, Cormorant Garamond, Jost)
  with `font-display: swap`. To try a different script face, change `--font-script` in `tokens.css`.

### Optional: the ribbon video

If `public/images/intro/ribbon-untie.webm` exists (a transparent VP9 video of the bow coming
undone), the intro plays it in place of the layered ribbon animation. See IMAGES.md for the spec.
