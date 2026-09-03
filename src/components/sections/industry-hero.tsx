import type { IndustryContent } from "@/content/industry";
import { Button, Container, Media, Tick } from "../ui";

export function IndustryHero({ data }: { data: IndustryContent["hero"] }) {
  return (
    <section className="relative z-10 overflow-hidden pb-14 pt-36 sm:pt-40 lg:pt-48">
      {/* the illustration behind the copy. An empty src renders the dashed
          placeholder, so the layout is final before the artwork exists. */}
      <Media
        image={data.background}
        variant="plain"
        sizes="100vw"
        priority
        className="absolute inset-0 -z-10 h-full w-full"
      />
      {/* scrim: keeps the copy readable whatever artwork lands back there */}
      <div aria-hidden="true" className="absolute inset-0 -z-1 bg-white/72" />

      <Container>
        <p
          className="rise text-center text-[13px] font-normal uppercase tracking-[0.18em] text-[#1E1E1E]/70"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          {data.badge}
        </p>

        <h1
          className="rise mx-auto mt-5 max-w-[860px] text-balance text-center text-[34px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[46px] lg:text-[54px]"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {data.heading}
        </h1>

        <p
          className="rise mx-auto mt-6 max-w-[720px] text-center text-[16px] leading-[1.75] text-[#1E1E1E]"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {data.body}
        </p>
        <p
          className="rise mx-auto mt-4 max-w-[720px] text-center text-[16px] leading-[1.75] text-[#1E1E1E]"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          {data.body2}
        </p>

        <div
          className="rise mt-9 flex flex-wrap items-center justify-center gap-4"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <Button cta={data.primary} className="px-8" />
          <Button cta={data.secondary} variant="outline" />
        </div>

        <ul
          className="rise mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          style={{ "--i": 5 } as React.CSSProperties}
        >
          {data.stats.map((stat) => (
            <li
              key={stat}
              className="flex items-center gap-2 text-[16px] font-normal text-[#1E1E1E]"
            >
              <Tick className="size-3.5 text-brand" />
              {stat}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
