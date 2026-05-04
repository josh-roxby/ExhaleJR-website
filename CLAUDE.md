# CLAUDE.md

Guidance for Claude Code working in this repo.

## Project shape

Next.js (App Router) + TypeScript (strict) + Tailwind. Three visible surfaces:

- **Portfolio** — default for web visitors. Routes: `/`, `/about`, `/thinking`.
- **Lab** — `/lab` and `/lab/[project]`. Default landing for installed PWA sessions; navigable on web.
- **Design system** — `/designsystem`. Showcase route demoing every primitive in `/components/ui` with §6 IDs.

## Persistent app chrome

The floating bottom nav (DESIGN-SYSTEM §5.2) and bento popover (§5.3) are **global** — mounted once at the root layout (`app/layout.tsx` → `<AppNav>`) and visible on every page. The `<AppNav>` floats over content with `fixed` positioning; the root wraps `children` in `pb-32` so content has clearance.

The nav has three sections, divided by subtle pipes:

1. **Primary** (left, persistent) — Home, About.
2. **Secondary** (center, per-page) — pages inject items via `<NavSecondary>{...NavItems}</NavSecondary>`. The portal teleports children into the slot. Pipes around the slot only render when at least one `<NavSecondary>` is mounted (tracked via `NavProvider` ref count).
3. **Menu** (right, persistent) — toggles the bento popover. The popover's action cells link to Lab, Design, Thinking, etc.; the lab list cell renders every entry in `projects/registry.ts`.

When adding page-specific nav items, render `<NavSecondary>` inside a client component. See `app/designsystem/page.tsx` for an example (scroll-to-top / scroll-to-bottom).

PWA detection is cookie-based:

- `components/pwa/display-mode-probe.tsx` writes the `x-display-mode` cookie on the client based on `(display-mode: standalone)`.
- `proxy.ts` (Next 16's renamed middleware) reads the cookie. If standalone and visiting `/`, it rewrites to `/lab`.

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
proxy.ts                      # PWA cookie routing (Next 16 convention)
```

## Project isolation rules

1. **Project-only code stays in `/projects/<slug>`.** Components, libs, hooks, styles, types — all scoped. Do not promote anything to `/components`, `/lib`, etc. unless ≥ 2 projects share it. Three near-duplicates beat a premature abstraction.
2. **Every project exports `Page` and `meta` from `index.ts`.** The lab route renders whatever `Page` you export.
3. **Register new projects in `projects/registry.ts`.** Add an `import * as <slug>` and an entry to `labProjects`.
4. **Each project owns a `TODO.md`.** Linked from the master `/TODO.md`.
5. **Imports inside a project** may use `@/projects/<slug>/...` or relative paths. Avoid cross-project imports — if you reach for one, that code probably belongs in shared roots.

## Design system

**Source of truth: `styles/DESIGN-SYSTEM.md` (v0.1, locked).** Do not invent tokens or colors — reference what's there. Amendments require a version bump.

- `styles/tokens.css` — CSS custom properties (§2 of the doc)
- `styles/base.css` — body atmosphere (radial glows + noise), resets, no-select rules (§3.4, §7)
- `styles/globals.css` — entry: imports tokens, then Tailwind, then base
- `tailwind.config.ts` — exposes tokens as Tailwind classes (`bg-bg`, `text-ink`, `text-mute`, `bg-surface`, `border-line`, `text-accent`, `shadow-glow`, `rounded-sq`, `font-display`, `font-mono`, etc.)

Fonts (`Big Shoulders Display`, `DM Sans`, `JetBrains Mono`) load via `next/font/google` in `app/layout.tsx` and populate `--font-*` CSS variables, which `tokens.css` aliases to `--f-display`, `--f-body`, `--f-mono`.

**Shape language (§3.1):** square (5px radius) for buttons, inputs, cards, dropdowns. Round (pill) for chips, pills, badges, toggles. Don't mix.

**Motion (§3.2):** single duration `var(--t)` = 240ms. Two easings: `--ease` for transitions, `--ease-press` for active scale.

**Overlays (§3.5):** dropdowns/popovers fully opaque (`#161616`). Modals get blur. Backdrops dim + blur.

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
