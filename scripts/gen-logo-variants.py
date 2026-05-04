"""Generate placeholder logo PNGs into /public/logo (no external deps).

The SVG masters (logo.svg, mark.svg) live alongside these and are the real
source. The PNGs here exist for surfaces that need a raster file (PWA
manifest, Apple touch icon, Open Graph image, favicon fallback).

Replace the PNGs with real renders when branding lands. The metadata in
app/layout.tsx and the manifest at app/manifest.ts both reference paths in
this folder, so swapping files keeps the wiring intact.
"""
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "logo")
os.makedirs(OUT, exist_ok=True)


def png_chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data))
    )


def make_png(width: int, height: int, pixel) -> bytes:
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # PNG filter type: None
        for x in range(width):
            r, g, b, a = pixel(x, y)
            raw += bytes((r, g, b, a))

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # RGBA, 8-bit
    return (
        sig
        + png_chunk(b"IHDR", ihdr)
        + png_chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + png_chunk(b"IEND", b"")
    )


BG = (10, 10, 10, 255)        # --bg #0a0a0a
FG = (124, 92, 255, 255)      # --accent Iris #7c5cff


def render_square(path: str, size: int, circle_radius_pct: float):
    """Iris circle on near-black square. Used for icon-shaped surfaces."""
    cx = cy = size / 2

    def pixel(x, y):
        dx = (x - cx) / (size / 2)
        dy = (y - cy) / (size / 2)
        d = (dx * dx + dy * dy) ** 0.5
        if d < circle_radius_pct:
            return FG
        return BG

    data = make_png(size, size, pixel)
    with open(path, "wb") as f:
        f.write(data)
    print(f"wrote {path} ({len(data)} bytes)")


def render_og(path: str, width: int, height: int):
    """Open Graph banner. Iris circle centered on a wider near-black canvas."""
    cx = width / 2
    cy = height / 2
    radius = min(width, height) * 0.18

    def pixel(x, y):
        dx = x - cx
        dy = y - cy
        d = (dx * dx + dy * dy) ** 0.5
        if d < radius:
            return FG
        return BG

    data = make_png(width, height, pixel)
    with open(path, "wb") as f:
        f.write(data)
    print(f"wrote {path} ({len(data)} bytes)")


# PWA manifest icons. Circle ~55% of canvas.
render_square(os.path.join(OUT, "logo-192.png"), 192, 0.55)
render_square(os.path.join(OUT, "logo-512.png"), 512, 0.55)

# Maskable: content inside ~80% safe zone, so radius ≤ 0.40.
render_square(os.path.join(OUT, "logo-maskable.png"), 512, 0.40)

# Apple touch icon, favicon, and any other "tile" surfaces.
render_square(os.path.join(OUT, "logo-180.png"), 180, 0.55)
render_square(os.path.join(OUT, "logo-256.png"), 256, 0.55)

# Open Graph image. 1200x630 is the spec for og:image and twitter:image.
render_og(os.path.join(OUT, "og.png"), 1200, 630)
