import type { Metadata } from "next";
import { PageShell } from "@/components/builder/render";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";
import { listPosts } from "@/lib/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — SmartSyncLink",
  description:
    "Practical insights on AI, automation, lead generation and follow-up for service businesses.",
};

/** The blog index layout; the listing section reads the posts and the query string passed in here. */
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string; q?: string }>;
}) {
  const [params, layout, blocks, global, posts] = await Promise.all([
    searchParams,
    getLayout("blog", "published"),
    getBlocks("published"),
    getGlobal("published"),
    listPosts(),
  ]);

  return (
    <PageShell
      layout={layout}
      blocks={blocks}
      global={global}
      ctx={{ pageKey: "blog", blog: { posts, searchParams: params } }}
    />
  );
}
