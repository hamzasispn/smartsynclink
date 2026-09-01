import { notFound } from "next/navigation";
import { BtnLink, PageHeader, Pill } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";
import { getPost } from "@/lib/posts";

export default async function PostEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const post = isNew ? null : await getPost(id, true);
  if (!isNew && !post) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "New post" : post!.title}
        subtitle="Body is Markdown. The AI buttons fill the fields — nothing saves until you press Save."
        action={
          <div className="flex items-center gap-3">
            {post?.source === "autopilot" ? <Pill tone="warn">Written by AI</Pill> : null}
            <BtnLink href="/admin/blog" variant="outline">Back</BtnLink>
          </div>
        }
      />
      <PostForm post={post} />
    </>
  );
}
