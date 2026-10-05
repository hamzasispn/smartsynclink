import type { CSSProperties } from "react";
import type { HomeContent } from "@/content/home";
import { ContractorSite, ContractorSiteMobile } from "../contractor-site";
import { Reveal } from "../reveal";
import { CARD } from "../site-mockup";
import { BOARD, PHONE, PhoneFrame } from "../suite-mockup";
import { SuiteLockup } from "../suite-logo";
import { Button, Container } from "../ui";

/**
 * Two arrangements on the stage's own pixel grid, as the Suite stage has:
 *   desk  — the site on the desktop with the phone over its bottom-right corner
 *   phone — the phone alone, for a phone: the desktop page would draw at a
 *           fifth of its size there
 * `pins` are the numbered marks on the three things that feed the Suite — the
 * quote form, the call button, the chat — in the order of `features`. On the
 * phone they sit beside the buttons, not on them: there the pin is as big as
 * the button it marks.
 */
const PHONE_AT = { x: 1559, y: 309 };
/** The mobile site's origin inside the handset: the screen inset, then the status bar. */
const SCREEN = { x: 11, y: 11 + 44 };
const STAGES = {
  desk: {
    w: PHONE_AT.x + PHONE.w,
    h: PHONE_AT.y + PHONE.h,
    pins: [
      [CARD.x, CARD.y],
      [538, 490],
      [PHONE_AT.x + SCREEN.x + 236, PHONE_AT.y + SCREEN.y + 579],
    ],
  },
  phone: {
    w: PHONE.w,
    h: PHONE.h,
    pins: [
      [SCREEN.x + 296, SCREEN.y + 416],
      [SCREEN.x + 208, SCREEN.y + 57],
      [SCREEN.x + 236, SCREEN.y + 579],
    ],
  },
} as const;

/**
 * SmartSync Site: the website half of "website + system". A contractor's site,
 * drawn after a live client's, on the desktop and the phone — the same drawing
 * the Suite intro opens on — with what each part of it feeds in the Suite.
 */
export function Site({ data }: { data: HomeContent["site"] }) {
  const show = data.showcase;
  const host = show.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return (
    <section id="site" className="relative overflow-hidden py-14 md:py-24 lg:py-28">
      <Container>
        <Reveal className="flex flex-col items-center text-center" stagger={0.1}>
          <SuiteLockup id="site-lockup" product="site" size={36} />
          <h2 className="mt-8 max-w-[20ch] text-balance text-[36px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[56px]">
            {data.heading}
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-[1.7] text-[#1E1E1E]">{data.body}</p>
          <Button cta={data.cta} className="mt-9" />
        </Reveal>

        <Reveal className="relative mt-10 md:mt-16" delay={0.1}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[10%] top-[10%] bottom-0 rounded-full bg-[radial-gradient(closest-side,rgba(5,46,255,0.16),transparent)] blur-2xl"
          />
          <Stage layout="desk" label={`${show.name}'s website on a desktop and a phone`} className="hidden w-full md:block">
            <div className="absolute overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(14,14,20,0.35)] ring-1 ring-black/5" style={{ left: 0, top: 0, width: BOARD.w, height: BOARD.h }}>
              <ContractorSite mode="static" />
            </div>
            <div className="absolute" style={{ left: PHONE_AT.x, top: PHONE_AT.y }}>
              <PhoneFrame>
                <ContractorSiteMobile mode="static" />
              </PhoneFrame>
            </div>
          </Stage>
          <Stage layout="phone" label={`${show.name}'s website on a phone`} className="mx-auto w-full max-w-75 md:hidden">
            <PhoneFrame>
              <ContractorSiteMobile mode="static" />
            </PhoneFrame>
          </Stage>
        </Reveal>

        <Reveal as="ul" className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3" stagger={0.08} delay={0.1}>
          {data.features.map((feature, i) => (
            <li key={feature.title} className="flex gap-4 rounded-2xl border border-line bg-white p-6">
              <Pin n={i + 1} />
              <div>
                <p className="text-[18px] font-medium tracking-[-0.01em] text-ink">{feature.title}</p>
                <p className="mt-2 text-[15px] leading-[1.6] text-muted">{feature.body}</p>
              </div>
            </li>
          ))}
        </Reveal>

        <p className="mt-8 text-center text-[15px] text-muted">
          {show.label}: {show.name}
          {show.place ? `, ${show.place}` : ""}.{" "}
          <a href={show.url} target="_blank" rel="noopener noreferrer" className="font-medium whitespace-nowrap text-brand hover:underline">
            Visit {host} <span aria-hidden="true">↗</span>
          </a>
        </p>
      </Container>
    </section>
  );
}

/**
 * A drawing on its fixed grid, scaled as one piece (see .suite-stage), with the
 * numbered pins laid over it in percentages — outside the scaled board, so
 * they stay a readable size at every width.
 */
function Stage({
  layout,
  label,
  className,
  children,
}: {
  layout: keyof typeof STAGES;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const stage = STAGES[layout];
  return (
    <div role="img" aria-label={label} className={`suite-stage relative ${className}`} style={{ aspectRatio: `${stage.w} / ${stage.h}` }}>
      <div className="suite-board" style={{ width: stage.w, height: stage.h, ["--stage-w" as string]: `${stage.w}px` }}>
        {children}
      </div>
      {stage.pins.map(([x, y], i) => (
        <Pin
          key={i}
          n={i + 1}
          ping
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(x / stage.w) * 100}%`, top: `${(y / stage.h) * 100}%` }}
        />
      ))}
    </div>
  );
}

/** A numbered mark, on the drawing and beside the feature it names. On the drawing it pulses. */
function Pin({ n, ping = false, className = "", style }: { n: number; ping?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-[14px] font-semibold text-white shadow-[0_8px_18px_-6px_rgba(5,46,255,0.7)] ring-[3px] ring-white ${className}`}
      style={style}
    >
      {ping ? <span className="absolute inset-0 rounded-full bg-[#052EFF]/40 motion-safe:animate-ping" /> : null}
      <span className="relative">{n}</span>
    </span>
  );
}
