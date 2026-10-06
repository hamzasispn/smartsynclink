import type { CSSProperties } from "react";
import type { HomeContent } from "@/content/home";
import { STORIES, type Story } from "@/lib/stage-intro";
import { Reveal } from "../reveal";
import { CARD } from "../site-mockup";
import { SITES } from "../story-sites";
import { BOARD, PHONE, PhoneFrame } from "../suite-mockup";
import { SuiteLockup } from "../suite-logo";
import { Button, Container } from "../ui";

/**
 * The page's site on the desktop with the phone over its bottom-right corner,
 * on the stage's own pixel grid, as the Suite stage has it — on a phone too.
 * The client asked for it on the call: the Suite section right below plays the
 * phone on its own, and two phones in a row read as the same section twice.
 */
const PHONE_AT = { x: 1559, y: 309 };
/** The mobile site's origin inside the handset: the screen inset, then the status bar. */
const SCREEN = { x: 11, y: 11 + 44 };
const DESK = { w: PHONE_AT.x + PHONE.w, h: PHONE_AT.y + PHONE.h };

/**
 * SmartSync Site: the website half of "website + system". The page's own
 * industry — a med spa, a plumber, an agent — drawn on the desktop and the
 * phone, the same drawing its Suite intro opens on, with numbered pins on the
 * three things that feed the Suite: the form, the call button, the chat.
 */
export function Site({ data, story = "medspa" }: { data: HomeContent["site"]; story?: Story }) {
  const { Desktop, Mobile, call } = SITES[story];
  const live = STORIES[story].live;
  // in the order of `features`: the form, the call button, the chat
  const deskPins: [number, number][] = [
    [CARD.x, CARD.y],
    call,
    // beside the phone's chat button, not on it
    [PHONE_AT.x + SCREEN.x + 236, PHONE_AT.y + SCREEN.y + 579],
  ];
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
          <Stage w={DESK.w} h={DESK.h} pins={deskPins} label="The website we build, on a desktop and a phone" className="w-full">
            <div className="absolute overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(14,14,20,0.35)] ring-1 ring-black/5" style={{ left: 0, top: 0, width: BOARD.w, height: BOARD.h }}>
              <Desktop mode="static" />
            </div>
            <div className="absolute" style={{ left: PHONE_AT.x, top: PHONE_AT.y }}>
              <PhoneFrame>
                <Mobile mode="static" />
              </PhoneFrame>
            </div>
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

        {live ? (
          <p className="mt-8 text-center text-[15px] text-muted">
            Drawn from a live client site: {live.name}, {live.place}.{" "}
            <a href={live.url} target="_blank" rel="noopener noreferrer" className="font-medium whitespace-nowrap text-brand hover:underline">
              Visit {live.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} <span aria-hidden="true">↗</span>
            </a>
          </p>
        ) : null}
      </Container>
    </section>
  );
}

/**
 * A drawing on its fixed grid, scaled as one piece (see .suite-stage), with the
 * numbered pins over it in percentages — outside the scaled board, so they stay
 * a readable size at every width.
 */
function Stage({
  w,
  h,
  pins,
  label,
  className,
  children,
}: {
  w: number;
  h: number;
  pins: [number, number][];
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div role="img" aria-label={label} className={`suite-stage relative ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <div className="suite-board" style={{ width: w, height: h, ["--stage-w" as string]: `${w}px` }}>
        {children}
      </div>
      {pins.map(([x, y], i) => (
        <Pin
          key={i}
          n={i + 1}
          ping
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` }}
        />
      ))}
    </div>
  );
}

/** A numbered mark, on the drawing and beside the feature it names. On the drawing it pulses; on a phone it is smaller. */
function Pin({ n, ping = false, className = "", style }: { n: number; ping?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] font-semibold text-white shadow-[0_8px_18px_-6px_rgba(5,46,255,0.7)] ${
        ping ? "size-6 text-[11px] ring-2 ring-white md:size-8 md:text-[14px] md:ring-[3px]" : "size-8 text-[14px] ring-[3px] ring-white"
      } ${className}`}
      style={style}
    >
      {ping ? <span className="absolute inset-0 rounded-full bg-[#052EFF]/40 motion-safe:animate-ping" /> : null}
      <span className="relative">{n}</span>
    </span>
  );
}
