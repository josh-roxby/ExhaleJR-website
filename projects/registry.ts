/**
 * Project registry.
 * Add an entry here for each project under /projects/<slug>. The drawing
 * board uses this list to render tiles; the route at /app/drawingboard/[project]
 * reads the matching entry to render the project's `Page` export.
 */
import type { ComponentType } from "react";

import * as cooking from "./cooking";
import * as decisionWheel from "./decision-wheel";
import * as flip from "./flip";
import * as sideQuestStroll from "./side-quest-stroll";
import * as tempo from "./tempo";

export interface ProjectEntry {
  slug: string;
  name: string;
  description: string;
  Page: ComponentType;
  /** True until I explicitly clear it. No version is published while WIP. */
  wip: boolean;
  /** Only meaningful once `wip` is false. Tracked in the project's TODO.md. */
  version?: string;
  /** Used by the drawing-board filter chips. */
  tags: string[];
}

/** Serializable subset for crossing the server → client boundary. */
export type ProjectSummary = Omit<ProjectEntry, "Page">;

export const projects: ProjectEntry[] = [
  {
    slug: "cooking",
    name: cooking.meta.name,
    description: cooking.meta.description,
    Page: cooking.Page,
    wip: cooking.meta.wip,
    version: cooking.meta.version,
    tags: [...cooking.meta.tags],
  },
  {
    slug: "tempo",
    name: tempo.meta.name,
    description: tempo.meta.description,
    Page: tempo.Page,
    wip: tempo.meta.wip,
    version: tempo.meta.version,
    tags: [...tempo.meta.tags],
  },
  {
    slug: "flip",
    name: flip.meta.name,
    description: flip.meta.description,
    Page: flip.Page,
    wip: flip.meta.wip,
    version: flip.meta.version,
    tags: [...flip.meta.tags],
  },
  {
    slug: "decision-wheel",
    name: decisionWheel.meta.name,
    description: decisionWheel.meta.description,
    Page: decisionWheel.Page,
    wip: decisionWheel.meta.wip,
    version: decisionWheel.meta.version,
    tags: [...decisionWheel.meta.tags],
  },
  {
    slug: "side-quest-stroll",
    name: sideQuestStroll.meta.name,
    description: sideQuestStroll.meta.description,
    Page: sideQuestStroll.Page,
    wip: sideQuestStroll.meta.wip,
    version: sideQuestStroll.meta.version,
    tags: [...sideQuestStroll.meta.tags],
  },
];

export function getProject(slug: string): ProjectEntry | undefined {
  return projects.find((p) => p.slug === slug);
}
