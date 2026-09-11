// One-off: point the header CTA at the booking popup (#contact).
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`
  UPDATE site_content
  SET data = jsonb_set(data, '{nav,cta,href}', '"#contact"')
  WHERE key = 'global'
  RETURNING data->'nav'->'cta' AS cta`;
console.log(rows[0]?.cta ?? "no global row");
