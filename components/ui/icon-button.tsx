// A4 — icon-only button. See DESIGN-SYSTEM.md §4.1.
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface IconButtonProps extends ComponentProps<"button"> {
  round?: boolean;
  notification?: boolean;
}

export function IconButton({
  round = false,
  notification = false,
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "ds-interactive relative grid h-9 w-9 place-items-center border border-line-2 bg-surface-2 text-mute outline-none active:scale-[0.92] hover:border-line-3 hover:text-ink",
        round ? "rounded-round" : "rounded-sq",
        className,
      )}
    >
      {children}
      {notification && (
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-round bg-accent shadow-[0_0_0_2px_var(--surface-2)]" />
      )}
    </button>
  );
}
