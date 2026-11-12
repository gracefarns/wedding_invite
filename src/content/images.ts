/**
 * The image manifest. Every image slot on the site is declared here, once.
 *
 * To replace a placeholder, save your file at `public/images/<file>` using the exact path
 * below. Nothing else needs to change: the site picks it up, builds responsive AVIF/WebP
 * versions and swaps the placeholder out. IMAGES.md describes what each image should look like.
 */

export type Tone = 'linen' | 'eggshell' | 'olive' | 'moss'
export type Shape = 'rect' | 'oval' | 'arch' | 'ring' | 'flap'

export interface ImageSlot {
  /** Path under public/images. */
  file: string
  /** Alt text. Leave empty for purely decorative images. */
  alt: string
  /** Width : height, used to hold space before the image loads and for the placeholder. */
  ratio: [number, number]
  /** Short hint shown on the placeholder label, e.g. 'B&W' or 'alpha'. */
  hint?: string
  /** Placeholder colour, so layouts stay legible before the real image arrives. */
  tone?: Tone
  /** Placeholder silhouette. */
  shape?: Shape
  /**
   * What a missing image does on the live site (labels only ever show in development or with
   * ?placeholders=1). 'block' keeps a plain block so the layout holds; 'hide' removes the
   * piece entirely, which is right for decorative accents and for parts of a composed object
   * (ribbon, envelope) that would otherwise read as a drawn shape.
   */
  missing?: 'block' | 'hide'
}

const slot = (s: ImageSlot) => s

