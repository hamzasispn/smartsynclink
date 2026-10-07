// Self-check for "Customize with AI"'s safety net: `node scripts/check-conform.ts`
import assert from "node:assert/strict";
import { conform, conformCustom, mediaOf } from "../src/lib/builder/conform.ts";
import { COLUMN_WIDTHS, CUSTOM_PRESETS, SECTION_FIELDS, WIDGETS } from "../src/lib/builder/widgets.ts";

const shape = {
  heading: "Heading",
  cta: { label: "Book", href: "#call" },
  image: { src: "", alt: "" },
  bullets: [{ title: "One", body: "Text" }],
  tags: ["a"],
  count: 3,
};
const current = {
  heading: "Old heading",
  cta: { label: "Book A Demo", href: "#call" },
  image: { src: "/images/a.webp", alt: "A" },
  bullets: [
    { title: "First", body: "One" },
    { title: "Second", body: "Two" },
  ],
  tags: ["x"],
  count: 3,
  legacy: "kept", // a key the defaults do not list
};
const media = mediaOf(current);
const fit = (answer: unknown) => conform(answer, shape, current, media) as typeof current;

// the asked-for change goes through, the rest stays
const changed = fit({ ...current, heading: "New heading" });
assert.equal(changed.heading, "New heading");
assert.deepEqual(changed.bullets, current.bullets);
assert.equal(changed.legacy, "kept", "keys the defaults do not know survive");

// keys the section does not have are dropped; missing keys keep their value
const extra = fit({ heading: "H", address: "8911 N Capital of Texas Hwy" }) as Record<string, unknown>;
assert.ok(!("address" in extra), "no new fields");
assert.deepEqual(extra.cta, current.cta, "an omitted key keeps its current value");

// wrong types fall back
const typed = fit({ ...current, heading: 42, count: "three", bullets: "none", cta: "Book" });
assert.equal(typed.heading, "Old heading");
assert.equal(typed.count, 3);
assert.deepEqual(typed.bullets, current.bullets);
assert.deepEqual(typed.cta, current.cta);

// pictures can be moved or removed, never invented
assert.equal(fit({ ...current, image: { src: "https://made.up/x.jpg", alt: "B" } }).image.src, "/images/a.webp");
assert.equal(fit({ ...current, image: { src: "", alt: "" } }).image.src, "");
assert.equal(fit({ ...current, image: { src: "/images/a.webp", alt: "New alt" } }).image.alt, "New alt");

// links have to be somewhere the site can go
assert.equal(fit({ ...current, cta: { label: "Plans", href: "/pricing-table" } }).cta.href, "/pricing-table");
assert.equal(fit({ ...current, cta: { label: "Plans", href: "javascript:alert(1)" } }).cta.href, "#call");

// lists grow, shrink and reorder; new items follow the item shape
const grown = fit({ ...current, bullets: [...current.bullets, { title: "Third" }, "junk"] });
assert.equal(grown.bullets.length, 4);
assert.deepEqual(grown.bullets[2], { title: "Third", body: "Text" }, "a missing field comes from the item shape");
assert.deepEqual(grown.bullets[3], { title: "One", body: "Text" }, "a non-object item becomes the item shape");
assert.equal(fit({ ...current, bullets: [current.bullets[1]] }).bullets.length, 1);
assert.deepEqual(fit({ ...current, tags: ["x", 5, "y"] }).tags, ["x", "a", "y"], "list values keep their type");
assert.equal(fit({ ...current, bullets: Array.from({ length: 99 }, () => ({ title: "t", body: "b" })) }).bullets.length, 40);

// a list the defaults leave empty cannot be checked, so it is left alone
assert.deepEqual(conform({ videos: [{ src: "x" }] }, { videos: [] }, { videos: [] }, new Set()), { videos: [] });

// a whole section built by the AI
const { columns: _none, ...sectionDefaults } = CUSTOM_PRESETS[0].build();
const { embed: _embed, ...widgets } = WIDGETS;
const cat = {
  widgets,
  sectionFields: SECTION_FIELDS,
  sectionDefaults,
  columnWidths: COLUMN_WIDTHS.map((w) => w.value),
  icons: ["phone", "calendar", "sparkle"],
};
const built = conformCustom(
  {
    background: "neon", // not offered
    textAlign: "center",
    width: "narrow",
    columns: [
      {
        width: "7", // not on the grid
        widgets: [
          { type: "heading", text: "Never miss a call", size: "huge", level: "h2" },
          { type: "embed", html: "<script>alert(1)</script>" }, // not allowed to the AI
          { type: "marquee", text: "?" }, // no such block
          { type: "features", style: "bento", items: [{ icon: "rocket", title: "Fast", text: "Quick." }, { icon: "phone", title: "Calls" }] },
          { type: "image", image: { src: "https://made.up/x.png", alt: "x" } },
        ],
      },
      { width: "6", widgets: [{ type: "nope" }] }, // ends up empty
    ],
  },
  cat,
  new Set(["/api/media/ok.webp"]),
) as { background: string; textAlign: string; columns: { width: string; widgets: Record<string, unknown>[] }[] };
assert.equal(built.background, "none", "a background the section doesn't offer falls back");
assert.equal(built.textAlign, "center");
assert.equal(built.columns.length, 1, "a column with no real blocks is dropped");
assert.equal(built.columns[0].width, "12", "widths come from the grid");
assert.deepEqual(built.columns[0].widgets.map((w) => w.type), ["heading", "features"], "unknown blocks, embeds and empty images dropped");
assert.equal(built.columns[0].widgets[0].size, "lg", "a size the heading doesn't offer falls back");
const items = built.columns[0].widgets[1].items as Record<string, unknown>[];
assert.equal(items[0].icon, "phone", "an icon that doesn't exist falls back");
assert.equal(items[1].text, "The AI picks up on the first ring, day or night.", "a missing field comes from the block's own items");
const pictured = conformCustom(
  { columns: [{ width: "12", widgets: [{ type: "image", image: { src: "/api/media/ok.webp", alt: "Team" } }] }] },
  cat,
  new Set(["/api/media/ok.webp"]),
) as { columns: { widgets: { image: { src: string } }[] }[] };
assert.equal(pictured.columns[0].widgets[0].image.src, "/api/media/ok.webp", "a supplied image is used");
assert.ok(built.columns[0].widgets.every((w) => typeof w.id === "string" && w.id.startsWith("w-")), "fresh ids");

console.log("conform ok");
