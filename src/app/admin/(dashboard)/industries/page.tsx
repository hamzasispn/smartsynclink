import Link from "next/link";
import { BtnLink, Card, Empty, PageHeader, Pill } from "@/components/admin/ui";
import { deleteIndustryAction } from "@/app/admin/actions";
import { listIndustries } from "@/lib/industries";

export const dynamic = "force-dynamic";

export default async function IndustriesPage() {
  const industries = await listIndustries(true);

  return (
    <>
      <PageHeader
        title="Industries"
        subtitle="Each one is its own landing page. Add a row and the page appears at /industries/<slug>."
        action={<BtnLink href="/admin/industries/new">New industry</BtnLink>}
      />

      {industries.length ? (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {industries.map((industry) => (
              <li
                key={industry.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/industries/${industry.id}`}
                    className="text-[15px] text-[#1e1e1e] hover:text-brand"
                  >
                    {industry.name}
                  </Link>
                  <p className="mt-0.5 truncate text-[13px] text-muted">
                    /industries/{industry.slug}
                    {industry.data.brand?.logo?.src ? " · own logo" : ""}
                  </p>
                </div>
                <Pill tone={industry.published ? "good" : "neutral"}>
                  {industry.published ? "live" : "hidden"}
                </Pill>
                <form action={deleteIndustryAction}>
                  <input type="hidden" name="id" value={industry.id} />
                  <button className="text-[13px] text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty>
          No industry pages yet — add the first one and it goes live straight
          away.
        </Empty>
      )}
    </>
  );
}
