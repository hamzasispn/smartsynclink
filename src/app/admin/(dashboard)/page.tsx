import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { BtnLink, Card, Empty, PageHeader, Pill, Stat } from "@/components/admin/ui";
import { getAutopilot } from "@/lib/autopilot";
import { listPosts, postCounts } from "@/lib/posts";
import { listServices } from "@/lib/services";

export default async function OverviewPage() {
  const [counts, services, autopilot, recent] = await Promise.all([
    postCounts(),
    listServices(true),
    getAutopilot(),
    listPosts(true),
  ]);

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="What is live on the site right now."
        action={<BtnLink href="/" variant="outline">View site</BtnLink>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Published posts" value={counts.published} />
        <Stat label="Drafts" value={counts.drafts} />
        <Stat label="Written by AI" value={counts.by_ai} />
        <Stat label="Services" value={services.length} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-medium text-[#1e1e1e]">Latest posts</h2>
            <Link href="/admin/blog" className="text-[14px] text-brand">
              All posts
            </Link>
          </div>

          {recent.length ? (
            <ul className="space-y-3">
              {recent.slice(0, 5).map((post) => (
                <li key={post.id} className="flex items-center justify-between gap-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="truncate text-[15px] text-[#1e1e1e] hover:text-brand"
                  >
                    {post.title}
                  </Link>
                  <Pill tone={post.status === "published" ? "good" : "neutral"}>
                    {post.status}
                  </Pill>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No posts yet.</Empty>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-medium text-[#1e1e1e]">Blog autopilot</h2>
            <Link href="/admin/autopilot" className="text-[14px] text-brand">
              Settings
            </Link>
          </div>

          <dl className="space-y-2.5 text-[15px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Status</dt>
              <dd>
                <Pill tone={autopilot.enabled ? "good" : "neutral"}>
                  {autopilot.enabled ? "On" : "Off"}
                </Pill>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Writes</dt>
              <dd className="text-[#1e1e1e]">every {autopilot.every_hours}h</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Next run</dt>
              <dd className="text-[#1e1e1e]">
                {autopilot.next_run_at
                  ? formatDateTime(autopilot.next_run_at)
                  : "—"}
              </dd>
            </div>
            {autopilot.last_error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
                Last run failed: {autopilot.last_error}
              </div>
            ) : null}
          </dl>
        </Card>
      </div>
    </>
  );
}
