// Refreshes one industry row from the template in src/content/industry.ts.
// Run: node --env-file=.env.local scripts/reseed-industry.ts <slug>
// Overwrites that row's `data` wholesale — only for rows nobody has edited yet.
import { neon } from "@neondatabase/serverless";
import { defaultIndustry } from "../src/content/industry.ts";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node --env-file=.env.local scripts/reseed-industry.ts <slug>");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`
  update industries set data = ${JSON.stringify(defaultIndustry)}::jsonb, updated_at = now()
  where slug = ${slug}
  returning slug`;

console.log(rows.length ? `reseeded: ${rows[0].slug}` : `no row with slug "${slug}"`);
process.exit(0);
