// Gives every post its own cover photograph from Pexels.
// Run: node --env-file=.env.local scripts/backfill-covers.ts
//      node --env-file=.env.local scripts/backfill-covers.ts --dry
//
// New posts get one as they are written (see the autopilot route); this is for
// the ones already on the blog — the ones with a grey placeholder, and the ones
// wearing a photograph another post is already using.
//
// The same job is a button in the dashboard (Blog → Fetch missing covers),
// which is the one to use when the Pexels key lives on the server rather than
// on this machine.
import { neon } from "@neondatabase/serverless";
import { coverQueries, findCover, pexelsReady } from "../src/lib/pexels.ts";

const sql = neon(process.env.DATABASE_URL!);
const dry = process.argv.includes("--dry");

if (!pexelsReady()) {
  console.log("PEXELS_API_KEY is not set — nothing to do.");
  process.exit(0);
}

const posts = await sql`
  select id, title, tags, coalesce(cover, '') as cover from posts
  order by coalesce(published_at, created_at) desc`;

// needs one if it has none, or if an earlier post already wears it
const used = new Set<string>();
const missing = posts.filter((post) => {
  if (!post.cover || used.has(post.cover)) return true;
  used.add(post.cover);
  return false;
});

if (!missing.length) {
  console.log("every post already has a cover of its own");
  process.exit(0);
}

let filled = 0;
for (const post of missing) {
  const cover = await findCover(coverQueries(post.tags ?? []), used);
  if (!cover) {
    console.log(`—  ${post.title}: nothing found`);
    continue;
  }
  used.add(cover);
  if (!dry) await sql`update posts set cover = ${cover}, updated_at = now() where id = ${post.id}`;
  filled++;
  console.log(`${dry ? "would set" : "set"}  ${post.title}`);
}

console.log(`\n${filled} of ${missing.length} post(s) ${dry ? "would get" : "got"} a cover`);
