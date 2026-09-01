import { notFound } from "next/navigation";
import { BtnLink, PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/service-form";
import { getService } from "@/lib/services";

export default async function ServiceEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const service = isNew ? null : await getService(id);
  if (!isNew && !service) notFound();

  return (
    <>
      <PageHeader
        title={isNew ? "New service" : service!.title}
        subtitle="Body is Markdown. The AI buttons fill the fields — nothing saves until you press Save."
        action={<BtnLink href="/admin/services" variant="outline">Back</BtnLink>}
      />
      <ServiceForm service={service} />
    </>
  );
}
