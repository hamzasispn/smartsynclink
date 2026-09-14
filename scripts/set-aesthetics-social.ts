// One-off: gives the aesthetics industry its Instagram and Facebook profiles.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const social = {
  instagram: "https://www.instagram.com/smart.synclink.aesthetics/",
  facebook: "https://www.facebook.com/people/Smart-Synclink-Aesthetics/61593243239672/",
};

const rows = await sql`
  update industries
  set data = jsonb_set(coalesce(data, '{}'::jsonb), '{social}', ${JSON.stringify(social)}::jsonb), updated_at = now()
  where slug = 'aesthetics'
  returning data->'social' as social`;
console.log(rows[0]?.social ?? "no aesthetics row");
