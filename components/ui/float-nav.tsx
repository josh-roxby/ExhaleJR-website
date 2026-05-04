// I6 — floating bottom nav wrapper. See DESIGN-SYSTEM.md §5.2.
// Visual chrome only — caller positions it (`absolute` inside a phone-frame
// showcase, `fixed` for a real app shell). Caller is also responsible for
// establishing a stacking context on the parent (§3.6).
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface FloatNavProps extends ComponentProps<"nav"> {}

export function FloatNav({ className, children, ...rest }: FloatNavProps) {
  return (
    <nav
      {...rest}
      className={cn(
        "flex items-center gap-0.5 rounded-sq-xxl border border-white/[0.08] p-[5px] [background:rgba(13,13,13,0.95)] [backdrop-filter:blur(20px)_saturate(160%)] [-webkit-backdrop-filter:blur(20px)_saturate(160%)] [box-shadow:0_12px_32px_rgba(0,0,0,.6),0_4px_12px_rgba(0,0,0,.4),0_0_0_1px_rgba(0,0,0,.5)]",
        className,
      )}
    >
      {children}
    </nav>
  );
}
