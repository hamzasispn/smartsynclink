import Link from "next/link";
import { Card, PageHeader, Pill } from "@/components/admin/ui";

/**
 * There is one editable page today. Listing it anyway means adding an About or
 * Pricing page later is a new row here, not a new place to look.
 */
const pages = [
  {
    href: "/admin/pages/home",
    title: "Home page",
    path: "/",
    description: "Hero, features, industries, steps, pricing, testimonials, FAQ.",
    live: true,
  },
];

export default function PagesIndex() {
  return (
    <>
      <PageHeader title="Pages" subtitle="Content for each page of the site." />

      <Card className="p-0">
        <ul className="divide-y divide-line">
          {pages.map((page) => (
            <li key={page.href} className="flex items-center gap-4 px-6 py-5">
              <div className="min-w-0 flex-1">
                <Link
                  href={page.href}
                  className="text-[16px] text-[#1e1e1e] hover:text-brand"
                >
                  {page.title}
                </Link>
                <p className="mt-1 text-[14px] text-muted">{page.description}</p>
              </div>
              <code className="hidden rounded bg-page px-2 py-1 text-[13px] text-muted sm:block">
                {page.path}
              </code>
              <Pill tone={page.live ? "good" : "neutral"}>
                {page.live ? "live" : "draft"}
              </Pill>
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-5 text-[14px] leading-[1.7] text-muted">
        Services and blog posts have their own sections — they are lists of
        records rather than single pages.
      </p>
    </>
  );
}
