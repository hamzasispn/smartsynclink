import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms & Conditions — SmartSyncLink",
  description:
    "The terms governing Smart SyncLink services and our SMS and email communication programs.",
};

export default async function TermsPage() {
  const [layout, blocks, global] = await Promise.all([
    getLayout("terms", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);

  return <PageShell layout={layout} blocks={blocks} global={global} ctx={{ pageKey: "terms" }} />;
}
