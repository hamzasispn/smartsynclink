"use client";

import { useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import type { Media } from "@/content/home";
import { Placeholder } from "./ui";

/**
 * The hero clip, or a crossfading playlist of them.
 *
 * Advancing is driven by the clip itself, not a timer: each video calls
 * slideNext when it ends, so a slide never cuts away mid-sentence and the
 * dashboard can mix clips of any length.
 *
 * `rewind` rather than `loop` on purpose — loop mode clones slide DOM, and a
 * cloned <video> is outside React so the refs below would miss it. Rewind
 * returns to the first slide with no clones at all.
 *
 * mix-blend-multiply is what drops the clip's white background out against the
 * page, which is why the uploader insists on white-background 16:9 footage.
 *
 * brightness-[1.03] is tolerance, not decoration. Multiply only erases a
 * background that is exactly #FFFFFF; an exported clip often lands on
 * #FCFCFC and those three levels show as a faint box against the page. The
 * lift clamps anything from 248 up to pure white and moves midtones by a
 * fraction nobody sees.
 *
 * ponytail: a fixed 3% covers the usual encoder drift, nothing more. A clip
 * whose backdrop is genuinely grey still needs re-exporting on white.
 *
 * That blend sits on the Swiper root, never on the <video>. Swiper transforms
 * .swiper-wrapper and fades .swiper-slide with opacity, and each of those makes
 * a stacking context — a blend on the video would be trapped inside its own
 * slide with nothing behind it. Applied to the root, the slides composite
 * together first and the finished frame multiplies with the section.
 */
export function HeroVideos({ videos }: { videos: Media[] }) {
  const clips = (videos ?? []).filter((clip) => clip?.src);
  const players = useRef<(HTMLVideoElement | null)[]>([]);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const playOnly = (index: number) => {
    players.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        // autoplay can still be refused; a stalled slide must not throw
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  if (!clips.length) {
    return (
      <Placeholder
        label="Hero video — white background, 16:9"
        className="h-full w-full"
      />
    );
  }

  if (clips.length === 1) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-label={clips[0].alt}
        className="h-full w-full object-cover brightness-[1.03] mix-blend-multiply"
      >
        <source src={clips[0].src} />
      </video>
    );
  }

  return (
    <Swiper
      modules={[EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      rewind
      // it is a playlist, not a carousel — dragging it would fight the videos
      allowTouchMove={false}
      speed={700}
      onSwiper={(instance) => {
        setSwiper(instance);
        playOnly(0);
      }}
      onSlideChange={(instance) => playOnly(instance.activeIndex)}
      className="h-full w-full mix-blend-multiply"
    >
      {clips.map((clip, i) => (
        <SwiperSlide key={`${clip.src}-${i}`}>
          <video
            ref={(el) => {
              players.current[i] = el;
            }}
            muted
            playsInline
            preload="auto"
            autoPlay={i === 0}
            onEnded={() => swiper?.slideNext()}
            aria-label={clip.alt}
            className="h-full w-full object-cover brightness-[1.03]"
          >
            <source src={clip.src} />
          </video>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
