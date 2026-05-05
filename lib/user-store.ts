/**
 * Single-key localStorage user store.
 *
 * One key (`exhalejr.user`) holds:
 *   {
 *     v: <root schema version>,
 *     settings: <global user settings>,
 *     projects: { [slug]: { v, data } },
 *   }
 *
 * Each project owns one slot under `projects[<slug>]` and reads/writes it via
 * `getProjectData` / `setProjectData` (typically through the
 * `useProjectStorage` hook). Mutating one project's slot leaves every other
 * slot and the global settings untouched, so adding or changing a project
 * never risks corrupting another project's data.
 *
 * Schema versions are tracked at two levels:
 *   - Root version: bumped only when this file's shape changes.
 *   - Per-project version: passed in by the project. If the stored version
 *     doesn't match what the project expects, the helpers fall back to the
 *     project's `defaultData` rather than reading stale data.
 */

const ROOT_KEY = "exhalejr.user";
const ROOT_VERSION = 1;

export interface UserSettings {
  // Empty for now. Extend as global settings are introduced (theme, etc.).
}

interface ProjectSlot {
  v: number;
  data: unknown;
}

interface UserStoreShape {
  v: number;
  settings: UserSettings;
  projects: Record<string, ProjectSlot>;
}

function emptyStore(): UserStoreShape {
  return { v: ROOT_VERSION, settings: {}, projects: {} };
}

function readRoot(): UserStoreShape {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(ROOT_KEY);
    if (!raw) return emptyStore();
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed as { v: unknown }).v !== ROOT_VERSION ||
      typeof (parsed as { projects: unknown }).projects !== "object"
    ) {
      return emptyStore();
    }
    return parsed as UserStoreShape;
  } catch {
    return emptyStore();
  }
}

function writeRoot(store: UserStoreShape): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ROOT_KEY, JSON.stringify(store));
  } catch {
    // QuotaExceeded / disabled storage / etc. Silent for now; the in-memory
    // state still works for the rest of the session.
  }
}

/**
 * Read a project's stored data. If nothing is stored or the schema version
 * doesn't match what the caller expects, returns `defaultData` so projects
 * never see stale shapes.
 */
export function getProjectData<T>(
  slug: string,
  defaultData: T,
  version: number,
): T {
  const root = readRoot();
  const slot = root.projects[slug];
  if (!slot || slot.v !== version) return defaultData;
  return slot.data as T;
}

/**
 * Write a project's data. Touches only `projects[<slug>]` so other projects
 * and global settings are preserved verbatim.
 */
export function setProjectData<T>(
  slug: string,
  data: T,
  version: number,
): void {
  const root = readRoot();
  root.projects[slug] = { v: version, data };
  writeRoot(root);
}

/**
 * Wipe a single project's slot without touching anything else. Useful for a
 * project's own "reset" affordance.
 */
export function clearProjectData(slug: string): void {
  const root = readRoot();
  if (slug in root.projects) {
    delete root.projects[slug];
    writeRoot(root);
  }
}

export function getSettings(): UserSettings {
  return readRoot().settings;
}

export function patchSettings(patch: Partial<UserSettings>): void {
  const root = readRoot();
  root.settings = { ...root.settings, ...patch };
  writeRoot(root);
}
