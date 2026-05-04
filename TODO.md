# TODO — master

This is the master todo. Sub-project todos live next to their code and are linked here as children. Keep this file as the single index — each sub-project owns its own detail.

## Repo / shared infra

### Now
- [x] ~~Apply design system tokens (`styles/DESIGN-SYSTEM.md` v0.1) to globals.~~ Done — tokens, fonts, body atmosphere live; existing pages refactored onto the token set.
- [ ] Build out the component library against `DESIGN-SYSTEM.md` §4–§5. Awaiting full reference HTML files (`jr-round-1-v4.html`, `jr-round-2-v2.html`, `jr-mobile-home-concept-v3.html`).
- [ ] Replace placeholder PWA icons in `/public/icons` and `/app/{icon,apple-icon}.png` with real branding.

### Next
- [ ] Flesh out `/about` and `/thinking` pages with real content.
- [ ] Decide on a content source for `/thinking` (MDX in repo? CMS? local markdown?).
- [ ] Add a real install prompt fallback for iOS (no `beforeinstallprompt` event) — show "Add to Home Screen" instructions instead.
- [ ] Add an offline page and basic SW caching strategy once routes stabilize.
- [ ] Implement floating bottom nav + bento popover (§5.2, §5.3) for the lab/PWA shell.

### Later
- [ ] ESLint + Prettier config when contribution patterns settle.
- [ ] Vitest setup once shared lib code is non-trivial.
- [ ] CI: typecheck + build on PR.
- [ ] Open Graph images, sitemap, robots.

## Projects

Each project links to its own TODO. Add new projects under `/projects/<slug>` and register them in `projects/registry.ts`.

- [`hello`](./projects/hello/TODO.md) — reference project demonstrating the isolation pattern.

<!--
When adding a new project:
1. Create /projects/<slug>/ with index.ts, meta.ts, page.tsx, TODO.md, README.md
2. Register it in projects/registry.ts
3. Add a link to its TODO.md in this section
-->
