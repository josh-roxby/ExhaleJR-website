import { notFound } from "next/navigation";
import { getProject, projects } from "@/projects/registry";
import { getRipContent } from "@/lib/rip";
import { ProjectShell } from "./_project-shell";

export function generateStaticParams() {
  return projects.map((p) => ({ project: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const entry = getProject(project);
  if (!entry) notFound();
  const { Page, ...summary } = entry;
  const ripContent = await getRipContent(entry.slug);
  return (
    <ProjectShell summary={summary} ripContent={ripContent}>
      <Page />
    </ProjectShell>
  );
}
