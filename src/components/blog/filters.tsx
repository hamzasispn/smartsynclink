import Link from "next/link";

/**
 * Category pills and pagination.
 *
 * Both are plain links carrying query parameters, not client state. That keeps
 * every filtered page shareable and crawlable, and the blog index stays a
 * server component with no JavaScript of its own.
 */

export function TagFilter({
  tags,
  active,
  allLabel,
}: {
  tags: string[];
  active: string | null;
  allLabel: string;
}) {
  const pill = (on: boolean) =>
    `rounded-full px-4 py-2 text-[13px] transition-colors ${
      on
        ? "bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white"
        : "bg-surface text-[#1E1E1E] hover:bg-black/[0.06]"
    }`;

  return (
    <nav aria-label="Article categories" className="flex flex-wrap gap-2.5">
      <Link href="/blog" className={pill(!active)}>
        {allLabel}
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={pill(active === tag)}
          aria-current={active === tag ? "page" : undefined}
        >
          {tag}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Numbered pages with an ellipsis once the run gets long.
 *
 * The window is the first page, the last three, and whatever surrounds the
 * current one — the design shows "1 2 3 … 8 9 10", which is that rule at ten
 * pages. Fewer pages simply means no gap appears.
 */
function pageList(current: number, total: number): (number | "gap")[] {
  const keep = new Set<number>([1, total - 2, total - 1, total, current - 1, current, current + 1]);
  const pages = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  pages.forEach((n, i) => {
    if (i && n - (pages[i - 1] as number) > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export function Pagination({
  page,
  total,
  hrefFor,
}: {
  page: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  if (total <= 1) return null;

  const step =
    "inline-flex items-center gap-2 text-[14px] text-[#1E1E1E] transition-colors hover:text-brand";
  const dim = "inline-flex items-center gap-2 text-[14px] text-muted";

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-between border-t border-line pt-6"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={step}>
          <span aria-hidden="true">←</span> Previous
        </Link>
      ) : (
        <span className={dim} aria-disabled="true">
          <span aria-hidden="true">←</span> Previous
        </span>
      )}

      <ol className="flex items-center gap-1.5">
        {pageList(page, total).map((entry, i) =>
          entry === "gap" ? (
            <li key={`gap-${i}`} className="px-1 text-[14px] text-muted">
              …
            </li>
          ) : (
            <li key={entry}>
              <Link
                href={hrefFor(entry)}
                aria-current={entry === page ? "page" : undefined}
                className={`grid size-8 place-items-center rounded-[7px] text-[14px] transition-colors ${
                  entry === page
                    ? "bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white"
                    : "text-[#1E1E1E] hover:bg-surface"
                }`}
              >
                {entry}
              </Link>
            </li>
          ),
        )}
      </ol>

      {page < total ? (
        <Link href={hrefFor(page + 1)} className={step}>
          Next <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className={dim} aria-disabled="true">
          Next <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  );
}

/**
 * Sidebar search on the single post page — a GET back to the index.
 *
 * One tall pill on a soft ground, matching the reference: the field is the
 * control, not a small box inside a bordered card.
 */
export function SearchBox({
  placeholder,
  defaultValue = "",
}: {
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <form action="/blog" className="rounded-[16px] bg-surface p-3">
      <label className="sr-only" htmlFor="blog-search">
        Search articles
      </label>
      <input
        id="blog-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-full bg-white px-6 py-3.5 text-[15px] text-ink outline-none placeholder:text-[#BFBFBF] focus-visible:ring-2 focus-visible:ring-brand"
      />
    </form>
  );
}
