import type { Bullet, HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { AssistantOrb } from "../assistant-orb";
import { BookingBand } from "../booking-band";
import { SuiteLockup, SuiteMark } from "../suite-logo";
import { ChatCycle, LivePhone } from "../live-suite";
import { Button, CheckSolid, Container } from "../ui";
import { SuiteStage } from "./suite";

/**
 * The same mark on every feature card, so the three read as one product rather
 * than three. Blue on the light cards, which is the mark's own colour; the
 * gradient tile beside them carries the white lockup instead.
 *
 * `id` has to differ per card: the mark's gradient is referenced by id, and
 * Chrome paints the second of two matching ids from the first.
 */
function SuiteBadge({ id }: { id: string }) {
  return (
    <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-brand/8 px-3 py-1.5">
      <SuiteMark id={id} size={18} />
      <span className="text-[13px] font-medium tracking-[-0.01em] text-brand">
        SmartSync Suite
      </span>
    </span>
  );
}

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
  const booking = data.booking;

  return (
    <section id="solutions" className="py-24 lg:py-28">
      <Container>
        <Reveal className="grid gap-[16px] lg:grid-cols-12" stagger={0.14}>
          <BookingBand booking={booking} className="lg:col-span-12" />

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
            <SuiteBadge id="bento-badge-voice" />
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
            <SuiteBadge id="bento-badge-inbox" />
            <h2 className="text-[28px] font-medium leading-tight tracking-[-0.02em] text-ink">
              {data.inbox.heading}
            </h2>
            <p className="mt-2 mb-8 text-[16px] leading-[136%] text-[#1E1E1E]">
              {data.inbox.body}
            </p>
            <FeatureList bullets={data.inbox.bullets} />
            <Button cta={data.inbox.cta} className="mt-8 w-fit" />
          </article>

          {/* smart inbox — the product itself, drawn, where the screenshot was */}
          <div className="flex flex-col overflow-clip rounded-[16px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] p-6 lg:col-span-6">
            <SuiteLockup id="bento-suite-lockup" size={30} inverse />
            {/* half as wide again as the tile, clipped by its right edge */}
            <div className="mt-auto pt-8">
              <SuiteStage idPrefix="bento-stage" layout="tile" className="hidden w-[150%] max-w-none md:block" />
              <div className="flex justify-center [zoom:0.8] md:hidden">
                <ChatCycle>
                  <LivePhone idPrefix="bento-solo" />
                </ChatCycle>
              </div>
            </div>
          </div>

          {/* campaigns — the tile teases it, its own section below explains it.
              The picture comes from the content now; it used to be a URL
              hardcoded in the class, so the field in the builder did nothing. */}
          <article
            className="relative z-10 flex flex-col overflow-hidden rounded-[26px] bg-surface bg-cover bg-center lg:col-span-3"
            style={
              data.campaigns.image?.src
                ? { backgroundImage: `url("${data.campaigns.image.src}")` }
                : undefined
            }
          >
            {/* the photograph reads as a band across the top now: the card
                carries points like its siblings, and they need a plain ground */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/85 to-white" />
            <div className="flex flex-1 flex-col justify-end p-[20px]">
              <SuiteBadge id="bento-badge-campaigns" />
              <h2 className="text-[28px] font-medium leading-tight tracking-[-0.02em] text-ink">
                {data.campaigns.heading}
              </h2>
              <p className="mt-2 mb-8 text-[16px] leading-[136%] text-[#1E1E1E]">
                {data.campaigns.body}
              </p>
              <FeatureList bullets={data.campaigns.bullets} />
              <Button cta={data.campaigns.cta} className="mt-8 w-fit" />
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
