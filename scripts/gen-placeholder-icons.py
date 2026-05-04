"""Generate placeholder PWA icons (no external deps)."""
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
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


def render(path: str, size: int, circle_radius_pct: float):
    cx = cy = size / 2

    def pixel(x, y):
        # squared distance from center, normalized to half-size
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


# Standard app icons — circle takes ~60% of canvas
render(os.path.join(OUT, "icon-192.png"), 192, 0.55)
render(os.path.join(OUT, "icon-512.png"), 512, 0.55)

# Maskable: stay inside ~80% safe zone (radius ≤ 0.4)
render(os.path.join(OUT, "maskable-512.png"), 512, 0.40)

# Next.js convention: app/apple-icon.png and app/icon.png are auto-wired
# into <link rel="apple-touch-icon"> and <link rel="icon"> respectively.
APP_DIR = os.path.join(os.path.dirname(__file__), "..", "app")
render(os.path.join(APP_DIR, "apple-icon.png"), 180, 0.55)
render(os.path.join(APP_DIR, "icon.png"), 256, 0.55)
