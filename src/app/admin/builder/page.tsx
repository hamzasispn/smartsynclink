import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Builder } from "@/components/builder/builder";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
// "Customize with AI" runs as a server action from this page, and a big section can take a minute
export const maxDuration = 300;

export const metadata: Metadata = {
  title: "Page builder — SmartSyncLink",
  robots: { index: false, follow: false },
};

/**
 * The page builder, full screen — it lives outside the (dashboard) group so
 * the admin sidebar doesn't eat the canvas, and guards the session itself.
 */
export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  const { page } = await searchParams;
  return <Builder initialPage={page ?? "home"} />;
}
