import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Reveal } from "@/components/reveal";
import { GradientText, Rich } from "@/components/rich";
import { FinalCta } from "@/components/sections";
import { Badge, Container } from "@/components/ui";
import type { RateGroup } from "@/content/pricing-pages";
import { getGlobalContent, getHomeContent, getUsagePricingContent } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Usage Pricing Guide — SmartSyncLink",
  description:
    "Transparent, pay-as-you-go rates for phone numbers, SMS & MMS, voice calls, AI features, A2P registration and add-ons.",
};

/** Tile icons per group, keyed by the group's `icon` field. */
const ICONS: Record<string, React.ReactNode> = {
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  voice: <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />,
  ai: (
    <>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
    </>
  ),
  a2p: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.7 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  addons: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </>
  ),
};

function GroupTable({ group }: { group: RateGroup }) {
  const valueCols = group.columns.length - 1;
  // name column takes the room left; each price column gets a fixed share
  const cols = `minmax(0,1fr) repeat(${valueCols}, minmax(120px, 170px))`;

  return (
    <section aria-labelledby={`rates-${group.icon}`} className="scroll-mt-28">
      <div className="flex items-center gap-4 border-b border-line pb-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-gradient-to-br from-[#052EFF] to-[#3300EA] text-white">
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {ICONS[group.icon] ?? ICONS.addons}
          </svg>
        </span>
        <div>
          <h2 id={`rates-${group.icon}`} className="text-[22px] font-medium tracking-[-0.01em] text-ink">
            {group.title}
          </h2>
          <p className="mt-0.5 text-[14px] text-muted">{group.subtitle}</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[16px] border border-line bg-white shadow-card">
        {/* header row — hidden on phones, where each price carries its own label */}
        <div
          className="hidden bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-6 py-3 text-[12px] font-semibold tracking-[0.06em] text-white uppercase sm:grid"
          style={{ gridTemplateColumns: cols }}
        >
          {group.columns.map((column, i) => (
            <span key={column} className={i === 0 ? "" : "text-right"}>
              {column}
            </span>
          ))}
        </div>

        <ul className="divide-y divide-line">
          {group.rows.map((row) => (
            <li
              key={row.name}
              className="grid gap-3 px-6 py-4 sm:items-center sm:gap-4 sm:[grid-template-columns:var(--cols)]"
              style={{ "--cols": cols } as React.CSSProperties}
            >
              <div>
                <p className="text-[15px] font-medium text-ink">{row.name}</p>
                <p className="mt-0.5 text-[13px] text-muted">{row.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:contents">
                {row.cells.map((cell, i) => (
                  <div key={i} className="sm:text-right">
                    <p className="text-[11px] font-semibold tracking-[0.06em] text-muted uppercase sm:hidden">
                      {group.columns[i + 1]}
                    </p>
                    <p className="text-[15px] font-semibold text-ink">{cell.value}</p>
                    {cell.unit ? <p className="text-[12px] text-muted">{cell.unit}</p> : null}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {group.note.label || group.note.text ? (
        <p className="mt-4 rounded-[12px] border-l-4 border-brand bg-brand-soft px-5 py-4 text-[14px] leading-[1.7] text-[#1E1E1E]">
          {group.note.label ? <strong className="font-semibold text-ink">{group.note.label} </strong> : null}
          <Rich text={group.note.text} />
        </p>
      ) : null}
    </section>
  );
}

export default async function TransparentPricingPage() {
  const [global, home, data] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getUsagePricingContent(),
  ]);

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main className="pb-24">
        <Container>
          <Reveal className="flex flex-col items-center pt-[168px] text-center" stagger={0.1}>
            <Badge>{data.badge}</Badge>
            <h1 className="mt-6 text-balance text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[60px]">
              <GradientText text={data.heading} highlight={data.highlight} />
            </h1>
            <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.7] text-[#1E1E1E]">
              {data.subheading}
            </p>
          </Reveal>

          <div className="mx-auto mt-16 flex max-w-[1000px] flex-col gap-16">
            {data.groups.map((group) => (
              <Reveal key={group.title}>
                <GroupTable group={group} />
              </Reveal>
            ))}

            <Reveal className="rounded-[22px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-8 py-10 text-center text-white">
              <p className="text-[22px] font-medium">{data.closing.title}</p>
              <p className="mx-auto mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/85">
                {data.closing.body}
              </p>
              <Link
                href={data.closing.link.href}
                className="mt-4 inline-block text-[15px] font-medium text-white underline underline-offset-4"
              >
                {data.closing.link.label}
              </Link>
            </Reveal>
          </div>
        </Container>
      </main>

      <FinalCta data={home.finalCta} />
      <Footer brand={global.brand} data={global.footer} />
    </>
  );
}
