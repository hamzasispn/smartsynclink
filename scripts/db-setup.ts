// Creates every application table and seeds the home page row.
// Run: npm run db:setup            (safe to re-run)
//      npm run db:setup -- --force (overwrite home content from code)
//
// Auth tables are NOT created here — Neon Auth provisions and owns the
// better-auth schema under neon_auth.
import { neon } from "@neondatabase/serverless";
import { defaultIndustry } from "../src/content/industry.ts";
import { defaultGlobal } from "../src/content/global.ts";
import { defaultHomeContent } from "../src/content/home.ts";

const sql = neon(process.env.DATABASE_URL!);

await sql`create extension if not exists pgcrypto`;

/* ------------------------------------------------------------------ auth -- */

// Neon Auth provisions the better-auth tables, but from an older release than
// the one we depend on: its `account` table predates the `issuer` column, and
// better-auth's INSERT lists it, so every sign-up fails with
// `column "issuer" of relation "account" does not exist`.
// Adding it is the whole delta — `npm run db:setup` re-adds it if Neon ever
// re-syncs the schema.
await sql`alter table neon_auth.account add column if not exists issuer text`;

/* ---------------------------------------------------------- page content -- */

await sql`
  create table if not exists site_content (
    key        text primary key,
    data       jsonb not null,
    updated_at timestamptz not null default now()
  )`;

/* -------------------------------------------------------------- services -- */

await sql`
  create table if not exists services (
    id         uuid primary key default gen_random_uuid(),
    slug       text unique not null,
    title      text not null,
    excerpt    text not null default '',
    body       text not null default '',
    image      text not null default '',
    position   int  not null default 0,
    published  boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`;
await sql`create index if not exists services_published_idx on services (published, position)`;

/* ------------------------------------------------------------ industries -- */

// One row per industry landing page. The three per-industry sections live in
// `data`; everything below them on the page is read from the home document.
await sql`
  create table if not exists industries (
    id         uuid primary key default gen_random_uuid(),
    slug       text unique not null,
    name       text not null,
    excerpt    text not null default '',
    position   int  not null default 0,
    published  boolean not null default true,
    data       jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`;
await sql`create index if not exists industries_published_idx on industries (published, position)`;

// Seeds the template once. `do nothing` so re-running setup never wipes edits.
await sql`
  insert into industries (slug, name, excerpt, position, data)
  values ('aesthetics', 'Aesthetics',
          'Turn treatment interest into booked appointments.', 0,
          ${JSON.stringify(defaultIndustry)}::jsonb)
  on conflict (slug) do nothing`;

/* ------------------------------------------------------------------ blog -- */

await sql`
  create table if not exists posts (
    id           uuid primary key default gen_random_uuid(),
    slug         text unique not null,
    title        text not null,
    excerpt      text not null default '',
    body         text not null default '',
    cover        text not null default '',
    tags         text[] not null default '{}',
    status       text not null default 'draft',
    source       text not null default 'manual',
    published_at timestamptz,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
  )`;
await sql`create index if not exists posts_feed_idx on posts (status, published_at desc)`;

/* ---------------------------------------------------------------- media -- */

// Uploads live in Postgres rather than on disk: the filesystem is read-only on
// most hosts we might deploy to, and this keeps images in the same backup as
// the content that references them. Files are downscaled to webp on the way
// in, so rows stay small.
await sql`
  create table if not exists media (
    id         uuid primary key default gen_random_uuid(),
    filename   text not null,
    mime       text not null default 'image/webp',
    width      int,
    height     int,
    bytes      int not null,
    data       bytea not null,
    created_at timestamptz not null default now()
  )`;
await sql`create index if not exists media_recent_idx on media (created_at desc)`;

/* ------------------------------------------------------------ ai config -- */

// Single-row connection settings. Separate from blog_autopilot, which holds
// the writing brief — one is "which model", the other is "what to write".
await sql`
  create table if not exists ai_settings (
    id         int primary key default 1 check (id = 1),
    provider   text not null default 'anthropic',
    base_url   text not null default '',
    api_key    text not null default '',
    model      text not null default 'claude-opus-5',
    updated_at timestamptz not null default now()
  )`;
