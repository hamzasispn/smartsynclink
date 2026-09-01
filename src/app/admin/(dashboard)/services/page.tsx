import Link from "next/link";
import { BtnLink, Card, Empty, PageHeader, Pill } from "@/components/admin/ui";
import { listServices } from "@/lib/services";
import { deleteServiceAction } from "@/app/admin/actions";

export default async function ServicesPage() {
  const services = await listServices(true);

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Shown on /services and linked from the site footer."
        action={<BtnLink href="/admin/services/new">New service</BtnLink>}
      />

      {services.length ? (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {services.map((service) => (
              <li key={service.id} className="flex items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="text-[15px] text-[#1e1e1e] hover:text-brand"
                  >
                    {service.title}
                  </Link>
                  <p className="mt-0.5 truncate text-[13px] text-muted">
                    /services/{service.slug}
                  </p>
                </div>
                <Pill tone={service.published ? "good" : "neutral"}>
                  {service.published ? "live" : "hidden"}
                </Pill>
                <form action={deleteServiceAction}>
                  <input type="hidden" name="id" value={service.id} />
                  <button className="text-[13px] text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty>No services yet — add the first one.</Empty>
      )}
    </>
  );
}
