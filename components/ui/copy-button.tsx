"use client";

// CopyButton. Writes `text` to the clipboard, flips its label to a confirm
// state for 2s. Use as a sibling to anchors / inside cards. Stops event
// propagation so it can sit on top of a clickable parent without triggering
// it.

import { useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";

export interface CopyButtonProps {
  /** Text to write to the clipboard. */
  text: string;
  /** Idle label. Default "Copy". */
  label?: string;
  /** Confirm label. Default "Copied". */
  copiedLabel?: string;
  /** ms to keep the confirm label visible. Default 2000. */
  duration?: number;
  className?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  duration = 2000,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    } catch {
      // Clipboard may be denied (insecure context, permissions). Silent fail.
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Copy ${text}`}
      className={cn(
        "ds-interactive rounded-sq-xs border border-line-2 bg-surface-2 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink outline-none active:scale-[0.97] hover:border-accent hover:text-accent",
        className,
      )}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
