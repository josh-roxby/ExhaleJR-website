import { Eyebrow } from "@/components/ui";
import { loadAllCollections } from "@/content/gallery";

import { GalleryClient } from "./_gallery-client";

export const metadata = {
  title: "Gallery",
  description: "Photography and visual work by Josh Roxby.",
};

export default async function GalleryPage() {
  const collections = await loadAllCollections();
  const total = collections.reduce((acc, c) => acc + c.images.length, 0);

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16 sm:pt-32">
      <header className="pb-12">
        <Eyebrow tone="accent" withPulseDot>// GALLERY · v0.1</Eyebrow>
        <h1 className="mt-3 font-display text-6xl font-black leading-[0.92] tracking-tight sm:text-7xl">
          Photography &amp; <span className="text-accent">creative</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-2">
          A loose feed of photographs and visual work. Tap any image to open it
          larger.
        </p>
      </header>

      <GalleryClient collections={collections} total={total} />
    </main>
  );
}
