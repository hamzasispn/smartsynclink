import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { Bolt, Button, Container } from "../ui";

/** Chip positions are fixed by index — the design has exactly four. */
const chipSpots = [
  "left-0 top-[14%]",
  "right-0 top-[30%]",
  "left-[2%] bottom-[26%]",
  "right-[4%] bottom-[10%]",
];

export function FinalCta({ data }: { data: HomeContent["finalCta"] }) {
  return (
    <section id="contact" className="pb-24 lg:pb-28">
      <Container>
        <Reveal className="relative grid items-center gap-12 overflow-hidden rounded-[30px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] p-10 text-white lg:grid-cols-2 lg:p-16">
          <div>
            <h2 className="max-w-[480px] text-[30px] font-medium leading-[1.22] tracking-[-0.02em] sm:text-[34px]">
              {data.heading}
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.85] text-white/80">
              {data.body}
            </p>
            <Button cta={data.cta} variant="white" className="mt-9" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[400px]">
            {/* orb: colored rim bloom behind a black core.
                The bloom rotates and the whole orb breathes — CSS keyframes,
                so it animates off the main thread and costs no JS. */}
            <div
              aria-hidden="true"
              className="orb-breathe absolute inset-[12%] rounded-full"
            >
              <div className="orb-spin size-full rounded-full bg-[conic-gradient(from_150deg,#22d3ee,#8b5cf6,#ec4899,#3b82f6,#22d3ee)] blur-xl" />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle_at_50%_45%,#15151f_58%,transparent_72%)]"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
              <span className="text-[10px] font-normal text-white/60">
                {data.orbLabel}
              </span>
              <a
                href={data.pill.href}
                data-fill=""
                style={{ "--fill": "#7c1fa8" } as React.CSSProperties}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-[16px] font-normal text-white shadow-lift transition-transform duration-200 hover:scale-105"
              >
                <Bolt className="orb-breathe size-3.5" />
                {data.pill.label}
              </a>
            </div>

            {data.chips.map((chip, i) => (
              <span
                key={chip}
                style={{ "--i": i } as React.CSSProperties}
                className={`orb-chip absolute rounded-full bg-white px-3 py-1.5 text-[10px] font-normal text-ink shadow-lift ${chipSpots[i] ?? ""}`}
              >
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
