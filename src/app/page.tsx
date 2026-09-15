import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";

// Admin panel can call revalidatePath("/") for instant updates.
export const revalidate = 60;

/** Sections, their order and their content come from the page builder. */
export default async function Home() {
  const [layout, blocks, global] = await Promise.all([
    getLayout("home", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);

  return <PageShell layout={layout} blocks={blocks} global={global} ctx={{ pageKey: "home" }} />;
}
