"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Script from "next/script";
import type { HomeContent } from "@/content/home";
import { BookingForm } from "../booking-form";

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
  // calendars our own form could not serve, which fall back to the widget
  const [widget, setWidget] = useState<Kind[]>([]);
  const close = useCallback(() => setKind(null), []);

  // stable per kind: BookingForm loads its slots once, and an inline arrow here
  // would make it start again every time the popup opens
  const fallback = useMemo(() => {
    const give = (which: Kind) => () =>
      setWidget((current) => (current.includes(which) ? current : [...current, which]));
    return { appointment: give("appointment"), call: give("call") };
  }, []);

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

  // the calendar's own id, which is the last path segment of its widget URL
  const calendarOf = (which: Kind) =>
    urlFor(which)!.split("?")[0].split("/").filter(Boolean).pop() ?? "";

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
        className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm sm:p-8"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {/* One card, the way the reference does it: the eyebrow, the ask and the
            times all live inside it, and the close button rides its corner —
            pulled inward on small screens, where outside the corner is off. */}
        <div className="relative my-auto w-full max-w-[660px]">
          {/* The same close button as the demo popup. The X was on a half-step
              size utility that was not in the generated stylesheet, so the svg
              had no width at all and stretched to fill the button; a whole-step
              size and the demo popup's filled glyph cannot do that. */}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-2.5 right-2.5 z-10 grid size-9 place-items-center rounded-full bg-white text-ink shadow-lift transition-transform hover:scale-105 sm:-top-3 sm:-right-3"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-current">
              <path d="m10 8.6 5-5 1.4 1.4-5 5 5 5-1.4 1.4-5-5-5 5L3.6 15l5-5-5-5L10 3.6z" />
            </svg>
          </button>

          <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto rounded-[18px] bg-white shadow-lift sm:max-h-[calc(100dvh-4rem)] sm:rounded-[20px]">
            {built.map((which) => {
              const url = urlFor(which)!;
              const bookingId = calendarOf(which) || "booking";
              // our own form, in the site's own design. The GHL widget is only
              // the last resort, for when even our slots endpoint cannot answer.
              if (!widget.includes(which)) {
                return (
                  <div key={which} hidden={which !== kind}>
                    <BookingForm
                      calendarId={bookingId}
                      eyebrow={data.badge}
                      title={data.heading}
                      subtitle={data.subheading}
                      onUnavailable={fallback[which]}
                    />
                  </div>
                );
              }
              // the frame scrolls itself: form_embed.js only resizes frames it
              // can reach, and a booking form taller than the screen must stay
              // usable whether or not that script ever runs
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
      </div>

      {/* loaded once the page is idle, so it is already there when a frame
          appears — and only when one actually will */}
      {built.some((which) => widget.includes(which)) ? (
        <Script src="https://link.smartsynclink.com/js/form_embed.js" strategy="afterInteractive" />
      ) : null}
    </>
  );
}
