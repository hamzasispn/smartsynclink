import type { HomeContent } from "@/content/home";
import { Container, PlayTarget } from "../ui";

export function ShowcaseVideo({
  data,
}: {
  data: HomeContent["showcaseVideo"];
}) {
  return (
    <section className="pb-24 lg:pb-28">
      <Container>
        {data.video?.src ? (
          <video
            src={data.video.src}
            aria-label={data.video.alt || data.label}
            controls
            playsInline
            preload="metadata"
            className="aspect-21/9 w-full rounded-[26px] bg-ink object-cover"
          />
        ) : (
          <a
            href="#demo"
            aria-label={`Play ${data.label}`}
            className="group relative flex aspect-21/9 items-center justify-center overflow-hidden rounded-[26px] bg-ink"
          >
            <PlayTarget tone="dark" />
          </a>
        )}
      </Container>
    </section>
  );
}
