"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scoped GSAP setup for one element.
 *
 * Everything `setup` creates is reverted on unmount (matchMedia owns the
 * context), and the whole block is skipped when the visitor has asked for
 * reduced motion — so the markup must be readable with no animation applied.
 * That means: animate *in* with `.from()`, never leave elements hidden by CSS.
 */
export function useGsap<T extends Element>(
  ref: RefObject<T | null>,
  /** May return a cleanup, for anything it starts that GSAP does not own (an observer, say). */
  setup: (g: typeof gsap, el: T) => void | (() => void),
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (context) => {
      const cleanup = setup(gsap, el);

      // Endless idle loops (repeat: -1) change something every frame, and on a
      // page this long every frame re-layerizes all of it — even when the loop
      // is off screen. Hold them while their element is out of view; the
      // attribute does the same for CSS keyframe loops inside it (globals.css).
      const held: gsap.core.Animation[] = [];
      const io = new IntersectionObserver(([entry]) => {
        el.toggleAttribute("data-offscreen", !entry.isIntersecting);
        if (entry.isIntersecting) {
          held.splice(0).forEach((a) => a.resume());
          return;
        }
        for (const a of context.data as gsap.core.Animation[]) {
          // repeat: -1 is stored as a 1e10 total duration, and it propagates to a parent timeline
          if (typeof a.totalDuration === "function" && a.totalDuration() >= 1e10 && !a.paused()) held.push(a.pause());
        }
      });
      io.observe(el);
      return () => {
        io.disconnect();
        el.removeAttribute("data-offscreen");
        cleanup?.();
      };
    });

    // Fonts and images land after layout, which moves every trigger point.
    ScrollTrigger.refresh();

    return () => mm.revert();
    // setup is defined inline at the call site; re-running on every render
    // would restart the timeline, so mount-only is deliberate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
