"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import type { HomeContent } from "@/content/home";

type Kind = "appointment" | "call";

/**
 * The booking calendar, over the page.
 *
 * Every "Book Now" / "Book An Appointment" / "Book A Call" button in the
 * content already points at #contact, so one delegated listener turns all of
 * them into this popup — an editor can add another tomorrow and it just works.
 *
 * Opening has to feel instant, and the widget is slow to boot: a DNS lookup, a
 * TLS handshake and the calendar's own start-up all happen before it paints.
 * So none of that waits for the click — the frame starts loading as soon as a
 * booking button is hovered or focused, and once built it is kept and merely
 * hidden, so every later open is immediate. A preconnect covers the visitor
 * who clicks straight away without hovering (touch, keyboard, fast pointer).
 *
 * The iframe id is not decoration. form_embed.js finds its own frame by an id
 * of the form `<bookingId>_<something>`; given anything else it parks the
 * frame off screen with `visibility:hidden; left:-9999px`. That is exactly
 * what happened when the id was left off and the calendar rendered as a gap.
 * The suffix is fixed, not Date.now(), so server and client agree.
 */
export function Calendar({ data }: { data: HomeContent["calendar"] }) {
  // which of the two bookings is showing — #contact is the appointment
  // calendar, #call the strategy call. null means the popup is closed.
  const [kind, setKind] = useState<Kind | null>(null);
  // frames already built: they stay mounted so a second open costs nothing
  const [built, setBuilt] = useState<Kind[]>([]);
  const close = useCallback(() => setKind(null), []);

  const build = useCallback(
    (next: Kind) => setBuilt((current) => (current.includes(next) ? current : [...current, next])),
    [],
  );

  useEffect(() => {
    const kindOf = (element: Element | null | undefined) => {
      const link = element?.closest?.(
        'a[href="#contact"], a[href$="/#contact"], a[href="#call"], a[href$="/#call"]',
      );
      return link ? (link.getAttribute("href")!.endsWith("#call") ? "call" : "appointment") : null;
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.button !== 0) return;
      const next = kindOf(event.target as Element | null);
      if (!next) return;
      event.preventDefault();
      build(next);
      setKind(next);
    };

    // the head start: by the time the click lands the calendar is usually up
    const onIntent = (event: Event) => {
      const next = kindOf(event.target as Element | null);
      if (next) build(next);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
    };
  }, [build]);

  useEffect(() => {
    if (!kind) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [kind, close]);

  const urlFor = (which: Kind) =>
    which === "call" ? data?.callEmbedUrl || data?.embedUrl : data?.embedUrl;
  if (!data?.embedUrl) return null;

  const host = (() => {
    try {
      return new URL(data.embedUrl).origin;
    } catch {
      return null;
    }
  })();

  return (
    <>
      {/* React hoists these into <head>: the handshake happens before any click */}
      {host ? (
        <>
          <link rel="preconnect" href={host} crossOrigin="" />
          <link rel="dns-prefetch" href={host} />
        </>
      ) : null}

      <div
        role="dialog"
        aria-modal="true"
        aria-label={data.heading}
        hidden={!kind}
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
          {built.map((which) => {
            const url = urlFor(which)!;
            const bookingId = url.split("?")[0].split("/").filter(Boolean).pop() ?? "booking";
            return (
              <iframe
                key={which}
                id={`${bookingId}_1`}
                src={url}
                title={data.heading}
                allow="payment"
                hidden={which !== kind}
                className="booking-frame block w-full shrink border-0"
              />
            );
          })}
        </div>
      </div>

      {/* loaded once the page is idle, so it is already there when a frame appears */}
      {built.length ? (
        <Script src="https://link.smartsynclink.com/js/form_embed.js" strategy="afterInteractive" />
      ) : null}
    </>
  );
}
