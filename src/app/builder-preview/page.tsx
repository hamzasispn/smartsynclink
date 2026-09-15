import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { industryChrome } from "@/components/builder/industry-chrome";
import { PageShell } from "@/components/builder/render";
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
 * The page as the builder's draft has it, rendered by the same PageShell the
 * live site uses — so what the editor sees is what publishing will produce.
 * Admins only; it shows unpublished work.
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

  const posts = pageKey === "blog" ? await listPosts() : [];

  return (
    <PageShell
      layout={layout}
      blocks={blocks}
      global={global}
      ctx={{ pageKey, blog: { posts, searchParams: {} } }}
      brand={chrome?.brand}
      after={chrome?.after}
      preview
    />
  );
}
