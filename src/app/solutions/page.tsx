import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Solutions — SmartSyncLink",
  description:
    "AI, communication, websites, automation, and sales management in one connected system.",
};

export default async function SolutionsPage() {
  const [layout, blocks, global] = await Promise.all([
    getLayout("solutions", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);

  return <PageShell layout={layout} blocks={blocks} global={global} ctx={{ pageKey: "solutions" }} />;
}
