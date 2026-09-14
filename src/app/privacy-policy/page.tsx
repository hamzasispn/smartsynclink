import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { LegalPage } from "@/components/legal-page";
import { FinalCta } from "@/components/sections";
import { getGlobalContent, getHomeContent, getPrivacyContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy — SmartSyncLink",
  description:
    "How Smart SyncLink collects, uses, stores and protects your information, including SMS and email consent.",
};

export default async function PrivacyPolicyPage() {
  const [global, home, doc] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getPrivacyContent(),
  ]);

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />
      <LegalPage doc={doc} />
      <FinalCta data={home.finalCta} />
      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
