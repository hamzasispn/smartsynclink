// Moves the one-click campaigns section from the home page to the aesthetics
// page, where the brief puts it. The home page keeps the bento tile, whose
// "Learn More" now links across to it.
//
// Page layouts live in the database, not in code, so this is the only way to
// place or remove a section without opening the builder by hand.
//
// Run: node --env-file=.env.local scripts/move-one-click-section.ts
import { neon } from "@neondatabase/serverless";
import { defaultHomeContent } from "../src/content/home.ts";

const sql = neon(process.env.DATABASE_URL!);
const TYPE = "oneClick";
const FROM = "layout:home";
const TO = "layout:industry:aesthetics";
/** It follows the page's own story, after the problem and journey sections. */
const AFTER = ["industryJourney", "funnel", "suite"];

type Section = { id: string; type: string; props?: Record<string, unknown> };

const instance = (): Section => ({
  id: `${TYPE}-seeded`,
  type: TYPE,
  label: "",
  hidden: false,
  devices: { desktop: true, tablet: true, mobile: true },
  conditions: { mode: "all", pages: [] },
  linked: false,
  props: structuredClone(defaultHomeContent.oneClick),
}) as unknown as Section;

async function edit(key: string, change: (sections: Section[]) => string | null) {
  const [row] = await sql`select data from site_content where key = ${key}`;
  if (!row) return console.log(`${key}: no stored layout`);

  const data = row.data as Record<string, { sections?: Section[] } | undefined>;
  const notes: string[] = [];
  for (const mode of ["published", "draft"] as const) {
    const sections = data[mode]?.sections;
    if (!Array.isArray(sections)) continue;
    const note = change(sections);
    if (note) notes.push(`${key}/${mode}: ${note}`);
  }
  if (!notes.length) return console.log(`${key}: nothing to do`);

  await sql`
    update site_content set data = ${JSON.stringify(data)}::jsonb, updated_at = now()
    where key = ${key}`;
  console.log(notes.join("\n"));
}

// off the home page
await edit(FROM, (sections) => {
  const at = sections.findIndex((s) => s.type === TYPE);
  if (at === -1) return null;
  sections.splice(at, 1);
  return "removed";
});

// onto the aesthetics page, after whichever of the anchors it finds first
await edit(TO, (sections) => {
  if (sections.some((s) => s.type === TYPE)) return "already there";
  const anchor = AFTER.map((type) => sections.findIndex((s) => s.type === type)).find((i) => i > -1);
  const at = anchor === undefined ? sections.length : anchor + 1;
  sections.splice(at, 0, instance());
  return `added at position ${at + 1} of ${sections.length}`;
});
