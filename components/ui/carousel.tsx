"use client";

// L — carousel. See DESIGN-SYSTEM.md §4.12.
// Horizontal snap scroll. Optional dot indicators; clicking a dot scrolls to
// that slide. Active slide is determined by which slide centre is closest to
// the container centre while scrolling.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CarouselProps {
  children: ReactNode;
  /** Width of each slide in any CSS unit. Default 220px. */
  slideWidth?: string;
  /** Show dot pagination. Default true. */
  showDots?: boolean;
  className?: string;
}

export function Carousel({
  children,
  slideWidth = "220px",
  showDots = true,
  className,
}: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = Array.isArray(children) ? children : [children];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const slideEls = el.querySelectorAll<HTMLElement>(":scope > [data-slide]");
      if (slideEls.length === 0) return;
      const containerRect = el.getBoundingClientRect();
      const containerMid = containerRect.left + containerRect.width / 2;
      let closest = 0;
      let minDist = Infinity;
      slideEls.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const slideMid = r.left + r.width / 2;
        const dist = Math.abs(slideMid - containerMid);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (idx: number) => {
    const el = ref.current;
    if (!el) return;
    const slide = el.querySelectorAll<HTMLElement>(":scope > [data-slide]")[idx];
    if (!slide) return;
    el.scrollTo({
      left: slide.offsetLeft - (el.clientWidth - slide.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-slide
            style={{ flex: `0 0 ${slideWidth}` }}
            className="snap-start"
          >
            {slide}
          </div>
        ))}
      </div>
      {showDots && slides.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={cn(
                "ds-interactive h-1.5 rounded-round transition-all duration-[var(--t)]",
                i === active
                  ? "w-4 bg-accent shadow-[0_0_8px_var(--accent-glow)]"
                  : "w-1.5 bg-mute-3 hover:bg-mute",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
