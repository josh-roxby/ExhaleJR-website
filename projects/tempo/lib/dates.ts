/**
 * Date helpers for tempo.
 *
 * All work in YYYY-MM-DD strings using the user's local timezone, so
 * "today" lines up with what the user actually sees on their wall.
 * Comparing dates is done via plain string compare since YYYY-MM-DD sorts
 * lexicographically.
 */

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function dateToIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Local-timezone today as YYYY-MM-DD. */
export function todayISO(): string {
  return dateToIso(new Date());
}

/** Add n days (can be negative) to a YYYY-MM-DD string. */
export function addDaysIso(iso: string, n: number): string {
  const d = isoToDate(iso);
  d.setDate(d.getDate() + n);
  return dateToIso(d);
}

/** Day of week 0..6 (Sunday..Saturday). */
export function dayOfWeek(iso: string): number {
  return isoToDate(iso).getDay();
}

/** Format YYYY-MM-DD into a friendly long form like "Monday, May 5". */
export function formatLong(iso: string): string {
  return isoToDate(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
