# /public/logo

Single source of truth for the ExhaleJR brand mark. Everything that references
the logo (favicon, PWA icons, Apple touch icon, Open Graph image, the React
`<Logo>` component) reads from this folder.

## Files

| File | Used by | Notes |
|---|---|---|
| `logo.svg` | Reference, downloads, future external use | 512×512 master vector. |
| `mark.svg` | Same | 64×64 mark for tight spaces. |
| `logo-192.png` | PWA manifest (`app/manifest.ts`) | 192×192 raster icon. |
| `logo-512.png` | PWA manifest | 512×512 raster icon. |
| `logo-maskable.png` | PWA manifest | 512×512 maskable. Content stays inside the safe zone. |
| `logo-180.png` | Apple touch icon (`metadata.icons.apple`) | 180×180. |
| `logo-256.png` | Favicon (`metadata.icons.icon`) | 256×256. |
| `og.png` | Open Graph image (`metadata.openGraph.images`) | 1200×630. |

## Inline usage

For React, import the `<Logo>` component from `@/components/ui`. It renders the
SVG inline with `currentColor`, so you can tint it via Tailwind text classes:

```tsx
import { Logo } from "@/components/ui";

<span className="text-accent">
  <Logo size={48} />
</span>
```

## How to replace these placeholders

Drop in real SVG and PNG files at the paths above. Keep the filenames identical
so all the references already in the codebase pick up the new files.

If you want to regenerate the placeholder PNGs from a single colour (during
early development), run:

```bash
python3 scripts/gen-placeholder-icons.py
```

Edit the `BG` and `FG` constants in the script first to change colours.
