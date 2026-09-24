"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HomeContent } from "@/content/home";

/**
 * The voice agent demo, over the page — a phone with the conversation open.
 *
 * Opened by any link pointing at #demo: the hero's demo buttons, the assistant
 * orb in the closing call to action, the play buttons on the video bands. One
 * delegated listener rather than a handler per button — the buttons are
 * content, and an editor can point a new one at #demo tomorrow.
 *
 * It used to be a white card wearing decoration: pulsing rings behind the
 * avatar, two badges floating over the edges, a blurred fake reply and a row of
 * typing dots that never typed anything. None of it was the product. What is
 * left is the shape a person already knows — a phone, a thread, the agent at
 * the top — with the real widget sitting in the thread where a reply would be.
 *
 * The third-party widget script loads on first open, never on page load — it
 * is a third-party bundle and nobody should pay for it just by visiting.
 */
export function DemoModal({ data }: { data: HomeContent["demo"] }) {
  const [open, setOpen] = useState(false);
  const embed = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  /* ---- open on any #demo link, anywhere on the page ---- */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // let a modified click do what the browser would normally do
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.button !== 0) return;
      const link = (event.target as Element | null)?.closest?.(
        'a[href="#demo"], a[href$="/#demo"]',
      );
      if (!link) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /* ---- escape, and the page must not scroll behind the phone ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  /* ---- the widget, once ---- */
  useEffect(() => {
    if (!open || loaded.current || !data.widgetId || !embed.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.src = "https://beta.leadconnectorhq.com/loader.js";
    script.dataset.resourcesUrl = "https://beta.leadconnectorhq.com/chat-widget/loader.js";
    script.dataset.widgetId = data.widgetId;
    embed.current.appendChild(script);
  }, [open, data.widgetId]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${data.agentName} — ${data.role}`}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="relative my-auto w-full max-w-[360px]">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 grid size-9 place-items-center rounded-full bg-white text-ink shadow-lift transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-current">
            <path d="m10 8.6 5-5 1.4 1.4-5 5 5 5-1.4 1.4-5-5-5 5L3.6 15l5-5-5-5L10 3.6z" />
          </svg>
        </button>

        {/* the handset */}
        <div className="rounded-[46px] bg-[#0E0E14] p-2.5 shadow-[0_40px_80px_-30px_rgba(14,14,20,.65)] ring-1 ring-white/10">
          <div className="relative flex h-[min(640px,calc(100dvh-7rem))] flex-col overflow-hidden rounded-[36px] bg-page">
            {/* status bar, with the notch between the two halves */}
            <div className="relative flex shrink-0 items-center justify-between bg-white px-6 pt-3 pb-1.5 text-[13px] font-semibold text-ink">
              <span>9:41</span>
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-1/2 h-6 w-[92px] -translate-x-1/2 rounded-full bg-[#0E0E14]"
              />
              <StatusIcons />
            </div>

            {/* who you are talking to */}
            <div className="flex shrink-0 items-center gap-3 border-b border-line bg-white px-4 pt-1 pb-3">
              <span className="relative size-10 shrink-0">
                <Avatar src={data.avatar?.src} alt={data.avatar?.alt || data.agentName} big={false} />
                <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-[#22c55e]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[16px] font-semibold tracking-[-0.01em] text-ink">
                    {data.agentName}
                  </span>
                  <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-[0.05em] text-brand">
                    {data.agentBadge}
                  </span>
                </span>
                <span className="block truncate text-[12px] text-muted">{data.role}</span>
              </span>
            </div>

            {/* the thread: one line of context, then the live widget */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
              <Opening data={data} />

              {/* the widget mounts here, where the next reply would be */}
              <div
                ref={embed}
                className="mt-auto w-full [&>div]:!w-full [&_iframe]:!w-full"
              />
            </div>

            <span aria-hidden="true" className="mx-auto mb-2 h-1.5 w-28 shrink-0 rounded-full bg-ink/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Pause before she starts, and the pace she types at, in milliseconds. */
const THINK_MS = 1100;
const TYPE_MS = 28;

/**
 * Sofia's opening line, typed: the dots first, then the reply letter by letter,
 * then the booking and the calendar land under it. Mounted with the modal, so
 * it plays on every open. Reduced motion gets the finished thread at once.
 *
 * Only ever rendered once the modal is open, which is after a click — so
 * reading matchMedia in the initial state never runs on the server.
 */
function Opening({ data }: { data: HomeContent["demo"] }) {
  const reply = data.reply ?? "";
  const [shown, setShown] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? reply.length : 0,
  );
  const done = shown >= reply.length;

  useEffect(() => {
    if (done) return;
    let n = shown;
    let tick: number | undefined;
    const wait = window.setTimeout(() => {
      tick = window.setInterval(() => {
        n += 1;
        setShown(n);
        if (n >= reply.length) window.clearInterval(tick);
      }, TYPE_MS);
    }, THINK_MS);
    return () => {
      window.clearTimeout(wait);
      window.clearInterval(tick);
    };
    // runs once per open; `shown` and `done` only seed it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reply]);

  return (
    <>
      {!reply ? null : shown === 0 ? (
        <span
          role="status"
          aria-label={`${data.agentName} is typing`}
          className="suite-pop inline-flex self-start rounded-[16px] rounded-bl-[5px] border border-line bg-white px-4 py-3.5 text-muted"
        >
          <span className="suite-dots">
            <i />
            <i />
            <i />
          </span>
        </span>
      ) : (
        <p
          aria-live="polite"
          className="max-w-[86%] self-start rounded-[16px] rounded-bl-[5px] border border-line bg-white px-3.5 py-2.5 text-[14px] leading-[1.5] text-ink"
        >
          {reply.slice(0, shown)}
          {done ? null : <span className="suite-caret !h-[15px]" />}
        </p>
      )}

      {done
        ? [
            { title: data.bookedTitle, sub: data.bookedSub, tone: "green" as const },
            { title: data.syncedTitle, sub: data.syncedSub, tone: "blue" as const },
          ]
            .filter((note) => note.title)
            .map((note, i) => (
              <span
                key={note.title}
                style={{ animationDelay: `${0.25 + i * 0.35}s` }}
                className="suite-pop flex items-center gap-2.5 self-start rounded-[14px] border border-line bg-white px-3 py-2"
              >
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full ${
                        note.tone === "green" ? "bg-[#dcfce7]" : "bg-brand-soft"
                      }`}
                    >
                      {note.tone === "green" ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 stroke-[#16a34a]" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 stroke-brand" fill="none" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      )}
                    </span>
                    <span className="block text-left">
                      <span className="block text-[12.5px] font-semibold leading-tight text-ink">
                        {note.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-muted">
                        {note.sub}
                      </span>
                    </span>
                  </span>
                ))
        : null}
    </>
  );
}

