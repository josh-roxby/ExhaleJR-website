# CLAUDE.md

Guidance for Claude Code working in this repo.

## Project shape

Next.js (App Router) + TypeScript (strict) + Tailwind. Three visible surfaces:

- **Home** (`/`) — unified welcome surface. Sections: hero, about (anchor `#about`), this app, drawing-board preview, exhale, thoughts/found/creative stubs. Same canonical home for both web and installed-PWA visits — no routing rewrite. `/about` redirects to `/#about` via `next.config.ts`.
- **Drawing board** — `/drawingboard` (index, tile grid) and `/drawingboard/[project]` (project page). Was `/lab` — old paths redirect.
- **Design system** — `/designsystem`. Showcase route demoing every primitive in `/components/ui` with §6 IDs.

## Persistent app chrome

The floating bottom nav (DESIGN-SYSTEM §5.2) and bento popover (§5.3) are **global** — mounted once at the root layout (`app/layout.tsx` → `<AppNav>`) and visible on every page. The `<AppNav>` floats over content with `fixed` positioning; the root wraps `children` in `pb-32` so content has clearance.

The nav has three sections, divided by subtle pipes:

1. **Primary** (left, persistent) — Home, About.
2. **Secondary** (center, per-page) — pages inject items via `<NavSecondary>{...NavItems}</NavSecondary>`. The portal teleports children into the slot. Pipes around the slot only render when at least one `<NavSecondary>` is mounted (tracked via `NavProvider` ref count).
3. **Menu** (right, persistent) — toggles the bento popover. The popover's action cells link to Lab, Design, Thinking, etc.; the lab list cell renders every entry in `projects/registry.ts`.

When adding page-specific nav items, render `<NavSecondary>` inside a client component. See `app/designsystem/page.tsx` for an example (scroll-to-top / scroll-to-bottom).

PWA detection is cookie-based:

- `components/pwa/display-mode-probe.tsx` writes the `x-display-mode` cookie on the client based on `(display-mode: standalone)`. The cookie is currently informational only — both web and PWA land on `/`.

## Directory layout

```
/app                          # Routes only — thin wrappers
  /drawingboard/[project]/page.tsx  # Imports Page from /projects/registry
/components                   # Shared UI primitives only (incl. /pwa)
/lib                          # Shared utilities
/hooks                        # Truly shared hooks
/styles                       # Global tokens, tailwind base
/projects
  /<slug>                     # Self-contained project
    index.ts                  # Public exports: Page, meta
    meta.ts                   # slug, name, description, wip, version, tags
    page.tsx                  # Page component
    components/ features/ lib/ hooks/ styles/ types/ server/
    TODO.md  README.md  RIP.md (public copy-into-Claude prompt)
  registry.ts                 # Lists all projects
/public                       # Static assets, sw.js, icons
next.config.ts                # Includes /lab → /drawingboard redirects
```

## Project isolation rules

1. **Project-only code stays in `/projects/<slug>`.** Components, libs, hooks, styles, types — all scoped. Do not promote anything to `/components`, `/lib`, etc. unless ≥ 2 projects share it. Three near-duplicates beat a premature abstraction.
2. **Every project exports `Page` and `meta` from `index.ts`.** The lab route renders whatever `Page` you export.
3. **Register new projects in `projects/registry.ts`.** Add an `import * as <slug>` and an entry to `projects`.
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

## User-store and per-project localStorage

Any project that wants to persist data on the user's device goes through one shared store. Single localStorage key `exhalejr.user` with shape `{ v, settings, projects: { [slug]: { v, data } } }`. Schema-versioned at the root and per-project so partial migrations don't trash sibling project data.

- **Read/write helpers:** `lib/user-store.ts` exposes `getProjectData`, `setProjectData`, `clearProjectData`, plus `getSettings` / `patchSettings` for global settings.
- **React hook:** `hooks/use-project-storage.ts` returns `[data, setData, hydrated]`. Loads on mount only (no SSR mismatch), writes only this project's slot, leaves the rest of the user's data untouched.
- **Rule:** projects only ever read or write their own slot via `useProjectStorage` (or the underlying helpers with their own slug). Touching another project's slot or the global settings from a project is a code smell. The single `exhalejr.user` key keeps the user's whole device state in one inspectable JSON object.

When changing a project's data shape, bump its `version` argument so older data is treated as missing and replaced with the project's `defaultData` instead of being misread.

## Project lifecycle: WIP and versioning

