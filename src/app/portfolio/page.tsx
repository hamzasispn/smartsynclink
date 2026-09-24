import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Reveal } from "@/components/reveal";
import { Badge, Button, Container, Media, Tick } from "@/components/ui";
import { getGlobalContent, getPortfolioContent } from "@/lib/content";
import type { CaseStudy } from "@/content/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Work — SmartSyncLink",
  description:
    "The connected system — AI on the phones, one inbox, funnels and follow-up — built and running in real businesses.",
};

/**
 * One case study. The photo carries the industry label on a gradient foot, the
 * way the site's other image cards do; the copy sits beside it and swaps sides
 * down the page so the eye zig-zags rather than marching straight down.
 */
function CaseCard({ study, flip }: { study: CaseStudy; flip: boolean }) {
  const copy = study.href ? (
    <Link href={study.href} className="group/case block">
      <CaseCopy study={study} linked />
    </Link>
  ) : (
    <CaseCopy study={study} linked={false} />
  );

  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className={flip ? "lg:order-2" : ""}>
        <div className="relative overflow-hidden rounded-[26px] shadow-[0_36px_80px_-40px_rgba(14,14,20,.5)] ring-1 ring-black/5">
          <Media
            image={study.image}
            sizes="(max-width: 1024px) 100vw, 560px"
            className="aspect-[4/3] w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-6 pt-16">
            <span className="text-[12px] font-bold tracking-[0.14em] text-white/90 uppercase">
              {study.eyebrow}
            </span>
          </div>
        </div>
      </div>
      <div className={flip ? "lg:order-1" : ""}>{copy}</div>
    </article>
  );
}

function CaseCopy({ study, linked }: { study: CaseStudy; linked: boolean }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line bg-white px-3 py-1 text-[12px] font-medium text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mt-5 max-w-[18ch] text-[28px] font-medium leading-[1.14] tracking-[-0.02em] text-ink sm:text-[34px]">
        {study.title}
      </h2>
      <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.7] text-[#1E1E1E]">{study.summary}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {study.highlights.map((point) => (
          <li key={point} className="flex items-center gap-3">
            <Tick className="size-4 shrink-0 text-brand" />
            <span className="text-[15px] text-ink">{point}</span>
          </li>
        ))}
      </ul>
      {linked ? (
        <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-brand">
          See the aesthetics build
          <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover/case:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      ) : null}
    </>
  );
}

export default async function PortfolioPage() {
  const [global, data] = await Promise.all([getGlobalContent(), getPortfolioContent()]);

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="overflow-hidden">
        {/* hero, on the soft page ground with the brand glow the home hero uses */}
        <section className="relative bg-[#fafaf9] pt-40 pb-20 lg:pt-46">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-1 overflow-hidden">
            <span className="absolute -top-32 -left-24 size-[360px] rounded-full bg-brand/20 opacity-40 blur-[100px]" />
            <span className="absolute -right-24 top-10 size-[320px] rounded-full bg-accent/20 opacity-30 blur-[100px]" />
          </div>
          <Container>
            <Reveal className="max-w-[820px]" stagger={0.1}>
              <Badge>{data.badge}</Badge>
              <h1 className="mt-6 text-[40px] font-medium leading-[1.06] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[64px]">
                {data.heading}
              </h1>
              <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.7] text-[#1E1E1E]">
                {data.subheading}
              </p>
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {data.meta.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[15px] text-ink">
                    <Tick className="size-3.5 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>

        {/* the work */}
        <section className="py-20 lg:py-24">
          <Container>
            <div className="flex flex-col gap-16 lg:gap-24">
              {data.cases.map((study, i) => (
                <Reveal key={study.title}>
                  <CaseCard study={study} flip={i % 2 === 1} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* capabilities strip — ties the work back to the service list */}
        <section className="border-y border-line bg-surface py-16">
          <Container>
            <Reveal className="flex flex-col items-center text-center" stagger={0.08}>
              <h2 className="text-[24px] font-medium tracking-[-0.02em] text-ink sm:text-[28px]">
                {data.capabilities.heading}
              </h2>
              <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
                {data.capabilities.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-white px-4 py-2 text-[14px] font-medium text-ink shadow-card"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>

        {/* closing call to action */}
        <section className="py-20 lg:py-24">
          <Container>
            <Reveal className="overflow-hidden rounded-[30px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-8 py-14 text-center text-white sm:px-16">
              <h2 className="mx-auto max-w-[20ch] text-[30px] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[36px]">
                {data.cta.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-[1.8] text-white/80">
                {data.cta.body}
              </p>
              <Button cta={data.cta.primary} variant="white" className="mt-9" />
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
