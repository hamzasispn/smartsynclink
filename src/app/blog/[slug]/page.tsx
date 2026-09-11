import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { FinalCta } from "@/components/sections";
import { Prose } from "@/components/prose";
import { TableOfContents } from "@/components/blog/toc";
import { NewsletterBand, PostTile } from "@/components/blog/parts";
import { Media } from "@/components/ui";
import { getBlogContent, getGlobalContent, getHomeContent } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getPost, listPosts } from "@/lib/posts";
import { tableOfContents } from "@/lib/toc";

export const revalidate = 60;

export async function generateStaticParams() {
  // A build must not die because the database is unreachable — an empty list
  // just means nothing is prerendered, and the pages still render on demand.
  try {
    return (await listPosts()).map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("generateStaticParams: skipping prerender:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return { title: `${post.title} — SmartSyncLink`, description: post.excerpt };
}

/** 225 words a minute, rounded up — the number every blog quotes. */
const readingMinutes = (body: string) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 225));

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [global, home, blog, post, all] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getBlogContent(),
    getPost(slug),
    listPosts(),
  ]);
  if (!post) notFound();

  const toc = tableOfContents(post.body);
  const others = all.filter((p) => p.id !== post.id);
  // Same tag first, newest otherwise — a related list that ignores tags is just
  // a second recent list.
  const related = [
    ...others.filter((p) => p.tags.some((t) => post.tags.includes(t))),
    ...others.filter((p) => !p.tags.some((t) => post.tags.includes(t))),
  ].slice(0, 3);

  const stamp = post.updated_at || post.published_at;

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pb-24 pt-[152px]">
        <div className="mx-auto w-full max-w-[1200px] px-5">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[14px]">
            <Link href="/blog" className="text-brand-blue hover:underline">
              {blog.badge.charAt(0) + blog.badge.slice(1).toLowerCase()}
            </Link>
            <span aria-hidden="true" className="text-muted">
              ›
            </span>
            <span className="text-muted">{post.title}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[760px_360px]">
            <div className="min-w-0">
              {post.tags[0] ? (
                <p className="text-[13px] font-semibold tracking-[0.08em] text-brand-blue uppercase">
                  — {post.tags[0]}
                </p>
              ) : null}

              <h1 className="mt-4 text-[36px] leading-[1.14] font-medium tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[56px]">
                {post.title}
              </h1>

              {/* byline row — author left, freshness right, the way the
                  reference splits it */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-7">
                <p className="text-[15px] text-ink">{blog.byline}</p>
                <p className="text-[15px] text-muted">
                  {stamp ? `${blog.updatedLabel} ${formatDate(stamp)} | ` : ""}
                  {readingMinutes(post.body)} {blog.readTimeLabel}
                </p>
              </div>

              {post.excerpt ? (
                <p className="mt-7 text-[20px] leading-[28px] text-muted">{post.excerpt}</p>
              ) : null}

              {post.cover ? (
                <Media
                  image={{ src: post.cover, alt: post.title }}
                  variant="plain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="mt-8 aspect-16/9 w-full rounded-[14px]"
                />
              ) : null}

              <div className="mt-8">
                <Prose markdown={post.body} />
              </div>

              {post.tags.length ? (
                <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="block rounded-full bg-surface px-3.5 py-1.5 text-[13px] text-[#1E1E1E] transition-colors hover:text-brand"
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* the contents card follows the reader down the article */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents items={toc} label={blog.tocLabel} />
              </div>
            </aside>
          </div>
        </div>

        <NewsletterBand blog={blog} />

        {related.length ? (
          <div className="mx-auto w-full max-w-[1200px] px-5 pt-16">
            <h2 className="text-[28px] font-medium tracking-[-0.02em] text-ink">
              {blog.relatedLabel}
            </h2>
            <div className="mt-8 grid gap-x-10 gap-y-13 md:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <PostTile key={p.id} post={p} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-24">
          <FinalCta data={home.finalCta} />
        </div>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
