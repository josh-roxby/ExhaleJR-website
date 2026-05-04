# /public/logo

Single source of truth for the ExhaleJR brand mark. `logo.png` is the master.
Everything else (PWA icons, favicon, Apple touch icon, OG image, the React
`<Logo>` component) reads from this folder.

## Files

| File | Used by | Notes |
|---|---|---|
| `logo.png` | `<Logo>` component, master | Source artwork (640×640 here, any size works). |
| `logo-192.png` | PWA manifest (`app/manifest.ts`) | 192×192 raster icon. Generated from `logo.png`. |
| `logo-512.png` | PWA manifest | 512×512 raster icon. Generated. |
| `logo-maskable.png` | PWA manifest | 512×512 maskable. Logo stays inside the safe zone. Generated. |
| `logo-180.png` | Apple touch icon (`metadata.icons.apple`) | 180×180. Generated. |
| `logo-256.png` | Favicon (`metadata.icons.icon`) | 256×256. Generated. |
| `og.png` | Open Graph (`metadata.openGraph.images`) | 1200×630. Generated. |

The generated variants render the master centered on a dark `--bg` (#0a0a0a)
canvas so the white mark stays visible on light surfaces (browser tabs in
light mode, social-card previews on light backgrounds, etc).

## Replacing the master

1. Drop new artwork at `/public/logo/logo.png`. Square aspect works best.
2. Regenerate the variants:

   ```bash
   pip3 install -r scripts/requirements.txt   # first time only
   python3 scripts/gen-logo-variants.py
   ```

3. Commit and push.

## Inline usage in React

```tsx
import { Logo } from "@/components/ui";

<Logo size={48} priority />
```

`priority` skips lazy-loading — use it for above-the-fold placement (hero).
