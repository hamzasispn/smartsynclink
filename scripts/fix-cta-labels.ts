// One-off: the live CTA labels were written before the wording was settled.
// Renames them wherever they are stored — page documents and industry rows —
// and points the demo buttons at the booking calendar, since they now say
// "Book a … call". Anything already renamed is left alone.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

/** label as stored → what it becomes. An href of "" keeps the current one. */
const RENAMES: Record<string, { label: string; href: string }> = {
  "Watch 3-Minute Demo": { label: "Book A 15-Min Demo Call", href: "#call" },
  "Watch 3-Min Demo": { label: "Book A 15-Min Demo Call", href: "#call" },
  "Try Now": { label: "Book A Demo Call", href: "#call" },
  "Book Now": { label: "Get More Booking", href: "" },
  "Book a Appointment": { label: "Book An Appointment", href: "" },
  "Book an Appointment": { label: "Book An Appointment", href: "" },
};

const changes: string[] = [];

/** Rewrites every {label, href} pair in place; nav and footer links are pairs too, so only known labels move. */
function walk(node: unknown, path: string) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  const record = node as Record<string, unknown>;
  const rename = typeof record.label === "string" ? RENAMES[record.label] : undefined;
  if (rename && typeof record.href === "string") {
    changes.push(`${path}: "${record.label}" → "${rename.label}"${rename.href ? ` (${record.href} → ${rename.href})` : ""}`);
    record.label = rename.label;
    if (rename.href) record.href = rename.href;
  }
  for (const [key, value] of Object.entries(record)) walk(value, `${path}.${key}`);
}

for (const row of await sql`select key, data from site_content`) {
  const before = JSON.stringify(row.data);
  walk(row.data, row.key);
  const after = JSON.stringify(row.data);
  if (before === after) continue;
  await sql`update site_content set data = ${after}::jsonb, updated_at = now() where key = ${row.key}`;
}

for (const row of await sql`select id, slug, data from industries`) {
  const before = JSON.stringify(row.data);
  walk(row.data, `industry:${row.slug}`);
  const after = JSON.stringify(row.data);
  if (before === after) continue;
  await sql`update industries set data = ${after}::jsonb where id = ${row.id}`;
}

console.log(changes.length ? changes.join("\n") : "nothing to rename");
console.log(`${changes.length} button(s) renamed`);
