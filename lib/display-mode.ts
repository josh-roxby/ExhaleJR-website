export const DISPLAY_MODE_COOKIE = "x-display-mode";

export type DisplayMode = "browser" | "standalone";

export function isStandaloneValue(value: string | undefined): boolean {
  return value === "standalone";
}
