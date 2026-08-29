import Link from "next/link";
import type { HomeContent } from "@/content/home";
import { Button, Chevron, Container, Logo, UserIcon } from "./ui";

export function Wordmark({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 text-ink transition-opacity hover:opacity-80 ${className}`}
    >
      <Logo className="size-7 shrink-0" />
      <span className="text-[19px] font-medium tracking-[-0.02em]">{name}</span>
    </Link>
  );
}

export default function Header({
  brand,
  nav,
}: {
  brand: HomeContent["brand"];
  nav: HomeContent["nav"];
}) {
  return (
    <header className="absolute w-full z-40 top-8 py-3">
      <Container className="flex items-center justify-between gap-6">
        <Wordmark name={brand.name} />

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
          {nav.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 text-[16px] font-normal text-[#1E1E1E] transition-colors "
            >
              {item.label}
              {item.hasMenu ? <Chevron className="size-3.5" /> : null}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={nav.login.href}
            className="flex items-center gap-1.5 text-[16px] border border-black/10 px-6 py-3 rounded-full font-normal text-[#1E1E1E] transition-colors hover:text-brand"
          >
            <UserIcon className="size-4" />
            {nav.login.label}
          </a>

          <Button cta={nav.cta} className="px-6 text-[16px]" />
        </div>

        {/* mobile menu — native <details>, no client JS */}
        <details className="relative xl:hidden">
          <summary
            className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-line bg-white/70 text-ink"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-current">
              <path d="M3 5.4h14V7H3zM3 9.2h14v1.6H3zM3 13h14v1.6H3z" />
            </svg>
          </summary>
          <div className="absolute right-0 top-14 w-64 rounded-2xl border border-line bg-white p-3 shadow-lift">
            <nav className="flex flex-col" aria-label="Mobile">
              {nav.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-normal text-ink hover:bg-page"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={nav.login.href}
                className="rounded-lg px-3 py-2.5 text-sm font-normal text-ink hover:bg-page"
              >
                {nav.login.label}
              </a>
            </nav>
            <Button cta={nav.cta} className="mt-2 w-full" />
          </div>
        </details>
      </Container>
    </header>
  );
}
