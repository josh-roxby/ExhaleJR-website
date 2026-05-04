// Brand mark. Renders /public/logo/logo.png via next/image.
// The master file lives in /public/logo/logo.png. Replacing it cascades
// through every surface that references the brand (manifest icons,
// favicon, apple-touch-icon, OG image, this component).

import Image from "next/image";
import { cn } from "@/lib/cn";

export interface LogoProps {
  /** Pixel size for both width and height. Defaults to 40. */
  size?: number;
  className?: string;
  "aria-label"?: string;
  /** Skip lazy-loading. Use for above-the-fold logo placement (hero). */
  priority?: boolean;
}

export function Logo({
  size = 40,
  className,
  "aria-label": ariaLabel = "ExhaleJR",
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/logo/logo.png"
      alt={ariaLabel}
      width={size}
      height={size}
      priority={priority}
      className={cn("inline-block select-none", className)}
    />
  );
}
