import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { projects } from "@/projects/registry";

const ROOT = process.cwd();

/**
 * Read a project's RIP.md (the public copy-into-Claude prompt). Returns null
 * if the file doesn't exist — projects without a RIP are valid; the rip
 * button just doesn't render for them.
 */
export async function getRipContent(slug: string): Promise<string | null> {
  try {
    const path = join(ROOT, "projects", slug, "RIP.md");
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

/** Map of slug → rip content, used by the drawing-board tile grid. */
export async function getAllRipContents(): Promise<Record<string, string | null>> {
  const entries = await Promise.all(
    projects.map(async (p) => [p.slug, await getRipContent(p.slug)] as const),
  );
  return Object.fromEntries(entries);
}
