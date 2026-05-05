import "server-only";

import { readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Gallery surface.
 *
 * Each collection maps to a folder under `/public/gallery/<slug>/`.
 * Optimised images live in:
 *
 *   /public/gallery/<slug>/<name>.jpg          full version (lightbox)
 *   /public/gallery/<slug>/thumbs/<name>.jpg   thumbnail (carousel)
 *
 * `scripts/import-gallery.py <slug> <path>` produces both sizes and
 * standardises filenames to zero-padded sequentials. If a thumbnail is
 * missing for a given file, the loader falls back to the full image so the
 * carousel still renders.
 */

export interface CollectionMeta {
  slug: string;
  name: string;
  description?: string;
}

export interface GalleryImage {
  /** Full-size URL, used in the lightbox. */
  full: string;
  /** Thumbnail URL, used in the carousel. Falls back to `full` if missing. */
  thumb: string;
}

export interface CollectionWithImages extends CollectionMeta {
  images: GalleryImage[];
}

export const collections: CollectionMeta[] = [
  {
    slug: "favourites",
    name: "Favourites",
    description: "A loose pile of shots I keep coming back to.",
  },
  { slug: "collection-1", name: "Collection 1" },
  { slug: "collection-2", name: "Collection 2" },
  { slug: "collection-3", name: "Collection 3" },
];

const IMAGE_EXT = /\.(jpg|jpeg|png|webp|avif|gif)$/i;

async function safeReaddir(dir: string): Promise<string[]> {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

async function listCollectionImages(slug: string): Promise<GalleryImage[]> {
  const dir = join(process.cwd(), "public", "gallery", slug);
  const thumbsDir = join(dir, "thumbs");

  const [files, thumbs] = await Promise.all([
    safeReaddir(dir),
    safeReaddir(thumbsDir),
  ]);

  const thumbSet = new Set(
    thumbs.filter((f) => IMAGE_EXT.test(f) && !f.startsWith(".")),
  );

  return files
    .filter((f) => IMAGE_EXT.test(f) && !f.startsWith("."))
    .sort()
    .map((f) => ({
      full: `/gallery/${slug}/${f}`,
      thumb: thumbSet.has(f)
        ? `/gallery/${slug}/thumbs/${f}`
        : `/gallery/${slug}/${f}`,
    }));
}

export async function loadAllCollections(): Promise<CollectionWithImages[]> {
  return Promise.all(
    collections.map(async (c) => ({
      ...c,
      images: await listCollectionImages(c.slug),
    })),
  );
}
