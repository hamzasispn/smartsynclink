import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Container, Media } from "@/components/ui";
import { getGlobalContent } from "@/lib/content";
import { listPosts } from "@/lib/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — SmartSyncLink",
  description: "Practical notes on automating a small service business.",
};

export default async function BlogIndex() {
  const [global, posts] = await Promise.all([getGlobalContent(), listPosts()]);

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pt-40 pb-24">
        <Container>
          <h1 className="text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1e1e1e]">
            Blog
          </h1>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.75] text-[#1e1e1e]">
            Practical notes on answering every call, following up, and getting
            the admin off your plate.
          </p>

          {posts.length ? (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-card transition-shadow hover:shadow-lift"
                >
                  <Media
                    image={{ src: post.cover, alt: post.title }}
                    variant="plain"
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="aspect-[16/10] w-full"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <time className="text-[13px] text-muted">
                      {post.published_at
                        ? formatDate(post.published_at)
                        : null}
                    </time>
                    <h2 className="mt-2 text-[19px] font-medium leading-snug tracking-[-0.02em] text-[#1e1e1e]">
                      {post.title}
                    </h2>
                    <p className="mt-2.5 line-clamp-3 text-[16px] leading-[1.7] text-[#1e1e1e]">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 text-[16px] text-brand group-hover:underline">
                      Read post
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-14 rounded-2xl border border-dashed border-line px-6 py-16 text-center text-[16px] text-muted">
              No posts published yet.
            </p>
          )}
        </Container>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
