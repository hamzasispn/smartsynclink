import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Usage Pricing Guide — SmartSyncLink",
  description:
    "Transparent, pay-as-you-go rates for phone numbers, SMS & MMS, voice calls, AI features, A2P registration and add-ons.",
};

export default async function TransparentPricingPage() {
  const [layout, blocks, global] = await Promise.all([
    getLayout("usage-pricing", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);

  return <PageShell layout={layout} blocks={blocks} global={global} ctx={{ pageKey: "usage-pricing" }} />;
}
