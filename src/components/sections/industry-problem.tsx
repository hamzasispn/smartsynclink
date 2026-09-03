import type { IndustryContent } from "@/content/industry";
import { Reveal } from "../reveal";
import { Button, Container, Media } from "../ui";

export function IndustryProblem({
  data,
}: {
  data: IndustryContent["problem"];
}) {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[45fr_55fr] lg:gap-x-14">
          {/* left: the story, told in short lines the way the design has it */}
          <Reveal>
            <Media
              image={data.image}
              variant="plain"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="h-[260px] w-full rounded-[18px] sm:h-[320px]"
            />

            <h2 className="mt-8 max-w-[22ch] text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[32px]">
              {data.heading}
            </h2>

            <ul className="mt-6 space-y-2">
              {data.bullets.map((line) => (
                <li
                  key={line}
                  className="flex gap-2.5 text-[16px] leading-[1.6] text-[#1E1E1E]"
                >
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-ink/40" />
                  {line}
                </li>
              ))}
            </ul>

            <Button cta={data.cta} className="mt-8 px-8" />
          </Reveal>

          {/* right: the six ways interest leaks away */}
          <Reveal
            className="grid gap-4 sm:grid-cols-2"
            stagger={0.12}
            delay={0.15}
          >
            {data.cards.map((card) => (
              <article
                key={card.title}
                className="rounded-[16px] bg-surface p-6"
              >
                <Media
                  image={card.icon}
                  variant="plain"
                  sizes="24px"
                  className="size-6 rounded-md"
                />
                <h3 className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-[#1E1E1E]">
                  {card.body}
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
