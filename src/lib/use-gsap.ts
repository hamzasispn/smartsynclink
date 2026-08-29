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
  setup: (g: typeof gsap, el: T) => void,
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => setup(gsap, el));

    // Fonts and images land after layout, which moves every trigger point.
    ScrollTrigger.refresh();

    return () => mm.revert();
    // setup is defined inline at the call site; re-running on every render
    // would restart the timeline, so mount-only is deliberate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
