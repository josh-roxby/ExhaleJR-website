# ExhaleJR

Personal portfolio + project lab. Next.js (App Router) + TypeScript + Tailwind, with a PWA shell for the lab.

## Surfaces

- **Portfolio** — `/`, `/about`, `/thinking`
- **Lab** — `/lab` index, `/lab/<slug>` per project. Default landing when installed as a PWA.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 (portfolio) or http://localhost:3000/lab.

## Adding a project

1. Create `/projects/<slug>/` with `index.ts`, `meta.ts`, `page.tsx`, `TODO.md`.
2. Register it in `projects/registry.ts`.
3. Link its TODO from the root `TODO.md`.

See `CLAUDE.md` for the full convention and `projects/hello/` as a reference.
