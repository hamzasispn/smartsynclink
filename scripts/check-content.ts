// Proves the home page renders DB content, not the static fallback.
// Needs `npm run dev` running.  Run: npm run db:check
import { neon } from "@neondatabase/serverless";
import assert from "node:assert/strict";

const sql = neon(process.env.DATABASE_URL!);
const url = process.env.CHECK_URL ?? "http://localhost:3000";
const sentinel = `SENTINEL-${Date.now()}`;

const [before] = await sql`select data from site_content where key = 'home'`;
assert.ok(before?.data, "site_content.home missing — run npm run db:setup");
const original = before.data as { hero: { heading: string } };

try {
  await sql`
    update site_content
    set data = jsonb_set(data, '{hero,heading}', ${JSON.stringify(sentinel)}::jsonb)
    where key = 'home'`;

  const html = await fetch(url, { cache: "no-store" }).then((r) => r.text());
  assert.ok(html.includes(sentinel), "page did not render the DB heading");
  console.log("ok — page is served from site_content.home");
} finally {
  await sql`update site_content set data = ${JSON.stringify(original)}::jsonb where key = 'home'`;
}
