"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Seconds each screen holds before the next comes round. */
const HOLD = 5.5;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The three SmartSync funnel screens on one scaled stage, taking turns.
 *
 * Which screen shows is React state, so the tabs work with motion turned off
 * and before any timeline exists; GSAP only animates the change. Autoplay
 * waits until the stage is actually on screen and holds while the pointer is
 * over it — nobody wants the metrics swapped out while they're reading them.
 */
export function FunnelShowcase({
  tabs,
  screens,
  width,
  height,
}: {
  tabs: string[];
  screens: ReactNode[];
  width: number;
  height: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // autoplay, with the active tab's progress bar filling toward the switch
  useEffect(() => {
    const bar = root.current?.querySelector<HTMLElement>(`[data-progress="${active}"]`);
    if (!inView || paused || reduced()) {
      if (bar) gsap.set(bar, { scaleX: 0 });
      return;
    }
    const fill = bar ? gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: "none" }) : null;
    const next = gsap.delayedCall(HOLD, () => setActive((a) => (a + 1) % screens.length));
    return () => {
      next.kill();
      fill?.kill();
    };
  }, [active, inView, paused, screens.length]);

  // what happens on the screen that just came in
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>(`[data-screen="${active}"]`);
    if (!el || !inView || reduced()) return;

    const counters = Array.from(el.querySelectorAll<HTMLElement>('[data-fa="count"]'));
    const finals = counters.map((node) => node.textContent ?? "");

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const out = { ease: "power3.out" };

      // opacity, never autoAlpha, on the screen itself: its visibility belongs to
      // React. autoAlpha records visibility too, and ctx.revert() on the way out
      // wrote "visible" back onto the screen being left — the topmost one
      // (Metrics) then covered every tab after it.
      gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ...out });

      gsap.from(q('[data-fa="card"]'), { y: 28, autoAlpha: 0, duration: 0.7, stagger: 0.12, delay: 0.2, ...out });

      gsap.from(q('[data-fa="preview"]'), { y: 60, autoAlpha: 0, duration: 0.9, delay: 0.15, ...out });
      gsap.from(q('[data-fa="cta"]'), { scale: 0.92, autoAlpha: 0, duration: 0.6, delay: 0.7, ...out });
      // the highlight walks the pages, the way a visitor moves through them
      gsap.to(q('[data-fa="page-active"]'), {
        y: 42.4 * 7,
        duration: 3.5,
        ease: "steps(7)",
        delay: 1,
      });

      gsap.from(q('[data-fa="kpi"]'), { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1, delay: 0.15, ...out });
      counters.forEach((node) => {
        const to = Number(node.dataset.to);
        const decimals = Number(node.dataset.decimals);
        const value = { v: 0 };
        gsap.to(value, {
          v: to,
          duration: 1.6,
          delay: 0.35,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = decimals
              ? value.v.toFixed(decimals)
              : Math.round(value.v).toLocaleString("en-US");
          },
        });
      });
      gsap.from(q('[data-fa="bar"]'), { scaleY: 0, duration: 0.8, stagger: 0.09, delay: 0.5, ...out });
      gsap.from(q('[data-fa="drop"]'), { y: 8, autoAlpha: 0, duration: 0.4, stagger: 0.09, delay: 1.1, ...out });
    }, el);

    return () => {
      ctx.revert();
      // a count cut off mid-way would otherwise leave "1,204" on the card
      counters.forEach((node, i) => (node.textContent = finals[i]));
    };
  }, [active, inView]);

  return (
    <div ref={root} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div role="tablist" aria-label="SmartSync funnel screens" className="flex justify-center gap-2 sm:gap-2.5">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`relative overflow-hidden rounded-full px-3.5 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors sm:px-5 sm:py-2.5 sm:text-[15px] ${
              active === i
                ? "bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white"
                : "bg-white text-ink ring-1 ring-line hover:ring-ink/20"
            }`}
          >
            {tab}
            <span
              aria-hidden="true"
              data-progress={i}
              className="absolute right-4 bottom-1 left-4 h-[2px] origin-left scale-x-0 rounded-full bg-white/70"
            />
          </button>
        ))}
      </div>

      {/* On a phone the screens would scale down past reading, so below md
          they keep a readable width and the strip scrolls sideways instead —
          the page itself never does. */}
      <div className="-mx-6 mt-8 overflow-x-auto px-6 pb-4 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
      <div
        className="suite-stage relative w-full min-w-220 overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(14,14,20,0.35)] ring-1 ring-black/5 md:min-w-0"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <div className="suite-board" style={{ width, height, ["--stage-w" as string]: `${width}px` }}>
          {screens.map((screen, i) => (
            <div
              key={tabs[i]}
              data-screen={i}
              role="tabpanel"
              aria-label={tabs[i]}
              aria-hidden={active !== i}
              className="absolute inset-0"
              style={{ visibility: active === i ? "visible" : "hidden", zIndex: active === i ? 1 : 0 }}
            >
              {screen}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
