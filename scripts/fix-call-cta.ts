// One-off: split the two bookings apart. "Book a call" buttons get their own
// widget (#call); "Book an appointment" / "Book now" keep #contact.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const CALL_URL = "https://link.smartsynclink.com/widget/booking/MVbnzZUSVYjA4pVXK9b2";

const rows = await sql`SELECT data FROM site_content WHERE key = 'home'`;
if (!rows[0]) throw new Error("no home row");

const walk = (node: unknown): void => {
  if (Array.isArray(node)) return node.forEach(walk);
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  if (typeof obj.label === "string" && obj.href === "#contact" && /\bcall\b/i.test(obj.label)) {
    obj.href = "#call";
  }
  Object.values(obj).forEach(walk);
};

const data = rows[0].data as Record<string, any>;
walk(data);
data.calendar = { ...data.calendar, callEmbedUrl: CALL_URL };

await sql`UPDATE site_content SET data = ${JSON.stringify(data)}::jsonb WHERE key = 'home'`;
console.log("calendar:", data.calendar);
console.log("#call links:", JSON.stringify(data).split('"#call"').length - 1);
