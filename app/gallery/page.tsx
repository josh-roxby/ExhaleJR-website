import { Eyebrow, Tag } from "@/components/ui";
import { sortedGalleryItems, type GalleryItem } from "@/content/gallery";

export const metadata = {
  title: "Gallery",
  description: "Photography and visual work by Josh Roxby.",
};

export default function GalleryPage() {
  const items = sortedGalleryItems();

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-16 sm:pt-32">
      <header className="pb-12">
        <Eyebrow tone="accent" withPulseDot>// GALLERY · v0.1</Eyebrow>
        <h1 className="mt-3 font-display text-6xl font-black leading-[0.92] tracking-tight sm:text-7xl">
          Photography &amp; <span className="text-accent">creative</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-2">
          A loose feed of photographs, sketches, and visual work. Updated as I make
          things.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <GalleryTile item={item} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function GalleryTile({ item }: { item: GalleryItem }) {
  return (
    <article className="ds-interactive group block overflow-hidden rounded-sq-md border border-line bg-surface hover:border-line-2">
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-2">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center [background:linear-gradient(135deg,var(--surface-2)_0%,var(--surface-3)_100%)]">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-mute-3">
              // PLACEHOLDER
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            {item.title}
          </h2>
          <span className="font-mono text-[10px] text-mute-2">{item.date}</span>
        </div>
        {item.caption && <p className="mt-1 text-sm text-mute">{item.caption}</p>}
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-12 text-center">
      <Eyebrow tone="mute" size="xs">// EMPTY</Eyebrow>
      <p className="mt-2 text-sm text-mute">No photos yet. Adding things soon.</p>
    </div>
  );
}
