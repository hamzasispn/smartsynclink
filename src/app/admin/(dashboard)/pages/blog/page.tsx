import { BtnLink, PageHeader } from "@/components/admin/ui";
import { BlogPageForm } from "@/components/admin/blog-page-form";
import { getBlogContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogPageEditor() {
  const blog = await getBlogContent();

  return (
    <>
      <PageHeader
        title="Blog page"
        subtitle="Wording around the posts — the heading, the labels above each column, the newsletter box and how many articles a page shows. The posts themselves live under Blog."
        action={
          <BtnLink href="/admin/pages" variant="outline">
            Back
          </BtnLink>
        }
      />
      <BlogPageForm initial={blog} />
    </>
  );
}
