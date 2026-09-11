import type { SolutionsContent } from "@/content/solutions";
import { Reveal } from "../reveal";
import { Badge, Container, Media } from "../ui";

/**
 * The solutions grid.
 *
 * Four to a row, and every card in a row lines up: "Best for:", the bullets,
 * the button and the artwork all sit at the same height whatever the length of
 * the paragraph above them. That comes from `mt-auto` on the lower half — the
 * spare space collects between the body copy and "Best for:", which is exactly
 * where the design puts it.
 */
export function Solutions({ data }: { data: SolutionsContent }) {
  return (
    <section id="solutions" className="pb-24 pt-40 lg:pb-28">
      <Container>
        <div className="flex flex-col items-center text-center">
          <Badge>{data.badge}</Badge>
          {/* wide enough for the two lines the design sets — 15ch broke it
              into four */}
          <h1 className="mt-6 max-w-[1080px] text-balance text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[56px]">
            {data.heading}
          </h1>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-[1.6] text-[#1E1E1E]">
            {data.body}
          </p>
          <p className="mt-6 max-w-[68ch] text-[16px] leading-[1.6] text-[#1E1E1E]">
            {data.body2}
          </p>
        </div>

        <Reveal
          className="mt-16 grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4"
          stagger={0.08}
          delay={0.12}
        >
          {data.cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-[14px] border border-line bg-white p-5"
            >
              <h2 className="text-[19px] font-medium leading-[1.25] tracking-[-0.01em] text-ink">
                {card.title}
              </h2>
              <p className="mt-3 text-[13.5px] font-medium leading-[1.45] text-ink">
                {card.tagline}
              </p>
              <p className="mt-2.5 text-[13.5px] leading-[1.55] text-[#1E1E1E]">
                {card.body}
              </p>

              {/* everything from here down is bottom-aligned across the row */}
              <p className="mt-auto pt-6 text-[13.5px] font-medium text-ink">
                {data.bestForLabel}
              </p>
              <ul className="mt-2 list-disc pl-5 text-[13px] leading-[1.75] text-[#1E1E1E] marker:text-[#1E1E1E]">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              <a
                href={card.cta.href}
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-4 py-2.5 text-center text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
              >
                {card.cta.label}
                <span aria-hidden="true">→</span>
              </a>

              <Media
                image={card.image}
                variant="plain"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 340px"
                className="mt-5 aspect-3/2 w-full rounded-[10px]"
              />
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
