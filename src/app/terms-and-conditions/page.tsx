import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { LegalPage } from "@/components/legal-page";
import { FinalCta } from "@/components/sections";
import { getGlobalContent, getHomeContent, getTermsContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms & Conditions — SmartSyncLink",
  description:
    "The terms governing Smart SyncLink services and our SMS and email communication programs.",
};

export default async function TermsPage() {
  const [global, home, doc] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getTermsContent(),
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
