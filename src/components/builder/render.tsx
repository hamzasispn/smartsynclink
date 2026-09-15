import type { ReactNode } from "react";
import type { BlogContent } from "@/content/blog";
import type { GlobalContent } from "@/content/global";
import type { HomeContent } from "@/content/home";
import type { IndustryContent } from "@/content/industry";
import type { LegalDoc } from "@/content/legal";
import type { PricingTableContent, UsagePricingContent } from "@/content/pricing-pages";
import type { SolutionsContent } from "@/content/solutions";
import { SECTIONS } from "@/lib/builder/sections";
import type { Blocks, Device, Layout, SectionInstance } from "@/lib/builder/types";
import type { Post } from "@/lib/posts";
import Footer from "../footer";
import Header from "../header";
import { LegalPage } from "../legal-page";
import {
  Bento,
  Faq,
  FinalCta,
  Funnel,
  Hero,
  HeroVideo,
  Industries,
  IndustryHero,
  IndustryJourney,
  IndustryProblem,
  IndustryReels,
  Intro,
  Pricing,
  ShowcaseVideo,
  Solutions,
  Steps,
  Suite,
  Testimonials,
} from "../sections";
import { BlogIndex } from "../sections/blog-index";
import { PricingPackages } from "../sections/pricing-packages";
import { UsagePricing } from "../sections/usage-pricing";
import { PreviewBridge } from "./preview-bridge";

/**
 * Turns a stored layout into the page.
 *
 * Server-rendered and dependency-free on the public site: the only thing the
 * builder adds to a live page is a wrapper div per section. The preview route
 * renders exactly this, plus the bridge that lets the builder select sections.
 */

export type BlogData = {
  posts: Post[];
  searchParams: { tag?: string; page?: string; q?: string };
};

export type RenderContext = {
  pageKey: string;
  blog?: BlogData;
};

type Render = (data: never, ctx: RenderContext) => ReactNode;

const RENDER: Record<string, Render> = {
  hero: (d: HomeContent["hero"]) => <Hero data={d} />,
  heroVideo: (d: HomeContent["heroVideo"]) => <HeroVideo data={d} />,
  industryHero: (d: IndustryContent["hero"]) => <IndustryHero data={d} />,

  intro: (d: HomeContent["intro"]) => <Intro data={d} />,
  bento: (d: HomeContent["bento"]) => <Bento data={d} />,
  industries: (d: HomeContent["industries"]) => <Industries data={d} />,
  showcaseVideo: (d: HomeContent["showcaseVideo"]) => <ShowcaseVideo data={d} />,
  testimonials: (d: HomeContent["testimonials"]) => <Testimonials data={d} />,
  faq: (d: HomeContent["faq"]) => <Faq data={d} />,

  suite: (d: HomeContent["suite"]) => <Suite data={d} />,
  funnel: (d: HomeContent["funnel"]) => <Funnel data={d} />,
  steps: (d: HomeContent["steps"]) => <Steps data={d} />,
  pricing: (d: HomeContent["pricing"]) => <Pricing data={d} />,
  finalCta: (d: HomeContent["finalCta"]) => <FinalCta data={d} />,

  industryProblem: (d: IndustryContent["problem"]) => <IndustryProblem data={d} />,
  industryJourney: (d: IndustryContent["journey"]) => <IndustryJourney data={d} />,
  industryReels: (d: IndustryContent["reels"]) => <IndustryReels data={d} />,

  solutions: (d: SolutionsContent) => <Solutions data={d} />,
  blogIndex: (d: BlogContent, ctx) => (
    <BlogIndex data={d} posts={ctx.blog?.posts ?? []} searchParams={ctx.blog?.searchParams ?? {}} />
  ),
  usagePricing: (d: UsagePricingContent) => <UsagePricing data={d} />,
  pricingTable: (d: PricingTableContent) => <PricingPackages data={d} />,
  legal: (d: LegalDoc) => <LegalPage doc={d} />,
};

/** Tailwind's md and lg split mobile / tablet / desktop, matching the builder's device preview. */
function deviceClasses(devices: Record<Device, boolean>) {
  return [
    devices.mobile ? "" : "max-md:hidden",
    devices.tablet ? "" : "md:max-lg:hidden",
    devices.desktop ? "" : "lg:hidden",
  ]
    .filter(Boolean)
    .join(" ");
}

export function sectionShows(section: SectionInstance, pageKey: string) {
  if (section.hidden) return false;
  const { mode, pages } = section.conditions;
  if (mode === "include") return pages.includes(pageKey);
  if (mode === "exclude") return !pages.includes(pageKey);
  return true;
}

export function PageShell({
  layout,
  blocks,
  global,
  ctx,
  brand,
  preview = false,
  after,
}: {
  layout: Layout;
  blocks: Blocks;
  global: GlobalContent;
  ctx: RenderContext;
  /** Per-page logo override (industries carry their own mark). */
  brand?: GlobalContent["brand"];
  /** Builder preview: wraps sections with selection hooks and mounts the bridge. */
  preview?: boolean;
  /** Anything that sits after the footer, like floating buttons. */
  after?: ReactNode;
}) {
  const visible = layout.sections.filter((s) => sectionShows(s, ctx.pageKey));

  const renderSection = (s: SectionInstance) => {
    const render = RENDER[s.type];
    if (!render) return null;
    const data = s.linked ? blocks[s.type] : s.props;
    return (
      <div
        key={s.id}
        className={deviceClasses(s.devices) || undefined}
        data-builder-id={preview ? s.id : undefined}
        data-builder-label={preview ? s.label || SECTIONS[s.type]?.label : undefined}
      >
        {render(data as never, ctx)}
      </div>
    );
  };

  // The header floats over the blueprint artwork, and that artwork belongs to
  // the hero — so leading backdrop sections share one wrapper with the header.
  let lead = 0;
  while (lead < visible.length && SECTIONS[visible[lead].type]?.backdrop) lead++;
  const heroes = visible.slice(0, lead);
  const rest = visible.slice(lead);

  const header = (
    <div data-builder-id={preview ? "__header" : undefined} data-builder-label={preview ? "Header" : undefined}>
      <Header brand={brand ?? global.brand} nav={global.nav} />
    </div>
  );

  return (
    <>
      {heroes.length ? (
        <div className="blueprint relative overflow-hidden">
          {header}
          {heroes.map(renderSection)}
        </div>
      ) : (
        header
      )}

      <main>{rest.map(renderSection)}</main>

      <div data-builder-id={preview ? "__footer" : undefined} data-builder-label={preview ? "Footer" : undefined}>
        <Footer brand={brand ?? global.brand} data={global.footer} />
      </div>

      {after}
      {preview ? <PreviewBridge /> : null}
    </>
  );
}
