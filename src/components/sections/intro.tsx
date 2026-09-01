import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { Button, Container, Media } from "../ui";

export function Intro({ data }: { data: HomeContent["intro"] }) {
  return (
    <section id="conversion" className="bg-page py-24 lg:py-28">
      <Container>
        <Reveal
          className="grid items-center gap-20 lg:grid-cols-2 lg:gap-40"
          stagger={0.14}
        >
          <div>
            <h2 className="text-[40px] font-medium leading-[1.2] tracking-[-0.02em] text-ink sm:text-[40px]">
              {data.heading}
            </h2>
            <p className="mt-9 text-[16px] leading-[1.9] text-muted">
              {data.body}
            </p>

            <ul className="mt-6 space-y-2.5 pl-5">
              {data.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="list-disc text-[16px] leading-[1.7] text-ink-2 marker:text-ink-2"
                >
                  {bullet}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[16px] leading-[1.9] text-muted">
              {data.body2}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button cta={data.primary} />
              <Button cta={data.secondary} variant="outline" />
            </div>
          </div>

          <Media
            image={data.image}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="h-full w-full rounded-3xl"
          />
        </Reveal>
      </Container>
    </section>
  );
}
