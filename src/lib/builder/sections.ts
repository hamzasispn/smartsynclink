import { defaultBlog } from "@/content/blog";
import { defaultHomeContent as home } from "@/content/home";
import { defaultIndustry as industry } from "@/content/industry";
import { defaultPrivacy } from "@/content/legal";
import { defaultPricingTable, defaultUsagePricing } from "@/content/pricing-pages";
import { defaultSolutions } from "@/content/solutions";
import { CUSTOM_PRESETS } from "./widgets";

/**
 * The catalogue of section types the builder can place.
 *
 * Data only — no components — so the store, the server actions and the admin
 * UI can all read it without pulling section markup into their bundles. The
 * renderer maps each key to its component (components/builder/render.tsx).
 *
 * `defaults` is the content a freshly added section starts with, and the shape
 * the inspector edits against. `linked` is where a new instance starts: shared
 * blocks edit once for every page. `backdrop` sections sit on the blueprint
 * artwork with the header over them, the way the hero always has.
 */
export type SectionMeta = {
  label: string;
  group: "Custom" | "Hero" | "Home" | "Shared" | "Industry" | "Page";
  description: string;
  defaults: object;
  linked: boolean;
  backdrop: boolean;
};

const meta = (m: Omit<SectionMeta, "linked" | "backdrop"> & Partial<Pick<SectionMeta, "linked" | "backdrop">>): SectionMeta => ({
  linked: false,
  backdrop: false,
  ...m,
});

export const SECTIONS: Record<string, SectionMeta> = {
  custom: meta({ label: "Custom section", group: "Custom", description: "Columns of widgets you arrange yourself.", defaults: CUSTOM_PRESETS[0].build() }),

  hero: meta({ label: "Hero", group: "Hero", description: "Heading, buttons and trust line on the blueprint backdrop.", defaults: home.hero, backdrop: true }),
  heroVideo: meta({ label: "Hero video", group: "Hero", description: "The blended hero clip playlist.", defaults: home.heroVideo, backdrop: true }),
  industryHero: meta({ label: "Industry hero", group: "Hero", description: "Industry heading, copy, buttons and artwork.", defaults: industry.hero, backdrop: true }),

  intro: meta({ label: "Intro", group: "Home", description: "Conversion funnels intro with bullets and image.", defaults: home.intro }),
  bento: meta({ label: "Bento grid", group: "Home", description: "Booking band, voice AI, smart inbox and campaigns tiles.", defaults: home.bento }),
  industries: meta({ label: "Industries", group: "Home", description: "Industry cards with hover frames.", defaults: home.industries }),
  showcaseVideo: meta({ label: "Showcase video", group: "Home", description: "Large product video band.", defaults: home.showcaseVideo }),
  testimonials: meta({ label: "Testimonials", group: "Home", description: "Customer quotes.", defaults: home.testimonials }),
  faq: meta({ label: "FAQ", group: "Home", description: "Questions and answers.", defaults: home.faq }),

  suite: meta({ label: "SmartSync Suite", group: "Shared", description: "Live inbox dashboard and phone.", defaults: home.suite, linked: true }),
  funnel: meta({ label: "SmartSync funnel", group: "Shared", description: "Funnel screens slider with metrics.", defaults: home.funnel, linked: true }),
  steps: meta({ label: "Steps", group: "Shared", description: "How it works, step by step.", defaults: home.steps, linked: true }),
  pricing: meta({ label: "Pricing", group: "Shared", description: "The three plan cards.", defaults: home.pricing, linked: true }),
  finalCta: meta({ label: "Final call to action", group: "Shared", description: "Closing banner with the Try Now orb.", defaults: home.finalCta, linked: true }),

  industryProblem: meta({ label: "Industry problem", group: "Industry", description: "The problem cards for an industry.", defaults: industry.problem }),
  industryJourney: meta({ label: "Industry journey", group: "Industry", description: "Journey steps bento.", defaults: industry.journey }),
  industryReels: meta({ label: "Reels", group: "Industry", description: "Vertical 9:16 video slider.", defaults: industry.reels }),

  solutions: meta({ label: "Solutions grid", group: "Page", description: "Intro and every solution card.", defaults: defaultSolutions }),
  blogIndex: meta({ label: "Blog listing", group: "Page", description: "Title, categories, post grid, newsletter.", defaults: defaultBlog }),
  usagePricing: meta({ label: "Usage pricing tables", group: "Page", description: "Transparent pay-as-you-go rate tables.", defaults: defaultUsagePricing }),
  pricingTable: meta({ label: "Pricing packages", group: "Page", description: "Quick-start, platform and SEO packages.", defaults: defaultPricingTable }),
  legal: meta({ label: "Legal document", group: "Page", description: "A policy with its contents list.", defaults: defaultPrivacy }),
  postArticle: meta({ label: "Blog post", group: "Page", description: "The post itself: article, contents, newsletter and related posts.", defaults: defaultBlog }),
};

export const GROUP_ORDER: SectionMeta["group"][] = ["Custom", "Hero", "Home", "Shared", "Industry", "Page"];
