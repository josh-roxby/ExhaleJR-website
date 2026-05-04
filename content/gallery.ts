/**
 * Gallery content. One module, one array. The /gallery page reads from this.
 *
 * To add a new entry:
 *   1. Drop the image file under /public/gallery/<slug>.<ext>
 *   2. Append a new object to `galleryItems` below.
 *   3. (Optional) git commit and push.
 *
 * Fields:
 *   slug     unique kebab-case id, used as React key.
 *   title    display title shown on the tile.
 *   date     YYYY-MM or YYYY-MM-DD. Sorted newest first when rendered.
 *   image    public path to the image, or null to render a placeholder.
 *   caption  short caption shown under the title.
 *   tags     freeform tags, used for future filtering.
 */

export interface GalleryItem {
  slug: string;
  title: string;
  date: string;
  image: string | null;
  caption?: string;
  tags: string[];
}

export const galleryItems: GalleryItem[] = [
  {
    slug: "morning-light",
    title: "Morning light",
    date: "2026-05",
    image: null,
    caption: "Window at sunrise.",
    tags: ["photography"],
  },
  {
    slug: "sketches",
    title: "Sketches",
    date: "2026-04",
    image: null,
    caption: "Notebook studies.",
    tags: ["sketches", "creative"],
  },
];

/** Items sorted newest first by date string (YYYY-MM[-DD] sorts correctly). */
export function sortedGalleryItems(): GalleryItem[] {
  return [...galleryItems].sort((a, b) => b.date.localeCompare(a.date));
}
