# Hello — rip prompt

Paste this into Claude (or Claude Code, in a Next.js + TypeScript + Tailwind
project) to scaffold a similar simple "hello world" project, following the same
isolation pattern this site uses.

---

I'd like to scaffold a small "hello" project inside an existing Next.js
(App Router) + TypeScript + Tailwind monorepo, following these conventions.

## Folder layout

Create `/projects/hello/` with this structure:

```
projects/hello/
  index.ts            # public exports — re-export Page and meta
  meta.ts             # slug, name, description, wip, version, tags
  page.tsx            # the project's Page component
  components/
    greeter.tsx       # a simple interactive component
  TODO.md             # private worklog (versions, in-flight tasks)
  README.md           # project layout reference
  RIP.md              # this prompt — public, copy-into-Claude
```

## Constraints

1. **Isolation rule.** Every component, lib, hook, style, and type used only
   by this project lives inside `/projects/hello/`. Do not promote anything to
   `/components`, `/lib`, etc. unless 2 or more projects share it.

2. **Public API.** `index.ts` exports `Page` and `meta` only.

3. **Meta fields.** `meta.ts` defines:
   - `slug: "hello"`
   - `name: "Hello"`
   - `description`. One short sentence.
   - `wip: true` (every project starts WIP)
   - `version: undefined` (no version published while WIP)
   - `tags: ["reference", "scaffold"]`

4. **Registry entry.** Add `import * as hello from "./hello"` and a record to
   `projects` in `/projects/registry.ts`.

5. **Page contents.** The page renders, in order:
   - A mono-caps eyebrow with the project slug.
   - A display-font heading with the project name.
   - A short description paragraph.
   - The `Greeter` component — a text input that echoes "Hello, {name}." as the
     user types.

6. **Use existing primitives.** Pull from `@/components/ui` rather than
   rebuilding — `Eyebrow`, `TextInput`, `Card`, etc.

7. **Styling.** Reference design tokens from `styles/tokens.css` only —
   no inline hex colours, no inline pixel values that don't match the spacing
   scale (`4, 8, 12, 16, 24, 32, 48, 64, 80`).

## Done state

- `/projects/hello/` exists with all the files above.
- `projects/registry.ts` includes the entry.
- `npm run typecheck` and `npm run build` both pass clean.
- The project tile shows up on `/drawingboard` with the WIP badge and tags.
- Visiting `/drawingboard/hello` renders the page successfully.

Generate the files now.
