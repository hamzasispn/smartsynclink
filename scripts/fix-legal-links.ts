// One-off: the stored global document still links the footer's legal entries
// to /privacy and /terms, which never existed. Points them at the real pages.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const [row] = await sql`select data from site_content where key = 'global'`;
if (!row) throw new Error("no global row");

const json = JSON.stringify(row.data)
  .replaceAll('"href":"/privacy"', '"href":"/privacy-policy"')
  .replaceAll('"href":"/terms"', '"href":"/terms-and-conditions"');

await sql`update site_content set data = ${json}::jsonb, updated_at = now() where key = 'global'`;
console.log("privacy links:", json.split('"/privacy-policy"').length - 1, "terms links:", json.split('"/terms-and-conditions"').length - 1);
