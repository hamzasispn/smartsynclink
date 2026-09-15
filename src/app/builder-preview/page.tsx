import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { industryChrome } from "@/components/builder/industry-chrome";
import { LivePreview } from "@/components/builder/live-preview";
import { auth } from "@/lib/auth";
import { findBuilderPage } from "@/lib/builder/pages";
import { getBlocks, getGlobal, getLayout } from "@/lib/builder/store";
import { getIndustry } from "@/lib/industries";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Builder preview",
  robots: { index: false, follow: false },
};

/**
 * The page as the builder's draft has it. The server renders the draft once;
 * from then on LivePreview re-renders from the document the builder posts on
 * every change, so edits show as they're typed. Admins only.
 */
export default async function BuilderPreview({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  const pageKey = (await searchParams).page ?? "home";
  const page = await findBuilderPage(pageKey);
  if (!page) notFound();

  const [layout, blocks, global] = await Promise.all([
    getLayout(pageKey, "draft"),
    getBlocks("draft"),
    getGlobal("draft"),
  ]);

  let chrome: ReturnType<typeof industryChrome> | null = null;
  if (pageKey.startsWith("industry:")) {
    const industry = await getIndustry(pageKey.slice("industry:".length));
    if (industry) chrome = industryChrome(industry, global.brand);
  }

  // the post template previews against the newest post
  const posts = pageKey === "blog" || pageKey === "post" ? await listPosts() : [];

  return (
    <LivePreview
      initial={{ layout, blocks, global }}
      ctx={{
        pageKey,
        blog: { posts, searchParams: {} },
        post: pageKey === "post" && posts[0] ? { post: posts[0], all: posts } : undefined,
      }}
      brand={chrome?.brand}
      after={chrome?.after}
    />
  );
}
