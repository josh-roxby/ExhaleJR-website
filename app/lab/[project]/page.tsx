import { notFound } from "next/navigation";
import { getLabProject, labProjects } from "@/projects/registry";

export function generateStaticParams() {
  return labProjects.map((p) => ({ project: p.slug }));
}

export default async function LabProjectPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const entry = getLabProject(project);
  if (!entry) notFound();
  const { Page } = entry;
  return <Page />;
}
