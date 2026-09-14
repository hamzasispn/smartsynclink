import type { HomeContent } from "@/content/home";
import { FunnelEditorScreen } from "../funnel/editor-screen";
import { FUNNEL_BOARD, FunnelListScreen } from "../funnel/list-screen";
import { FunnelMetricsScreen } from "../funnel/metrics-screen";
import { FunnelShowcase } from "../funnel/showcase";
import { Reveal } from "../reveal";
import { SuiteLockup } from "../suite-logo";
import { Button, Container } from "../ui";

/**
 * SmartSync funnel: the workspace, the editor and the metrics, taking turns on
 * one stage. The screens render here on the server; the showcase only decides
 * which one is showing and animates the change.
 */
export function Funnel({ data }: { data: HomeContent["funnel"] }) {
  return (
    <section id="funnel" className="relative overflow-hidden py-24 lg:py-28">
      <Container>
        <Reveal className="flex flex-col items-center text-center" stagger={0.1}>
          <SuiteLockup id="funnel-lockup" product="funnel" size={36} />
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

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] top-[15%] bottom-0 rounded-full bg-[radial-gradient(closest-side,rgba(51,0,234,0.14),transparent)] blur-2xl"
          />
          <FunnelShowcase
            tabs={data.tabs}
            width={FUNNEL_BOARD.w}
            height={FUNNEL_BOARD.h}
            screens={[
              <FunnelListScreen key="list" idPrefix="funnel-list" />,
              <FunnelEditorScreen key="editor" />,
              <FunnelMetricsScreen key="metrics" />,
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
