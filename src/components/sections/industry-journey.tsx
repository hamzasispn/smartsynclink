import type { IndustryContent } from "@/content/industry";
import { Reveal } from "../reveal";
import { Container, Media, SectionHead } from "../ui";

export function IndustryJourney({
  data,
}: {
  data: IndustryContent["journey"];
}) {
  return (
    <section id="journey" className="py-20 lg:py-24">
      <Container>
        <Reveal>
          <SectionHead
            badge={data.badge}
            heading={data.heading}
            subheading={data.body}
          />
        </Reveal>

        <Reveal
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-12"
          stagger={0.14}
          delay={0.18}
        >
          {data.steps.map((step) => (
            <article
              key={step.step}
              className={`flex flex-col overflow-hidden rounded-[16px] ${
                step.wide ? "lg:col-span-6" : "lg:col-span-3"
              } ${
                step.highlight
                  ? "bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white"
                  : "bg-surface text-ink"
              }`}
            >
              <div className="p-6">
                <h3 className="text-[17px] font-medium tracking-[-0.01em]">
                  {step.step}. {step.title}
                </h3>
                <p
                  className={`mt-2 text-[15px] leading-[1.55] ${
                    step.highlight ? "text-white/85" : "text-[#1E1E1E]"
                  }`}
                >
                  {step.body}
                </p>
              </div>

              {/* artwork sits at the bottom of the tile and grows to fill it,
                  so tiles stay the same height whatever the copy length */}
              <Media
                image={step.image}
                variant="plain"
                tone={step.highlight ? "dark" : "light"}
                sizes="(max-width: 768px) 100vw, 380px"
                className="mt-auto h-[180px] w-full"
              />
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
