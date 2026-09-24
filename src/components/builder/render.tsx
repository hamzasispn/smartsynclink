import type { ComponentType, ReactNode } from "react";
import type { BlogContent } from "@/content/blog";
import type { GlobalContent } from "@/content/global";
import type { HomeContent, Media } from "@/content/home";
import type { IndustryContent } from "@/content/industry";
import type { LegalDoc } from "@/content/legal";
import type { PricingTableContent, UsagePricingContent } from "@/content/pricing-pages";
import type { SolutionsContent } from "@/content/solutions";
import type { CustomProps } from "@/lib/builder/widgets";
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
  OneClick,
  Pricing,
  ShowcaseVideo,
  Solutions,
  Steps,
  Suite,
  Testimonials,
} from "../sections";
import { BlogIndex } from "../sections/blog-index";
import { PostArticle } from "../sections/post-article";
import { PricingPackages } from "../sections/pricing-packages";
import { UsagePricing } from "../sections/usage-pricing";
import { CustomSection } from "./custom-section";
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
  /** Set by PageShell in the builder preview. */
  preview?: boolean;
  /** The post a blog post template renders, and every post for its related list. */
  post?: { post: Post; all: Post[] };
};

type Render = (data: never, ctx: RenderContext) => ReactNode;

const RENDER: Record<string, Render> = {
  custom: (d: CustomProps, ctx) => <CustomSection data={d} preview={ctx.preview} />,

  hero: (d: HomeContent["hero"]) => <Hero data={d} />,
  heroVideo: (d: HomeContent["heroVideo"]) => <HeroVideo data={d} />,
  industryHero: (d: IndustryContent["hero"] & { reels?: Media[] }) => <IndustryHero data={d} reels={d.reels} />,

  intro: (d: HomeContent["intro"]) => <Intro data={d} />,
  bento: (d: HomeContent["bento"]) => <Bento data={d} />,
  oneClick: (d: HomeContent["oneClick"]) => <OneClick data={d} />,
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
  postArticle: (d: BlogContent, ctx) =>
    ctx.post ? (
      <PostArticle data={d} post={ctx.post.post} all={ctx.post.all} />
    ) : (
      <section className="px-6 pt-44 pb-24 text-center text-[15px] text-muted">
        No published posts yet — publish one to see this template filled in.
      </section>
    ),
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

/** Whether a set of display conditions lets something show on this page. */
export function conditionsShow(conditions: { mode: string; pages: string[] } | undefined, pageKey: string) {
  if (!conditions || conditions.mode === "all") return true;
  if (conditions.mode === "include") return conditions.pages.includes(pageKey);
  return !conditions.pages.includes(pageKey);
}

export function sectionShows(section: SectionInstance, pageKey: string) {
  return !section.hidden && conditionsShow(section.conditions, pageKey);
}

export type SectionBlockProps = {
  section: SectionInstance;
  data: unknown;
  ctx: RenderContext;
  preview: boolean;
};

/**
 * One placed section: its device classes, its builder hooks, its markup.
 * A component of its own so the live preview can memoise it per section.
 */
export function SectionBlock({ section: s, data, ctx, preview }: SectionBlockProps) {
  const render = RENDER[s.type];
  if (!render) return null;
  return (
    <div
      className={deviceClasses(s.devices) || undefined}
      data-builder-id={preview ? s.id : undefined}
      data-builder-label={preview ? s.label || SECTIONS[s.type]?.label : undefined}
    >
      {render(data as never, { ...ctx, preview })}
    </div>
  );
}

export function PageShell({
  layout,
  blocks,
  global,
  ctx,
  brand,
  preview = false,
  after,
  Block = SectionBlock,
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
  /** The live preview swaps in a memoised block so unchanged sections skip re-rendering. */
  Block?: ComponentType<SectionBlockProps>;
}) {
  const shown = layout.sections.filter((s) => sectionShows(s, ctx.pageKey));
  const dataOf = (s: SectionInstance) => (s.linked ? blocks[s.type] : s.props);

  // An industry page's reels play in the right-hand column of its hero rather
  // than as a section of their own: the hero takes the clips and the Reels
  // block drops out of the flow. The clips are still edited — and hidden — on
  // the Reels block, so nothing had to move.
  const reels = shown.find((s) => s.type === "industryReels");
  const heroReels =
    reels && shown.some((s) => s.type === "industryHero")
      ? (dataOf(reels) as IndustryContent["reels"] | undefined)?.videos
      : undefined;
  const visible = heroReels?.length ? shown.filter((s) => s !== reels) : shown;

  // ctx is passed through untouched so a memoised Block can compare it by identity
  const renderSection = (s: SectionInstance) => (
    <Block
      key={s.id}
      section={s}
      data={heroReels?.length && s.type === "industryHero" ? { ...(dataOf(s) as object), reels: heroReels } : dataOf(s)}
      ctx={ctx}
      preview={preview}
    />
  );

  // The header floats over the blueprint artwork, and that artwork belongs to
  // the hero — so leading backdrop sections share one wrapper with the header.
  let lead = 0;
  while (lead < visible.length && SECTIONS[visible[lead].type]?.backdrop) lead++;
  const heroes = visible.slice(0, lead);
  const rest = visible.slice(lead);

  const showHeader = conditionsShow(global.visibility?.header, ctx.pageKey);
  const showFooter = conditionsShow(global.visibility?.footer, ctx.pageKey);

  const header = (
    <div data-builder-id={preview ? "__header" : undefined} data-builder-label={preview ? "Header" : undefined}>
      <Header brand={brand ?? global.brand} nav={global.nav} />
    </div>
  );

  return (
    <>
      {heroes.length ? (
        <div className="blueprint relative overflow-hidden">
          {showHeader ? header : null}
          {heroes.map(renderSection)}
        </div>
      ) : showHeader ? (
        header
      ) : null}

      <main>{rest.map(renderSection)}</main>

      {showFooter ? (
        <div data-builder-id={preview ? "__footer" : undefined} data-builder-label={preview ? "Footer" : undefined}>
          <Footer brand={brand ?? global.brand} data={global.footer} />
        </div>
      ) : null}

      {after}
      {preview ? <PreviewBridge /> : null}
    </>
  );
}
