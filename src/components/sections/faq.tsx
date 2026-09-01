import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { Chevron, Container } from "../ui";

export function Faq({ data }: { data: HomeContent["faq"] }) {
  return (
    <section className="pb-24 lg:pb-28">
      <Container>
        <Reveal
          className="grid gap-12 lg:grid-cols-12 lg:gap-10"
          stagger={0.14}
        >
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-5 place-items-center rounded-full border-[6px] border-brand" />
              <span className="text-[20px] font-normal text-[#1e1e1e]">
                {data.eyebrow}
              </span>
            </div>
            <h2 className="mt-5 max-w-[500px] text-[40px] font-normal leading-[96%] tracking-[-0.02em] text-ink">
              {data.heading}
            </h2>
          </div>

          <div className="lg:col-span-7">
            {data.items.map((item) => (
              <details key={item.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[20px] font-normal text-[#1e1e1e] transition-colors hover:text-brand">
                  {item.q}
                  <Chevron className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:-rotate-180" />
                </summary>
                <p className="max-w-[70ch] pb-5 text-[16px] leading-[1.85] text-[#1e1e1e]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
