"""Import + optimise images into a /public/gallery/<slug>/ collection.

Reads originals from one or more source paths (files or folders) and writes
two optimised copies per image:

    /public/gallery/<slug>/<NN>.jpg          long edge 1600 px, JPEG q85
    /public/gallery/<slug>/thumbs/<NN>.jpg   long edge  500 px, JPEG q78

`<NN>` is a zero-padded sequence starting at 1 + the count of existing
files in the collection, so re-running appends rather than replacing.

EXIF orientation is baked into the pixels so phone photos stay right-way-up.

Usage:
    python3 scripts/import-gallery.py <slug> <path> [<path> ...]

Example:
    python3 scripts/import-gallery.py favourites ~/Downloads/best-of-may
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("Pillow required. Run: pip3 install -r scripts/requirements.txt")

ROOT = Path(__file__).resolve().parent.parent
GALLERY_DIR = ROOT / "public" / "gallery"

FULL_LONG_EDGE = 1600
FULL_QUALITY = 85
THUMB_LONG_EDGE = 500
THUMB_QUALITY = 78

IMAGE_EXT = re.compile(r"\.(jpe?g|png|webp|avif)$", re.IGNORECASE)


def resize_long_edge(img: Image.Image, long_edge: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= long_edge:
        return img.copy()
    if w >= h:
        new_w = long_edge
        new_h = round(h * long_edge / w)
    else:
        new_h = long_edge
        new_w = round(w * long_edge / h)
    return img.resize((new_w, new_h), Image.LANCZOS)


def process(src: Path, full_path: Path, thumb_path: Path) -> None:
    with Image.open(src) as img:
        img = ImageOps.exif_transpose(img)
        if img.mode in ("RGBA", "LA", "P"):
            # JPEG can't carry alpha; flatten on a black background to match
            # the gallery surface so transparent regions don't render white.
            background = Image.new("RGB", img.size, (10, 10, 10))
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")

        full = resize_long_edge(img, FULL_LONG_EDGE)
        full.save(full_path, "JPEG", quality=FULL_QUALITY, optimize=True, progressive=True)
        full_size = full_path.stat().st_size
        print(f"  full   {full_path.relative_to(ROOT)}  {full.size[0]}x{full.size[1]}  {full_size // 1024}k")

        thumb = resize_long_edge(img, THUMB_LONG_EDGE)
        thumb.save(thumb_path, "JPEG", quality=THUMB_QUALITY, optimize=True, progressive=True)
        thumb_size = thumb_path.stat().st_size
        print(f"  thumb  {thumb_path.relative_to(ROOT)}  {thumb.size[0]}x{thumb.size[1]}  {thumb_size // 1024}k")


def collect_sources(paths: list[Path]) -> list[Path]:
    sources: list[Path] = []
    for p in paths:
        if p.is_dir():
            for f in sorted(p.iterdir()):
                if f.is_file() and IMAGE_EXT.search(f.name):
                    sources.append(f)
        elif p.is_file():
            if IMAGE_EXT.search(p.name):
                sources.append(p)
            else:
                print(f"skipping non-image: {p}")
        else:
            print(f"missing: {p}")
    return sources


def next_index(coll_dir: Path) -> int:
    if not coll_dir.exists():
        return 1
    nums: list[int] = []
    for f in coll_dir.iterdir():
        if f.is_file() and IMAGE_EXT.search(f.name) and f.stem.isdigit():
            nums.append(int(f.stem))
    return (max(nums) + 1) if nums else 1


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit("Usage: import-gallery.py <slug> <path> [<path> ...]")

    slug = sys.argv[1]
    paths = [Path(p).expanduser().resolve() for p in sys.argv[2:]]

    coll_dir = GALLERY_DIR / slug
    thumbs_dir = coll_dir / "thumbs"
    coll_dir.mkdir(parents=True, exist_ok=True)
    thumbs_dir.mkdir(parents=True, exist_ok=True)

    sources = collect_sources(paths)
    if not sources:
        sys.exit("No image files found.")

    start = next_index(coll_dir)
    print(f"Importing {len(sources)} image(s) into {coll_dir.relative_to(ROOT)} starting at #{start:02d}")

    for i, src in enumerate(sources):
        n = start + i
        name = f"{n:02d}.jpg"
        print(f"#{n:02d}  ({src.name})")
        try:
            process(src, coll_dir / name, thumbs_dir / name)
        except Exception as exc:  # noqa: BLE001
            print(f"  ERROR: {exc}")

    print("Done.")


if __name__ == "__main__":
    main()
