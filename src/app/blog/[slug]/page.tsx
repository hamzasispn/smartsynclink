import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { FinalCta } from "@/components/sections";
import { Prose } from "@/components/prose";
import { ColumnHead, PostCard, RecentRow } from "@/components/blog/parts";
import { SearchBox } from "@/components/blog/filters";
import { Container, Media } from "@/components/ui";
import { getBlogContent, getGlobalContent, getHomeContent } from "@/lib/content";
import { getPost, listPosts } from "@/lib/posts";

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

  const others = all.filter((p) => p.id !== post.id);
  // Same tag first, newest otherwise — a related list that ignores tags is just
  // a second recent list, and the sidebar already is one.
  const related = [
    ...others.filter((p) => p.tags.some((t) => post.tags.includes(t))),
    ...others.filter((p) => !p.tags.some((t) => post.tags.includes(t))),
  ].slice(0, 3);

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pb-24 pt-32">
        <Container>
          {post.cover ? (
            <Media
              image={{ src: post.cover, alt: post.title }}
              variant="plain"
              priority
              sizes="(max-width: 1024px) 100vw, 1180px"
              className="aspect-21/9 w-full rounded-[14px]"
            />
          ) : null}

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <article className="lg:col-span-8">
              <h1 className="max-w-[22ch] text-[32px] font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[38px]">
                {post.title}
              </h1>

              <div className="mt-7">
                <Prose markdown={post.body} />
              </div>

              {post.tags.length ? (
                <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <a
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="block rounded-full bg-surface px-3.5 py-1.5 text-[13px] text-muted transition-colors hover:text-brand"
                      >
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>

            <aside className="flex flex-col gap-9 lg:col-span-4">
              <section>
                <ColumnHead rule={false}>{blog.search.label}</ColumnHead>
                <div className="mt-4">
                  <SearchBox placeholder={blog.search.placeholder} />
                </div>
              </section>

              {others.length ? (
                <section>
                  <ColumnHead>{blog.recentLabel}</ColumnHead>
                  <div className="mt-5 flex flex-col gap-4">
                    {others.slice(0, 3).map((p) => (
                      <RecentRow key={p.id} post={p} byline={blog.byline} />
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>

          {related.length ? (
            <section className="mt-20">
              <ColumnHead>{blog.relatedLabel}</ColumnHead>
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.id} post={p} blog={blog} />
                ))}
              </div>
            </section>
          ) : null}
        </Container>

        <div className="mt-24">
          <FinalCta data={home.finalCta} />
        </div>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
