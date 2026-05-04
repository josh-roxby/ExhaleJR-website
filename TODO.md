# TODO. Master

This is the master todo. Sub-project todos live next to their code and are linked here as children. Keep this file as the single index. Each sub-project owns its own detail.

## Repo / shared infra

### Now
Sprint focus, in suggested order. See chat for the spec behind each item.

1. **Writing-style sweep.** Apply the no-em-dash, no-AI-tell rule (CLAUDE.md `Writing style`) to existing user-facing copy: `app/page.tsx`, `app/drawingboard/_drawing-board-client.tsx`, `app/drawingboard/page.tsx`, `app/designsystem/page.tsx` headers, `components/ui/rip-modal.tsx`, `components/pwa/install-prompt.tsx`, project READMEs, this file, and CLAUDE.md.
2. **PWA bottom bar dark on Android.** When installed (standalone), the body / safe-area should fill in `--bg`, not white. Check `themeColor`, `<meta name="theme-color">`, body min-height-dvh + `viewportFit: cover`, and any `env(safe-area-inset-*)` padding.
3. **Nav popover edits** (`components/ui/app-nav.tsx`):
   - Remove the **Theme** cell.
   - Remove the **Search** cell.
   - Replace the **Design** cell with **Gallery** (route `/gallery`).
   - Make the Josh **Account** card "long" (taller, more breathing space) with three square sub-CTA icon buttons inside it: `?` linking to `/about`, an Instagram icon linking to `https://instagram.com/josh_roxby`, an email icon linking to `mailto:josh@exhale.studio`.
4. ~~**/about as a separate route.**~~ Done. `app/about/page.tsx` with hero plus five sections (About me, Background, What I like, Why I build, Addicted to learning). Redirect removed from `next.config.ts`. Both About nav slots route to `/about`.
5. ~~**/contact route.**~~ Done. Two cards, IG opens in new tab, email opens mail client, plus a `CopyButton` for the address. Side note about studio enquiries pointing to exhale.studio.
6. ~~**/gallery real content.**~~ Done. Tile grid pulling from `content/gallery.ts` (single TS array, easy to append). Aspect 4:5 tiles, placeholder gradient when no image, lazy-loaded `<img>`, tags rendered as Tag chips, sorted newest first, EmptyState for zero items. Workflow doc in `content/README.md`. The thoughts/found surfaces will follow the same `content/<surface>.ts` pattern when built.
7. ~~**Help cell content.**~~ Done. `/help` route with hero, TOC, and five sections (Drawing board, GitHub, Claude, Vercel, Putting it together). Friendly non-technical voice, doc links per section. Help cell in popover routes here.
8. **Rip feature revision.** This is the big one.
   - More breathing room in the modal layout. Less dense, friendlier for non-technical readers.
   - Auto-prefix every rip prompt with an attribution header that prints into the user's generated code:
     ```
     # Designed by Josh Roxby
     # exhalejr.com · josh@exhale.studio
     ```
   - Handle two consumer modes the user can toggle in the modal:
     - **Claude chat (artifact)**: prompt produces a self-contained HTML artifact mirroring the project.
     - **Claude Code (init repo)**: prompt scaffolds a full repo with the same drawing-board structure and conventions.
   - Instructions explicit enough to minimise output variance. The deliverable should match this site's pattern.
   - Update `projects/hello/RIP.md` to the new template. Establish the format other projects copy.
   - Modal copy aimed at someone who has never used Claude Code before.

### Standing
- [ ] Phase 2 atomic components from `DESIGN-SYSTEM.md` §4: selects (E), checkboxes/radios (Fc), toggles (G), sliders (H), tabs (I3), carousel (L). Add to `/designsystem` as built.
- [ ] Replace placeholder PWA icons in `/public/icons` and `/app/{icon,apple-icon}.png` with real branding.
- [ ] Real copy on the home page. Replace `// COPY:` markers in `app/page.tsx`.
- [ ] Decide content source for `/thoughts`, `/found`, `/creative`, `/gallery`. Markdown entries committed, or admin UI.
- [ ] iOS install-prompt fallback. No `beforeinstallprompt` event on iOS, so render "Add to Home Screen" instructions instead.
- [ ] Offline page + SW caching once routes stabilise.

### Later
- [ ] ESLint + Prettier config when contribution patterns settle.
- [ ] Vitest setup once shared lib code is non-trivial.
- [ ] CI: typecheck + build on PR.
- [ ] Open Graph images, sitemap, robots.

## Projects

Each project links to its own TODO. Add new projects under `/projects/<slug>` and register them in `projects/registry.ts`.

- [`hello`](./projects/hello/TODO.md). Reference project demonstrating the isolation pattern.

<!--
When adding a new project:
1. Create /projects/<slug>/ with index.ts, meta.ts, page.tsx, TODO.md, README.md, RIP.md
2. Register it in projects/registry.ts
3. Add a link to its TODO.md in this section
-->
