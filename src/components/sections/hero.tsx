import type { HomeContent } from "@/content/home";
import { HeroBackdrop } from "../hero-backdrop";
import { Button, Container, Media, Tick } from "../ui";

export function Hero({ data }: { data: HomeContent["hero"] }) {
  return (
    <section className="relative z-10 overflow-hidden pb-10 pt-28 sm:pt-32 lg:pt-46">
      {/* backdrop images come from the dashboard now, not a hard-coded url */}
      <HeroBackdrop
        images={data.backgrounds ?? []}
        seconds={data.backgroundSeconds ?? 7}
      />
      <div className="absolute inset-0 -z-1 h-full w-full bg-[#D5D5D5] opacity-87"></div>
      <Container>
        <h1
          className="rise mx-auto text-balance text-center text-[38px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[54px] lg:text-[64px]"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          {data.heading}
        </h1>
        <p
          className="rise mx-auto mt-5 max-w-[740px] text-center text-[20px] leading-[1.65] text-[#1E1E1E]"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {data.subheading}
        </p>
      </Container>

      <div
        className="rise relative mt-10 flex justify-center lg:mt-14"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <div className="h-[300px] w-[240px] rounded-t-[110px] lg:h-[500px] lg:w-[600px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full mix-blend-multiply object-cover"
          >
            <source src="/video/video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <Container>
        <div
          className="rise flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <Button cta={data.primary} className="px-8" />
          <Button cta={data.secondary} variant="outline" />
        </div>

        <ul
          className="rise mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-3"
          style={{ "--i": 4 } as React.CSSProperties}
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
