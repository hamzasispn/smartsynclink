// Self-check for the solution page's Markdown conventions: `node scripts/check-solution-page.ts`
import assert from "node:assert/strict";
import { frontMatter, plain, splitFaq } from "../src/lib/solution-page.ts";

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

console.log("solution page ok — SEO block and", faq.items.length, "FAQ pairs read");
