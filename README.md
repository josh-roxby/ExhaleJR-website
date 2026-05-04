# ExhaleJR

Personal site + drawing board for projects. Next.js (App Router) + TypeScript + Tailwind, with a PWA shell.

## Surfaces

- **Home** (`/`) — unified welcome: about, this app, drawing-board preview, exhale, more. Same canonical home for both web and installed PWA.
- **Drawing board** — `/drawingboard` (tile grid) and `/drawingboard/<slug>` (project page).
- **Design system** — `/designsystem`. Component showcase tied to `styles/DESIGN-SYSTEM.md`.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding a project

1. Create `/projects/<slug>/` with `index.ts`, `meta.ts`, `page.tsx`, `TODO.md`, and (when ready) `RIP.md`.
2. Register it in `projects/registry.ts`.
3. Link its TODO from the root `TODO.md`.

Every project starts `wip: true`. See `CLAUDE.md` for the WIP / version lifecycle and `projects/hello/` for the reference layout.
