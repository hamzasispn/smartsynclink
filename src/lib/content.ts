import { defaultHomeContent, type HomeContent } from "@/content/home";
import { sql } from "./db";

/**
 * Whole-page content is one jsonb document keyed by page name.
 * ponytail: single row per page, no per-section tables. Split it up only if the
 * admin panel ever needs to edit two sections concurrently.
 */
export async function getHomeContent(): Promise<HomeContent> {
  try {
    const rows = await sql`select data from site_content where key = 'home'`;
    return (rows[0]?.data as HomeContent) ?? defaultHomeContent;
  } catch (error) {
    // A dead DB must not take the marketing site down.
    console.error("getHomeContent failed, serving defaults:", error);
    return defaultHomeContent;
  }
}

export async function saveHomeContent(data: HomeContent): Promise<void> {
  await sql`
    insert into site_content (key, data, updated_at)
    values ('home', ${JSON.stringify(data)}::jsonb, now())
    on conflict (key) do update
      set data = excluded.data, updated_at = now()`;
}
