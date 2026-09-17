// One-off, from the client call: the "Did You Know" band asked the same thing
// twice, the three feature cards ran long beside their own animations, and the
// assistant orb opened a calendar instead of the assistant.
//
// Brings the live content in line with src/content/home.ts. Only the fields
// below are touched; everything else is left exactly as it is.
// Run: node --env-file=.env.local scripts/fix-bento-copy.ts
//
// There are three places the home page can read this from, and all three have
// to agree or the page keeps showing the old words:
//   layout:home  — the bento section's own props (it is an unlinked section)
//   blocks       — the linked sections, finalCta among them
//   home         — the content document the other two fall back to
import { neon } from "@neondatabase/serverless";
import { defaultHomeContent } from "../src/content/home.ts";

const sql = neon(process.env.DATABASE_URL!);

/** These documents are walked by path rather than typed: they are plain JSON. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = Record<string, any>;

const source = defaultHomeContent as unknown as Node;
const changes: string[] = [];

/** Same value in a different key order is not a change. */
const same = (a: unknown, b: unknown) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const [x, y] = [a as Node, b as Node];
  const keys = Object.keys(x);
  return keys.length === Object.keys(y).length && keys.every((k) => same(x[k], y[k]));
};

const set = (path: string, into: Node, key: string, value: unknown) => {
  if (same(into[key], value)) return;
  changes.push(`${path}: ${JSON.stringify(into[key])} → ${JSON.stringify(value)}`);
  into[key] = value;
};

/** The bento's copy, wherever a copy of it lives. */
function fixBento(bento: Node | undefined, where: string) {
  if (!bento) return;

  const band = bento.booking;
  if (band) {
    set(`${where}.booking.cta`, band, "cta", source.bento.booking.cta);
    if (band.secondary !== undefined) {
      changes.push(`${where}.booking.secondary: removed ${JSON.stringify(band.secondary)}`);
      delete band.secondary;
    }
  }

  for (const card of ["voice", "inbox", "campaigns"] as const) {
    const live = bento[card];
    if (!live) continue;
    set(`${where}.${card}.body`, live, "body", source.bento[card].body);
    set(`${where}.${card}.cta`, live, "cta", source.bento[card].cta);

    const fresh = source.bento[card].bullets as { title: string; body: string }[] | undefined;
    if (!fresh || !Array.isArray(live.bullets)) continue;
    for (const bullet of live.bullets) {
      // matched by title, so a reordered or renamed list is left alone
      const match = fresh.find((b) => b.title === bullet.title);
      if (match) set(`${where}.${card}.bullets["${bullet.title}"].body`, bullet, "body", match.body);
    }
  }
}

/** The orb's pill, which now opens the chat bot. */
function fixFinalCta(finalCta: Node | undefined, where: string) {
  if (finalCta) set(`${where}.pill`, finalCta, "pill", source.finalCta.pill);
}

async function rewrite(key: string, edit: (data: Node) => void) {
  const [row] = await sql`select data from site_content where key = ${key}`;
  if (!row) return;
  const data = row.data as Node;
  const before = JSON.stringify(data);
  edit(data);
  if (JSON.stringify(data) === before) return;
  await sql`
    update site_content set data = ${JSON.stringify(data)}::jsonb, updated_at = now()
    where key = ${key}`;
}

// the page builder's layout: both what is live and what is being edited
await rewrite("layout:home", (data) => {
  for (const mode of ["published", "draft"] as const) {
    const sections = data[mode]?.sections;
    if (!Array.isArray(sections)) continue;
    const bento = sections.find((s: Node) => s.type === "bento");
    fixBento(bento?.props, `layout:home/${mode}`);
  }
});

// the linked sections
await rewrite("blocks", (data) => {
  for (const mode of ["published", "draft"] as const) {
    fixFinalCta(data[mode]?.finalCta, `blocks/${mode}`);
  }
});

// and the document both of those fall back to
await rewrite("home", (data) => {
  fixBento(data.bento, "home");
  fixFinalCta(data.finalCta, "home");
});

console.log(changes.length ? changes.join("\n") : "already up to date");
console.log(`\n${changes.length} change(s)`);
