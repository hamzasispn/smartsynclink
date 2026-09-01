import Link from "next/link";
import Image from "next/image";
import type { GlobalContent } from "@/content/global";
import { SiteLogo } from "./site-logo";
import { Bolt, Button, Chevron, Container, UserIcon } from "./ui";

export function Wordmark({
  brand,
  className = "",
}: {
  brand: GlobalContent["brand"];
  className?: string;
}) {
  const height = brand.logoHeight || 28;
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 text-ink transition-opacity hover:opacity-80 ${className}`}
    >
      {brand.logo?.src ? (
        // width is only a srcset hint; the rendered size comes from the style,
        // so any logo aspect ratio works without being told about it
        <Image
          src={brand.logo.src}
          alt={brand.logo.alt || brand.name}
          width={240}
          height={height}
          style={{ height, width: "auto" }}
          priority
        />
      ) : (
        // the lockup already contains the wordmark, so no separate name here
        <SiteLogo height={height} label={brand.name} className="shrink-0" />
      )}
    </Link>
  );
}

export default function Header({
  brand,
  nav,
}: {
  brand: GlobalContent["brand"];
  nav: GlobalContent["nav"];
}) {
  return (
    <header className="absolute w-full z-40 top-8 py-3">
      <Container className="flex items-center justify-between gap-6">
        <Wordmark brand={brand} />

        <nav className="hidden items-center gap-6 self-stretch xl:flex" aria-label="Main">
          {nav.items.map((item) => (
            // self-stretch + h-full make the trigger box as tall as the nav
            // row. Without it the link ends 13px above the row, and that strip
            // is neither link nor panel — the pointer crossing it dropped
            // :hover and the menu vanished before it could be reached.
            <div
              key={item.label}
              className={`group flex items-center self-stretch ${item.mega ? "static" : "relative"}`}
            >
              <a
                href={item.href}
                className="flex h-full items-center gap-1 text-[16px] font-normal text-[#1E1E1E] transition-colors"
              >
                {item.label}
                {item.children?.length ? <Chevron className="size-3.5" /> : null}
              </a>

              {item.children?.length ? (
                // focus-within as well as hover, so the panel is reachable by
                // keyboard and not only by mouse
                <div
                  className={`nav-panel absolute left-1/2 top-full z-50 -translate-x-1/2 ${
                    // a mega panel hangs off the header (static parent), so it
                    // starts one header padding lower than the trigger; -mt-3
                    // cancels that py-3 and pt-7 puts the card back where it was
                    item.mega
                      ? "-mt-3 w-[min(1180px,calc(100vw-3rem))] pt-7"
                      : "pt-4"
                  }`}
                >
                  {item.mega ? (
                    <div className="rounded-[20px] border border-line bg-white p-4 shadow-lift">
                      <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                        {item.children.map((child, i) => (
                          <li
                            key={child.label}
                            className="mega-item"
                            style={{ "--i": i } as React.CSSProperties}
                          >
                            <a
                              href={child.href}
                              className="flex h-full gap-3 rounded-2xl p-3.5 transition-colors hover:bg-page"
                            >
                              <span className="mt-0.5 grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-brand/[0.07]">
                                {child.icon?.src ? (
                                  // eslint-disable-next-line @next/next/no-img-element -- uploaded icons have no known intrinsic size
                                  <img
                                    src={child.icon.src}
                                    alt=""
                                    className="size-4 object-contain"
                                  />
                                ) : (
                                  <Bolt className="size-4 text-brand" />
                                )}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[15px] font-medium text-[#1E1E1E]">
                                  {child.label}
                                </span>
                                {child.description ? (
                                  <span className="mt-1 block text-[13px] leading-[1.55] text-muted">
                                    {child.description}
                                  </span>
                                ) : null}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="min-w-[240px] rounded-2xl border border-line bg-white p-2 shadow-lift">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a
                            href={child.href}
                            className="block rounded-lg px-3.5 py-2.5 text-[15px] text-[#1E1E1E] transition-colors hover:bg-page hover:text-brand"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
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
                <div key={item.label}>
                  <a
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-normal text-ink hover:bg-page"
                  >
                    {item.label}
                  </a>
                  {item.children?.length ? (
                    <div className="ml-3 border-l border-line pl-2">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-[13px] text-muted hover:bg-page hover:text-brand"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
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
