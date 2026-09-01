import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { Container, SectionHead } from "../ui";

export function Steps({ data }: { data: HomeContent["steps"] }) {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <Reveal>
          <SectionHead
            badge={data.badge}
            heading={data.heading}
            subheading={data.subheading}
          />
        </Reveal>

        <Reveal className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.16} delay={0.18}>
          {data.items.map((item) => (
            <article
              key={item.step}
              className="rounded-[20px] border border-line bg-white p-8 shadow-card"
            >
              <span className="inline-flex rounded-full bg-brand px-4 py-1.5 text-[16px] font-normal text-white">
                {item.step}
              </span>
              <h3 className="mt-7 text-[17px] font-medium tracking-[-0.02em] text-ink">
                {item.title}{" "}
                <span className="text-[16px] font-normal text-[#1e1e1e]">
                  ( {item.duration} )
                </span>
              </h3>
              <p className="mt-3 text-[16px] leading-[1.8] text-[#1e1e1e]">
                {item.body}
              </p>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
