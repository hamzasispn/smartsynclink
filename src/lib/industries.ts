import { defaultIndustry, type IndustryContent } from "@/content/industry";
import { sql } from "./db";
import { slugify } from "./services";

export type Industry = {
  id: string;
  slug: string;
  name: string;
  excerpt: string;
  position: number;
  published: boolean;
  data: IndustryContent;
  updated_at: string;
};

/**
 * Merges a stored row over the template.
 *
 * Shallow per section rather than a deep merge: a section the row has not been
 * saved with yet falls back whole, and one it has is used as written. That is
 * what lets a field added to the template appear on rows saved before it
 * existed, without silently resurrecting an item an editor deleted from a list.
 */
function withDefaults(data: Partial<IndustryContent> | null): IndustryContent {
  const d = data ?? {};
  return {
    hero: { ...defaultIndustry.hero, ...(d.hero ?? {}) },
    problem: { ...defaultIndustry.problem, ...(d.problem ?? {}) },
    journey: { ...defaultIndustry.journey, ...(d.journey ?? {}) },
  };
}

const shape = (row: Record<string, unknown>): Industry => ({
  ...(row as Omit<Industry, "data">),
  data: withDefaults(row.data as Partial<IndustryContent> | null),
});

// see the note on listPosts — /industries pages are prerendered too, so an
// unreachable database must not take the build down
export async function listIndustries(includeDrafts = false) {
  try {
    const rows = includeDrafts
      ? await sql`select * from industries order by position, created_at`
      : await sql`select * from industries where published order by position, created_at`;
    return rows.map(shape);
  } catch (error) {
    console.error("listIndustries failed, serving an empty list:", error);
    return [] as Industry[];
  }
}

export async function getIndustry(idOrSlug: string) {
  const rows = await sql`
    select * from industries
    where slug = ${idOrSlug}
       or (${/^[0-9a-f-]{36}$/i.test(idOrSlug)} and id::text = ${idOrSlug})
    limit 1`;
  return rows[0] ? shape(rows[0]) : null;
}

export async function upsertIndustry(
  i: Partial<Omit<Industry, "data">> & { name: string; data?: IndustryContent },
) {
  const slug = i.slug?.trim() || slugify(i.name);
  const data = JSON.stringify(i.data ?? defaultIndustry);

  if (i.id) {
    await sql`
      update industries set
        slug = ${slug}, name = ${i.name}, excerpt = ${i.excerpt ?? ""},
        position = ${i.position ?? 0}, published = ${i.published ?? true},
        data = ${data}::jsonb, updated_at = now()
      where id = ${i.id}`;
    return i.id;
  }

  const rows = await sql`
    insert into industries (slug, name, excerpt, position, published, data)
    values (${slug}, ${i.name}, ${i.excerpt ?? ""}, ${i.position ?? 0},
            ${i.published ?? true}, ${data}::jsonb)
    returning id`;
  return rows[0].id as string;
}

export async function deleteIndustry(id: string) {
  await sql`delete from industries where id = ${id}`;
}
