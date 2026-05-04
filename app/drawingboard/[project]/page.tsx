import { notFound } from "next/navigation";
import { getProject, projects } from "@/projects/registry";

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
  const { Page } = entry;
  return <Page />;
}
