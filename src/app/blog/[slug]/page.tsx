import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";
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

/**
 * Every post renders through one template, built in the page builder under
 * "Blog post (template)" — the URL picks the post, the template everything
 * around it.
 */
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, all, layout, blocks, global] = await Promise.all([
    getPost(slug),
    listPosts(),
    getLayout("post", "published"),
    getBlocks("published"),
    getGlobal("published"),
  ]);
  if (!post) notFound();

  return (
    <PageShell
      layout={layout}
      blocks={blocks}
      global={global}
      ctx={{ pageKey: "post", post: { post, all } }}
    />
  );
}
