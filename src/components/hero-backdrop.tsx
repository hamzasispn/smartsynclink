import Image from "next/image";
import type { Media } from "@/content/home";

/**
 * The hero backdrop. One image is a static background; two or more crossfade.
 *
 * Done with a single generated keyframe plus negative animation delays rather
 * than a client component with a timer: no JavaScript, no hydration flash, and
 * it works for any number of images the dashboard happens to hold.
 */
export function HeroBackdrop({
  images,
  seconds = 7,
}: {
  images: Media[];
  seconds?: number;
}) {
  const slides = (images ?? []).filter((image) => image?.src);
  if (!slides.length) return null;

  const each = Math.max(3, seconds || 7);
  const total = each * slides.length;
  const slice = 100 / slides.length;
  const fade = Math.min(slice * 0.35, 8);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {slides.length > 1 ? (
        <style>{`
          @keyframes heroBackdrop {
            0%              { opacity: 0 }
            ${fade.toFixed(2)}%  { opacity: 1 }
            ${(slice - fade).toFixed(2)}% { opacity: 1 }
            ${slice.toFixed(2)}% { opacity: 0 }
            100%            { opacity: 0 }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-slide { animation: none !important; opacity: 0 !important }
            .hero-slide:first-of-type { opacity: 1 !important }
          }
        `}</style>
      ) : null}

      {slides.map((image, i) => (
        <Image
          key={`${image.src}-${i}`}
          src={image.src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className="hero-slide object-cover"
          style={
            slides.length > 1
              ? {
                  opacity: i === 0 ? 1 : 0,
                  animation: `heroBackdrop ${total}s linear infinite`,
                  // negative delay starts each slide already part-way through,
                  // which is what staggers them across the cycle
                  animationDelay: `-${((total / slides.length) * (slides.length - i)).toFixed(2)}s`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
