import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { FinalCta, Pricing, Solutions, Steps } from "@/components/sections";
import {
  getGlobalContent,
  getHomeContent,
  getSolutionsContent,
} from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Solutions — SmartSyncLink",
  description:
    "AI, communication, websites, automation, and sales management in one connected system.",
};

/**
 * Every card is its own document field, so the grid grows from the dashboard.
 * Below it the page reuses the home page's steps, pricing and closing call to
 * action — the same offer everywhere, edited once.
 */
export default async function SolutionsPage() {
  const [global, home, solutions] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getSolutionsContent(),
  ]);

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main>
        <Solutions data={solutions} />
        <Steps data={home.steps} />
        <Pricing data={home.pricing} />
        <FinalCta data={home.finalCta} />
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
