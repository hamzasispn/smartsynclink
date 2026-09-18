/**
 * Cover photographs for posts, from Pexels.
 *
 * Server-side only: PEXELS_API_KEY is a key, not a public token. Without it
 * every call returns null and posts simply keep the placeholder they have —
 * a missing photo is not worth failing a blog run over.
 *
 * Pexels photos are free to use and attribution is not required, so the URL is
 * all we store. next.config.ts has to allow images.pexels.com, because covers
 * go through next/image.
 */
const ENDPOINT = "https://api.pexels.com/v1/search";

export const pexelsReady = () => Boolean(process.env.PEXELS_API_KEY);

async function search(query: string): Promise<string | null> {
  const response = await fetch(
    `${ENDPOINT}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&size=medium`,
    { headers: { Authorization: process.env.PEXELS_API_KEY! }, cache: "no-store" },
  );
  if (!response.ok) throw new Error(`pexels ${response.status}`);

  const photo = (await response.json())?.photos?.[0];
  return photo?.src?.large2x ?? photo?.src?.large ?? null;
}

/**
 * The first query that finds anything wins, so pass the post's own words first
 * and something generic last. Pexels matches keywords rather than sentences —
 * a headline finds nothing, a tag like "med spa" finds plenty.
 */
export async function findCover(queries: string[]): Promise<string | null> {
  if (!pexelsReady()) return null;

  for (const query of queries.map((q) => q.trim()).filter(Boolean)) {
    try {
      const found = await search(query);
      if (found) return found;
    } catch (error) {
      console.error(`pexels search "${query}" failed:`, error);
      return null;
    }
  }
  return null;
}

/** What to look for, given a post: its tags, then a safe fallback. */
export const coverQueries = (tags: string[] = []) => [...tags, "modern office desk"];
