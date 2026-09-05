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
/**
 * Fills in anything the stored document is missing, at any depth.
 *
 * A one level spread was not enough: a stored `bento` replaced the default
 * `bento` whole, so a field added to a section in code read as undefined
 * until someone wrote a migration for it. Merging all the way down means new
 * fields simply appear.
 *
 * Arrays are taken from the stored side untouched, never merged element by
 * element — an editor who deletes the fourth card means it, and a positional
 * merge would quietly bring the default back.
 */
function fill<T>(stored: unknown, fallback: T): T {
  if (Array.isArray(fallback) || Array.isArray(stored)) {
    return (stored === undefined ? fallback : stored) as T;
  }
  if (!isPlainObject(stored) || !isPlainObject(fallback)) {
    return (stored === undefined ? fallback : stored) as T;
  }
  const out: Record<string, unknown> = { ...stored };
  for (const [key, value] of Object.entries(fallback)) {
    out[key] = fill(stored[key], value);
  }
  return out as T;
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const rows = await sql`select data from site_content where key = ${key}`;
    return rows[0]?.data ? fill(rows[0].data, fallback) : fallback;
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
