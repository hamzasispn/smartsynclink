// Creates the content table and seeds the home page row.
// Run: npm run db:setup   (safe to re-run; only seeds when the row is missing)
import { neon } from "@neondatabase/serverless";
import { defaultHomeContent } from "../src/content/home.ts";

const sql = neon(process.env.DATABASE_URL!);

await sql`
  create table if not exists site_content (
    key        text primary key,
    data       jsonb not null,
    updated_at timestamptz not null default now()
  )`;

// --force overwrites live content with the defaults in code. Once the admin
// panel is editing rows for real, only use it deliberately.
const force = process.argv.includes("--force");
const json = JSON.stringify(defaultHomeContent);

const [row] = force
  ? await sql`
      insert into site_content (key, data)
      values ('home', ${json}::jsonb)
      on conflict (key) do update set data = excluded.data, updated_at = now()
      returning key`
  : await sql`
      insert into site_content (key, data)
      values ('home', ${json}::jsonb)
      on conflict (key) do nothing
      returning key`;

console.log(
  row
    ? `site_content.home ${force ? "overwritten from code" : "seeded"}`
    : "site_content.home already exists — left alone (pass --force to overwrite)",
);
