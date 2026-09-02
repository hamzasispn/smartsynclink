import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// the shape neon() returns with default options: a tagged template whose rows
// come back as objects. ReturnType<typeof neon> is the wider overload union and
// loses that, which makes every rows[0] an error.
type Sql = NeonQueryFunction<false, false>;

let client: Sql | null = null;

/**
 * Connects on first query, not on import.
 *
 * Throwing at module scope took the whole production build down: `next build`
 * imports every route to collect its config, so a missing DATABASE_URL failed
 * at "Collecting page data for /api/media/[id]" before a single query ran.
 * Deferred, the error surfaces where callers already handle it — read() in
 * content.ts falls back to the built-in defaults rather than losing the site.
 *
 * Only ever used as a tagged template, so wrapping the call is enough; none of
 * the extra properties on the neon client are referenced anywhere.
 */
export const sql = ((...args: Parameters<Sql>) => {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client(...args);
}) as Sql;
