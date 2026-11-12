"""
Generates the three starter textures that ship with the repo so paper surfaces are never flat:

  public/images/paper/grain.png            tileable paper grain (used with mix-blend-mode: multiply)
  public/images/paper/linen-surface.jpg    woven linen tabletop behind the intro card
  public/images/paper/watercolor-wash.png  olive wash that dissolves to transparent

They are procedural rasters (noise, not drawings) and are meant as stand-ins: replace any of
them with a scanned or photographed texture of the same name whenever you like.

    python3 scripts/starter-textures.py
"""
import numpy as np
from PIL import Image, ImageFilter

OUT = "public/images/paper/"
rng = np.random.default_rng(24042027)


def fractal(h, w, beta, seed):
    """Tileable 1/f^beta noise via spectral synthesis, normalised to 0..1."""
    r = np.random.default_rng(seed)
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    f = np.sqrt(fx * fx + fy * fy)
    f[0, 0] = 1.0
    spectrum = (r.normal(size=(h, w)) + 1j * r.normal(size=(h, w))) / f ** beta
    spectrum[0, 0] = 0
    n = np.real(np.fft.ifft2(spectrum))
    return (n - n.min()) / (n.max() - n.min())


def blur(a, radius):
    img = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float64) / 255


def grain():
    n = 512
    fine = rng.normal(0, 1, (n, n))
    tooth = fractal(n, n, 0.9, 1) - 0.5        # paper tooth
    cloud = fractal(n, n, 2.2, 2) - 0.5        # slow mottling
    # short fibres: anisotropic noise in two directions
    fy = np.fft.fftfreq(n)[:, None]
    fx = np.fft.fftfreq(n)[None, :]
    fibres = np.zeros((n, n))
    for k, angle in enumerate((0.35, 1.9, 2.7)):
        u = fx * np.cos(angle) + fy * np.sin(angle)
        v = -fx * np.sin(angle) + fy * np.cos(angle)
        env = np.exp(-(u * 14) ** 2) * np.exp(-((np.abs(v) - 0.16) * 9) ** 2)
        r = np.random.default_rng(10 + k)
        s = (r.normal(size=(n, n)) + 1j * r.normal(size=(n, n))) * env
        f = np.real(np.fft.ifft2(s))
        fibres += f / np.abs(f).max()
    value = 0.93 + 0.020 * fine + 0.16 * tooth + 0.06 * cloud + 0.035 * fibres
    value = np.clip(value, 0.74, 1.0)
    Image.fromarray((value * 255).astype(np.uint8), "L").save(OUT + "grain.png", optimize=True)


def linen_surface():
    h, w = 1800, 2400
    y = np.arange(h)[:, None].astype(np.float64)
    x = np.arange(w)[None, :].astype(np.float64)
    period = 7.0
    # threads wander slightly and vary in thickness, as real slubby linen does
    wander_x = (fractal(h, w, 1.8, 21) - 0.5) * 9
    wander_y = (fractal(h, w, 1.8, 22) - 0.5) * 9
    slub_x = fractal(1, w, 0.6, 23)            # per-thread thickness, vertical threads
    slub_y = fractal(h, 1, 0.6, 24)
    warp = np.cos(2 * np.pi * (x + wander_x) / period)
    weft = np.cos(2 * np.pi * (y + wander_y) / period)
    over = np.cos(np.pi * (x + wander_x) / period) * np.cos(np.pi * (y + wander_y) / period) > 0
    weave = np.where(over, warp * (0.6 + slub_x), weft * (0.6 + slub_y))
    weave = blur((weave + 2.2) / 4.4, 0.7) - 0.5
    tone = (fractal(h, w, 2.4, 25) - 0.5)       # slow shading across the cloth
    fuzz = rng.normal(0, 1, (h, w))
    value = 0.80 + 0.16 * weave + 0.14 * tone + 0.012 * fuzz
    # a touch of falloff toward the edges, so the card reads as lit from above
    cy, cx = (y - h * 0.46) / h, (x - w * 0.5) / w
    value *= 1.0 - 0.38 * (cx * cx + cy * cy)
    value = np.clip(value, 0, 1)[..., None]
    # tabletop taupe: linen (#DDCCB7) deepened toward moss-brown in the shadows
    light = np.array([221, 204, 183]) / 255
    dark = np.array([122, 108, 92]) / 255
    rgb = dark + (light - dark) * value
    Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(
        OUT + "linen-surface.jpg", quality=86, optimize=True, progressive=True)


def watercolor_wash():
    h, w = 1600, 1280
    t = np.linspace(0, 1, h)[:, None]           # 0 at top (pigment), 1 at bottom (bare paper)
    big = fractal(h, w, 2.3, 31)
    mid = fractal(h, w, 1.5, 32)
    fine = fractal(h, w, 0.8, 33)
    # where the water carried pigment: a ragged front between ~45% and ~85% of the height
    front = t * 1.75 - 0.30 + (big - 0.5) * 0.62 + (mid - 0.5) * 0.16
    body = np.clip(1.0 - front, 0, 1)
    alpha = np.clip(body * 1.9, 0, 1) ** 0.75
    # pigment pools along the drying edge
    edge = np.exp(-((front - 0.93) / 0.045) ** 2)
    alpha = np.clip(alpha * (0.90 + 0.14 * big) + 0.22 * edge * (0.4 + mid), 0, 1)
    # granulation: pigment settles into the paper tooth
    alpha *= 0.96 + 0.20 * (fine - 0.5) + 0.06 * (rng.random((h, w)) - 0.5)
    # back-runs: lighter blooms inside the wash
    bloom = blur(np.clip((fractal(h, w, 2.0, 34) - 0.62) * 6, 0, 1), 12)
    alpha *= 1.0 - 0.22 * bloom * np.clip(t * 2.2, 0, 1)
    alpha = np.clip(alpha, 0, 1)
    alpha[-40:, :] *= np.linspace(1, 0, 40)[:, None]
    olive = np.array([155, 152, 121]) / 255
    moss = np.array([106, 106, 83]) / 255
    depth = np.clip(0.25 + 0.75 * (1 - t) * (0.55 + 0.9 * (mid - 0.3)) + 0.5 * edge, 0, 1)[..., None]
    rgb = olive + (moss - olive) * depth
    rgba = np.concatenate([rgb, alpha[..., None]], -1)
    Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8), "RGBA").save(
        OUT + "watercolor-wash.png", optimize=True)


if __name__ == "__main__":
    grain()
    linen_surface()
    watercolor_wash()
    print("starter textures written to", OUT)
