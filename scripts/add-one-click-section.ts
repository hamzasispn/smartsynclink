// One-off: puts the one-click campaigns section on the home page, right after
// the bento grid whose tile now links to it.
//
// The page's layout lives in the database, not in code — a section added to the
// catalogue does not appear on a page until it is placed on one, and this
// places it without anyone having to open the builder.
//
// Run: node --env-file=.env.local scripts/add-one-click-section.ts
import { neon } from "@neondatabase/serverless";
import { defaultHomeContent } from "../src/content/home.ts";

const sql = neon(process.env.DATABASE_URL!);
const TYPE = "oneClick";

/** The same shape newSection() builds, written out so this needs no bundler. */
const instance = () => ({
  id: `${TYPE}-seeded`,
  type: TYPE,
  label: "",
  hidden: false,
  devices: { desktop: true, tablet: true, mobile: true },
  conditions: { mode: "all", pages: [] },
  linked: false,
  props: structuredClone(defaultHomeContent.oneClick),
});

const [row] = await sql`select data from site_content where key = 'layout:home'`;
if (!row) {
  console.log("no stored home layout — the section will come from the default layout");
  process.exit(0);
}

const data = row.data as Record<string, { sections?: { type: string }[] } | undefined>;
const changes: string[] = [];

for (const mode of ["published", "draft"] as const) {
  const sections = data[mode]?.sections;
  if (!Array.isArray(sections)) continue;
  if (sections.some((s) => s.type === TYPE)) {
    changes.push(`${mode}: already there`);
    continue;
  }
  const after = sections.findIndex((s) => s.type === "bento");
  const at = after === -1 ? sections.length : after + 1;
  sections.splice(at, 0, instance());
  changes.push(`${mode}: inserted at position ${at + 1} of ${sections.length}`);
}

await sql`
  update site_content set data = ${JSON.stringify(data)}::jsonb, updated_at = now()
  where key = 'layout:home'`;

console.log(changes.join("\n"));
