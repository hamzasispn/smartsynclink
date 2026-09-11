"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HomeContent } from "@/content/home";

/**
 * The voice agent demo, over the page.
 *
 * Opened by any link pointing at #demo — the hero's "Watch 3-Minute Demo", the
 * Try Now pill in the closing call to action, the play buttons on the video
 * bands. One delegated listener rather than a handler per button: the buttons
 * are content, an editor can point a new one at #demo tomorrow, and it will
 * work without anyone touching this file.
 *
 * The third-party widget script loads on first open, never on page load — it
 * is a third-party bundle and nobody should pay for it just by visiting.
 */
export function DemoModal({ data }: { data: HomeContent["demo"] }) {
  const [open, setOpen] = useState(false);
  const card = useRef<HTMLDivElement>(null);
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

  /* ---- escape, and the page must not scroll behind the card ---- */
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

  /* ---- the card leans toward the pointer ---- */
  const tilt = (event: React.MouseEvent) => {
    const el = card.current;
    if (!el || window.matchMedia("(max-width: 768px)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-y", `${x * 12}deg`);
    el.style.setProperty("--tilt-x", `${-y * 12}deg`);
  };
  const level = () => {
    card.current?.style.setProperty("--tilt-x", "0deg");
    card.current?.style.setProperty("--tilt-y", "0deg");
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${data.agentName} — ${data.role}`}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="demo-halo relative my-auto w-full max-w-[440px]">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 grid size-9 place-items-center rounded-full bg-white text-ink shadow-lift transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-current">
            <path d="m10 8.6 5-5 1.4 1.4-5 5 5 5-1.4 1.4-5-5-5 5L3.6 15l5-5-5-5L10 3.6z" />
          </svg>
        </button>

        <div
          ref={card}
          onMouseMove={tilt}
          onMouseLeave={level}
          className="demo-card relative flex flex-col overflow-hidden rounded-[24px] bg-white shadow-lift"
        >
          {/* header */}
          <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-5 py-4">
            <span className="relative size-10 shrink-0">
              <Avatar src={data.avatar?.src} alt={data.avatar?.alt || data.agentName} big={false} />
              <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-[#3300EA] bg-[#22c55e]" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">
              {data.headerTitle}
            </span>
          </div>

          {/* body */}
          <div className="relative flex flex-1 flex-col items-center gap-1 overflow-hidden bg-page px-4 pt-6 pb-5">
            {/* ripples, behind everything */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 size-[100px] -translate-x-1/2 -translate-y-1/2"
            >
              <span className="demo-ripple" />
              <span className="demo-ripple" />
              <span className="demo-ripple" />
            </div>

            <Badge
              className="absolute top-5 right-4"
              title={data.bookedTitle}
              sub={data.bookedSub}
              tone="green"
            />
            <Badge
              className="absolute bottom-24 left-3 [animation-delay:-1.75s]"
              title={data.syncedTitle}
              sub={data.syncedSub}
              tone="blue"
            />

            {/* agent */}
            <div className="relative z-[3] flex flex-col items-center gap-1.5">
              <span className="size-24 rounded-full border border-line bg-white p-1 shadow-card">
                <Avatar
                  src={data.avatar?.src}
                  alt={data.avatar?.alt || data.agentName}
                  big
                />
              </span>
              <span className="mt-1 flex items-center gap-2">
                <span className="text-[20px] font-bold tracking-[-0.02em] text-ink">
                  {data.agentName}
                </span>
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-[0.05em] text-brand">
                  {data.agentBadge}
                </span>
              </span>
              <span className="text-[13px] text-muted">{data.role}</span>
            </div>

            {/* the widget mounts here */}
            <div
              ref={embed}
              className="relative z-[2] min-h-[220px] w-full [&_iframe]:!w-full [&>div]:!w-full"
            />

            <p className="relative z-[3] mt-2 w-[calc(100%-20px)] rounded-[14px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-4 py-3 text-center text-[13px] text-white/75 blur-[1px]">
              {data.reply}
            </p>
          </div>

          {/* typing */}
          <div className="flex shrink-0 items-center gap-2.5 bg-white px-4 pt-3.5 pb-4.5">
            <span className="size-7 shrink-0 overflow-hidden rounded-full border border-line">
              <Avatar src={data.avatar?.src} alt="" big={false} />
            </span>
            <span className="flex items-center gap-1 rounded-2xl bg-surface px-3.5 py-2">
              <i className="demo-dot" />
              <i className="demo-dot" />
              <i className="demo-dot" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The uploaded portrait, or the brand mark's initial when there is none. */
function Avatar({ src, alt, big }: { src?: string; alt: string; big: boolean }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- uploads have no known size
    return (
      <img
        src={src}
        alt={alt}
        className="size-full rounded-full object-cover"
      />
    );
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

function Badge({
  title,
  sub,
  tone,
  className = "",
}: {
  title: string;
  sub: string;
  tone: "green" | "blue";
  className?: string;
}) {
  return (
    <span
      className={`demo-float z-[5] flex items-center gap-2.5 rounded-[12px] bg-white px-3.5 py-2.5 shadow-lift ${className}`}
    >
      <span
        className={`grid size-6 shrink-0 place-items-center ${
          tone === "green" ? "rounded-full bg-[#dcfce7]" : "rounded-md bg-brand-soft"
        }`}
      >
        {tone === "green" ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 stroke-[#16a34a]" fill="none" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 stroke-brand" fill="none" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )}
      </span>
      <span className="block text-left">
        <span className="block text-[12px] font-bold leading-tight text-ink">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-tight text-muted">{sub}</span>
      </span>
    </span>
  );
}
