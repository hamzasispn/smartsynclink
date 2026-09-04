"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/content/home";
import { Placeholder } from "./ui";

/** Five frames a second. Five frames, two passes: two seconds end to end. */
const FRAME_MS = 200;
/** Two passes through the sequence, then it rests. */
const PASSES = 2;

/**
 * A frame sequence that plays on hover and returns to frame one on leave.
 *
 * Every frame is in the DOM from the start, stacked and switched by opacity
 * rather than swapping one `src`. A single <img> whose src changes would show
 * a blank gap on the first pass while each new frame downloads, which at one
 * frame per second is impossible to miss. Stacked, the browser fetches them
 * while the card is on its way up the page and the hover is instant.
 *
 * The pointer listeners go on the surrounding card, not on this element, so
 * hovering anywhere on the card plays the sequence — the image is only part of
 * what the visitor is pointing at.
 */
export function Flipbook({
  frames,
  className = "",
  sizes = "100vw",
}: {
  frames: Media[];
  className?: string;
  sizes?: string;
}) {
  const shots = (frames ?? []).filter((frame) => frame?.src);
  const root = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el || shots.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // the card, so the whole tile is the hover target
    const card = el.closest("article") ?? el;
    let timer: ReturnType<typeof setInterval> | undefined;

    const play = () => {
      clearInterval(timer);
      let step = 0;
      // frame 0 is already on screen, so a full run is one short of the total
      const steps = shots.length * PASSES - 1;
      timer = setInterval(() => {
        step += 1;
        setFrame(step % shots.length);
        if (step >= steps) clearInterval(timer);
      }, FRAME_MS);
    };

    const stop = () => {
      clearInterval(timer);
      setFrame(0);
    };

    card.addEventListener("pointerenter", play);
    card.addEventListener("pointerleave", stop);
    return () => {
      clearInterval(timer);
      card.removeEventListener("pointerenter", play);
      card.removeEventListener("pointerleave", stop);
    };
  }, [shots.length]);

  if (!shots.length) {
    return <Placeholder label="Industry frames" className={className} />;
  }

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      {shots.map((shot, i) => (
        <Image
          key={shot.src}
          src={shot.src}
          alt={i === 0 ? shot.alt : ""}
          fill
          sizes={sizes}
          // the resting frame is the one worth fetching early
          priority={false}
          loading={i === 0 ? "eager" : "lazy"}
          aria-hidden={i === 0 ? undefined : true}
          className={`object-cover ${
            i === frame ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
