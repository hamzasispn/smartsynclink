import type { HomeContent } from "@/content/home";
import { CampaignMotion } from "../campaign-motion";
import { OneClickVideo } from "../one-click-video";
import { Reveal } from "../reveal";
import { Badge, Button, Container } from "../ui";

/**
 * One-click campaigns: the sequence on one side, the walkthrough on the other.
 *
 * What it is: the front desk enters a client's first name and mobile number
 * after the visit, and that one submit starts a year of texts. Four weekly
 * review requests that stop when a review lands, then a returning-client offer
 * every two or three months with a referral reward on it. Everything here is
 * SMS; nothing here is email, and none of it moves anybody's data anywhere.
 *
 * It sits on the home page under the bento tile that links to it, and again on
 * the aesthetics page. Each page keeps its own copy of the content.
 */

/** A YouTube or Vimeo link has to be an iframe; anything else plays as a file. */
function embedSrc(url: string) {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return undefined;
}

/**
 * One mark per step, in order: the check-in form, the review, the return visit,
 * the referral. Drawn here rather than pulled from the mockup icon set, which
 * positions everything absolutely for the artboard and cannot sit inline. A
 * step added in the builder past these falls back to its number.
 */
const STEP_ICONS = [
  // the check-in form, with a name typed into it
  <>
    <rect key="card" x="3" y="4" width="18" height="16" rx="2" />
    <path key="lines" d="M7 9h6M7 13h10M7 17h4" />
  </>,
  // the review they leave
  <path
    key="star"
    d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.6l5.8-.8z"
  />,
  // the text that brings them back
  <path key="return" d="M7.9 20A9 9 0 1 0 4 16.1L2 22ZM8 11h8M8 15h5" />,
  // the friend they refer
  <>
    <circle key="head" cx="9" cy="8" r="3.4" />
    <path key="body" d="M2.5 20a6.5 6.5 0 0 1 13 0M18 7.5v5M20.5 10h-5" />
  </>,
];

export function OneClick({ data }: { data: HomeContent["oneClick"] }) {
  const url = data.videoUrl?.trim() ?? "";
  const embed = url ? embedSrc(url) : undefined;
  const file = data.video?.src || (url && !embed ? url : "");
  const poster = data.image?.src || "";

  return (
    <section id="one-click" className="scroll-mt-24 bg-page py-24 lg:py-28">
      <Container>
        <Reveal
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          stagger={0.12}
        >
          <div>
            {data.badge ? <Badge>{data.badge}</Badge> : null}
            <h2 className="mt-5 max-w-[16ch] text-[34px] leading-[1.1] font-medium tracking-[-0.03em] text-ink sm:text-[42px]">
              {data.heading}
            </h2>
            {data.subheading ? (
              <p className="mt-5 max-w-[54ch] text-[16px] leading-[1.7] text-[#1E1E1E]">
                {data.subheading}
              </p>
            ) : null}

            {data.points?.length ? (
              <ul className="mt-9 flex flex-col gap-5">
                {data.points.map((point, i) => (
                  <li key={point.title} className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-brand-soft text-brand">
                      {STEP_ICONS[i] ? (
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {STEP_ICONS[i]}
                        </svg>
                      ) : (
                        <span className="text-[15px] font-semibold">{i + 1}</span>
                      )}
                    </span>
                    <span className="block">
                      <span className="block text-[17px] font-medium tracking-[-0.01em] text-ink">
                        {point.title}
                      </span>
                      {point.body ? (
                        <span className="mt-1 block text-[15px] leading-[1.6] text-muted">
                          {point.body}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {data.footnote ? (
              <p className="mt-7 max-w-[48ch] text-[14px] leading-[1.6] text-muted">
                {data.footnote}
              </p>
            ) : null}

            {data.cta?.label ? <Button cta={data.cta} className="mt-8 px-8" /> : null}
          </div>

          {/* the client's walkthrough once it is uploaded; until then the
              sequence drawn and running, which says the same thing */}
          {file || embed ? (
            <OneClickVideo src={file || undefined} embed={embed} poster={poster || undefined} label={data.heading} />
          ) : (
            <>
              {/* portrait below sm, landscape above — one drawing, two arrangements */}
              <CampaignMotion layout="tall" className="w-full sm:hidden" />
              <CampaignMotion layout="wide" className="hidden w-full sm:block" />
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
