import { sql } from "./db";

export type Service = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  position: number;
  published: boolean;
  updated_at: string;
};

/** Turns a title into a url-safe slug. Callers must still handle collisions. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listServices(includeDrafts = false) {
  const rows = includeDrafts
    ? await sql`select * from services order by position, created_at`
    : await sql`select * from services where published order by position, created_at`;
  return rows as Service[];
}

export async function getService(idOrSlug: string) {
  const rows = await sql`
    select * from services
    where slug = ${idOrSlug}
       or (${/^[0-9a-f-]{36}$/i.test(idOrSlug)} and id::text = ${idOrSlug})
    limit 1`;
  return (rows[0] as Service) ?? null;
}

export async function upsertService(s: Partial<Service> & { title: string }) {
  const slug = s.slug?.trim() || slugify(s.title);
  if (s.id) {
    await sql`
      update services set
        slug = ${slug}, title = ${s.title}, excerpt = ${s.excerpt ?? ""},
        body = ${s.body ?? ""}, image = ${s.image ?? ""},
        position = ${s.position ?? 0}, published = ${s.published ?? true},
        updated_at = now()
      where id = ${s.id}`;
    return s.id;
  }
  const rows = await sql`
    insert into services (slug, title, excerpt, body, image, position, published)
    values (${slug}, ${s.title}, ${s.excerpt ?? ""}, ${s.body ?? ""},
            ${s.image ?? ""}, ${s.position ?? 0}, ${s.published ?? true})
    returning id`;
  return rows[0].id as string;
}

export async function deleteService(id: string) {
  await sql`delete from services where id = ${id}`;
}
