// Seeds the blog with the articles the design shows, so the layout can be seen
// before anyone writes a real one.
// Run: node --env-file=.env.local scripts/seed-posts.ts
// Skips any slug that already exists — safe to re-run, and it never touches a
// post someone has edited.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const body = (heading: string) => `${heading}

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets.

1. Lorem Ipsum is simply dummy text of the printing.
2. Lorem Ipsum is simply dummy text of the printing.
3. Lorem Ipsum is simply dummy text of the printing.
4. Lorem Ipsum is simply dummy text of the printing.
5. Lorem Ipsum is simply dummy text of the printing.
6. Lorem Ipsum is simply dummy text of the printing.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.`;

// Stand-in covers from the images already in /public, so the layout can be
// judged before real photography exists. Replace them from the dashboard.
const covers = [
  "/images/hero-img.png",
  "/images/contractors.webp",
  "/images/real-estate.webp",
  "/images/aesthetics.webp",
  "/images/campaigns.webp",
  "/images/constrution.png",
];

const posts = [
  {
    slug: "hidden-cost-of-missed-calls",
    title: "The Hidden Cost of Missed Calls: How AI Can Help Recover Lost Leads",
    excerpt:
      "Every missed call could be a missed opportunity. Learn how automated text-back, AI conversations, and smart follow-up can help businesses reconnect with prospects before they move on to a competitor.",
    tags: ["AI & Automation", "Follow-Up"],
  },
  {
    slug: "what-is-an-ai-receptionist",
    title: "What Is an AI Receptionist and How Can It Help Your Business?",
    excerpt:
      "Your team can't answer every call or respond to every question instantly. An AI receptionist can help handle conversations, answer common questions, qualify prospects, and guide customers toward the next step.",
    tags: ["AI & Automation", "Lead Generation"],
  },
  {
    slug: "why-your-website-isnt-converting",
    title: "Why Your Website Isn't Converting as Many Leads as It Should",
    excerpt:
      "Getting traffic is only part of the equation. If visitors don't understand what you offer, trust your business, or know what to do next, they're likely to leave without contacting you.",
    tags: ["Websites & CRO", "Conversion Funnels"],
  },
  {
    slug: "website-vs-landing-page-vs-funnel",
    title: "Website vs. Landing Page vs. Funnel: What's the Difference?",
    excerpt:
      "Not every visitor should be sent to the same page. A website, landing page, and conversion funnel each serve a different purpose. Understanding when to use each can make a major difference.",
    tags: ["Conversion Funnels", "Websites & CRO"],
  },
  {
    slug: "following-up-without-being-annoying",
    title: "How to Follow Up With Leads Without Being Annoying",
    excerpt:
      "There is a line between persistent and pushy. A follow-up sequence that respects the reader keeps you in the conversation long after the first enquiry.",
    tags: ["Follow-Up", "Lead Generation"],
  },
  {
    slug: "what-service-businesses-get-wrong",
    title: "What Service Businesses Most Often Get Wrong About Automation",
    excerpt:
      "Automation is not about removing people from the conversation. It is about making sure nobody waits for one — and that the right person picks it up at the right moment.",
    tags: ["Industry Insights", "AI & Automation"],
  },
];

let added = 0;
for (const [i, post] of posts.entries()) {
  const exists = await sql`select 1 from posts where slug = ${post.slug}`;
  if (exists.length) {
    console.log(`  skipped (already there): ${post.slug}`);
    continue;
  }
  // spaced a day apart so "recent" has a real order to sort by
  await sql`
    insert into posts (slug, title, excerpt, body, cover, tags, status, source, published_at)
    values (${post.slug}, ${post.title}, ${post.excerpt}, ${body(post.title)},
            '', ${post.tags}, 'published', 'manual', now() - ${`${i} days`}::interval)`;
  console.log(`  added: ${post.slug}`);
  added += 1;
}

console.log(`\n${added} added, ${posts.length - added} already present`);
process.exit(0);
