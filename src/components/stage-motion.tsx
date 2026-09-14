"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGsap } from "@/lib/use-gsap";

/**
 * Entrance and idle motion for the SmartSync Suite stage.
 *
 * The mockup itself is server-rendered markup; this only finds its hooks —
 * [data-sa] on the two shots, [data-a] on the thread rows — and moves them.
 * Everything animates *in* with from(), so with reduced motion (where useGsap
 * does nothing) the stage simply sits there complete.
 */
export function StageMotion({
  children,
  className,
  style,
  label,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(ref, (gsap, el) => {
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
    });

    tl.from(q('[data-sa="board"]'), { y: 60, autoAlpha: 0, duration: 0.9 })
      .from(q('[data-a="row"]'), { x: -24, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, "-=0.45")
      .from(
        q('[data-sa="phone"]'),
        { y: 160, rotate: 5, autoAlpha: 0, duration: 1, ease: "back.out(1.2)" },
        "-=0.6",
      )
      .from(q('[data-a="prow"]'), { y: 18, autoAlpha: 0, duration: 0.45, stagger: 0.08 }, "-=0.5")
      // once it has landed the phone keeps breathing, so the stage never
      // looks like a flat screenshot
      .to(q('[data-sa="float"]'), {
        y: -14,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
  });

  return (
    <div ref={ref} role="img" aria-label={label} className={className} style={style}>
      {children}
    </div>
  );
}
