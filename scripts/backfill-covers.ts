// Gives every post without a cover a photograph from Pexels.
// Run: node --env-file=.env.local scripts/backfill-covers.ts
//      node --env-file=.env.local scripts/backfill-covers.ts --dry
//
// New posts get theirs as they are written (see the autopilot route); this is
// for the ones already in the blog, which show a grey placeholder instead.
import { neon } from "@neondatabase/serverless";
import { coverQueries, findCover, pexelsReady } from "../src/lib/pexels.ts";

const sql = neon(process.env.DATABASE_URL!);
const dry = process.argv.includes("--dry");

if (!pexelsReady()) {
  console.log("PEXELS_API_KEY is not set — nothing to do.");
  process.exit(0);
}

const posts = await sql`
  select id, title, tags from posts
  where coalesce(cover, '') = ''
  order by coalesce(published_at, created_at) desc`;

if (!posts.length) {
  console.log("every post already has a cover");
  process.exit(0);
}

let filled = 0;
for (const post of posts) {
  const cover = await findCover(coverQueries(post.tags ?? []));
  if (!cover) {
    console.log(`—  ${post.title}: nothing found`);
    continue;
  }
  if (!dry) await sql`update posts set cover = ${cover}, updated_at = now() where id = ${post.id}`;
  filled++;
  console.log(`${dry ? "would set" : "set"}  ${post.title}`);
}

console.log(`\n${filled} of ${posts.length} post(s) ${dry ? "would get" : "got"} a cover`);
