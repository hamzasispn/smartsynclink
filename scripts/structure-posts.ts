// One-off: the seeded posts are flat lorem with no headings at all, so the
// article page renders no table of contents — there is nothing to list.
// This keeps each post's own paragraphs and slots headings between them so the
// layout (and the contents card) shows what it is meant to show.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

/** Section headings per post, applied in order to the paragraphs it already has. */
const PLAN: Record<string, [string, string[]][]> = {
  "hidden-cost-of-missed-calls": [
    ["What a missed call actually costs", ["The first call wins", "Where the leak shows up"]],
    ["How automated text-back closes the gap", []],
    ["Putting it to work", ["What to measure"]],
  ],
  "what-is-an-ai-receptionist": [
    ["What an AI receptionist does", ["Answering", "Qualifying"]],
    ["Where it fits in your day", []],
    ["Getting started", ["What to set up first"]],
  ],
  "why-your-website-isnt-converting": [
    ["Why visitors leave", ["Slow answers", "Unclear next step"]],
    ["Fixes that move the number", []],
    ["Measuring the change", ["What to watch"]],
  ],
  "website-vs-landing-page-vs-funnel": [
    ["Three things, three jobs", ["The website", "The landing page"]],
    ["When a funnel is the right answer", []],
    ["Choosing for your business", ["A simple rule"]],
  ],
  "following-up-without-being-annoying": [
    ["Why follow-up fails", ["Too soon, too often", "No reason to reply"]],
    ["A cadence people answer", []],
    ["Automating it safely", ["Where to stop"]],
  ],
  "what-service-businesses-get-wrong": [
    ["The common mistakes", ["Automating the wrong step", "No owner for replies"]],
    ["What working automation looks like", []],
    ["Where to start", ["First 30 days"]],
  ],
};

const rows = await sql`select id, slug, title, body from posts`;

for (const post of rows) {
  const plan = PLAN[post.slug as string];
  if (!plan) continue;

  // paragraphs as the post already has them, minus a repeated title line
  const blocks = (post.body as string)
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b && b !== post.title);

  const out: string[] = [];
  let i = 0;
  for (const [h2, h3s] of plan) {
    out.push(`## ${h2}`);
    out.push(blocks[i++ % blocks.length]);
    for (const h3 of h3s) {
      out.push(`### ${h3}`);
      out.push(blocks[i++ % blocks.length]);
    }
  }

  const body = out.join("\n\n");
  await sql`update posts set body = ${body}, updated_at = now() where id = ${post.id}`;
  console.log(post.slug, "→", (body.match(/^#{2,3}\s/gm) ?? []).length, "headings");
}
