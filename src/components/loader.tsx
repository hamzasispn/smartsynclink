"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { SiteLogo } from "./site-logo";

/** The mark is 42 of the logo's 268 viewBox units wide. */
const MARK_ONLY = "inset(0% 84.3% 0% 0%)";
const WHOLE_LOGO = "inset(0% 0% 0% 0%)";

/** Long enough for the intro to finish, so a fast load does not flash. */
const MIN_MS = 1500;
/** Never trap the visitor if `load` refuses to fire (a stalled image, say). */
const MAX_MS = 6000;

/**
 * First-paint loader.
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

    const ctx = gsap.context(() => {
      const logo = el.querySelector(".loader-logo") as HTMLElement;
      const mark = el.querySelector(".logo-spin");
      const accents = el.querySelectorAll('.logo-spin path[fill="#3300EA"]');
      const bar = el.querySelector(".loader-bar");

      if (reduced) {
        gsap.set(logo, { autoAlpha: 1, clipPath: WHOLE_LOGO });
        return;
      }

      gsap.set(logo, { autoAlpha: 1, clipPath: MARK_ONLY });

      const intro = gsap.timeline();
      intro
        // the mark lands first, overshooting so it arrives with some weight
        .from(mark, {
          scale: 0,
          rotation: -270,
          autoAlpha: 0,
          transformOrigin: "21px 21px",
          duration: 0.9,
          ease: "back.out(1.5)",
        })
        // the two violet shapes are the only colour in the mark — worth a beat
        // of their own rather than arriving with everything else
        .from(
          accents,
          {
            scale: 0,
            autoAlpha: 0,
            transformOrigin: "21px 21px",
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(3)",
          },
          "-=0.35",
        )
        // then the clip opens rightward and the wordmark wipes in behind it
        .to(
          logo,
          { clipPath: WHOLE_LOGO, duration: 0.75, ease: "power4.inOut" },
          "-=0.15",
        )
        .to(bar, { scaleX: 0.75, duration: 1.1, ease: "power2.out" }, 0.3);

      // keeps turning while the page is still arriving, so a slow load never
      // looks like a frozen screen
      gsap.to(mark, {
        rotation: "+=360",
        transformOrigin: "21px 21px",
        duration: 4,
        ease: "none",
        repeat: -1,
        delay: 1.1,
      });
    }, el);

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
        .to(el.querySelector(".loader-bar"), { scaleX: 1, duration: 0.25 }, 0)
        .to(el, { yPercent: -100, duration: 0.75, ease: "power4.inOut" }, "-=0.15");
    };

    Promise.race([Promise.all([ready, settled]), capped]).then(leave);

    return () => {
      ctx.revert();
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
      {/* autoAlpha starts it hidden; GSAP reveals it once the timeline owns it */}
      <div className="loader-logo invisible opacity-0">
        <SiteLogo height={56} label="SmartSyncLink" />
      </div>

      <div className="h-[3px] w-[160px] overflow-hidden rounded-full bg-black/8">
        <div className="loader-bar h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA]" />
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}
