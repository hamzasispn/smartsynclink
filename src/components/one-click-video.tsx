"use client";

import { useState } from "react";
import { PlayTarget } from "./ui";

/**
 * The walkthrough as a poster with a play button on it, which is what a video
 * should look like before it is playing — native controls on a paused video
 * read as a black box with a thin bar.
 *
 * Nothing loads until it is pressed. That matters most for a YouTube link: its
 * iframe pulls a few hundred kilobytes of player before anyone has decided to
 * watch, so it is only mounted on the click that asks for it.
 */
export function OneClickVideo({
  src,
  embed,
  poster,
  label,
}: {
  /** A file to play — an upload, or a link that is not YouTube or Vimeo. */
  src?: string;
  /** A YouTube or Vimeo embed URL, used when there is no file. */
  embed?: string;
  poster?: string;
  label: string;
}) {
  const [playing, setPlaying] = useState(false);
  const frame =
    "relative aspect-video w-full overflow-hidden rounded-[24px] bg-ink shadow-[0_30px_70px_-34px_rgba(14,14,20,.55)]";

  if (playing && src) {
    return (
      <video
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay
        controls
        playsInline
        className={`${frame} object-cover`}
      />
    );
  }

  if (playing && embed) {
    return (
      <iframe
        src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
        title={label}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className={`${frame} border-0`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${label}`}
      className={`${frame} group block cursor-pointer`}
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
    </button>
  );
}
