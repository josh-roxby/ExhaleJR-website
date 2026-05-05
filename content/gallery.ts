import "server-only";

import { readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Gallery surface.
 *
 * Each collection maps to a folder under `/public/gallery/<slug>/`. Drop
 * portrait images into a folder and they show up automatically. No registry
 * to update, no JSON to maintain.
 *
 *   /public/gallery/favourites/        the headline carousel
 *   /public/gallery/collection-1/      additional collections
 *   /public/gallery/collection-2/
 *   /public/gallery/collection-3/
 *
 * Edit `collections` below to rename a collection or add a description.
 * Add a new collection by creating its folder under /public/gallery and
 * appending an entry here.
 */

export interface CollectionMeta {
  slug: string;
  name: string;
  description?: string;
}

export interface CollectionWithImages extends CollectionMeta {
  /** Public paths like "/gallery/<slug>/<file>". */
  images: string[];
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

async function listCollectionImages(slug: string): Promise<string[]> {
  const dir = join(process.cwd(), "public", "gallery", slug);
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => IMAGE_EXT.test(f) && !f.startsWith("."))
      .sort()
      .map((f) => `/gallery/${slug}/${f}`);
  } catch {
    return [];
  }
}

export async function loadAllCollections(): Promise<CollectionWithImages[]> {
  return Promise.all(
    collections.map(async (c) => ({
      ...c,
      images: await listCollectionImages(c.slug),
    })),
  );
}