export const images = {
  // ── Couple photographs ────────────────────────────────────────────────────
  coupleHero: slot({
    file: 'couple/hero.jpg',
    alt: 'Clara and Clark together',
    ratio: [3, 2],
    hint: 'landscape, safe centre crop',
    tone: 'moss',
  }),
  coupleHeroPortrait: slot({
    file: 'couple/hero-portrait.jpg',
    alt: 'Clara and Clark together',
    ratio: [9, 16],
    hint: 'portrait crop for phones',
    tone: 'moss',
  }),
  ovalPortrait: slot({
    file: 'couple/oval-portrait.jpg',
    alt: 'Portrait of Clara and Clark',
    ratio: [4, 5],
    hint: 'shown B&W',
    shape: 'oval',
    tone: 'eggshell',
  }),

  // ── Paper and stationery ──────────────────────────────────────────────────
  linenSurface: slot({ file: 'paper/linen-surface.jpg', alt: '', ratio: [4, 3], tone: 'linen' }),
  grain: slot({ file: 'paper/grain.png', alt: '', ratio: [1, 1], hint: 'tileable' }),
  embossedCard: slot({
    file: 'paper/embossed-card.png',
    alt: '',
    ratio: [5, 7],
    hint: 'alpha',
    tone: 'eggshell',
  }),
  ovalDetailsCard: slot({
    file: 'paper/oval-details-card.png',
    alt: '',
    ratio: [3, 4],
    hint: 'alpha',
    shape: 'oval',
    tone: 'linen',
  }),
  embossedOvalFrame: slot({
    file: 'paper/embossed-oval-frame.png',
    alt: '',
    ratio: [4, 5],
    hint: 'alpha, transparent centre',
    shape: 'ring',
    missing: 'hide',
  }),
  deckleCard: slot({
    file: 'paper/deckle-card.png',
    alt: '',
    ratio: [4, 5],
    hint: 'alpha',
    tone: 'eggshell',
  }),
  watercolorWash: slot({
    file: 'paper/watercolor-wash.png',
    alt: '',
    ratio: [4, 5],
    hint: 'alpha',
    tone: 'olive',
    missing: 'hide',
  }),
  envelopeBack: slot({ file: 'paper/envelope-back.png', alt: '', ratio: [7, 5], hint: 'alpha', tone: 'moss', missing: 'hide' }),
  envelopeFront: slot({ file: 'paper/envelope-front.png', alt: '', ratio: [7, 5], hint: 'alpha', tone: 'olive', missing: 'hide' }),
  envelopeFlap: slot({
    file: 'paper/envelope-flap.png',
    alt: '',
    ratio: [7, 4],
    hint: 'alpha',
    tone: 'olive',
    shape: 'flap',
    missing: 'hide',
  }),
  venueWatercolor: slot({
    file: 'paper/venue-watercolor.jpg',
    alt: 'Watercolour illustration of Larkspur House',
    ratio: [7, 5],
    tone: 'eggshell',
  }),

  // ── Ribbon ────────────────────────────────────────────────────────────────
  ribbonKnot: slot({ file: 'ribbon/bow-knot.png', alt: '', ratio: [2, 1], hint: 'alpha', tone: 'moss', missing: 'hide' }),
  ribbonTailLeft: slot({ file: 'ribbon/tail-left.png', alt: '', ratio: [1, 2], hint: 'alpha', tone: 'olive', missing: 'hide' }),
  ribbonTailRight: slot({ file: 'ribbon/tail-right.png', alt: '', ratio: [1, 2], hint: 'alpha', tone: 'olive', missing: 'hide' }),
  ribbonBand: slot({ file: 'ribbon/band.png', alt: '', ratio: [8, 1], hint: 'alpha', tone: 'olive', missing: 'hide' }),
  ribbonTab: slot({ file: 'ribbon/tab.png', alt: '', ratio: [1, 2], hint: 'alpha', tone: 'olive', missing: 'hide' }),

  // ── Florals ───────────────────────────────────────────────────────────────
  cornerLeft: slot({
    file: 'florals/corner-arrangement-left.png',
    alt: '',
    ratio: [4, 5],
    hint: 'alpha',
    missing: 'hide',
  }),
  cornerRight: slot({
    file: 'florals/corner-arrangement-right.png',
    alt: '',
    ratio: [4, 5],
    hint: 'alpha',
    missing: 'hide',
  }),
  hydrangea: slot({ file: 'florals/hydrangea-sprig.png', alt: '', ratio: [1, 1], hint: 'alpha', missing: 'hide' }),
  ranunculus: slot({
    file: 'florals/ranunculus-single.png',
    alt: '',
    ratio: [1, 1],
    hint: 'alpha',
    shape: 'oval',
    tone: 'eggshell',
  }),
  amaranthus: slot({ file: 'florals/amaranthus-trail.png', alt: '', ratio: [1, 3], hint: 'alpha', missing: 'hide' }),
  rose: slot({ file: 'florals/rose-single.png', alt: '', ratio: [1, 1], hint: 'alpha', missing: 'hide' }),
  gardenBlur: slot({
    file: 'florals/garden-blur.jpg',
    alt: 'A soft-focus garden of white and green flowers',
    ratio: [3, 2],
    hint: 'soft focus',
    tone: 'moss',
  }),

  // ── Monogram and table ────────────────────────────────────────────────────
  wreath: slot({
    file: 'monogram/wreath.png',
    alt: '',
    ratio: [1, 1],
    hint: 'eggshell on alpha',
    shape: 'ring',
    missing: 'hide',
  }),
  taperCandle: slot({ file: 'table/taper-candle.png', alt: '', ratio: [1, 4], hint: 'alpha', missing: 'hide' }),
  toileNapkin: slot({ file: 'table/toile-napkin.jpg', alt: '', ratio: [3, 2], hint: 'tileable if possible', tone: 'moss' }),
  goldRimPlate: slot({ file: 'table/gold-rim-plate.png', alt: '', ratio: [1, 1], hint: 'alpha', missing: 'hide' }),

  // ── Sharing ───────────────────────────────────────────────────────────────
  og: slot({ file: 'og.jpg', alt: '', ratio: [1200, 630] }),

  // ── Optional transparent video for the untie step ─────────────────────────
  ribbonUntieVideo: slot({ file: 'intro/ribbon-untie.webm', alt: '', ratio: [5, 7], hint: 'optional, alpha video' }),
} satisfies Record<string, ImageSlot>

export type SlotName = keyof typeof images
