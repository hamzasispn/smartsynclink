"use client";

import { useEffect } from "react";

/**
 * Feeds every [data-fill] element the cursor's entry point as --mx/--my, so
 * the hover fill in globals.css grows from where the pointer actually crossed
 * the edge.
 *
 * One delegated listener for the whole document rather than handlers per
 * button: buttons stay server components, and nothing extra hydrates.
 * pointerover (not pointermove) is enough — the fill starts from the entry
 * point and the rest is the CSS transition, so there is no per-frame work.
 */
export function PointerFill() {
  useEffect(() => {
    const onOver = (e: PointerEvent) => {
      // touch reports a pointerover that then sticks as a stuck hover
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest?.(
        "[data-fill]",
      ) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    document.addEventListener("pointerover", onOver);
    return () => document.removeEventListener("pointerover", onOver);
  }, []);

  return null;
}
