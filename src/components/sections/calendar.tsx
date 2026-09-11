"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import type { HomeContent } from "@/content/home";

/**
 * The booking calendar, over the page.
 *
 * Every "Book Now" / "Book An Appointment" / "Book A Call" button in the
 * content already points at #contact, so one delegated listener turns all of
 * them into this popup — an editor can add another tomorrow and it just works.
 *
 * The iframe id is not decoration. form_embed.js finds its own frame by an id
 * of the form `<bookingId>_<something>`; given anything else it parks the
 * frame off screen with `visibility:hidden; left:-9999px`. That is exactly
 * what happened when the id was left off and the calendar rendered as a gap.
 * The suffix is fixed, not Date.now(), so server and client agree.
 */
export function Calendar({ data }: { data: HomeContent["calendar"] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.button !== 0) return;
      if (!(event.target as Element | null)?.closest?.('a[href="#contact"], a[href$="/#contact"]')) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!data?.embedUrl || !open) return null;

  const bookingId = data.embedUrl.split("?")[0].split("/").filter(Boolean).pop() ?? "booking";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={data.heading}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-ink/55 p-4 backdrop-blur-sm sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="flex max-h-full w-full max-w-[1120px] flex-col overflow-hidden rounded-[20px] bg-white shadow-lift">
        {/* the close button lives in the header row, not floating outside it —
            floating left it stacking under the card on small screens */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-6 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-[0.08em] text-white/70">{data.badge}</p>
            <p className="mt-1 truncate text-[18px] font-semibold tracking-[-0.01em] text-white">
              {data.heading}
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* the frame scrolls itself: form_embed.js only resizes frames it can
            reach, and a booking form taller than the screen must stay usable
            whether or not that script ever runs */}
        <iframe
          id={`${bookingId}_1`}
          src={data.embedUrl}
          title={data.heading}
          allow="payment"
          className="booking-frame block w-full shrink border-0"
        />
      </div>

      <Script src="https://link.smartsynclink.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
