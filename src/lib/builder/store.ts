import type { GlobalContent } from "@/content/global";
import {
  fill,
  getBlogContent,
  getCookieContent,
  getGlobalContent,
  getHomeContent,
  getPricingTableContent,
  getPrivacyContent,
  getSolutionsContent,
  getTermsContent,
  getUsagePricingContent,
  saveGlobalContent,
} from "../content";
import { sql } from "../db";
import { getIndustry } from "../industries";
import { newSection } from "./instance";
import { SECTIONS } from "./sections";
import type { Blocks, Layout, Mode, Versioned } from "./types";

export { newSection };

/**
 * Where builder documents live, and how a page gets a layout before anyone has
 * opened it in the builder.
 *
 * All of it rides the existing site_content table, one row per document:
 *   layout:<page>  — that page's sections, published and draft
 *   blocks         — the shared content of linked sections
 *   global:draft   — unpublished header/footer edits (live copy stays in "global")
 *
 * A page with no layout row is rendered from its current content documents in
 * the order the site has always used — so switching a page to the builder
 * changes nothing on screen until someone edits it.
 *
 * ponytail: whole documents per page, last save wins. Two people editing the
 * same page at once overwrite each other; add a version check if that happens.
 */

const HISTORY = 5;

const emptyVersioned = <T>(): Versioned<T> => ({
  published: null,
  draft: null,
  publishedAt: null,
  draftAt: null,
  history: [],
});

async function readRow<T>(key: string): Promise<Versioned<T>> {
  try {
    const rows = await sql`select data from site_content where key = ${key}`;
    return { ...emptyVersioned<T>(), ...((rows[0]?.data as Partial<Versioned<T>>) ?? {}) };
  } catch (error) {
    console.error(`builder row "${key}" failed, using defaults:`, error);
    return emptyVersioned<T>();
  }
}

async function writeRow(key: string, data: unknown) {
  await sql`
    insert into site_content (key, data, updated_at)
    values (${key}, ${JSON.stringify(data)}::jsonb, now())
    on conflict (key) do update set data = excluded.data, updated_at = now()`;
}

/* ----------------------------------------------------------- instances -- */

/** Stored instances merged over the current catalogue, so fields added to a section in code appear. */
function normalise(layout: Layout): Layout {
  return {
    sections: (layout.sections ?? [])
      .filter((s) => SECTIONS[s.type])
      .map((s) => {
        const base = newSection(s.type, {}, s.id);
        return {
          ...base,
          ...s,
          devices: { ...base.devices, ...s.devices },
          conditions: { ...base.conditions, ...s.conditions },
          props: s.linked ? {} : fill(s.props ?? {}, SECTIONS[s.type].defaults as Record<string, unknown>),
        };
      }),
  };
}

/* ------------------------------------------------------ default layouts -- */

// Deterministic ids: a default layout is rebuilt on every request, and the
// preview's selection has to survive a refresh before the first save.
const seeded = (entries: [string, unknown?][]): Layout => ({
  sections: entries.map(([type, props], i) => newSection(type, props as Record<string, unknown> | undefined, `${type}-${i}`)),
});

export async function defaultLayout(pageKey: string): Promise<Layout> {
  if (pageKey.startsWith("industry:")) {
    const found = await getIndustry(pageKey.slice("industry:".length));
    const d = found?.data;
    if (!d) return seeded([["industryHero"], ["finalCta"]]);
    return seeded([
      ["industryHero", d.hero],
      ["industryProblem", d.problem],
      ["industryJourney", d.journey],
      ["industryReels", d.reels],
      ...(d.showcase.suite ? ([["suite"]] as [string][]) : []),
      ...(d.showcase.funnel ? ([["funnel"]] as [string][]) : []),
      ["steps"],
      ["pricing"],
      ["finalCta"],
    ]);
  }

  switch (pageKey) {
    case "home": {
      const h = await getHomeContent();
      return seeded([
        ["hero", h.hero],
        ["heroVideo", h.heroVideo],
        ["intro", h.intro],
        ["bento", h.bento],
        ["suite"],
        ["funnel"],
        ["industries", h.industries],
        ["steps"],
        ["pricing"],
        ["showcaseVideo", h.showcaseVideo],
        ["testimonials", h.testimonials],
        ["faq", h.faq],
        ["finalCta"],
      ]);
    }
    case "solutions":
      return seeded([["solutions", await getSolutionsContent()], ["steps"], ["pricing"], ["finalCta"]]);
    case "blog":
      return seeded([["blogIndex", await getBlogContent()], ["finalCta"]]);
    case "post":
      return seeded([["postArticle", await getBlogContent()], ["finalCta"]]);
    case "usage-pricing":
      return seeded([["usagePricing", await getUsagePricingContent()], ["finalCta"]]);
    case "pricing-table":
      return seeded([["pricingTable", await getPricingTableContent()], ["finalCta"]]);
    case "privacy":
      return seeded([["legal", await getPrivacyContent()], ["finalCta"]]);
    case "terms":
      return seeded([["legal", await getTermsContent()], ["finalCta"]]);
    case "cookies":
      return seeded([["legal", await getCookieContent()], ["finalCta"]]);
    default:
      return { sections: [] };
  }
}

