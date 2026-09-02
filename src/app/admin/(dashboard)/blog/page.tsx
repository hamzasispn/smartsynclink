import Link from "next/link";
import { formatDate } from "@/lib/format";
import { BtnLink, Card, Empty, PageHeader, Pill } from "@/components/admin/ui";
import { listPosts } from "@/lib/posts";
import { deletePostAction } from "@/app/admin/actions";

export default async function BlogPage() {
  const posts = await listPosts(true);

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Drafts stay private until you publish them."
        action={<BtnLink href="/admin/blog/new">New post</BtnLink>}
      />

      {posts.length ? (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="text-[15px] text-[#1e1e1e] hover:text-brand"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 truncate text-[13px] text-muted">
                    {post.published_at
                      ? formatDate(post.published_at)
                      : "not published"}
                    {post.tags.length ? ` · ${post.tags.join(", ")}` : ""}
                  </p>
                </div>
                {post.source === "autopilot" ? <Pill tone="warn">AI</Pill> : null}
                <Pill tone={post.status === "published" ? "good" : "neutral"}>
                  {post.status}
                </Pill>
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button className="text-[13px] text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty>Nothing written yet. Add a post, or let the autopilot do it.</Empty>
      )}
    </>
  );
}
