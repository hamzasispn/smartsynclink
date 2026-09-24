"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

/** Milliseconds each screen holds before the next slides in. */
const HOLD = 5500;

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The three SmartSync funnel screens as slides.
 *
 * Swiper moves the slides; GSAP only plays what happens *on* a screen once it
 * has arrived — cards landing, the page highlight walking, metrics counting up.
 * Autoplay runs only while the slider is on screen, pauses under the pointer,
 * and never starts under prefers-reduced-motion; arrows, dots, keys and swipes
 * always work.
 *
 * Below md each screen switches to its phone layout (`mobile`), drawn at
 * phone width so it shows whole and at nearly full size, rather than the
 * desktop board shrunk to a fifth. Both are scaled to the slide by
 * <StageScale>; CSS picks which one shows.
 */
export function FunnelShowcase({
  tabs,
  screens,
  width,
  height,
  mobile,
}: {
  tabs: string[];
  screens: ReactNode[];
  width: number;
  height: number;
  /** The same screens laid out for a phone, in the same order. */
  mobile?: { screens: ReactNode[]; width: number; height: number };
}) {
  const root = useRef<HTMLDivElement>(null);

  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    io.observe(el);

    // on a phone the slides do not take swipes: the page scroll does
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);

    return () => {
      io.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  // autoplay only while it can be seen
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    if (inView && !reduced()) swiper.autoplay.start();
    else swiper.autoplay.stop();
  }, [swiper, inView]);

  // what happens on the screen that just slid in
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>(
      `[data-screen="${active}"]`
    );

    if (!el || !inView || reduced()) return;

    const counters = Array.from(
      el.querySelectorAll<HTMLElement>('[data-fa="count"]')
    );

    const finals = counters.map((node) => node.textContent ?? "");

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const out = { ease: "power3.out" };

      gsap.from(q('[data-fa="card"]'), {
        y: 28,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.35,
        ...out,
      });

      gsap.from(q('[data-fa="preview"]'), {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.3,
        ...out,
      });

      gsap.from(q('[data-fa="cta"]'), {
        scale: 0.92,
        autoAlpha: 0,
        duration: 0.6,
        delay: 0.85,
        ...out,
      });

      // The highlight walks the pages, the way a visitor moves through them.
      gsap.to(q('[data-fa="page-active"]'), {
        y: 42.4 * 7,
        duration: 3.5,
        ease: "steps(7)",
        delay: 1.1,
      });
      // the phone editor's pages are steps across the top, lit in turn
      gsap.from(q('[data-fa="page-step"]'), {
        backgroundColor: "#E5E7EB",
        duration: 0.2,
        stagger: 0.5,
        delay: 1.1,
      });

      gsap.from(q('[data-fa="kpi"]'), {
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ...out,
      });

      counters.forEach((node) => {
        const to = Number(node.dataset.to);
        const decimals = Number(node.dataset.decimals);

        const value = { v: 0 };

        gsap.to(value, {
          v: to,
          duration: 1.6,
          delay: 0.5,
          ease: "power2.out",

          onUpdate: () => {
            node.textContent = decimals
              ? value.v.toFixed(decimals)
              : Math.round(value.v).toLocaleString("en-US");
          },
        });
      });

      gsap.from(q('[data-fa="bar"]'), {
        scaleY: 0,
        duration: 0.8,
        stagger: 0.09,
        delay: 0.65,
        ...out,
      });
      // the phone layout's bars run across, so they grow from the left
      gsap.from(q('[data-fa="hbar"]'), {
        scaleX: 0,
        duration: 0.8,
        stagger: 0.09,
        delay: 0.65,
        ...out,
      });

      gsap.from(q('[data-fa="drop"]'), {
        y: 8,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.09,
        delay: 1.25,
        ...out,
      });
    }, el);

    return () => {
      ctx.revert();

      // A count cut off mid-way would otherwise leave the animated value
      // on the card.
      counters.forEach(
        (node, i) => (node.textContent = finals[i])
      );
    };
  }, [active, inView]);

  const arrow =
    "grid size-11 place-items-center rounded-full transition-colors disabled:opacity-40";

  return (
    <div ref={root} className="w-full">
      <Swiper
        modules={[A11y, Autoplay, Keyboard]}
        onSwiper={setSwiper}
        onSlideChange={(s) => setActive(s.realIndex)}
        onAutoplayTimeLeft={(s, _timeLeft, left) => {
          const bar = root.current?.querySelector<HTMLElement>(
            `[data-progress="${s.realIndex}"]`
          );

          if (bar) {
            bar.style.transform = `scaleX(${1 - left})`;
          }
        }}
        autoplay={{
          delay: HOLD,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        rewind
        keyboard
        speed={750}
        spaceBetween={24}
        className="!pb-8"
      >
        {screens.map((screen, i) => (
          <SwiperSlide
            key={tabs[i]}
            aria-label={`${i + 1} of ${screens.length}: ${tabs[i]}`}
          >
            <div
              className={`w-full px-1 pt-1 pb-6 md:px-6 ${
                narrow ? "swiper-no-swiping" : ""
              }`}
            >
              {/* both layouts, each on its own stage; CSS shows one. The
                  animations look inside data-screen, so they find either. */}
              <div data-screen={i}>
                <Stage
                  w={width}
                  h={height}
                  className={mobile ? "hidden md:block" : undefined}
                >
                  {screen}
                </Stage>
                {mobile ? (
                  <Stage w={mobile.width} h={mobile.height} className="mx-auto max-w-105 md:hidden">
                    {mobile.screens[i]}
                  </Stage>
                ) : null}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => swiper?.slidePrev()}
          aria-label="Previous screen"
          className={`${arrow} border border-line bg-white text-ink hover:border-brand hover:text-brand`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-2">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => swiper?.slideTo(i)}
                aria-label={`Show ${tab}`}
                aria-current={active === i}
                className={`relative h-2 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                  active === i
                    ? "w-12 bg-brand/15"
                    : "w-2 bg-ink/20 hover:bg-ink/40"
                }`}
              >
                {active === i ? (
                  <span
                    data-progress={i}
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] will-change-transform"
                  />
                ) : null}
              </button>
            ))}
          </div>

          <p
            className="text-[14px] font-medium text-ink"
            aria-live="polite"
          >
            {tabs[active]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => swiper?.slideNext()}
          aria-label="Next screen"
          className={`${arrow} bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white hover:opacity-90`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** One drawn screen: a board of w × h, scaled as a piece to the stage's width. */
function Stage({ w, h, className = "", children }: { w: number; h: number; className?: string; children: ReactNode }) {
  return (
    <div
      className={`suite-stage relative w-full overflow-hidden rounded-[14px] shadow-[0_16px_36px_-20px_rgba(14,14,20,0.4)] ring-1 ring-black/5 ${className}`}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <div className="suite-board" style={{ width: w, height: h, ["--stage-w" as string]: `${w}px` }}>
        {children}
      </div>
    </div>
  );
}
