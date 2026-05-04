"use client";

// Circular icon button that opens the rip modal for a project. Hides itself
// when the project has no RIP.md content. Stops propagation so it can sit
// inside an anchor tile without triggering navigation.

import { useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { RipModal } from "./rip-modal";

export interface RipButtonProps {
  projectName: string;
  projectSlug: string;
  promptContent: string | null;
  size?: "sm" | "md";
  className?: string;
}

export function RipButton({
  projectName,
  projectSlug,
  promptContent,
  size = "md",
  className,
}: RipButtonProps) {
  const [open, setOpen] = useState(false);

  if (!promptContent) return null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const sizeClass = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Rip ${projectName}`}
        title={`Rip ${projectName}`}
        className={cn(
          "ds-interactive grid place-items-center rounded-round border border-line-2 bg-surface-2 text-mute outline-none active:scale-[0.92] hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-glow",
          sizeClass,
          className,
        )}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      </button>
      <RipModal
        open={open}
        onClose={() => setOpen(false)}
        projectName={projectName}
        projectSlug={projectSlug}
        promptContent={promptContent}
      />
    </>
  );
}
