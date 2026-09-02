import Link from "next/link";
import { formatDate } from "@/lib/format";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Prose } from "@/components/prose";
import { Container, Media } from "@/components/ui";
import { getGlobalContent } from "@/lib/content";
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
  const [global, post] = await Promise.all([getGlobalContent(), getPost(slug)]);
  if (!post) notFound();

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pt-40 pb-24">
        <Container>
          <Link href="/blog" className="text-[16px] text-muted hover:text-brand">
            ← All posts
          </Link>

          <article className="mt-6 max-w-[70ch]">
            <time className="text-[16px] text-muted">
              {post.published_at
                ? formatDate(post.published_at)
                : null}
            </time>

            <h1 className="mt-3 text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1e1e1e]">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="mt-4 text-[16px] leading-[1.75] text-muted">
                {post.excerpt}
              </p>
            ) : null}

            {post.cover ? (
              <Media
                image={{ src: post.cover, alt: post.title }}
                variant="plain"
                sizes="(max-width: 1024px) 100vw, 760px"
                className="mt-10 aspect-[16/9] w-full rounded-[22px]"
              />
            ) : null}

            <div className="mt-12">
              <Prose markdown={post.body} />
            </div>

            {post.tags.length ? (
              <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-surface px-3.5 py-1.5 text-[13px] text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        </Container>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
