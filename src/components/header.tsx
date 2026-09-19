"use client";

import Link from "next/link";
import type { GlobalContent } from "@/content/global";
import { SiteLogo } from "./site-logo";
import { Bolt, Button, Chevron, Container, PhoneIcon, UserIcon } from "./ui";

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
        /* A plain <img>, not next/image. Logos are very often SVG, and the
           optimiser refuses those outright — "image type is not allowed" —
           so the header rendered nothing at all. It also wanted a width and
           height it cannot know for a vector. At this size there is no
           optimisation worth having, and this works for every format. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logo.src}
          alt={brand.logo.alt || brand.name}
          style={{ height, width: "auto" }}
          className="shrink-0"
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

        <nav className="hidden items-center gap-5 self-stretch xl:flex" aria-label="Main">
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

        <div className="hidden items-center gap-4 lg:flex">
          {/* icon only: the label stays as the accessible name and the tooltip */}
          <a
            href={nav.login.href}
            aria-label={nav.login.label}
            title={nav.login.label}
            className="grid size-12 shrink-0 place-items-center rounded-full border border-black/10 text-[#1E1E1E] transition-colors hover:border-brand/40 hover:text-brand"
          >
            <UserIcon className="size-5" />
          </a>

          {/* the number, one tap to dial on a phone and a plain link on desktop */}
          {nav.call?.number ? (
            <a
              href={nav.call.href}
              className="flex items-center gap-2.5 rounded-full border border-black/10 py-1.5 pl-1.5 pr-5 transition-colors hover:border-brand/40"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white">
                <PhoneIcon className="size-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-[12px] text-muted">{nav.call.label}</span>
                <span className="block text-[15px] font-medium whitespace-nowrap text-ink">{nav.call.number}</span>
              </span>
            </a>
          ) : null}

          <Button cta={nav.cta} className="whitespace-nowrap px-6 text-[16px]" />
        </div>


        {/* mobile menu — right-side off-canvas drawer */}
        <details className="mobile-menu group relative xl:hidden">
          {/* Hamburger */}
          <summary
            className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-line bg-white/70 text-ink [&::-webkit-details-marker]:hidden"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-current">
              <path d="M3 5.4h14V7H3zM3 9.2h14v1.6H3zM3 13h14v1.6H3z" />
            </svg>
          </summary>

          {/* Overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black/40 opacity-0 invisible transition-all duration-300 group-open:visible group-open:opacity-100"
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className="fixed right-0 top-0 z-[70] flex h-dvh w-[min(88vw,380px)] translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out group-open:translate-x-0"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Wordmark brand={brand} />

              <button
                type="button"
                onClick={(e) => {
                  const details = e.currentTarget.closest("details");
                  if (details) details.removeAttribute("open");
                }}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-full border border-black/10 text-ink transition-colors hover:border-brand/30 hover:text-brand"
              >
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav
              className="flex-1 overflow-y-auto px-5 py-5"
              aria-label="Mobile"
            >
              <div className="flex flex-col">
                {nav.items.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-line last:border-b-0"
                  >
                    {item.children?.length ? (
                      <details className="mobile-accordion group/accordion">
                        <summary
                          className="flex cursor-pointer list-none items-center justify-between py-4 text-[16px] font-normal text-ink [&::-webkit-details-marker]:hidden"
                        >
                          <span>{item.label}</span>

                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-page transition-transform duration-300 group-open/accordion:rotate-180">
                            <svg
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                              className="size-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 7.5l5 5 5-5" />
                            </svg>
                          </span>
                        </summary>

                        <div className="overflow-hidden pb-3 pl-3">
                          <div className="border-l border-line pl-3">
                            {/* Optional parent link */}
                            <a
                              href={item.href}
                              className="block rounded-lg px-3 py-2.5 text-[14px] font-medium text-brand transition-colors hover:bg-page"
                            >
                              View {item.label}
                            </a>

                            {item.children.map((child) => (
                              <a
                                key={child.label}
                                href={child.href}
                                className="block rounded-lg px-3 py-2.5 text-[14px] text-muted transition-colors hover:bg-page hover:text-brand"
                              >
                                {child.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </details>
                    ) : (
                      <a
                        href={item.href}
                        className="block py-4 text-[16px] font-normal text-ink transition-colors hover:text-brand"
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact / Login */}
              <div className="mt-6 space-y-2">
                {nav.call?.number ? (
                  <a
                    href={nav.call.href}
                    className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 transition-colors hover:bg-page"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white">
                      <PhoneIcon className="size-4" />
                    </span>

                    <span className="leading-tight">
                      <span className="block text-[12px] text-muted">
                        {nav.call.label}
                      </span>
                      <span className="block text-[14px] font-medium text-ink">
                        {nav.call.number}
                      </span>
                    </span>
                  </a>
                ) : null}

                <a
                  href={nav.login.href}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] text-ink transition-colors hover:bg-page"
                >
                  <UserIcon className="size-5" />
                  {nav.login.label}
                </a>
              </div>
            </nav>

            {/* CTA */}
            <div className="border-t border-line bg-white p-5">
              <Button cta={nav.cta} className="w-full" />
            </div>
          </div>
        </details>

      </Container>
    </header>
  );
}
