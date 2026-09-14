import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { StageMotion } from "../stage-motion";
import { SuiteLockup } from "../suite-logo";
import { ChatCycle, LiveDashboard, LivePhone } from "../live-suite";
import { BOARD, PHONE } from "../suite-mockup";
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
export function SuiteStage({
  idPrefix,
  layout = "section",
  /** Carries the width: w-full normally, wider than its box to crop. */
  className = "w-full",
}: {
  idPrefix: string;
  layout?: keyof typeof LAYOUTS;
  className?: string;
}) {
  const STAGE = LAYOUTS[layout];
  return (
    <StageMotion
      label="The SmartSync Suite conversations dashboard, with the same inbox open in the mobile app"
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
        <div data-sa="phone" className="absolute" style={{ left: STAGE.phone.x, top: STAGE.phone.y }}>
          <div data-sa="float">
            <LivePhone idPrefix={idPrefix} />
          </div>
        </div>
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
          <SuiteStage idPrefix="suite-stage" className="hidden w-full md:block" />
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
