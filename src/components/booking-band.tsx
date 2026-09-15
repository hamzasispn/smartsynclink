import type { Cta } from "@/content/home";
import { BookingArt } from "./booking-art";

export type BookingBandData = {
  eyebrow: string;
  heading: string;
  /** Painted in the accent colour wherever it appears in the heading. */
  highlight: string;
  cta: Cta;
  secondary: Cta;
};

/** The heading with every occurrence of `highlight` painted in the accent. */
function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  return (
    <>
      {text.split(highlight).map((part, i, parts) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? <span className="text-chip-yellow">{highlight}</span> : null}
        </span>
      ))}
    </>
  );
}

/**
 * The "Did You Know?" band: copy left, the booking drawing in the middle, two
 * actions stacked on the right. Shared by the home bento and the industry pages.
 */
export function BookingBand({ booking, className = "" }: { booking: BookingBandData; className?: string }) {
  return (
    <article
      className={`relative grid items-center gap-6 overflow-hidden rounded-[16px] bg-[linear-gradient(100deg,#14063F_0%,#2600B0_58%,#3300EA_100%)] px-9 pt-9 lg:grid-cols-[1.25fr_1fr_auto] lg:gap-10 lg:py-0 lg:pl-9 lg:pr-12 ${className}`}
    >
      <div className="lg:py-10">
        <p className="text-[18px] font-normal text-white/80">{booking.eyebrow}</p>
        <h2 className="mt-3 max-w-[46ch] text-[20px] font-normal leading-[1.8] text-white">
          <Highlighted text={booking.heading} highlight={booking.highlight} />
        </h2>
      </div>

      <div className="relative -mb-px h-[215px] self-end max-lg:order-last">
        <BookingArt className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2" />
      </div>

      <div className="flex flex-col gap-3 whitespace-nowrap lg:w-[220px]">
        <a
          href={booking.cta.href}
          data-fill=""
          style={{ "--fill": "#052EFF" } as React.CSSProperties}
          className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-gradient-to-r from-[#5B63FF] to-[#6A45FF] px-5 text-[15px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(5,46,255,.8)]"
        >
          {booking.cta.label}
        </a>
        <a
          href={booking.secondary.href}
          data-fill=""
          style={{ "--fill": "rgba(255,255,255,.14)" } as React.CSSProperties}
          className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-white/80 px-5 text-[15px] font-medium text-white"
        >
          {booking.secondary.label}
        </a>
      </div>
    </article>
  );
}
