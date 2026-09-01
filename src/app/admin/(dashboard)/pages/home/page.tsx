import { PageHeader } from "@/components/admin/ui";
import { HomeForm } from "@/components/admin/home-form";
import { getHomeContent } from "@/lib/content";

export default async function HomeEditorPage() {
  const content = await getHomeContent();

  return (
    <>
      <PageHeader
        title="Home page"
        subtitle="The home page's own sections. Nav, footer and brand live under Settings."
      />
      <HomeForm initial={content} />
    </>
  );
}
