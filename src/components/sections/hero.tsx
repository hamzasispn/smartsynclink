import type { ReactNode } from "react";
import type { HomeContent } from "@/content/home";
import { FUNNEL_BOARD } from "../funnel/list-screen";
import { FunnelMetricsScreen } from "../funnel/metrics-screen";
import { HeroVideos, type HeroScreen } from "../hero-videos";
import { ChatCycle, LiveDashboard, LivePhoneChat } from "../live-suite";
import { BOARD, PHONE } from "../suite-mockup";
import { Button, Container, GLOW, Tick } from "../ui";

/**
 * A fixed-size artboard scaled down to fit the hero box whole — by width or by
 * height, whichever runs out first — so a screen is small on a phone, never
 * cropped and never a sideways scroll. The outer box is a size container; the
 * stage is as wide as both limits allow and scales its board to that width.
 */
function Fit({ w, h, framed = false, children }: { w: number; h: number; framed?: boolean; children: ReactNode }) {
  return (
    <div className={`grid h-full w-full place-items-center [container-type:size] ${framed ? "py-3" : ""}`}>
      <div
        className={`suite-stage relative ${framed ? "overflow-hidden rounded-[10px] shadow-[0_20px_50px_-24px_rgba(14,14,20,0.35)] ring-1 ring-black/5" : ""}`}
        style={{ aspectRatio: `${w} / ${h}`, width: `min(100cqw, calc(100cqh * ${w / h}))` }}
      >
        <div className="suite-board" style={{ width: w, height: h, ["--stage-w" as string]: `${w}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** What plays between the clips: the Suite inbox, the same chat on the phone, then the funnel metrics. */
const SCREENS: HeroScreen[] = [
  {
    hold: 7000,
    node: (
      <ChatCycle className="h-full w-full">
        <Fit w={BOARD.w} h={BOARD.h} framed>
          <LiveDashboard />
        </Fit>
      </ChatCycle>
    ),
  },
  {
    // long enough for a message to arrive, the reply to type and send
    hold: 8500,
    node: (
      <ChatCycle className="h-full w-full py-2">
        <Fit w={PHONE.w} h={PHONE.h}>
          <LivePhoneChat />
        </Fit>
      </ChatCycle>
    ),
  },
  {
    hold: 6500,
    node: (
      <Fit w={FUNNEL_BOARD.w} h={FUNNEL_BOARD.h} framed>
        <FunnelMetricsScreen />
      </Fit>
    ),
  },
];

export function Hero({ data }: { data: HomeContent["hero"] }) {
  return (
    <section className="relative z-10 overflow-hidden bg-[#fafaf9] pb-10 pt-28 sm:pt-32 lg:pt-46">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-1 overflow-hidden"
      >
        <span
          className="absolute -left-32 -top-32 size-[380px] rounded-full opacity-[0.22] blur-[100px]"
          style={{ background: GLOW }}
        />
        <span
          className="absolute -right-32 -bottom-32 size-[380px] rounded-full opacity-[0.22] blur-[100px]"
          style={{ background: GLOW }}
        />
      </div>
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
        {/* wider than the clip on desktop: the clips stay 700px, the product screens get the room */}
        <div className="relative h-[300px] w-full px-3 md:h-[420px] lg:h-[500px] lg:max-w-[1100px] lg:px-6">
          <HeroVideos videos={data.videos ?? []} screens={SCREENS} />
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
