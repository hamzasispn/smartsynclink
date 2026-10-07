import type { HomeContent } from "@/content/home";
import { STORIES, type Story } from "@/lib/stage-intro";
import { Reveal } from "../reveal";
import { CLICKS, LeadAlert } from "../site-mockup";
import { SITES } from "../story-sites";
import { StageMotion } from "../stage-motion";
import { SuiteLockup } from "../suite-logo";
import { LiveDashboard, LivePhone } from "../live-suite";
import { BOARD, INK, LINE, PHONE } from "../suite-mockup";
import { Button, Container } from "../ui";

/**
 * Arrangements of the same two shots, on the stage's own pixel grid.
 *   section — the phone over the dashboard's right-hand corner
 *   tile    — the phone in front on the left, the dashboard running off the
 *             right edge; for the bento tile, which is too narrow to show the
 *             whole screen at a readable size, so it shows the part that matters
 *   mobile  — the Suite section on a phone: the whole dashboard across the top,
 *             scaled to the screen's width (cut off at the edges it looked
 *             broken), and the phone big in front of its lower part. Both
 *             shots, as on a desktop — with the phone alone, people did not see
 *             there is a desktop app too.
 * `scale` draws the dashboard (and what plays over it) smaller than the phone.
 */
const LAYOUTS = {
  section: { board: { x: 0, y: 0 }, phone: { x: 1559, y: 309 }, w: 1559 + PHONE.w, h: 309 + PHONE.h, scale: 1 },
  tile: { board: { x: 200, y: 0 }, phone: { x: 0, y: 250 }, w: 200 + BOARD.w, h: 250 + PHONE.h, scale: 1 },
  mobile: { board: { x: 0, y: 0 }, phone: { x: (600 - PHONE.w) / 2, y: 190 }, w: 600, h: 190 + PHONE.h, scale: 600 / BOARD.w },
} as const;

/**
 * The desktop inbox with the mobile app laid over its corner, on one
 * fixed-size stage that scales as a single piece — identical at every width.
 * Used by the Suite section and by the inbox tile in the bento.
 *
 * `idPrefix` keeps the phone's SVG gradient ids unique when two stages are on
 * the same page.
 */
/** The desktop booking button on the artboard: the chip leaves from there. */
const BOOKED = { x: CLICKS[3][0], y: CLICKS[3][1] };

export function SuiteStage({
  idPrefix,
  layout = "section",
  /** Carries the width: w-full normally, wider than its box to crop. */
  className = "w-full",
  /** Open on the website whose form feeds this inbox. See StageMotion. */
  intro = false,
  /** Whose website, lead and inbox: the med spa's, or the plumber's or the agent's on those pages. */
  story = "medspa",
}: {
  idPrefix: string;
  layout?: keyof typeof LAYOUTS;
  className?: string;
  intro?: boolean;
  story?: Story;
}) {
  const STAGE = LAYOUTS[layout];
  const board = STAGE.board;
  const { Desktop, Mobile } = SITES[story];
  // the dashboard's own grid, placed and scaled as one piece
  const desk = {
    left: board.x,
    top: board.y,
    width: BOARD.w,
    height: BOARD.h,
    transform: `scale(${STAGE.scale})`,
    transformOrigin: "0 0",
  } as const;
  return (
    <StageMotion
      intro={intro}
      story={story}
      label={
        intro
          ? "A visitor sends a message from a website, and it arrives in the SmartSync Suite inbox on the desktop dashboard and in the mobile app"
          : "The SmartSync Suite conversations dashboard, with the same inbox open in the mobile app"
      }
      className={`suite-stage relative ${className}`}
      style={{ aspectRatio: `${STAGE.w} / ${STAGE.h}` }}
    >
      <div
        className="suite-board"
        style={{ width: STAGE.w, height: STAGE.h, ["--stage-w" as string]: `${STAGE.w}px` }}
      >
        <div className="absolute" style={desk}>
          <div
            data-sa="board"
            className="absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(14,14,20,0.35)] ring-1 ring-black/5"
          >
            <LiveDashboard story={story} />
          </div>

          {/* Between the dashboard and the phone on purpose: it covers the
              dashboard exactly, so the inbox opens where the website was, but the
              phone stays in front of it the way it does over the finished screen.
              stage-cue keeps it out of the way wherever the timeline never runs. */}
          {intro ? (
            <div
              data-a="site"
              className="stage-cue absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(14,14,20,0.35)] ring-1 ring-black/5"
            >
              <Desktop />
            </div>
          ) : null}
        </div>

        <div data-sa="phone" className="absolute" style={{ left: STAGE.phone.x, top: STAGE.phone.y }}>
          <div data-sa="float" className="will-change-transform">
            {/* The same site she is reading on her phone, over the app that is
                already there — so when it clears, the inbox is underneath.
                The frame, the status bar and the home bar never move. */}
            <LivePhone
              idPrefix={idPrefix}
              story={story}
              overlay={
                intro ? (
                  <>
                    <Mobile />
                    <LeadAlert visitor={STORIES[story].visitor} />
                  </>
                ) : undefined
              }
            />
          </div>
        </div>

        {intro ? (
          <div className="pointer-events-none absolute" style={desk}>
            {/* what the desk catches the moment the form is sent */}
            <div
              data-a="chip"
              className="stage-cue absolute flex items-center gap-2.5"
              style={{
                left: BOOKED.x - 95,
                top: BOOKED.y - 22,
                width: 190,
                height: 44,
                paddingLeft: 16,
                borderRadius: 22,
                background: "#fff",
                border: `1px solid ${LINE}`,
                boxShadow: "0 18px 34px -16px rgba(14,14,20,.45)",
                color: INK,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <span className="size-2.5 rounded-full bg-[#052EFF]" />
              New lead
            </div>
          </div>
        ) : null}
      </div>
    </StageMotion>
  );
}

/**
 * SmartSync Suite. Below md the stage is rearranged rather than shrunk: the
 * whole desktop screen small behind, the phone big in front (see LAYOUTS).
 */
export function Suite({ data, story }: { data: HomeContent["suite"]; story?: Story }) {
  return (
    <section id="suite" className="relative overflow-hidden bg-page py-14 md:py-24 lg:py-28">
      <Container>
        <Reveal className="flex flex-col items-center text-center" stagger={0.1}>
          <SuiteLockup id="suite-lockup" size={36} />
          <h2 className="mt-8 max-w-[20ch] text-balance text-[36px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[48px] lg:text-[56px]">
            {data.heading}
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-[1.7] text-[#1E1E1E]">
            {data.body}
          </p>
          <Button cta={data.cta} className="mt-9" />
        </Reveal>

        <Reveal as="ul" className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3" stagger={0.08} delay={0.1}>
          {data.points.map((point) => (
            <li key={point.title} className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[18px] font-medium tracking-[-0.01em] text-ink">{point.title}</p>
              <p className="mt-2 text-[15px] leading-[1.6] text-muted">{point.body}</p>
            </li>
          ))}
        </Reveal>

        <div className="relative mt-10 md:mt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[10%] top-[10%] bottom-0 rounded-full bg-[radial-gradient(closest-side,rgba(5,46,255,0.16),transparent)] blur-2xl"
          />
          <SuiteStage idPrefix="suite-stage" className="hidden w-full md:block" intro story={story} />
          <SuiteStage idPrefix="suite-solo" layout="mobile" className="mx-auto w-full max-w-[440px] md:hidden" intro story={story} />
        </div>
      </Container>
    </section>
  );
}
