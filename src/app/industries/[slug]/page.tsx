import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industryChrome } from "@/components/builder/industry-chrome";
import { PageShell } from "@/components/builder/render";
import { industryKey } from "@/lib/builder/pages";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";
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
 * One layout per industry, built in the page builder. Until an industry is
 * opened there, its layout is its own hero, problem, journey and reels
 * followed by the shared blocks — the order these pages have always had.
 */
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [global, industry] = await Promise.all([getGlobal("published"), getIndustry(slug)]);
  if (!industry || !industry.published) notFound();

  const key = industryKey(slug);
  const [layout, blocks] = await Promise.all([getLayout(key, "published"), getBlocks("published")]);
  const { brand, after } = industryChrome(industry, global.brand);

  return (
    <PageShell
      layout={layout}
      blocks={blocks}
      global={global}
      ctx={{ pageKey: key }}
      brand={brand}
      after={after}
    />
  );
}
