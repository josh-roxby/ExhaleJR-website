"use client";

// Portal that injects per-page secondary nav items into the AppNav center slot.
// Pages render <NavSecondary> as part of their tree; the contents teleport into
// the floating nav between the primary section and the menu toggle.
//
// On SSR / first paint there's no portal target, so children render nothing —
// they pop in after hydration. This is a small visual trade for letting pages
// own their secondary items via React's natural component tree.

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useNavSlot } from "./nav-context";

export function NavSecondary({ children }: { children: ReactNode }) {
  const { registerSecondary } = useNavSlot();
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById("nav-secondary-slot"));
    const unregister = registerSecondary();
    return unregister;
  }, [registerSecondary]);

  if (!target) return null;
  return createPortal(children, target);
}
