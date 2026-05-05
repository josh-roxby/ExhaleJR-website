"use client";

import { useCallback, useEffect, useState } from "react";

import { getProjectData, setProjectData } from "@/lib/user-store";

/**
 * Per-project localStorage hook.
 *
 * Returns `[data, setData, hydrated]`:
 *   - `data` starts at `defaultData` on the server / initial render to avoid
 *     hydration mismatch. After mount, it's replaced with whatever was in
 *     localStorage (or `defaultData` if nothing valid was stored).
 *   - `setData` accepts a value or an updater function. Writes only this
 *     project's slot; other projects and global settings stay intact.
 *   - `hydrated` flips to `true` once the localStorage read has happened.
 *     Useful for showing loading / empty states without flashing default
 *     data.
 *
 * Bump `version` whenever the project changes its persisted shape; older
 * stored data is then treated as missing and `defaultData` is returned.
 */
export function useProjectStorage<T>(
  slug: string,
  version: number,
  defaultData: T,
): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const [data, setDataState] = useState<T>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDataState(getProjectData(slug, defaultData, version));
    setHydrated(true);
    // `defaultData` is intentionally excluded from the dep list; passing a
    // fresh literal each render would otherwise re-trigger the load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, version]);

  const setData = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setDataState((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (p: T) => T)(prev)
            : updater;
        setProjectData(slug, next, version);
        return next;
      });
    },
    [slug, version],
  );

  return [data, setData, hydrated];
}
