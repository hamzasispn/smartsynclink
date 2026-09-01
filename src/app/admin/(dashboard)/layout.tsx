import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteLogo } from "@/components/site-logo";
import { Btn } from "@/components/admin/ui";
import { signOutAction } from "../actions";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/autopilot", label: "Blog autopilot" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  // /admin/login deliberately lives outside this (dashboard) route group, so
  // it never reaches this guard and there is no redirect loop to guard against.
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-page">
      <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-6 py-8">
        <aside className="sticky top-8 hidden h-fit w-56 shrink-0 lg:block">
          <Link href="/" className="mb-8 flex items-center">
            <SiteLogo height={26} />
          </Link>

          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-2.5 text-[15px] text-[#1e1e1e] transition-colors hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-xl border border-line bg-white p-4">
            <p className="truncate text-[13px] text-muted">
              {session.user.email}
            </p>
            <form action={signOutAction} className="mt-3">
              <Btn variant="outline" className="min-h-9 w-full px-4 text-[13px]">
                Sign out
              </Btn>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
