import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { Button, CheckRing, Container, GLOW, SectionHead } from "../ui";

export function Pricing({ data }: { data: HomeContent["pricing"] }) {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-page py-24 lg:py-28"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 select-none text-[324px] font-black leading-none tracking-[-0.04em] text-ink/[0.038]"
      >
        {data.watermark}
      </span>

      <Container className="relative">
        <Reveal>
          <SectionHead
            badge={data.badge}
            heading={data.heading}
            subheading={data.subheading}
          />
        </Reveal>

        <Reveal className="mt-20 grid gap-[25px] lg:grid-cols-3" stagger={0.16} delay={0.18}>
          {data.plans.map((plan) => {
            const hot = plan.featured;
            return (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-[22px] p-8 ${
                  hot
                    ? "bg-linear-to-br from-[#052EFF] to-[#3300EA] text-white"
                    : "border border-black/25 bg-linear-to-br from-[#cabee2]/20 via-white/10 to-[#cad7dd]/30 backdrop-blur-xl"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
                >
                  <span
                    className={`absolute right-0 -top-20 size-64 rounded-full blur-[60px] ${hot ? "opacity-100" : "opacity-[0.22]"}`}
                    style={{ background: GLOW }}
                  />
                  <span
                    className={`absolute -bottom-20 -left-20 size-64 rounded-full blur-[60px] ${hot ? "opacity-100" : "opacity-[0.22]"}`}
                    style={{ background: GLOW }}
                  />
                </div>

                {plan.badge ? (
                  <span className="absolute -top-3.5 right-8 rounded-full px-4 py-1.5 text-[16px] font-normal text-brand bg-white border-brand border-solid border shadow-lift">
                    {plan.badge}
                  </span>
                ) : null}

                <h3
                  className={`relative text-[20px] font-medium ${hot ? "text-white" : "text-[#1e1e1e]"}`}
                >
                  {plan.name}
                </h3>

                <p className="relative mt-4 flex items-baseline gap-1.5">
                  <span
                    className={`text-[64px] font-medium leading-none tracking-[-0.03em] ${hot ? "text-white" : "text-ink"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-[16px] ${hot ? "text-white/70" : "text-[#1e1e1e]"}`}
                  >
                    {data.period}
                  </span>
                </p>

                <p
                  className={`relative text-[14px] pb-[36px] border-b  ${hot ? "text-white/75 border-white/25" : "text-[#1e1e1e] border-black/25"}`}
                >
                  {plan.tagline}
                </p>

                <ul className="relative mt-8 mb-10 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-[16px] leading-snug ${hot ? "text-white/90" : "text-[#1e1e1e]"}`}
                    >
                      <CheckRing
                        className={`mt-px size-[17px] shrink-0 ${hot ? "text-white/80" : "text-brand"}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  cta={plan.cta}
                  variant={hot ? "white" : "outline"}
                  className="relative mt-auto w-full"
                />
              </article>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
