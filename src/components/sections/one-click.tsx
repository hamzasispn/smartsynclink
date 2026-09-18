import type { HomeContent } from "@/content/home";
import { OneClickVideo } from "../one-click-video";
import { Reveal } from "../reveal";
import { Badge, Button, Container, PlayTarget } from "../ui";

/**
 * One-click campaigns: the promise on one side, the walkthrough on the other.
 *
 * The bento tile it came from is a quarter of a row wide — a video in there was
 * too small to follow, and it pushed the tile's own heading and button aside.
 * The tile now links here (#one-click), and the video gets half a section.
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
 * One mark per step, in order. Drawn here rather than pulled from the mockup
 * icon set, which positions everything absolutely for the artboard and cannot
 * sit inline. A fourth step added in the builder falls back to its number.
 */
const STEP_ICONS = [
  // a list of people to reach
  <path
    key="list"
    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"
  />,
  // a message written once
  <path key="message" d="M7.9 20A9 9 0 1 0 4 16.1L2 22ZM8 11h8M8 15h5" />,
  // an appointment that comes back
  <>
    <rect key="cal" x="3" y="4" width="18" height="18" rx="2" />
    <path key="marks" d="M16 2v4M8 2v4M3 10h18m-9 4 2 2 4-4" />
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

            {data.cta?.label ? <Button cta={data.cta} className="mt-10 px-8" /> : null}
          </div>

          {/* the walkthrough, or the picture with a play badge until one arrives */}
          {file || embed ? (
            <OneClickVideo src={file || undefined} embed={embed} poster={poster || undefined} label={data.heading} />
          ) : (
            <a
              href="#demo"
              aria-label="Watch a demo"
              className="group relative block aspect-video w-full overflow-hidden rounded-[24px] bg-ink shadow-[0_30px_70px_-34px_rgba(14,14,20,.55)]"
              style={
                poster
                  ? { backgroundImage: `url("${poster}")`, backgroundSize: "cover", backgroundPosition: "center" }
                  : undefined
              }
            >
              <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/10 transition-colors group-hover:from-ink/60" />
              <span className="absolute inset-0 grid place-items-center">
                <PlayTarget tone="dark" />
              </span>
            </a>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
