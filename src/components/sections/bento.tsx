import type { Bullet, HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { AssistantOrb } from "../assistant-orb";
import { BookingArt } from "../booking-art";
import { SuiteLockup } from "../suite-logo";
import { ChatCycle, LivePhone } from "../live-suite";
import { Button, CheckSolid, Container } from "../ui";
import { SuiteStage } from "./suite";

function FeatureList({ bullets }: { bullets: Bullet[] }) {
  return (
    <ul>
      {bullets.map((bullet) => (
        <li key={bullet.title} className="mb-[16px] last:mb-0">
          <div className="flex items-center gap-[13px] mb-[8px]">
            <CheckSolid className="size-[19px] shrink-0 text-ink" />
            <p className="text-[20px] font-medium tracking-[-0.01em] text-ink">
              {bullet.title}
            </p>
          </div>
          {bullet.body ? (
            <p className="text-[15px] leading-[136%] text-[#1E1E1E]">
              {bullet.body}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** The heading with every occurrence of `highlight` painted in the accent. */
function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  return (
    <>
      {text.split(highlight).map((part, i, parts) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? <span className="text-chip-yellow">{highlight}</span> : null}
        </span>
      ))}
    </>
  );
}

export function Bento({ data }: { data: HomeContent["bento"] }) {
  const booking = data.booking;

  return (
    <section id="solutions" className="py-24 lg:py-28">
      <Container>
        <Reveal className="grid gap-[16px] lg:grid-cols-12" stagger={0.14}>
          {/* booking band — a "did you know" notice: copy left, the drawing in
              the middle, two actions stacked on the right */}
          <article className="relative grid items-center gap-6 overflow-hidden rounded-[16px] bg-[linear-gradient(100deg,#14063F_0%,#2600B0_58%,#3300EA_100%)] px-9 pt-9 lg:col-span-12 lg:grid-cols-[1.25fr_1fr_auto] lg:gap-10 lg:py-0 lg:pl-9 lg:pr-12">
            <div className="lg:py-10">
              <p className="text-[18px] font-normal text-white/80">{booking.eyebrow}</p>
              <h2 className="mt-3 max-w-[46ch] text-[20px] font-normal leading-[1.8] text-white">
                <Highlighted text={booking.heading} highlight={booking.highlight} />
              </h2>
            </div>

            <div className="relative -mb-px h-[215px] self-end max-lg:order-last">
              <BookingArt className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2" />
            </div>

            <div className="flex flex-col gap-3 whitespace-nowrap lg:w-[220px]">
              <a
                href={booking.cta.href}
                data-fill=""
                style={{ "--fill": "#052EFF" } as React.CSSProperties}
                className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-gradient-to-r from-[#5B63FF] to-[#6A45FF] px-5 text-[15px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(5,46,255,.8)]"
              >
                {booking.cta.label}
              </a>
              <a
                href={booking.secondary.href}
                data-fill=""
                style={{ "--fill": "rgba(255,255,255,.14)" } as React.CSSProperties}
                className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-white/80 px-5 text-[15px] font-medium text-white"
              >
                {booking.secondary.label}
              </a>
            </div>
          </article>

          {/* complete solution — gradient card */}
          <article className="flex flex-col overflow-hidden rounded-[16px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-5.5 pt-6 pb-0 text-white lg:col-span-4">
            <span className="w-fit rounded-full bg-white/20 px-3.5 py-1.5 text-[16px] font-normal">
              {data.intro.eyebrow}
            </span>
            <h2 className="mt-4 text-[24px] font-medium leading-[1.22] tracking-[-0.02em]">
              {data.intro.heading}
            </h2>
            <p className="mt-4 mb-4 text-[16px] leading-[136%] text-white">
              {data.intro.body}
            </p>
            <AssistantOrb />
          </article>

          {/* smart voice ai */}
          <article className="flex flex-col rounded-[16px] bg-surface p-9 lg:col-span-8">
            <h2 className="text-[26px] font-medium tracking-[-0.02em] text-ink">
              {data.voice.heading}
            </h2>
            <p className="mt-3 max-w-[68ch] text-[16px] leading-[136%] text-[#1E1E1E]">
              {data.voice.body}
            </p>
            <FeatureList bullets={data.voice.bullets} />
            <Button cta={data.voice.cta} className="mt-9 w-fit" />
          </article>

          {/* smart inbox — copy */}
          <article className="flex flex-col rounded-[26px] bg-surface p-[20px] lg:col-span-3">
            <h2 className="text-[28px] font-medium leading-tight tracking-[-0.02em] text-ink">
              {data.inbox.heading}
            </h2>
            <p className="mt-2 mb-8 text-[16px] leading-[136%] text-[#1E1E1E]">
              {data.inbox.body}
            </p>
            <FeatureList bullets={data.inbox.bullets} />
            <Button cta={data.inbox.cta} className="mt-8 w-fit" />
          </article>

          {/* smart inbox — the product itself, drawn, where the screenshot was */}
          <div className="flex flex-col overflow-clip rounded-[16px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] p-6 lg:col-span-6">
            <SuiteLockup id="bento-suite-lockup" size={30} inverse />
            {/* half as wide again as the tile, clipped by its right edge */}
            <div className="mt-auto pt-8">
              <SuiteStage idPrefix="bento-stage" layout="tile" className="hidden w-[150%] max-w-none md:block" />
              <div className="flex justify-center [zoom:0.8] md:hidden">
                <ChatCycle>
                  <LivePhone idPrefix="bento-solo" />
                </ChatCycle>
              </div>
            </div>
          </div>

          {/* campaigns */}
          <article className="relative z-10 flex flex-col overflow-hidden rounded-[26px] bg-surface lg:col-span-3 bg-[url('/images/campaigns.webp')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#052EFF]/0 to-white -z-10"></div>
            <div className="flex flex-1 flex-col p-8 justify-end">
              <h2 className="text-[28px] font-medium leading-tight tracking-[-0.02em] text-ink">
                {data.campaigns.heading}
              </h2>
              <p className="mt-2 text-[16px] leading-[136%] text-[#1E1E1E]">
                {data.campaigns.body}
              </p>
              <Button cta={data.campaigns.cta} className="mt-4 w-fit" />
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
