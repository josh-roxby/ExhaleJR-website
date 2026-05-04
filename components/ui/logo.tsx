// Brand mark. Inline SVG, uses currentColor for the JR letterform and the
// thin frame stroke so callers can tint via Tailwind text classes:
//
//   <span className="text-accent">
//     <Logo size={48} />
//   </span>
//
// The dark fill stays #0a0a0a regardless of context (the mark always sits on
// a dark plate). Static asset versions live in /public/logo/ for surfaces
// that need a real file (PWA manifest, OG image, etc.).

import { cn } from "@/lib/cn";

export interface LogoProps {
  size?: number;
  className?: string;
  "aria-label"?: string;
}

export function Logo({ size = 40, className, "aria-label": ariaLabel = "ExhaleJR" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={cn("inline-block text-accent", className)}
    >
      <rect width="64" height="64" rx="7" fill="#0a0a0a" />
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="6.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <text
        x="32"
        y="33"
        fontFamily="var(--f-display), 'Big Shoulders Display', sans-serif"
        fontWeight="900"
        fontSize="34"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="central"
        letterSpacing="-0.04em"
      >
        JR
      </text>
    </svg>
  );
}
