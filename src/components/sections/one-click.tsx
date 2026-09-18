import type { HomeContent } from "@/content/home";
import { Reveal } from "../reveal";
import { Button, Container, Media, SectionHead } from "../ui";

/**
 * One-click campaigns, with the walkthrough at full width.
 *
 * The bento tile it came from is a quarter of a row wide — a video in there was
 * too small to follow, and it pushed the tile's own heading and button out of
 * the way. The tile now links here (#one-click), and this is where the video
 * gets the room to explain the feature.
 */

/** A YouTube or Vimeo link has to be an iframe; anything else plays as a file. */
function embedSrc(url: string) {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/**
 * However the walkthrough was given to us: uploaded in the page builder, or a
 * link pasted beside it. The upload wins if both are set, and with neither the
 * section still stands — it shows the picture instead of an empty black box.
 */
function Walkthrough({ data }: { data: HomeContent["oneClick"] }) {
  const frame =
    "aspect-video w-full rounded-[26px] bg-ink shadow-[0_30px_70px_-34px_rgba(14,14,20,.5)]";
  const poster = data.image?.src || undefined;
  const url = data.videoUrl?.trim() ?? "";

  if (data.video?.src || (url && !embedSrc(url))) {
    return (
      <video
        src={data.video?.src || url}
        poster={poster}
        aria-label={data.video?.alt || data.heading}
        controls
        playsInline
        preload="metadata"
        className={`${frame} object-cover`}
      />
    );
  }

  const embed = url ? embedSrc(url) : null;
  if (embed) {
    return (
      <iframe
        src={embed}
        title={data.heading}
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className={`${frame} border-0`}
      />
    );
  }

  return (
    <Media
      image={data.image}
      variant="plain"
      sizes="(max-width: 1024px) 100vw, 980px"
      className={frame}
    />
  );
}

export function OneClick({ data }: { data: HomeContent["oneClick"] }) {
  return (
    <section id="one-click" className="scroll-mt-24 py-24 lg:py-28">
      <Container>
        <Reveal stagger={0.1}>
          <SectionHead badge={data.badge} heading={data.heading} subheading={data.subheading} />

          <div className="mx-auto mt-12 max-w-[980px]">
            <Walkthrough data={data} />
          </div>

          {data.points?.length ? (
            <ul className="mx-auto mt-12 grid max-w-[980px] gap-6 md:grid-cols-3">
              {data.points.map((point, i) => (
                <li key={point.title} className="rounded-2xl border border-line bg-white p-6">
                  <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-[14px] font-semibold text-brand">
                    {i + 1}
                  </span>
                  <p className="mt-4 text-[18px] font-medium tracking-[-0.01em] text-ink">
                    {point.title}
                  </p>
                  {point.body ? (
                    <p className="mt-2 text-[15px] leading-[1.6] text-muted">{point.body}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {data.cta?.label ? (
            <div className="mt-11 flex justify-center">
              <Button cta={data.cta} className="px-8" />
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
