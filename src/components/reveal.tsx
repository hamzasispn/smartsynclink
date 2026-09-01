"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

/**
 * Scroll entrance for a block of content.
 *
 * Renders a plain div, so it can replace a grid or flex container without
 * changing the DOM shape — the same className goes on it and the layout is
 * untouched. With `stagger`, the container's direct children come in one after
 * another; without it the block moves as one.
 *
 * Mobile gets its own numbers rather than the desktop ones scaled down: short
 * viewports mean an element is barely past the fold when it triggers, so the
 * travel is smaller and the trigger point later, or the animation is still
 * running when the reader has already arrived.
 */
export function Reveal({
  children,
  className,
  stagger = 0,
  delay = 0,
  y,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  /** Hold before this block starts, so a heading lands before its grid does. */
  delay?: number;
  y?: number;
  as?: "div" | "section" | "ul";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(ref, (gsap, el) => {
    const phone = window.matchMedia("(max-width: 640px)").matches;
    const targets = stagger ? Array.from(el.children) : [el];
    if (!targets.length) return;

    gsap.from(targets, {
      autoAlpha: 0,
      y: y ?? (phone ? 18 : 32),
      duration: phone ? 0.5 : 0.7,
      ease: "power3.out",
      delay,
      // a phone still needs to read as one-after-another; the old 0.08 cap
      // squashed every grid into what looked like a single simultaneous pop
      stagger: phone ? Math.min(stagger, 0.13) : stagger,
      scrollTrigger: {
        trigger: el,
        // a phone shows so little at once that "top 88%" fires while the block
        // is still off screen; it needs to be further in before it starts
        start: phone ? "top 95%" : "top 88%",
        once: true,
      },
    });
  });

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
