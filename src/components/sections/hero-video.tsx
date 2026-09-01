import type { HomeContent } from "@/content/home";
import { PlayTarget } from "../ui";

export function HeroVideo({ data }: { data: HomeContent["heroVideo"] }) {
  // Until a clip is uploaded in the dashboard this stays the flat placeholder
  // band from the design, so the page never shows an empty black box.
  if (!data.video?.src) {
    return (
      <section>
        <a
          href="#demo"
          aria-label={`Play ${data.label}`}
          className="group relative flex aspect-21/9 items-center justify-center overflow-hidden bg-[#D9D9D9]"
        >
          <PlayTarget />
        </a>
      </section>
    );
  }

  return (
    <section>
      <video
        src={data.video.src}
        aria-label={data.video.alt || data.label}
        controls
        playsInline
        preload="metadata"
        className="aspect-21/9 w-full bg-[#D9D9D9] object-cover"
      />
    </section>
  );
}
