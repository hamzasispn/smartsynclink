import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Choose Your Power Level — SmartSyncLink Pricing",
  description:
    "Quick-start packages, full platform plans and Local SEO content packages — scalable AI solutions to capture leads, build reputation and automate your workflow.",
};

export default async function PricingTablePage() {
  const [layout, blocks, global] = await Promise.all([
    getLayout("pricing-table", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);

  return <PageShell layout={layout} blocks={blocks} global={global} ctx={{ pageKey: "pricing-table" }} />;
}
