"use client";

import { useEffect } from "react";
import { DISPLAY_MODE_COOKIE } from "@/lib/display-mode";

/**
 * Detects whether the page is running as an installed PWA (standalone) and
 * sets a cookie so the server middleware can route accordingly on the next
 * request. Runs once on mount and on display-mode changes.
 */
export function DisplayModeProbe() {
  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    const isiOSStandalone =
      // Safari sets navigator.standalone for installed PWAs.
      typeof navigator !== "undefined" &&
      "standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    const write = (standalone: boolean) => {
      const value = standalone ? "standalone" : "browser";
      document.cookie = `${DISPLAY_MODE_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    };

    write(mq.matches || isiOSStandalone);
    const onChange = (e: MediaQueryListEvent) => write(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return null;
}
