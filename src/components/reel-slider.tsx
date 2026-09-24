"use client";

import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { Media } from "@/content/home";

/**
 * Vertical reels, one playing at a time.
 *
 * Only the centred slide plays; the rest pause and dim, so four clips never
 * decode at once. Everything pauses while the slider is off screen, too.
 * `rewind` rather than `loop`, as in the hero: loop clones slides outside
 * React, and the refs to each <video> would miss the clones.
 *
 * Empty slots render as a designed placeholder, so the section already reads
 * right before anyone has uploaded a clip.
 *
 * `fit="column"` is for half a page — the industry hero's right column: fewer
 * slides across, clipped to the column, the edges faded out with a mask (so it
 * fades over whatever sits behind it), and the side reels dimmer still, so the
 * playing one is the one you look at.
 */
const PER_VIEW = {
  row: {
    slidesPerView: 1.25,
    spaceBetween: 16,
    breakpoints: {
      640: { slidesPerView: 2.2, spaceBetween: 20 },
      1024: { slidesPerView: 3.2, spaceBetween: 24 },
      1440: { slidesPerView: 4.2, spaceBetween: 24 },
    },
  },
  column: {
    slidesPerView: 1.5,
    spaceBetween: 14,
    breakpoints: {
      640: { slidesPerView: 2.2, spaceBetween: 18 },
      1024: { slidesPerView: 1.8, spaceBetween: 16 },
      1280: { slidesPerView: 2.1, spaceBetween: 18 },
    },
  },
};

export function ReelSlider({ videos, fit = "row" }: { videos: Media[]; fit?: keyof typeof PER_VIEW }) {
  const column = fit === "column";
  const players = useRef<(HTMLVideoElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  // start on the middle reel so a centred slider has clips on both sides
  const start = Math.floor(videos.length / 2);
  const [active, setActive] = useState(start);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    players.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView) {
        video.muted = muted;
        video.play().catch(() => {}); // autoplay can be refused; never throw
      } else {
        video.pause();
      }
    });
  }, [active, inView, muted]);

  const count = String(videos.length).padStart(2, "0");

  return (
    <div ref={root}>
      <div
        className={
          column
            ? "overflow-hidden py-4 mask-[linear-gradient(90deg,transparent,#000_22%,#000_78%,transparent)]"
            : undefined
        }
      >
        <Swiper
          modules={[A11y, Keyboard]}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActive(s.activeIndex)}
          initialSlide={start}
          rewind
          keyboard
          centeredSlides
          {...PER_VIEW[fit]}
          className="!overflow-visible"
        >
          {videos.map((video, i) => (
            <SwiperSlide key={i}>
              <div
                className={`relative aspect-[9/16] overflow-hidden rounded-[24px] bg-ink shadow-lift transition-[transform,opacity] duration-500 ${
                  i === active ? "scale-100 opacity-100" : column ? "scale-[0.88] opacity-40" : "scale-[0.92] opacity-60"
                }`}
              >
                {video.src ? (
                  <video
                    ref={(el) => {
                      players.current[i] = el;
                    }}
                    src={video.src}
                    muted
                    loop
                    playsInline
                    preload={Math.abs(i - active) <= 1 ? "auto" : "metadata"}
                    aria-label={video.alt || `Reel ${i + 1}`}
                    className="size-full object-cover"
                    onClick={() => (i === active ? setMuted((m) => !m) : swiper?.slideTo(i))}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => swiper?.slideTo(i)}
                    className="grid size-full place-items-center bg-[radial-gradient(120%_80%_at_30%_10%,#3b2cff_0%,#14063f_70%)] text-white"
                    aria-label={`Reel ${i + 1} — no clip uploaded yet`}
                  >
                    <span className="flex flex-col items-center gap-3">
                      <span className="grid size-16 place-items-center rounded-full bg-white/15 backdrop-blur">
                        <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-white" aria-hidden="true">
                          <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z" />
                        </svg>
                      </span>
                      <span className="text-[13px] tracking-[0.08em] text-white/70 uppercase">Reel {i + 1}</span>
                    </span>
                  </button>
                )}

                {/* caption + sound, over a soft fade so white text reads on any clip */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16">
                  <p className="text-[14px] leading-snug font-medium text-white">{video.alt}</p>
                  {video.src && i === active ? (
                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      aria-label={muted ? "Unmute" : "Mute"}
                      className="pointer-events-auto grid size-9 shrink-0 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M11 5 6 9H2v6h4l5 4z" />
                        {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={`${column ? "mt-4" : "mt-10"} flex items-center justify-center gap-5`}>
        <button
          type="button"
          onClick={() => swiper?.slidePrev()}
          aria-label="Previous reel"
          className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand hover:text-brand"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <p className="min-w-[72px] text-center text-[15px] font-medium tabular-nums text-ink" aria-live="polite">
          {String(active + 1).padStart(2, "0")} <span className="text-muted">/ {count}</span>
        </p>
        <button
          type="button"
          onClick={() => swiper?.slideNext()}
          aria-label="Next reel"
          className="grid size-12 place-items-center rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
