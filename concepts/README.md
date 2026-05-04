# /concepts

Reference HTML files from the design system. Source artifacts — not part of the build.
Use them as a visual + structural target when building React components in `/components`
and `/projects/<slug>`.

| File | What it covers | DESIGN-SYSTEM.md |
|---|---|---|
| `jr-round-1-v4.html` | Atomic UI: foundations (F), buttons (A), chips/tags (B), pills/badges (C), fields (D), selects (E), checks/radios (Fc), toggles (G), sliders (H). Has an export-picker UI — ignore that, port the components. | §4.1–4.9 |
| `jr-round-2.html` | Surfaces + nav: cards (J), bento (K), carousel (L), navigation (I1–I4). Same export-picker pattern. | §4.10–4.13, §5.1 |
| `jr-mobile-home-concept-v3.html` | Full mobile home composition: app head, hero, bento stat cards (J2), project list, quick links, floating bottom nav (I6), bento popover with 3x3 grid + scrollable lab list. | §3.6, §4.10–4.12, §5.2–5.4 |

Conventions when porting:
- Class names in the references prefix categories (`btn-`, `chip-`, `card-`, `field-`, `tab-…`). Keep the IDs from §6 of the design doc as a comment on each component (`// A1.1`, `// J2`, etc.) for traceability.
- Don't import the export-picker UI — it's a build-time selection tool, not part of the brand.
- Tokens come from `styles/tokens.css`. Don't redeclare values inline; reference `var(--…)`.
