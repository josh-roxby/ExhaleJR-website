# CLAUDE.md

Guidance for Claude Code working in this repo.

## Project shape

Next.js (App Router) + TypeScript (strict) + Tailwind. Two visible surfaces:

- **Portfolio** — default for web visitors. Routes: `/`, `/about`, `/thinking`, etc.
- **Lab** — `/lab` and `/lab/[project]`. Default landing for installed PWA sessions; navigable on web. On web, an install prompt is shown so users can pin it to their home screen.

PWA detection is cookie-based:

- `components/pwa/display-mode-probe.tsx` writes the `x-display-mode` cookie on the client based on `(display-mode: standalone)`.
- `middleware.ts` reads the cookie. If standalone and visiting `/`, it rewrites to `/lab`.

## Directory layout

```
/app                          # Routes only — thin wrappers
  /lab/[project]/page.tsx     # Imports project Page from /projects/registry
/components                   # Shared UI primitives only (incl. /pwa)
/lib                          # Shared utilities
/hooks                        # Truly shared hooks
/styles                       # Global tokens, tailwind base
/projects
  /<slug>                     # Self-contained project
    index.ts                  # Public exports: Page, meta
    meta.ts                   # slug, name, description
    page.tsx                  # Page component
    components/ features/ lib/ hooks/ styles/ types/ server/
    TODO.md  README.md
  registry.ts                 # Lists all projects
/public                       # Static assets, sw.js, icons
middleware.ts                 # PWA cookie routing
```

## Project isolation rules

1. **Project-only code stays in `/projects/<slug>`.** Components, libs, hooks, styles, types — all scoped. Do not promote anything to `/components`, `/lib`, etc. unless ≥ 2 projects share it. Three near-duplicates beat a premature abstraction.
2. **Every project exports `Page` and `meta` from `index.ts`.** The lab route renders whatever `Page` you export.
3. **Register new projects in `projects/registry.ts`.** Add an `import * as <slug>` and an entry to `labProjects`.
4. **Each project owns a `TODO.md`.** Linked from the master `/TODO.md`.
5. **Imports inside a project** may use `@/projects/<slug>/...` or relative paths. Avoid cross-project imports — if you reach for one, that code probably belongs in shared roots.

## Style guide

Tokens live as CSS variables in `styles/globals.css`. Tailwind reads them via `tailwind.config.ts` (`bg`, `fg`, `muted`, `accent`, `font-sans`, `font-mono`). When the real style guide arrives, replace the values in `:root` and the dark `prefers-color-scheme` block — components shouldn't need to change.

## Branches

- `main` — production
- `dev` — integration
- `feat/<project-slug>/...` — feature branches off `dev`

Do not push directly to `main`.

## Commands

```
npm run dev        # local dev
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Tests/lint intentionally not configured yet — add when needed.

## Working preferences

- Edit existing files over creating new ones.
- Don't add features, abstractions, or error handling beyond what the task requires.
- Default to no comments. Only add a comment when the WHY is non-obvious.
- For UI changes, run `npm run dev` and verify in a browser before reporting done.
- Match the scope of changes to what was asked — no surrounding cleanup unless requested.
