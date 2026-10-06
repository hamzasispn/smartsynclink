"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { SiteLogo } from "./site-logo";

/** What the curtain says under the logo, word by word; the second sentence in the brand gradient. */
const TAGLINE: [string, boolean][] = [
  ["Every", false],
  ["call", false],
  ["answered.", false],
  ["Every", true],
  ["lead", true],
  ["booked.", true],
];

/** Long enough for the intro to finish, so a fast load does not flash. */
const MIN_MS = 1500;
/** Never trap the visitor if `load` refuses to fire (a stalled image, say). */
// 3.5s, not 6: `load` waits on every image, and on a phone that was most of
// what made the site feel slow — the page is ready well before its pictures
const MAX_MS = 3500;

/**
 * First-paint loader.
 *
 * The intro is CSS (see "first-paint loader" in globals.css), so the logo and
 * the line are there from the first paint rather than once the JavaScript has
 * arrived. This only decides when the curtain lifts, and lifts it.
 *
 * Deliberately not built on useGsap: that hook skips its whole body under
 * prefers-reduced-motion, which for a full-screen overlay would mean it never
 * animates *out* either. Here reduced motion takes its own path — the curtain
 * still lifts, it just does not perform on the way.
 *
 * Only runs once. It lives in the root layout and stays mounted across client
 * navigation, so it never reappears between pages.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // the page behind must not scroll while the curtain is up
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ready = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const settled = new Promise<void>((resolve) => setTimeout(resolve, MIN_MS));
    const capped = new Promise<void>((resolve) => setTimeout(resolve, MAX_MS));

    let left = false;
    const leave = () => {
      if (left) return;
      left = true;

      const finish = () => {
        document.body.style.overflow = previousOverflow;
        setGone(true);
      };

      if (reduced) {
        finish();
        return;
      }

      gsap
        .timeline({ onComplete: finish })
        .to(el.querySelector(".loader-logo"), {
          scale: 1.1,
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in",
        })
        .to(el.querySelector(".loader-line"), { y: -8, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
        .to(el, { yPercent: -100, duration: 0.75, ease: "power4.inOut" }, "-=0.15");
    };

    Promise.race([Promise.all([ready, settled]), capped]).then(leave);

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="site-loader fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-7 bg-page"
      role="status"
      aria-live="polite"
    >
      <div className="loader-logo">
        <SiteLogo height={56} label="SmartSyncLink" />
      </div>

      {/* word by word in CSS (.loader-word), so the line starts with the first paint, not the script */}
      <p aria-hidden="true" className="loader-line px-6 text-center text-[16px] font-medium tracking-[-0.01em] text-[#1e1e1e] sm:text-[18px]">
        {TAGLINE.map(([word, accent], i) => (
          <span
            key={i}
            className={`loader-word inline-block ${i < TAGLINE.length - 1 ? "mr-[0.28em]" : ""} ${
              accent ? "bg-gradient-to-r from-[#052EFF] to-[#3300EA] bg-clip-text text-transparent" : ""
            }`}
            style={{ "--i": i } as React.CSSProperties}
          >
            {word}
          </span>
        ))}
      </p>

      <span className="sr-only">Loading</span>
    </div>
  );
}
