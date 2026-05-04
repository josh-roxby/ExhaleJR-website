# /content

Content data for the personal surfaces. Plain TypeScript modules, no markdown
parsing, no admin UI. Edit a file, commit, push.

| File | Surface | What's in it |
|---|---|---|
| `gallery.ts` | `/gallery` | Photographs and visual work. |
| _(future)_ `thoughts.ts` | `/thoughts` | Notes, write-ups. |
| _(future)_ `found.ts` | `/found` | Interesting links. |

Each file exports a typed array. To add an entry, append an object to the array.
For images, drop the file under `/public/<surface>/<slug>.<ext>` and reference
it by path (e.g. `image: "/gallery/morning-light.jpg"`).

## When this gets too much to maintain by hand

Migrate to per-entry markdown files with frontmatter, or add a small admin UI
backed by Supabase. Both upgrade paths preserve the public type signatures so
the page components don't need to change.
