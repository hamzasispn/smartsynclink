import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { FinalCta } from "@/components/sections";
import { NewsletterBand, PostTile } from "@/components/blog/parts";
import { Badge } from "@/components/ui";
import { CirclePagination, TabRow } from "@/components/blog/filters";
import { getBlogContent, getGlobalContent, getHomeContent } from "@/lib/content";
import { listPosts } from "@/lib/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — SmartSyncLink",
  description:
    "Practical insights on AI, automation, lead generation and follow-up for service businesses.",
};

/**
 * The blog index.
 *
 * A dark title band, a tab bar of categories with search, then one grid of
 * cards split by the newsletter band. 1200 of container with 20 of padding
 * makes 1160 of content, which is two 560 cards and the 40 between them.
 */
export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string; q?: string }>;
}) {
  const { tag, page: pageParam, q } = await searchParams;
  const [global, home, blog, posts] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getBlogContent(),
    listPosts(),
  ]);

  // Every tag any published post carries, in the order they first appear —
  // alphabetical would put "AI & Automation" wherever the alphabet says, and
  // the editor's own ordering is more useful than that.
  const tags = [...new Set(posts.flatMap((post) => post.tags))];

  const needle = (q ?? "").trim().toLowerCase();
  const matching = posts.filter((post) => {
    if (tag && !post.tags.includes(tag)) return false;
    if (!needle) return true;
    return `${post.title} ${post.excerpt}`.toLowerCase().includes(needle);
  });

  const perPage = Math.max(1, blog.perPage || 10);
  const totalPages = Math.max(1, Math.ceil(matching.length / perPage));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const shown = matching.slice((page - 1) * perPage, page * perPage);

  const split = Math.max(0, blog.beforeNewsletter ?? 4);
  const above = shown.slice(0, split);
  const below = shown.slice(split);

  const hrefFor = (n: number) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (needle) params.set("q", q!.trim());
    if (n > 1) params.set("page", String(n));
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  const grid = "grid gap-x-10 gap-y-13 md:grid-cols-2";

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pb-24">
        {/* page title — the same badge + heading the sections use, left aligned
            rather than centred, on the page's own background */}
        <section className="mx-auto w-full max-w-[1200px] px-5 pt-[168px] pb-4">
          <Badge>{blog.badge}</Badge>
          <h1 className="mt-6 max-w-[18ch] text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[60px]">
            {blog.heading}
          </h1>
          <p className="mt-5 max-w-[70ch] text-[16px] leading-[1.7] text-[#1E1E1E]">
            {blog.subheading}
          </p>
        </section>

        <TabRow
          tags={tags}
          active={tag ?? null}
          allLabel={blog.allLabel}
          placeholder={blog.search.placeholder}
          query={q ?? ""}
        />

        <div className="mx-auto w-full max-w-[1200px] px-5 pt-12">
          {above.length ? (
            <div className={grid}>
              {above.map((post) => (
                <PostTile key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="rounded-[10px] border border-dashed border-line px-6 py-16 text-center text-[16px] text-muted">
              {posts.length
                ? "Nothing matches that filter yet."
                : "No posts published yet."}
            </p>
          )}
        </div>

        {above.length ? <NewsletterBand blog={blog} /> : null}

        <div className="mx-auto w-full max-w-[1200px] px-5">
          {below.length ? (
            <div className={`${grid} pt-16`}>
              {below.map((post) => (
                <PostTile key={post.id} post={post} />
              ))}
            </div>
          ) : null}

          <CirclePagination page={page} total={totalPages} hrefFor={hrefFor} />
        </div>

        <div className="mt-24">
          <FinalCta data={home.finalCta} />
        </div>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
