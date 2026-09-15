import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy — SmartSyncLink",
  description:
    "How Smart SyncLink collects, uses, stores and protects your information, including SMS and email consent.",
};

export default async function PrivacyPolicyPage() {
  const [layout, blocks, global] = await Promise.all([
    getLayout("privacy", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);

  return <PageShell layout={layout} blocks={blocks} global={global} ctx={{ pageKey: "privacy" }} />;
}
