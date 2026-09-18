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

/**
 * How many results to weigh up per query.
 *
 * It used to ask for one, which is why the blog filled with the same few
 * pictures: posts share tags, and the first result for "med spa" is the first
 * result for "med spa" every time. A page of them plus the set of covers
 * already in use gives each post its own.
 */
const CHOICES = 30;

export const pexelsReady = () => Boolean(process.env.PEXELS_API_KEY);

async function search(query: string): Promise<string[]> {
  const response = await fetch(
    `${ENDPOINT}?query=${encodeURIComponent(query)}&per_page=${CHOICES}&orientation=landscape&size=medium`,
    { headers: { Authorization: process.env.PEXELS_API_KEY! }, cache: "no-store" },
  );
  if (!response.ok) throw new Error(`pexels ${response.status}`);

  const photos = (await response.json())?.photos;
  return Array.isArray(photos)
    ? photos.map((p) => p?.src?.large2x ?? p?.src?.large).filter(Boolean)
    : [];
}

/**
 * The first query that finds a photograph nobody else is using wins, so pass
 * the post's own words first and something generic last. Pexels matches
 * keywords rather than sentences — a headline finds nothing, a tag like
 * "med spa" finds plenty.
 *
 * `taken` is the covers already on other posts. A query whose whole page is
 * spoken for falls through to the next one rather than repeating a picture.
 */
export async function findCover(
  queries: string[],
  taken: Iterable<string> = [],
): Promise<string | null> {
  if (!pexelsReady()) return null;
  const used = new Set(taken);

  for (const query of queries.map((q) => q.trim()).filter(Boolean)) {
    try {
      const found = (await search(query)).find((url) => !used.has(url));
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
