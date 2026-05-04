"use client";

// Wraps every project page with a top-right action cluster: WIP / version
// status tags + the rip button. Project pages don't need to render these
// themselves — the shell handles meta consistently.

import type { ReactNode } from "react";
import { RipButton, Tag } from "@/components/ui";
import type { ProjectSummary } from "@/projects/registry";

export interface ProjectShellProps {
  summary: ProjectSummary;
  ripContent: string | null;
  children: ReactNode;
}

export function ProjectShell({ summary, ripContent, children }: ProjectShellProps) {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10 flex items-center gap-2">
        {summary.wip && <Tag variant="dev">WIP</Tag>}
        {summary.version && !summary.wip && <Tag>{summary.version}</Tag>}
        <RipButton
          projectName={summary.name}
          projectSlug={summary.slug}
          promptContent={ripContent}
        />
      </div>
      <div className="pr-12 sm:pr-16">{children}</div>
    </div>
  );
}
