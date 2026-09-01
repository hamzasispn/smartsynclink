import { defaultGlobal, type GlobalContent } from "@/content/global";
import { defaultHomeContent, type HomeContent } from "@/content/home";
import { sql } from "./db";

/**
 * Page content is one jsonb document per key.
 *
 *   global — brand, nav, footer: everything every page renders
 *   home   — the home page's own sections
 *
 * ponytail: one row per document, no per-section tables. Split further only if
 * two editors ever need to save different sections at the same time.
 */
async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const rows = await sql`select data from site_content where key = ${key}`;
    // Merge over the defaults so a key added in code shows up before the row
    // is next saved, instead of rendering as undefined.
    return rows[0]?.data ? { ...fallback, ...(rows[0].data as T) } : fallback;
  } catch (error) {
    // A dead database must not take the marketing site down.
    console.error(`content "${key}" failed, serving defaults:`, error);
    return fallback;
  }
}

async function write(key: string, data: unknown) {
  await sql`
    insert into site_content (key, data, updated_at)
    values (${key}, ${JSON.stringify(data)}::jsonb, now())
    on conflict (key) do update
      set data = excluded.data, updated_at = now()`;
}

export const getHomeContent = () => read<HomeContent>("home", defaultHomeContent);
export const saveHomeContent = (data: HomeContent) => write("home", data);

export const getGlobalContent = () => read<GlobalContent>("global", defaultGlobal);
export const saveGlobalContent = (data: GlobalContent) => write("global", data);
