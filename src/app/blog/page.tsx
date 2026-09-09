import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { FinalCta } from "@/components/sections";
import {
  ColumnHead,
  FeaturedRow,
  Newsletter,
  PostCard,
  RecentRow,
} from "@/components/blog/parts";
import { Pagination, TagFilter } from "@/components/blog/filters";
import { Badge, Container } from "@/components/ui";
import { getBlogContent, getGlobalContent, getHomeContent } from "@/lib/content";
import { listPosts } from "@/lib/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — SmartSyncLink",
  description:
    "Practical insights on AI, automation, lead generation and follow-up for service businesses.",
};

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

  const perPage = Math.max(1, blog.perPage || 4);
  const totalPages = Math.max(1, Math.ceil(matching.length / perPage));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const featured = matching.slice((page - 1) * perPage, page * perPage);

  // The sidebar always shows the newest posts, whatever the filter says — it
  // is a way out of an empty result, not a second view of the same list.
  const recent = posts.slice(0, 3);
  const spotlight = posts[3] ?? posts[0] ?? null;

  const hrefFor = (n: number) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (needle) params.set("q", q!.trim());
    if (n > 1) params.set("page", String(n));
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pb-24">
        <Container>
          <div className="flex flex-col items-center pt-40 text-center">
            <Badge>{blog.badge}</Badge>
            <h1 className="mt-5 max-w-[760px] text-balance text-[34px] font-medium leading-[1.15] tracking-[-0.02em] text-ink sm:text-[42px]">
              {blog.heading}
            </h1>
            <p className="mt-5 max-w-[68ch] text-[15px] leading-[1.7] text-[#1E1E1E]">
              {blog.subheading}
            </p>
          </div>

          {tags.length ? (
            <div className="mt-14">
              <TagFilter tags={tags} active={tag ?? null} allLabel={blog.allLabel} />
            </div>
          ) : null}

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* featured column */}
            <div className="lg:col-span-8">
              <ColumnHead>{blog.featuredLabel}</ColumnHead>

              {featured.length ? (
                <div className="mt-7 flex flex-col gap-9">
                  {featured.map((post) => (
                    <FeaturedRow key={post.id} post={post} blog={blog} />
                  ))}
                </div>
              ) : (
                <p className="mt-7 rounded-2xl border border-dashed border-line px-6 py-14 text-center text-[15px] text-muted">
                  {posts.length
                    ? "Nothing matches that filter yet."
                    : "No posts published yet."}
                </p>
              )}

              <Pagination page={page} total={totalPages} hrefFor={hrefFor} />
            </div>

            {/* sidebar */}
            <aside className="flex flex-col gap-9 lg:col-span-4">
              {recent.length ? (
                <section>
                  <ColumnHead>{blog.recentLabel}</ColumnHead>
                  <div className="mt-5 flex flex-col gap-4">
                    {recent.map((post) => (
                      <RecentRow key={post.id} post={post} byline={blog.byline} />
                    ))}
                  </div>
                </section>
              ) : null}

              {spotlight ? <PostCard post={spotlight} blog={blog} /> : null}

              <section>
                <ColumnHead rule={false}>{blog.newsletter.label}</ColumnHead>
                <div className="mt-5">
                  <Newsletter blog={blog} />
                </div>
              </section>
            </aside>
          </div>
        </Container>

        <div className="mt-24">
          <FinalCta data={home.finalCta} />
        </div>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
