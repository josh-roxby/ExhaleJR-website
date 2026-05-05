# /content

Content data for the personal surfaces. Plain TypeScript modules, no markdown
parsing, no admin UI. Edit a file, commit, push.

| File | Surface | Reads from |
|---|---|---|
| `gallery.ts` | `/gallery` | `/public/gallery/<slug>/` folders. Drop portrait images in, they show up automatically. |
| _(future)_ `thoughts.ts` | `/thoughts` | TBD. |
| _(future)_ `found.ts` | `/found` | TBD. |

## Gallery

Folders under `/public/gallery/` correspond to collections rendered on the
gallery page:

- `favourites/` (the headline carousel at the top)
- `collection-1/`, `collection-2/`, `collection-3/`

`gallery.ts` exports `collections` (slug + name + optional description) and
`loadAllCollections()` which lists the images in each folder server-side. To
add a photo, drop a `.jpg` / `.png` / `.webp` / `.avif` file in the matching
folder. To rename a collection or add a description, edit `gallery.ts`. To
add a new collection, create a new subfolder and append an entry to
`collections`.

`server-only` is enforced; the page reads via the helpers and passes the
list down to the client component as serializable strings.

## When this gets too much to maintain by hand

Migrate to per-entry markdown files with frontmatter, or add a small admin
UI backed by Supabase. Both upgrade paths preserve the public type
signatures so the page components don't need to change.
