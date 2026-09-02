import { sql } from "./db";
import { slugify } from "./services";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  tags: string[];
  status: "draft" | "published";
  source: "manual" | "autopilot";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// Same bargain content.ts makes: an unreachable database means an empty list,
// not a dead page. /blog is prerendered, so an uncaught throw here fails the
// whole production build rather than just one request.
export async function listPosts(includeDrafts = false) {
  try {
    const rows = includeDrafts
      ? await sql`select * from posts order by coalesce(published_at, created_at) desc`
      : await sql`
          select * from posts
          where status = 'published' and published_at <= now()
          order by published_at desc`;
    return rows as Post[];
  } catch (error) {
    console.error("listPosts failed, serving an empty list:", error);
    return [] as Post[];
  }
}

export async function getPost(idOrSlug: string, includeDrafts = false) {
  const rows = await sql`
    select * from posts
    where (slug = ${idOrSlug}
           or (${/^[0-9a-f-]{36}$/i.test(idOrSlug)} and id::text = ${idOrSlug}))
      and (${includeDrafts} or (status = 'published' and published_at <= now()))
    limit 1`;
  return (rows[0] as Post) ?? null;
}

/** Appends -2, -3 … until the slug is free. */
export async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "post";
  for (let n = 0; n < 50; n++) {
    const slug = n ? `${root}-${n + 1}` : root;
    const clash = await sql`
      select 1 from posts where slug = ${slug} and id::text is distinct from ${ignoreId ?? ""} limit 1`;
    if (!clash.length) return slug;
  }
  return `${root}-${Date.now()}`;
}

export async function upsertPost(p: Partial<Post> & { title: string }) {
  const status = p.status ?? "draft";
  // publishing without an explicit date means "now"
  const publishedAt =
    status === "published" ? (p.published_at ?? new Date().toISOString()) : null;

  if (p.id) {
    await sql`
      update posts set
        slug = ${p.slug || (await uniqueSlug(p.title, p.id))},
        title = ${p.title}, excerpt = ${p.excerpt ?? ""}, body = ${p.body ?? ""},
        cover = ${p.cover ?? ""}, tags = ${p.tags ?? []}, status = ${status},
        published_at = ${publishedAt}, updated_at = now()
      where id = ${p.id}`;
    return p.id;
  }

  const rows = await sql`
    insert into posts (slug, title, excerpt, body, cover, tags, status, source, published_at)
    values (${p.slug || (await uniqueSlug(p.title))}, ${p.title}, ${p.excerpt ?? ""},
            ${p.body ?? ""}, ${p.cover ?? ""}, ${p.tags ?? []}, ${status},
            ${p.source ?? "manual"}, ${publishedAt})
    returning id`;
  return rows[0].id as string;
}

export async function deletePost(id: string) {
  await sql`delete from posts where id = ${id}`;
}

export async function postCounts() {
  const rows = await sql`
    select
      count(*) filter (where status = 'published')::int as published,
      count(*) filter (where status = 'draft')::int     as drafts,
      count(*) filter (where source = 'autopilot')::int as by_ai
    from posts`;
  return rows[0] as { published: number; drafts: number; by_ai: number };
}
