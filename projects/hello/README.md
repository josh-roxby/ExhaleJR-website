# Hello

Reference project demonstrating the isolation pattern.

## Layout

```
projects/hello/
  index.ts            # Public exports: Page, meta
  meta.ts             # Slug, name, description
  page.tsx            # Project's Page component (rendered by /drawingboard/hello)
  components/         # Components used only by this project
  features/           # Feature folders if/when needed
  lib/                # Utilities scoped to this project
  hooks/              # Hooks scoped to this project
  styles/             # CSS modules or scoped styles
  types/              # TypeScript types
  server/             # Route handlers / server actions
  TODO.md             # Project-specific todos (private worklog)
  README.md           # this file
  RIP.md              # public copy-into-Claude prompt
```

## Rules

- Anything used only by this project lives here. Do not promote to root
  `/components`, `/lib`, etc. unless it is genuinely shared by ≥ 2 projects.
- Imports in this folder may use `@/projects/hello/...` or relative paths.
- Public API is whatever `index.ts` exports — at minimum `Page` and `meta`.
