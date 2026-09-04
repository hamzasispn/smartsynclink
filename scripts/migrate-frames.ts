// Adds the hover frame list to each stored industry card.
// Run: node --env-file=.env.local scripts/migrate-frames.ts
// Frames are copied from the template by matching card title, so the code
// stays the single source of truth for what the sequence is.
import { neon } from "@neondatabase/serverless";
import { defaultHomeContent } from "../src/content/home.ts";

const sql = neon(process.env.DATABASE_URL!);

const rows = await sql`select data from site_content where key = 'home'`;
if (!rows[0]) {
  console.log("no home row — nothing to migrate");
  process.exit(0);
}

type Card = { title: string; frames?: unknown[] };
const data = rows[0].data as Record<string, { cards?: Card[] }>;
const stored = data.industries?.cards ?? [];

const industries = {
  ...defaultHomeContent.industries,
  ...data.industries,
  cards: stored.map((card) => {
    if (card.frames) return card;
    const template = defaultHomeContent.industries.cards.find(
      (t) => t.title === card.title,
    );
    return { ...card, frames: template?.frames ?? [] };
  }),
};

await sql`
  update site_content set data = ${JSON.stringify({ ...data, industries })}::jsonb,
                          updated_at = now()
  where key = 'home'`;

for (const card of industries.cards) {
  console.log(`  ${card.title.padEnd(24)} ${card.frames?.length ?? 0} frames`);
}
process.exit(0);
