import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  FinalCta,
  IndustryHero,
  IndustryJourney,
  IndustryProblem,
  Pricing,
  Steps,
} from "@/components/sections";
import { getGlobalContent, getHomeContent } from "@/lib/content";
import { getIndustry, listIndustries } from "@/lib/industries";

export const revalidate = 60;

export async function generateStaticParams() {
  // A build must not die because the database is unreachable — an empty list
  // just means nothing is prerendered, and the pages still render on demand.
  try {
    return (await listIndustries()).map((i) => ({ slug: i.slug }));
  } catch (error) {
    console.error("generateStaticParams: skipping prerender:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const industry = await getIndustry((await params).slug);
  if (!industry) return {};
  return {
    title: `${industry.name} — SmartSyncLink`,
    description: industry.excerpt || industry.data.hero.body,
  };
}

/**
 * One template, one row per industry.
 *
 * Only the top three sections are per-industry; everything below is the same
 * offer on every page, so it reads straight from the home document instead of
 * being copied into each row — change the pricing once and every industry page
 * follows.
 */
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [global, home, industry] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getIndustry(slug),
  ]);
  if (!industry || !industry.published) notFound();

  return (
    <>
      {/* header sits on the hero artwork, as it does on the home page */}
      <div className="blueprint relative overflow-hidden">
        <Header brand={global.brand} nav={global.nav} />
        <IndustryHero data={industry.data.hero} />
      </div>

      <main>
        <IndustryProblem data={industry.data.problem} />
        <IndustryJourney data={industry.data.journey} />

        {/* shared below the fold */}
        <Steps data={home.steps} />
        <Pricing data={home.pricing} />
        <FinalCta data={home.finalCta} />
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