async function defaultBlocks(): Promise<Blocks> {
  const h = await getHomeContent();
  return { suite: h.suite, funnel: h.funnel, steps: h.steps, pricing: h.pricing, finalCta: h.finalCta };
}

/* ------------------------------------------------------------- reading -- */

export async function getLayout(pageKey: string, mode: Mode): Promise<Layout> {
  const row = await readRow<Layout>(`layout:${pageKey}`);
  const chosen = (mode === "draft" ? (row.draft ?? row.published) : row.published) ?? (await defaultLayout(pageKey));
  return normalise(chosen);
}

export async function getBlocks(mode: Mode): Promise<Blocks> {
  const row = await readRow<Blocks>("blocks");
  const stored = (mode === "draft" ? (row.draft ?? row.published) : row.published) ?? {};
  const defaults = await defaultBlocks();
  const out: Blocks = {};
  for (const [type, m] of Object.entries(SECTIONS)) {
    if (!m.linked) continue;
    out[type] = fill(stored[type] ?? defaults[type] ?? {}, m.defaults as Record<string, unknown>);
  }
  return out;
}

export async function getGlobal(mode: Mode): Promise<GlobalContent> {
  const live = await getGlobalContent();
  if (mode === "published") return live;
  const row = await readRow<GlobalContent>("global:draft");
  return row.draft ? fill(row.draft, live) : live;
}

/** Everything the builder needs to open a page, and whether anything is unpublished. */
export async function getBuilderState(pageKey: string) {
  const [layoutRow, blocksRow, globalRow] = await Promise.all([
    readRow<Layout>(`layout:${pageKey}`),
    readRow<Blocks>("blocks"),
    readRow<GlobalContent>("global:draft"),
  ]);
  const [layout, blocks, global] = await Promise.all([
    getLayout(pageKey, "draft"),
    getBlocks("draft"),
    getGlobal("draft"),
  ]);
  return {
    layout,
    blocks,
    global,
    dirty: Boolean(layoutRow.draft || blocksRow.draft || globalRow.draft),
    publishedAt: layoutRow.publishedAt,
    history: layoutRow.history.map((h) => h.at),
  };
}

/* ------------------------------------------------------------- writing -- */

export async function saveDraft(pageKey: string, draft: { layout: Layout; blocks: Blocks; global: GlobalContent }) {
  const now = new Date().toISOString();
  const [layoutRow, blocksRow, globalRow] = await Promise.all([
    readRow<Layout>(`layout:${pageKey}`),
    readRow<Blocks>("blocks"),
    readRow<GlobalContent>("global:draft"),
  ]);
  await Promise.all([
    writeRow(`layout:${pageKey}`, { ...layoutRow, draft: draft.layout, draftAt: now }),
    writeRow("blocks", { ...blocksRow, draft: draft.blocks, draftAt: now }),
    writeRow("global:draft", { ...globalRow, draft: draft.global, draftAt: now }),
  ]);
  return now;
}

/** Makes the page's draft, the shared blocks and the header/footer live together. */
export async function publish(pageKey: string) {
  const now = new Date().toISOString();
  const [layoutRow, blocksRow, globalRow] = await Promise.all([
    readRow<Layout>(`layout:${pageKey}`),
    readRow<Blocks>("blocks"),
    readRow<GlobalContent>("global:draft"),
  ]);

  const layout = layoutRow.draft ?? layoutRow.published ?? (await defaultLayout(pageKey));
  const history = layoutRow.published
    ? [{ at: layoutRow.publishedAt ?? now, value: layoutRow.published }, ...layoutRow.history].slice(0, HISTORY)
    : layoutRow.history;

  await writeRow(`layout:${pageKey}`, { published: layout, draft: null, publishedAt: now, draftAt: null, history });
  if (blocksRow.draft) {
    await writeRow("blocks", { ...blocksRow, published: blocksRow.draft, draft: null, publishedAt: now, draftAt: null });
  }
  if (globalRow.draft) {
    await saveGlobalContent(globalRow.draft);
    await writeRow("global:draft", emptyVersioned());
  }
  return now;
}

export async function discardDraft(pageKey: string) {
  const [layoutRow, blocksRow] = await Promise.all([readRow<Layout>(`layout:${pageKey}`), readRow<Blocks>("blocks")]);
  await Promise.all([
    writeRow(`layout:${pageKey}`, { ...layoutRow, draft: null, draftAt: null }),
    writeRow("blocks", { ...blocksRow, draft: null, draftAt: null }),
    writeRow("global:draft", emptyVersioned()),
  ]);
}

/** Puts a previously published version back as the draft, to review before publishing. */
export async function restoreVersion(pageKey: string, at: string) {
  const row = await readRow<Layout>(`layout:${pageKey}`);
  const version = row.history.find((h) => h.at === at);
  if (!version) throw new Error("That version is no longer kept");
  await writeRow(`layout:${pageKey}`, { ...row, draft: version.value, draftAt: new Date().toISOString() });
}
