"use client";

import { useState } from "react";

import { Eyebrow, Modal } from "@/components/ui";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/cn";
import type { CollectionWithImages, GalleryImage } from "@/content/gallery";

interface GalleryClientProps {
  collections: CollectionWithImages[];
  total: number;
}

export function GalleryClient({ collections, total }: GalleryClientProps) {
  const lightbox = useDisclosure();
  const [active, setActive] = useState<GalleryImage | null>(null);

  const open = (img: GalleryImage) => {
    setActive(img);
    lightbox.onOpen();
  };

  if (total === 0) {
    return (
      <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-12 text-center">
        <Eyebrow tone="mute" size="xs">// EMPTY</Eyebrow>
        <p className="mt-2 text-sm text-mute">
          No photos yet. Drop images into{" "}
          <code className="font-mono text-ink-2">/public/gallery/&lt;slug&gt;/</code>{" "}
          (or run{" "}
          <code className="font-mono text-ink-2">scripts/import-gallery.py</code>) to
          fill a collection.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {collections.map((c) => (
          <CollectionRow key={c.slug} collection={c} onOpen={open} />
        ))}
      </div>

      <Modal
        open={lightbox.open}
        onClose={lightbox.onClose}
        eyebrow="// VIEW"
        className="max-w-4xl"
      >
        {active && (
          // `key` forces a fresh mount when the user opens a different photo,
          // so the loading state resets properly instead of flashing the
          // previous full image while the new one decodes.
          <div className="flex justify-center">
            <LightboxImage key={active.full} image={active} />
          </div>
        )}
      </Modal>
    </>
  );
}

interface LightboxImageProps {
  image: GalleryImage;
}

/** Progressive lightbox image. Renders the cached thumbnail upscaled and
 *  blurred while the full version downloads, with a subtle pulse so the
 *  loading state is obvious. Once the full image fires `onLoad`, it fades
 *  in over 500 ms and the thumb fades out. */
function LightboxImage({ image }: LightboxImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative inline-block overflow-hidden rounded-sq-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.thumb}
        alt=""
        aria-hidden
        decoding="async"
        className={cn(
          "block max-h-[75dvh] w-auto select-none transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100 animate-pulse",
        )}
        style={{ filter: "blur(20px)", transform: "scale(1.04)" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.full}
        alt=""
        onLoad={() => setLoaded(true)}
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

interface CollectionRowProps {
  collection: CollectionWithImages;
  onOpen: (img: GalleryImage) => void;
}

function CollectionRow({ collection, onOpen }: CollectionRowProps) {
  const { name, description, images, slug } = collection;
  const isEmpty = images.length === 0;

  return (
    <section className="space-y-4">
      <header>
        <Eyebrow tone="mute" size="sm">{`// ${name.toUpperCase()}`}</Eyebrow>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl font-black tracking-tight">
            {name}.
          </h2>
          {!isEmpty && (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-mute-2">
              {images.length} {images.length === 1 ? "photo" : "photos"}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-mute">{description}</p>
        )}
      </header>

      {isEmpty ? (
        <div className="rounded-sq-md border border-dashed border-line-2 bg-surface/40 p-6 text-sm text-mute">
          Empty. Drop portrait photos into{" "}
          <code className="font-mono text-ink-2">/public/gallery/{slug}/</code>{" "}
          (or send them in chat) to fill this carousel.
        </div>
      ) : (
        <ul
          className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img) => (
            <li key={img.full} className="snap-start shrink-0">
              <button
                type="button"
                onClick={() => onOpen(img)}
                aria-label="Open photo"
                className="ds-interactive block overflow-hidden rounded-sq-md border border-line bg-surface outline-none active:scale-[0.98] hover:border-line-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="block h-[200px] w-auto object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
