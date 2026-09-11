import { BtnLink, PageHeader } from "@/components/admin/ui";
import { SolutionsForm } from "@/components/admin/solutions-form";
import { getSolutionsContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SolutionsPageEditor() {
  const solutions = await getSolutionsContent();

  return (
    <>
      <PageHeader
        title="Solutions page"
        subtitle="The intro and every card in the grid — title, tagline, description, the Best for list, the button and the artwork. Add a card and it appears on the page. Steps, pricing and the closing call to action come from the home page."
        action={
          <BtnLink href="/admin/pages" variant="outline">
            Back
          </BtnLink>
        }
      />
      <SolutionsForm initial={solutions} />
    </>
  );
}
