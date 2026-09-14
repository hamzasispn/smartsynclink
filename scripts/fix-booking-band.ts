// One-off: the home row still stores the old booking band copy, which would
// override the "Did You Know?" layout's seed. Merges only the band's fields.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const patch = {
  eyebrow: "Did You Know?",
  heading:
    "Businesses that reply in under a minute book 57% more appointments. Here's how SmartSyncLink gets you there.",
  highlight: "57%",
  secondary: { label: "Watch 3-Minute Demo", href: "#demo" },
};

const rows = await sql`
  UPDATE site_content
  SET data = jsonb_set(data, '{bento,booking}', coalesce(data->'bento'->'booking', '{}'::jsonb) || ${JSON.stringify(patch)}::jsonb)
  WHERE key = 'home'
  RETURNING data->'bento'->'booking' AS booking`;
console.log(rows[0]?.booking ?? "no home row");
