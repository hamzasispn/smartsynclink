import type { HomeContent } from "@/content/home";
import { Flipbook } from "../flipbook";
import { Reveal } from "../reveal";
import { Button, Container, Media, SectionHead } from "../ui";

export function Industries({ data }: { data: HomeContent["industries"] }) {
  return (
    <section id="industries" className="py-24 lg:py-28">
      <Container>
        <Reveal>
          <SectionHead heading={data.heading} subheading={data.subheading} />
        </Reveal>

        <Reveal className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.16} delay={0.18}>
          {data.cards.map((card) => (
            <article
              key={card.title}
              className="group relative flex min-h-[752px] flex-col overflow-hidden rounded-[22px] bg-[#F2F2F2]"
            >
              <div className="px-[24px] pb-[18px] pt-[30px]">
                <h3 className="text-[28px] font-medium tracking-[-0.02em] text-ink">
                  {card.title}
                </h3>
                <p className="mt-1 text-[16px] leading-[136%] text-[#1E1E1E]">
                  {card.body}
                </p>
              </div>
              {/* a frame sequence when the card has one, the single still
                  otherwise — so a card without frames is unaffected */}
              {card.frames?.length ? (
                <Flipbook
                  frames={card.frames}
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="w-full flex-1"
                />
              ) : (
                <Media
                  image={card.image}
                  variant="plain"
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="w-full flex-1"
                />
              )}
              <Button
                cta={card.cta}
                className="absolute inset-x-5 bottom-5 w-auto justify-center"
              />
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