await sql`insert into ai_settings (id) values (1) on conflict (id) do nothing`;

/* ---------------------------------------------------------- ai autopilot -- */

// Single-row config table: the id check keeps it that way.
await sql`
  create table if not exists blog_autopilot (
    id           int primary key default 1 check (id = 1),
    enabled      boolean not null default false,
    every_hours  int not null default 24,
    topics       text[] not null default '{}',
    tone         text not null default 'Practical and direct. No hype, no filler.',
    audience     text not null default 'Small business owners who are not technical',
    words        int not null default 900,
    auto_publish boolean not null default false,
    model        text not null default 'claude-opus-5',
    last_run_at  timestamptz,
    next_run_at  timestamptz,
    last_error   text,
    updated_at   timestamptz not null default now()
  )`;
await sql`insert into blog_autopilot (id) values (1) on conflict (id) do nothing`;

/* ------------------------------------------------------- global content -- */

// brand/nav/footer used to live inside the home document. Lift them into their
// own row before seeding, so edits already made in the dashboard survive.
await sql`
  insert into site_content (key, data)
  select 'global', jsonb_build_object(
           'brand',  coalesce(data->'brand',  '{}'::jsonb),
           'nav',    coalesce(data->'nav',    '{}'::jsonb),
           'footer', coalesce(data->'footer', '{}'::jsonb))
  from site_content
  where key = 'home' and data ? 'brand'
  on conflict (key) do nothing`;

await sql`
  update site_content
  set data = data - 'brand' - 'nav' - 'footer', updated_at = now()
  where key = 'home' and (data ? 'brand' or data ? 'nav' or data ? 'footer')`;

const [g] = await sql`
  insert into site_content (key, data)
  values ('global', ${JSON.stringify(defaultGlobal)}::jsonb)
  on conflict (key) do nothing
  returning key`;
if (g) console.log("site_content.global seeded");

// A brand row lifted from an older home document has no logo fields yet.
await sql`
  update site_content
  set data = jsonb_set(
        data, '{brand}',
        ${JSON.stringify(defaultGlobal.brand)}::jsonb || coalesce(data->'brand', '{}'::jsonb))
  where key = 'global'`;

// Nav items gained a `children` list. Add it where it is missing, without
// touching the labels and hrefs someone may already have edited.
await sql`
  update site_content
  set data = jsonb_set(data, '{nav,items}', (
        select coalesce(jsonb_agg(
          case when item ? 'children' then item
               else (item - 'hasMenu') || '{"children": []}'::jsonb end
        ), '[]'::jsonb)
        from jsonb_array_elements(data->'nav'->'items') item))
  where key = 'global' and data->'nav' ? 'items'`;

// Nav gained a mega-menu flag and per-child icon/description. Fill in the
// flag everywhere, and seed the Solution panel from code if it is still empty
// — that panel's contents are design, not something to retype by hand.
await sql`
  update site_content
  set data = jsonb_set(data, '{nav,items}', (
        select coalesce(jsonb_agg(
          case
            when item->>'label' = 'Solution' and coalesce(jsonb_array_length(item->'children'), 0) = 0
              then item || ${JSON.stringify({
                mega: true,
                children: defaultGlobal.nav.items.find((i) => i.label === "Solution")?.children ?? [],
              })}::jsonb
            when item ? 'mega' then item
            else item || '{"mega": false}'::jsonb
          end
        ), '[]'::jsonb)
        from jsonb_array_elements(data->'nav'->'items') item))
  where key = 'global' and data->'nav' ? 'items'`;

// The hero backdrop moved from a hard-coded CSS url into editable content.
await sql`
  update site_content
  set data = jsonb_set(
        jsonb_set(data, '{hero,backgrounds}',
          ${JSON.stringify(defaultHomeContent.hero.backgrounds)}::jsonb),
        '{hero,backgroundSeconds}', to_jsonb(7))
  where key = 'home' and not (data->'hero' ? 'backgrounds')`;

/* ------------------------------------------------------------------ seed -- */

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
console.log("tables ready: site_content, services, posts, blog_autopilot, ai_settings, media");
