import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cookie Policy — SmartSyncLink",
  description: "Which cookies the Smart SyncLink website uses, why, and how to control them.",
};

export default async function CookiePolicyPage() {
  const [layout, blocks, global] = await Promise.all([
    getLayout("cookies", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);

  return <PageShell layout={layout} blocks={blocks} global={global} ctx={{ pageKey: "cookies" }} />;
}
