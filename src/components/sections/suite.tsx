import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { CLICKS, LeadAlert, VisitorSite, VisitorSiteMobile } from "../site-mockup";
import { StageMotion } from "../stage-motion";
import { SuiteLockup } from "../suite-logo";
import { ChatCycle, LiveDashboard, LivePhone } from "../live-suite";
import { BOARD, INK, LINE, PHONE } from "../suite-mockup";
import { Button, Container } from "../ui";

/**
 * Two arrangements of the same two shots, on the stage's own pixel grid.
 *   section — the phone over the dashboard's right-hand corner
 *   tile    — the phone in front on the left, the dashboard running off the
 *             right edge; for the bento tile, which is too narrow to show the
 *             whole screen at a readable size, so it shows the part that matters
 */
const LAYOUTS = {
  section: { board: { x: 0, y: 0 }, phone: { x: 1559, y: 309 }, w: 1559 + PHONE.w, h: 309 + PHONE.h },
  tile: { board: { x: 200, y: 0 }, phone: { x: 0, y: 250 }, w: 200 + BOARD.w, h: 250 + PHONE.h },
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
}: {
  idPrefix: string;
  layout?: keyof typeof LAYOUTS;
  className?: string;
  intro?: boolean;
}) {
  const STAGE = LAYOUTS[layout];
  return (
    <StageMotion
      intro={intro}
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
        <div
          data-sa="board"
          className="absolute overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(14,14,20,0.35)] ring-1 ring-black/5"
          style={{ left: STAGE.board.x, top: STAGE.board.y, width: BOARD.w, height: BOARD.h }}
        >
          <LiveDashboard />
        </div>

        {/* Between the dashboard and the phone on purpose: it covers the
            dashboard exactly, so the inbox opens where the website was, but the
            phone stays in front of it the way it does over the finished screen.
            stage-cue keeps it out of the way wherever the timeline never runs. */}
        {intro ? (
          <div
            data-a="site"
            className="stage-cue absolute overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(14,14,20,0.35)] ring-1 ring-black/5"
            style={{ left: STAGE.board.x, top: STAGE.board.y, width: BOARD.w, height: BOARD.h }}
          >
            <VisitorSite />
          </div>
        ) : null}

        <div data-sa="phone" className="absolute" style={{ left: STAGE.phone.x, top: STAGE.phone.y }}>
          <div data-sa="float" className="will-change-transform">
            {/* The same site she is reading on her phone, over the app that is
                already there — so when it clears, the inbox is underneath.
                The frame, the status bar and the home bar never move. */}
            <LivePhone
              idPrefix={idPrefix}
              overlay={
                intro ? (
                  <>
                    <VisitorSiteMobile />
                    <LeadAlert />
                  </>
                ) : undefined
              }
            />
          </div>
        </div>

        {intro ? (
          <>
            {/* what the desk catches the moment the form is sent */}
            <div
              data-a="chip"
              className="stage-cue absolute flex items-center gap-2.5"
              style={{
                left: STAGE.board.x + BOOKED.x - 95,
                top: STAGE.board.y + BOOKED.y - 22,
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
          </>
        ) : null}
      </div>
    </StageMotion>
  );
}

/**
 * SmartSync Suite. Below md the desktop screen would shrink past reading, so
 * the phone — which is the mobile story anyway — is shown on its own.
 */
export function Suite({ data }: { data: HomeContent["suite"] }) {
  return (
    <section id="suite" className="relative overflow-hidden bg-page py-24 lg:py-28">
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

        <Reveal as="ul" className="mt-14 grid gap-4 md:grid-cols-3" stagger={0.08} delay={0.1}>
          {data.points.map((point) => (
            <li key={point.title} className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[18px] font-medium tracking-[-0.01em] text-ink">{point.title}</p>
              <p className="mt-2 text-[15px] leading-[1.6] text-muted">{point.body}</p>
            </li>
          ))}
        </Reveal>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[10%] top-[10%] bottom-0 rounded-full bg-[radial-gradient(closest-side,rgba(5,46,255,0.16),transparent)] blur-2xl"
          />
          <SuiteStage idPrefix="suite-stage" className="hidden w-full md:block" intro />
          <div className="relative flex justify-center md:hidden">
            <ChatCycle>
              <LivePhone idPrefix="suite-solo" />
            </ChatCycle>
          </div>
        </div>
      </Container>
    </section>
  );
}
