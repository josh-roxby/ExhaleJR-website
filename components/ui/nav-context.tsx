"use client";

// Nav slot context — tracks how many <NavSecondary> are mounted so AppNav
// can hide the surrounding pipe dividers when the slot is empty.
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface NavCtx {
  secondaryCount: number;
  registerSecondary: () => () => void;
}

const Ctx = createContext<NavCtx | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const registerSecondary = useCallback(() => {
    setCount((c) => c + 1);
    return () => setCount((c) => c - 1);
  }, []);
  return (
    <Ctx.Provider value={{ secondaryCount: count, registerSecondary }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNavSlot(): NavCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNavSlot must be used inside <NavProvider>");
  return ctx;
}
