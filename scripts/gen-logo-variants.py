"""Generate sized logo variants from /public/logo/logo.png.

Reads `logo.png` (the master) and writes the sized variants used by the PWA
manifest, favicon, Apple touch icon, and Open Graph image. Each variant is
rendered as the master centered on a dark `--bg` (#0a0a0a) canvas so the
white mark stays visible on light surfaces (browser tabs in light mode,
Apple home screens, OG previews on light social cards).

Run after replacing logo.png with new artwork:

    pip3 install -r scripts/requirements.txt
    python3 scripts/gen-logo-variants.py

Sizes: see the calls at the bottom of the file.
"""
import os
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required. Run: pip3 install -r scripts/requirements.txt")

ROOT = os.path.join(os.path.dirname(__file__), "..")
LOGO_DIR = os.path.join(ROOT, "public", "logo")
SRC_PATH = os.path.join(LOGO_DIR, "logo.png")

if not os.path.exists(SRC_PATH):
    sys.exit(f"Source not found: {SRC_PATH}. Drop logo.png into /public/logo first.")

SRC = Image.open(SRC_PATH).convert("RGBA")
BG = (10, 10, 10, 255)  # --bg #0a0a0a


def render(out_name: str, width: int, height: int, logo_scale: float) -> None:
    """Centered source logo on dark bg.

    logo_scale is the fraction of min(width, height) that the logo occupies.
    """
    canvas = Image.new("RGBA", (width, height), BG)
    target = int(min(width, height) * logo_scale)
    aspect = SRC.width / SRC.height
    if aspect >= 1:
        lw, lh = target, int(target / aspect)
    else:
        lw, lh = int(target * aspect), target
    logo = SRC.resize((lw, lh), Image.LANCZOS)
    canvas.alpha_composite(logo, ((width - lw) // 2, (height - lh) // 2))
    out_path = os.path.join(LOGO_DIR, out_name)
    canvas.save(out_path, "PNG", optimize=True)
    print(f"wrote {out_path}")


# PWA manifest icons. Logo at ~72% of canvas leaves a comfortable margin.
render("logo-192.png", 192, 192, 0.72)
render("logo-512.png", 512, 512, 0.72)

# Maskable: Android crops to a circle/squircle. Content must stay inside the
# safe zone (~80% inscribed circle), so the logo scales smaller.
render("logo-maskable.png", 512, 512, 0.55)

# Apple touch icon and favicon raster fallback.
render("logo-180.png", 180, 180, 0.72)
render("logo-256.png", 256, 256, 0.72)

# Open Graph banner. Smaller scale because the canvas is much wider than tall.
render("og.png", 1200, 630, 0.40)
