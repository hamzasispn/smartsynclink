// Self-check for the solution page's Markdown conventions: `node scripts/check-solution-page.ts`
import assert from "node:assert/strict";
import { frontMatter, pageSections, plain, splitFaq } from "../src/lib/solution-page.ts";

const body = `---
title: AI Voice Agent | SmartSyncLink
seo_description: "Answers every call, 24/7."
keywords: ai receptionist, ai phone answering
related: missed-call-text-back, expert-ai
cta_note: Or call [+1 737 252-4262](tel:+17372524262).
---
## What it does

Answers calls.

## FAQ

### Does it sound like a **robot**?
No — it sounds **natural**, see [the demo](/#demo).

### Can it book appointments?
Yes.
It books straight into your calendar.

## Next steps

Book a demo.
`;

const { seo, markdown } = frontMatter(body);
assert.equal(seo.title, "AI Voice Agent | SmartSyncLink");
assert.equal(seo.description, "Answers every call, 24/7.", "seo_ prefix dropped, quotes stripped");
assert.equal(seo.keywords, "ai receptionist, ai phone answering");
assert.equal(seo.related, "missed-call-text-back, expert-ai");
assert.equal(seo.cta_note, "Or call [+1 737 252-4262](tel:+17372524262).", "colons after the key survive");
assert.ok(markdown.startsWith("## What it does"), "the block is removed from the article");

assert.deepEqual(frontMatter("## Just markdown").seo, {}, "no block, no SEO");
assert.equal(frontMatter("## Just markdown").markdown, "## Just markdown");

const faq = splitFaq(markdown);
assert.equal(faq.title, "FAQ");
assert.equal(faq.items.length, 2, "stops at the next ## heading");
assert.equal(faq.items[0].q, "Does it sound like a robot?", "questions are plain text");
assert.equal(faq.items[0].a, "No — it sounds **natural**, see [the demo](/#demo).", "answers stay Markdown");
assert.equal(plain(faq.items[1].a), "Yes. It books straight into your calendar.");
assert.ok(!faq.article.includes("### Can it book"), "the questions leave the article");
assert.ok(faq.article.includes("## What it does") && faq.article.includes("## Next steps"), "the rest stays");

const empty = "## Other\n### Q\nA\n\n## FAQ\n\nAsk us anything.";
assert.deepEqual(splitFaq(empty).items, [], "only under an FAQ heading");
assert.equal(splitFaq(empty).article, empty, "an FAQ without questions stays in the article");

// sections, and the kind each one is drawn as
const sections = pageSections(
  [
    "intro line",
    "## The problem",
    "People call.",
    "- **Owner answers.** Works until it doesn't.\n- **Phone calls**, with recordings",
    "## What it does",
    "### Answers 24/7\nNights too.",
    "### Books\nOn your calendar.",
    "**Example text:**",
    '> "Hi Sarah, thanks!"',
    "## Compare",
    "| | Them | Us |\n|---|---|---|\n| Books | No | Yes |",
    "## How it works",
    '1. **Call.** We learn.\n2. **Build.** We build.\n3. **Live.** Calls answered.\n\n   > "Sorry we missed you"',
    "## In action",
    "**A med spa, Instagram DM.**",
    "> **Client:** hi\n>\n> **AI:** Hello!",
    "The AI answers.",
    "## Who it's for",
    "**Contractors.** Calls spike.",
    "**Med spas.** Clients ask.",
    "**Real estate.** Buyers call.",
    "## Connected",
    "- **[Missed Call Text Back](/solutions/missed-call-text-back)** texts back.\n- **[Expert AI](/solutions/expert-ai).** Knows things.",
    "## Checklist",
    "- One\n- Two",
    "## A note",
    "Just words.",
  ].join("\n\n"),
);
assert.deepEqual(
  sections.map((s) => s.kind),
  ["list", "features", "compare", "steps", "chats", "cards", "links", "list", "prose"],
);
assert.equal(sections[0].items[0].title, "Owner answers", "bold leads become titles, the stop dropped");
assert.equal(sections[0].items[1].body, "with recordings", "a comma after the lead is dropped too");
assert.equal(sections[1].items[1].body, "On your calendar.", "the last feature keeps one paragraph");
assert.ok(sections[1].outro.includes("Hi Sarah"), "the rest of the section follows the grid");
assert.deepEqual(sections[2].table, { head: ["", "Them", "Us"], rows: [["Books", "No", "Yes"]] });
assert.equal(sections[3].items[2].quote, "Sorry we missed you", "a quote inside a step rides with it");
assert.deepEqual(sections[4].chats[0], {
  label: "A med spa, Instagram DM",
  lines: [
    { who: "Client", text: "hi" },
    { who: "AI", text: "Hello!" },
  ],
});
assert.equal(sections[4].outro, "The AI answers.");
assert.equal(sections[6].items[1].href, "/solutions/expert-ai");
assert.equal(sections[6].items[1].body, "Knows things.");
assert.equal(sections[7].items[0].title, "", "a plain list has no titles");
assert.equal(sections[5].id, "who-it-s-for");
assert.equal(pageSections("## A\n\nOne.\n\nTwo.\n\n- x\n- y")[0].intro, "One.\n\nTwo.", "paragraphs stay apart");

console.log("solution page ok —", faq.items.length, "FAQ pairs;", sections.map((s) => s.kind).join(", "));
