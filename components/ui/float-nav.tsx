// I6 — floating bottom nav wrapper. See DESIGN-SYSTEM.md §5.2.
// Container only — caller composes <NavItem> children. Parent must establish
// stacking context (isolation: isolate, position: relative) per §3.6.
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface FloatNavProps extends ComponentProps<"nav"> {}

export function FloatNav({ className, children, ...rest }: FloatNavProps) {
  return (
    <nav
      {...rest}
      className={cn(
        "absolute bottom-[18px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-sq-xxl border border-white/[0.08] p-[5px] [background:rgba(13,13,13,0.95)] [backdrop-filter:blur(20px)_saturate(160%)] [-webkit-backdrop-filter:blur(20px)_saturate(160%)] [box-shadow:0_12px_32px_rgba(0,0,0,.6),0_4px_12px_rgba(0,0,0,.4),0_0_0_1px_rgba(0,0,0,.5)]",
        className,
      )}
    >
      {children}
    </nav>
  );
}