- **Every new project starts `wip: true`.** While WIP, the drawing board renders a `WIP` Tag on its tile and the project page. No `version` is published.
- **Clearing WIP requires explicit confirmation.** When a project feels ready to leave WIP, ask the user in chat before flipping `wip: false`. Once confirmed, set `wip: false` and add `version: "v0.0.1"` to `meta.ts`.
- **Version bumps live in the project's `TODO.md`** under `## Versions` (newest first). Public-facing surfaces read `meta.version` only.
- **Public vs private docs.** `TODO.md` is the project's private worklog (versions, in-flight tasks). `RIP.md` is the public copy-into-Claude prompt that gets shipped alongside the project.

## Brand assets

`/public/logo/` is the single source of truth for the brand mark. `logo.png` is the master. Every surface that needs the logo reads from there: `app/manifest.ts` icons, `metadata.icons` and `metadata.openGraph.images` in `app/layout.tsx`, and the React `<Logo>` component in `components/ui/logo.tsx` (which renders the master via `next/image`).

To replace the brand, drop new artwork into `/public/logo/logo.png` then run `python3 scripts/gen-logo-variants.py` to regenerate the sized variants. The script reads `logo.png`, centers it on a dark `--bg` canvas, and writes `logo-{180,192,256,512}.png`, `logo-maskable.png`, and `og.png`. All wiring already references those paths.

`scripts/requirements.txt` lists `Pillow>=10` (the only dep). First time only: `pip3 install -r scripts/requirements.txt`.

## Rip system

Each project ships with a `RIP.md` containing only the **project-specific** content: what the project does, its meta fields, any unique constraints. The shared scaffolding (attribution header, mode preamble, design language, output instructions) lives in `lib/rip-prompt.ts` and gets prepended/appended at runtime when the modal builds the final prompt.

This means individual `RIP.md` files stay short. Updating the brand attribution, design tokens, or output format only happens in one place.

Two consumer modes, toggled in the modal:

- **Claude chat** — produces a self-contained HTML artifact previewable in the chat. Best for quick experiments.
- **Claude Code** — scaffolds a full Next.js project folder under `/projects/<slug>/`, matching the drawing-board pattern.

Server-side: `lib/rip.ts` reads the `RIP.md` files (`getRipContent(slug)`, `getAllRipContents()`). Client receives the raw project content as a string and the `RipModal` calls `assembleRipPrompt(content, mode)` to build the full output that gets copied.

UI surfaces:

- **Drawing-board tiles** (`app/drawingboard/_drawing-board-client.tsx`) — circular rip button positioned absolutely top-right of each tile, sibling to the link so it doesn't trigger navigation.
- **Project pages** (`app/drawingboard/[project]/_project-shell.tsx`) — `<ProjectShell>` wraps every `Page` and renders WIP / version Tags + a rip button in the top-right action cluster.
- **`<RipButton>`** is hidden when `promptContent` is null. Projects without a `RIP.md` simply don't expose the affordance.

The modal copy is friendly and aimed at non-technical readers. Three numbered steps: pick mode, copy prompt, follow next-steps. A footer link points to `/help` for the full GitHub / Claude / Vercel walkthrough.

The attribution header instructs Claude to bake a credit comment into the generated code (in HTML for chat mode, at the top of `page.tsx` for code mode).

## Writing style

User-facing copy (pages, modals, buttons, alt text) and Claude's chat responses both follow these rules:

- **No em-dashes (—).** Use a comma, period, or parens instead. The em-dash is an AI tell.
- **No AI-tell phrasing.** Avoid: "Let's dive in", "I'd be happy to", "absolutely", "It's worth noting", "comprehensive", "moreover", "furthermore", chunky semicolons used as separators.
- **Prefer sentences over bullet lists** when prose works. Bullets are for genuinely parallel items, not for looking thorough.
- **Cut filler.** Drop "in order to", "really", "very", "just", "actually" unless they carry weight.
- **Plain words.** Talk like a normal person. Avoid jargon unless the reader is technical.

When editing existing files, clean em-dashes you encounter as you go. A full sweep of the codebase is its own task in TODO.md.

## Working preferences

- Edit existing files over creating new ones.
- Don't add features, abstractions, or error handling beyond what the task requires.
- Default to no comments. Only add a comment when the WHY is non-obvious.
- For UI changes, run `npm run dev` and verify in a browser before reporting done.
- Match the scope of changes to what was asked. No surrounding cleanup unless requested.
