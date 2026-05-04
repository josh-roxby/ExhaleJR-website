import { projects } from "@/projects/registry";
import { getAllRipContents } from "@/lib/rip";
import { DrawingBoardClient } from "./_drawing-board-client";

export default async function DrawingBoardHome() {
  // Strip the non-serializable `Page` component before crossing the
  // server → client boundary; the tile grid only needs metadata.
  const summaries = projects.map(({ Page: _Page, ...rest }) => rest);
  const ripContents = await getAllRipContents();
  return <DrawingBoardClient projects={summaries} ripContents={ripContents} />;
}
