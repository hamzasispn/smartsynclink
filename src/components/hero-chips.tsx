"use client";

import { useEffect, useRef } from "react";

/**
 * The four pieces of the system, pinned around the hero heading's corners —
 * each tilted its own way and drifting on its own beat (.hero-float, staggered
 * by --i). Every couple of seconds one of them, picked at random, does
 * something small and random to catch the eye: a wiggle, a pop, a jump or a
 * glow (.hero-chip[data-nudge] in globals.css).
 *
 * Sits inside the heading's own box (see Hero), so the corners are the
 * heading's corners at every width. Under reduced motion they simply sit there.
 */
const CHIPS = [
  {
    label: "Website",
    spot: "-top-10 left-[-2%] sm:-top-9 sm:-left-3 lg:-left-8",
    tilt: -8,
    icon: (
      <>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M2.5 12h19M12 2.5a14.5 14.5 0 0 1 0 19M12 2.5a14.5 14.5 0 0 0 0 19" />
      </>
    ),
  },
  {
    label: "Integrations",
    spot: "-top-12 right-[-2%] sm:-top-11 sm:-right-3 lg:-right-10",
    tilt: 7,
    icon: <path d="M9 2.5v5M15 2.5v5M6 7.5h12v4a6 6 0 0 1-12 0v-4ZM12 17.5v4" />,
  },
  {
    label: "Funnels",
    spot: "-bottom-10 left-[4%] sm:left-0 lg:-left-3",
    tilt: 6,
    icon: <path d="M3 4h18l-7 8.5V19l-4 2v-8.5L3 4Z" />,
  },
  {
    label: "AI Calls",
    spot: "-bottom-8 right-[3%] sm:-bottom-9 sm:right-2 lg:right-4",
    tilt: -6,
    icon: (
      <>
        <path d="M6.6 3h3l1.5 4.2-2 1.4a12 12 0 0 0 5.3 5.3l1.4-2 4.2 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z" />
        <path d="M17.5 2.5v4M15.5 4.5h4" />
      </>
    ),
  },
];

const NUDGES = ["wiggle", "pop", "jump", "glow"];

export function HeroChips() {
  const chips = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let last = -1;
    const nudge = () => {
      if (!document.hidden) {
        // a different chip from the last one, so it reads as random, not stuck
        let i = Math.floor(Math.random() * CHIPS.length);
        if (i === last) i = (i + 1) % CHIPS.length;
        last = i;
        const chip = chips.current[i];
        if (chip) {
          chip.dataset.nudge = NUDGES[Math.floor(Math.random() * NUDGES.length)];
          window.setTimeout(() => delete chip.dataset.nudge, 950);
        }
      }
      timer = window.setTimeout(nudge, 1600 + Math.random() * 2200);
    };
    timer = window.setTimeout(nudge, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ul
      aria-label="Included"
      className="rise pointer-events-none absolute inset-0 text-[12px] sm:text-[13px] lg:text-[14px]"
      style={{ "--i": 1 } as React.CSSProperties}
    >
      {CHIPS.map((chip, i) => (
        <li
          key={chip.label}
          className={`hero-float absolute ${chip.spot}`}
          // the resting tilt; while floating, heroFloat carries it instead
          style={{ "--tilt": `${chip.tilt}deg`, "--i": i, transform: `rotate(${chip.tilt}deg)` } as React.CSSProperties}
        >
          <span
            ref={(el) => {
              chips.current[i] = el;
            }}
            className="hero-chip inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/10 bg-white px-3 py-1.5 font-medium text-ink shadow-[0_8px_20px_-10px_rgba(14,14,20,0.35)]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-[1.2em] shrink-0 text-brand"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {chip.icon}
            </svg>
            {chip.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
