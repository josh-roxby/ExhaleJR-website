# TODO. Master

This is the master todo. Sub-project todos live next to their code and are linked here as children. Keep this file as the single index. Each sub-project owns its own detail.

## Repo / shared infra

### Now (current sprint, ordered)

A1. **Cleanup pass.** Small mechanical changes, ship together.
   - Remove the `hello` project (folder, registry entry, master TODO link).
   - Rename the `cooking` project's display name to `What's cookin` (slug stays `cooking`).

A2. **Local-storage architecture.** Foundation for any project that wants to persist data on the user's device.
   - `lib/user-store.ts` with a single localStorage key `exhalejr.user`. Shape: `{ v, settings, projects: { [slug]: { v, data } } }`. Schema-versioned at root and per-project so partial migrations don't trash sibling project data.
   - `hooks/use-project-storage.ts` returning `[data, setData, hydrated]`. Loads on mount only (no SSR mismatch), writes only this project's slot, leaves the rest of the user's stored data untouched.
   - Document the rule in `CLAUDE.md`: projects only ever read/write their own slot via this hook.

A3. **Tempo project.** New drawing-board entry. Habit tracker MVP using A2.
   - Project under `/projects/tempo` with the standard folder layout (index, meta, page, components/, data/, TODO, README, RIP).
   - Two habit types: `boolean` (yes/no toggle) and `counter` (numeric +/-).
   - Today's view: list of habits with the input control per type. Add-habit form (name + type select).
   - Persist via `useProjectStorage("tempo", 1, ...)`.
   - Description on the home page tile mentions data lives on the device only.
   - WIP true; tags `["habits", "tools", "personal"]`.

A4. **Gallery rebuild.** Replaces the flat tile grid with collections + carousels + lightbox.
   - Folders under `/public/gallery/` for `favourites`, `collection-1`, `collection-2`, `collection-3` (with `.gitkeep` so empty ones are tracked).
   - Server-side reader (`content/gallery.ts`) that lists image files in each subfolder.
   - Page: hero, then four sections each rendering a 200px-tall horizontal carousel with snap. Portrait images.
   - Click any image to open it in the existing `<Modal>` as a lightbox (max-h-[80vh]).
   - Empty-collection state per section so dropping new images is the only setup needed.
   - Names + descriptions for collection-1/2/3 are placeholders for now; user names them later.

### Standing
- [ ] Replace placeholder PWA icons in `/public/icons` and `/app/{icon,apple-icon}.png` with real branding.
- [ ] Real copy on the home page. Replace `// COPY:` markers in `app/page.tsx`.
- [ ] Decide content source for `/thoughts`, `/found`, `/creative`. Markdown entries committed, or admin UI.
- [ ] iOS install-prompt fallback. No `beforeinstallprompt` event on iOS, so render "Add to Home Screen" instructions instead.
- [ ] Offline page + SW caching once routes stabilise.

### Later
- [ ] ESLint + Prettier config when contribution patterns settle.
- [ ] Vitest setup once shared lib code is non-trivial.
- [ ] CI: typecheck + build on PR.
- [ ] Open Graph images, sitemap, robots.

## Recently shipped

- Phase 2 component library: selects, checkboxes/radios, toggles, sliders, tabs, carousel.
- Cooking project full-bleed layout, monochrome step cards, ← / → nav arrows across the cook flow, two new recipes (soft-boiled eggs + pancakes).
- Floating-nav timer slot + counter pill above the bottom nav for cook step view.
- `/public/logo` as single source of truth, real logo wired through icons / favicon / OG.
- `/about`, `/contact`, `/gallery`, `/help` routes.

## Projects

Each project links to its own TODO. Add new projects under `/projects/<slug>` and register them in `projects/registry.ts`.

- [`cooking`](./projects/cooking/TODO.md). Recipe player with step-by-step timers and an audio ding.
- [`tempo`](./projects/tempo/TODO.md). Daily habit tracker. Boolean or counter habits, persisted on device.

<!--
When adding a new project:
1. Create /projects/<slug>/ with index.ts, meta.ts, page.tsx, TODO.md, README.md, RIP.md
2. Register it in projects/registry.ts
3. Add a link to its TODO.md in this section
-->
