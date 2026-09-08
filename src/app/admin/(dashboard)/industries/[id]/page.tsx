import { notFound } from "next/navigation";
import { BtnLink, PageHeader } from "@/components/admin/ui";
import { IndustryForm } from "@/components/admin/industry-form";
import { getIndustry } from "@/lib/industries";

export const dynamic = "force-dynamic";

export default async function IndustryEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const industry = isNew ? null : await getIndustry(id);
  if (!isNew && !industry) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "New industry" : industry!.name}
        subtitle="Hero, the problem section and the journey belong to this page. Everything below them — steps, pricing, the closing call to action — comes from the home page, so it stays the same across every industry."
        action={
          <BtnLink href="/admin/industries" variant="outline">
            Back
          </BtnLink>
        }
      />
      <IndustryForm industry={industry} />
    </>
  );
}
