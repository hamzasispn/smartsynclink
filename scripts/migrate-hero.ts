// Moves the hero off the backdrop slider and the single still image.
// Run: node --env-file=.env.local scripts/migrate-hero.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const rows = await sql`select data from site_content where key = 'home'`;
if (!rows[0]) {
  console.log("no home row — nothing to migrate");
  process.exit(0);
}

const data = rows[0].data as Record<string, Record<string, unknown>>;
const hero = { ...data.hero };

// The clip already playing keeps playing: it becomes the first slide rather
// than being dropped along with the still it replaced.
if (!hero.videos) {
  hero.videos = [{ src: "/video/video.mp4", alt: "Product walkthrough" }];
}
delete hero.image;
delete hero.backgrounds;
delete hero.backgroundSeconds;

await sql`
  update site_content set data = ${JSON.stringify({ ...data, hero })}::jsonb, updated_at = now()
  where key = 'home'`;

console.log("hero keys now:", Object.keys(hero).join(", "));
process.exit(0);
