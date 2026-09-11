// Self-check for the article table of contents: `node scripts/check-toc.ts`
// The anchors the sidebar links to and the ids stamped on the headings come
// from two different passes, so the one thing worth asserting is that they
// still agree — a drift there is a sidebar full of dead links.
import assert from "node:assert/strict";
import { marked } from "marked";
import { tableOfContents } from "../src/lib/toc.ts";

const body = [
  "Intro paragraph.",
  "",
  "## First Section",
  "Text.",
  "### A Detail",
  "## First Section",       // duplicate title, must not duplicate the anchor
  "```",
  "## not a heading",       // inside a fence
  "```",
  "### Wrap Up!",
].join("\n");

const items = tableOfContents(body);
assert.deepEqual(
  items.map((i) => `${i.level}:${i.id}`),
  ["2:first-section", "3:a-detail", "2:first-section-2", "3:wrap-up"],
  "headings, levels and de-duplicated anchors",
);

// the same injection the Prose component does
let html = marked.parse(body, { async: false, gfm: true }) as string;
let i = 0;
html = html.replace(/<h([23])>/g, (tag, level) => {
  const item = items[i++];
  return item && String(item.level) === level ? `<h${level} id="${item.id}">` : tag;
});

for (const item of items) {
  assert.ok(html.includes(`id="${item.id}"`), `#${item.id} exists in the rendered body`);
}
assert.ok(!html.includes('id="not-a-heading"'), "fenced code is not a heading");

console.log("toc ok:", items.length, "anchors");
