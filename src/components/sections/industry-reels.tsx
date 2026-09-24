import type { IndustryContent } from "@/content/industry";
import { ReelSlider } from "../reel-slider";
import { Reveal } from "../reveal";
import { Container, SectionHead } from "../ui";

/** Vertical reels for an industry page. With no slots at all the section stays out. */
export function IndustryReels({ data }: { data: IndustryContent["reels"] }) {
  if (!data?.videos?.length) return null;

  return (
    <section id="reels" className="overflow-hidden bg-page py-14 md:py-24 lg:py-28">
      <Container>
        <Reveal>
          <SectionHead badge={data.badge} heading={data.heading} subheading={data.subheading} />
        </Reveal>
        <Reveal className="mt-14" delay={0.1}>
          <ReelSlider videos={data.videos} />
        </Reveal>
      </Container>
    </section>
  );
}
