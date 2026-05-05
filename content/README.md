# /content

Content data for the personal surfaces. Plain TypeScript modules, no markdown
parsing, no admin UI. Edit a file, commit, push.

| File | Surface | Reads from |
|---|---|---|
| `gallery.ts` | `/gallery` | `/public/gallery/<slug>/` folders. Drop optimised images in (and matching thumbnails in `thumbs/`). |
| _(future)_ `thoughts.ts` | `/thoughts` | TBD. |
| _(future)_ `found.ts` | `/found` | TBD. |

## Gallery

Folders under `/public/gallery/` correspond to collections rendered on the
gallery page:

- `favourites/` (the headline carousel at the top)
- `collection-1/`, `collection-2/`, `collection-3/`

Each collection folder holds the **full-size** images. A `thumbs/` subfolder
inside each holds the matching **thumbnails** with the same filename. The
carousel loads the thumbnail; clicking opens the full image in a lightbox.
If a thumbnail is missing for a given file the loader falls back to the full
image so the carousel still renders.

`gallery.ts` exports `collections` (slug + name + optional description) and
`loadAllCollections()` which lists `{ full, thumb }` URLs for every image
server-side. To add a photo, drop a file in the matching folder. To rename
a collection or add a description, edit `gallery.ts`. To add a new
collection, create a new subfolder and append an entry to `collections`.

`server-only` is enforced; the page reads via the helpers and passes the
list down to the client component as serializable strings.

## Importing photos

Originals from a phone or camera are usually too large to upload through
GitHub's web UI and bigger than they need to be for a 200 px carousel. The
import script handles both:

```bash
pip3 install -r scripts/requirements.txt   # first time only
python3 scripts/import-gallery.py <slug> <path-to-source>
```

For each input image it writes:

- `/public/gallery/<slug>/<NN>.jpg` — long edge 1600 px, JPEG q85 (~150 KB).
- `/public/gallery/<slug>/thumbs/<NN>.jpg` — long edge 500 px, JPEG q78 (~25 KB).

`<NN>` is zero-padded and continues from wherever the collection left off,
so re-running appends rather than replacing. EXIF orientation is baked into
the pixels so phone photos stay right-way-up.

You can also drop original images into the chat with Claude Code, name the
collection, and the script gets run for you.

## When this gets too much to maintain by hand

Migrate to per-entry markdown files with frontmatter, or move images to a
CDN (Vercel Blob, Cloudflare Images, S3) so the repo only stores URLs. The
public type signatures stay the same so the page components don't need to
change.
