import type { Bullet, HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { AssistantOrb } from "../assistant-orb";
import { InboxMockup } from "../inbox-mockup";
import { Button, CheckSolid, Container, Media } from "../ui";

function FeatureList({ bullets }: { bullets: Bullet[] }) {
  return (
    <ul>
      {bullets.map((bullet) => (
        <li key={bullet.title} className="mb-[16px] last:mb-0">
          <div className="flex items-center gap-[13px] mb-[8px]">
            <CheckSolid className="size-[19px] shrink-0 text-ink" />
            <p className="text-[20px] font-medium tracking-[-0.01em] text-ink">
              {bullet.title}
            </p>
          </div>
          {bullet.body ? (
            <p className="text-[15px] leading-[136%] text-[#1E1E1E]">
              {bullet.body}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function Bento({ data }: { data: HomeContent["bento"] }) {
  return (
    <section id="solutions" className="py-24 lg:py-28">
      <Container>
        <Reveal className="grid gap-[16px] lg:grid-cols-12" stagger={0.14}>
          {/* booking band — the whole row, so it reads as one invitation
              rather than another feature tile */}
          <article className="flex flex-col gap-6 rounded-[16px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] p-9 lg:col-span-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div>
              <span className="w-fit rounded-full bg-white/20 px-3.5 py-1.5 text-[16px] font-normal text-white">
                {data.booking.eyebrow}
              </span>
              <h2 className="mt-4 max-w-[24ch] text-[26px] font-medium leading-[1.22] tracking-[-0.02em] text-white sm:text-[30px]">
                {data.booking.heading}
              </h2>
              <p className="mt-3 max-w-[62ch] text-[16px] leading-[136%] text-white">
                {data.booking.body}
              </p>
            </div>
            <Button cta={data.booking.cta} className="shrink-0 px-8" variant="white" />
          </article>

          {/* complete solution — gradient card */}
          <article className="flex flex-col overflow-hidden rounded-[16px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-5.5 pt-6 pb-0 text-white lg:col-span-4">
            <span className="w-fit rounded-full bg-white/20 px-3.5 py-1.5 text-[16px] font-normal">
              {data.intro.eyebrow}
            </span>
            <h2 className="mt-4 text-[24px] font-medium leading-[1.22] tracking-[-0.02em]">
              {data.intro.heading}
            </h2>
            <p className="mt-4 mb-4 text-[16px] leading-[136%] text-white">
              {data.intro.body}
            </p>
            <AssistantOrb />
          </article>

          {/* smart voice ai */}
          <article className="flex flex-col rounded-[16px] bg-surface p-9 lg:col-span-8">
            <h2 className="text-[26px] font-medium tracking-[-0.02em] text-ink">
              {data.voice.heading}
            </h2>
            <p className="mt-3 max-w-[68ch] text-[16px] leading-[136%] text-[#1E1E1E]">
              {data.voice.body}
            </p>
            <FeatureList bullets={data.voice.bullets} />
            <Button cta={data.voice.cta} className="mt-9 w-fit" />
          </article>

          {/* smart inbox — copy */}
          <article className="flex flex-col rounded-[26px] bg-surface p-[20px] lg:col-span-3">
            <h2 className="text-[28px] font-medium leading-tight tracking-[-0.02em] text-ink">
              {data.inbox.heading}
            </h2>
            <p className="mt-2 mb-8 text-[16px] leading-[136%] text-[#1E1E1E]">
              {data.inbox.body}
            </p>
            <FeatureList bullets={data.inbox.bullets} />
            <Button cta={data.inbox.cta} className="mt-8 w-fit" />
          </article>

          {/* smart inbox — ui shot on brand */}
          <div className="rounded-[16px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] lg:col-span-6 pb-0 flex items-end justify-center">
            <InboxMockup />
          </div>

          {/* campaigns */}
          <article className="relative z-10 flex flex-col overflow-hidden rounded-[26px] bg-surface lg:col-span-3 bg-[url('/images/campaigns.webp')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#052EFF]/0 to-white -z-10"></div>
            <div className="flex flex-1 flex-col p-8 justify-end">
              <h2 className="text-[28px] font-medium leading-tight tracking-[-0.02em] text-ink">
                {data.campaigns.heading}
              </h2>
              <p className="mt-2 text-[16px] leading-[136%] text-[#1E1E1E]">
                {data.campaigns.body}
              </p>
              <Button cta={data.campaigns.cta} className="mt-4 w-fit" />
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