/** Signal, wifi and battery, at the size a phone draws them. */
function StatusIcons() {
  return (
    <svg viewBox="0 0 66 12" width={58} height={11} aria-hidden="true" className="fill-ink">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.5" y="6" width="3" height="6" rx="1" />
      <rect x="9" y="3.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="1" width="3" height="11" rx="1" />
      <path
        d="M23 4.6a9 9 0 0 1 12 0M25.2 7a5.6 5.6 0 0 1 7.6 0"
        fill="none"
        stroke="currentColor"
        className="stroke-ink"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="29" cy="10" r="1.5" />
      <rect x="40.5" y="1" width="22" height="11" rx="3" fill="none" className="stroke-ink" strokeOpacity=".4" />
      <rect x="42.5" y="3" width="16" height="7" rx="1.5" />
      <rect x="63.5" y="4.5" width="1.6" height="4" rx=".8" opacity=".4" />
    </svg>
  );
}

/** The uploaded portrait, or the brand mark's initial when there is none. */
function Avatar({ src, alt, big }: { src?: string; alt: string; big: boolean }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- uploads have no known size
    return <img src={src} alt={alt} className="size-full rounded-full object-cover" />;
  }
  return (
    <span
      aria-label={alt}
      role="img"
      className={`grid size-full place-items-center rounded-full bg-gradient-to-br from-[#052EFF] to-[#3300EA] font-medium text-white ${
        big ? "text-[34px]" : "text-[15px]"
      }`}
    >
      {alt.trim().charAt(0).toUpperCase() || "S"}
    </span>
  );
}
