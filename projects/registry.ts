/**
 * Lab project registry.
 * Add an entry here for each project under /projects/<slug>. The lab index
 * uses this list to render cards; the route at /app/lab/[project] reads the
 * matching entry to render the project's `Page` export.
 */
import type { ComponentType } from "react";

import * as hello from "./hello";

export type LabProject = {
  slug: string;
  name: string;
  description: string;
  Page: ComponentType;
};

export const labProjects: LabProject[] = [
  {
    slug: "hello",
    name: hello.meta.name,
    description: hello.meta.description,
    Page: hello.Page,
  },
];

export function getLabProject(slug: string): LabProject | undefined {
  return labProjects.find((p) => p.slug === slug);
}
