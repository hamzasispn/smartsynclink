// One-off: the stored footer links "Cookie Policy" to /cookies, which never
// existed. Points it (live and draft header/footer) at the real /cookie-policy page.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

for (const key of ["global", "global:draft"]) {
  const [row] = await sql`select data from site_content where key = ${key}`;
  if (!row) {
    console.log(key, "— no row");
    continue;
  }
  const json = JSON.stringify(row.data).replaceAll('"href":"/cookies"', '"href":"/cookie-policy"');
  await sql`update site_content set data = ${json}::jsonb, updated_at = now() where key = ${key}`;
  console.log(key, "cookie links:", json.split('"/cookie-policy"').length - 1);
}
