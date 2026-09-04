import Image from "next/image";
import type { Cta, Media as MediaSlot } from "@/content/home";

/** The brand glow used behind pricing cards and in the hero corners. */
export const GLOW =
  "linear-gradient(180deg, #292176 0%, #374AA8 58%, #6C31E9 100%)";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-382 px-6 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- icons -- */

type IconProps = { className?: string };

export function CheckSolid({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="11" className="fill-current" />
      <path
        d="M7.3 12.3l3.1 3.1 6.3-6.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckRing({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
    >
      <circle cx="12" cy="12" r="9.4" />
      <path d="M8.2 12.2l2.6 2.6 5-5.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Tick({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export function Chevron({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

export function Star({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        className="fill-current"
        d="M10 1.4l2.6 5.4 5.9.85-4.25 4.15 1 5.9L10 14.9l-5.25 2.8 1-5.9L1.5 7.65l5.9-.85z"
      />
    </svg>
  );
}

export function Bolt({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path className="fill-current" d="M11.4 1.5L4 11.2h4.2l-.6 7.3L15.5 8.5h-4.3z" />
    </svg>
  );
}

export function UserIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="10" cy="7" r="3.2" />
      <path d="M3.8 17c.5-3.2 3.1-5 6.2-5s5.7 1.8 6.2 5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="14.6" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="M21.5 11.2c-2.4-2-5.6-1.2-6.6 1.4-.9 2.5 1 4.3 3.2 5.3 2.2 1 3.5 2.6 2.7 4.6-1 2.5-4.2 3.2-6.6 1.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const socialPaths: Record<string, string> = {
  LinkedIn:
    "M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 002.48 2.5A2.5 2.5 0 007.5 6a2.5 2.5 0 00-2.52-2.5zM3 9.5h4V21H3zM10 9.5h3.8v1.6c.6-1 1.9-1.9 3.7-1.9 3 0 4.5 1.9 4.5 5.4V21h-4v-5.7c0-1.6-.6-2.6-2-2.6-1.1 0-1.8.8-2.1 1.5-.1.3-.1.7-.1 1V21h-4z",
  X: "M17.5 3h3.3l-7.2 8.2L22 21h-6.6l-4.5-5.9L5.6 21H2.3l7.7-8.8L2 3h6.8l4.1 5.4zm-1.2 16h1.8L7.8 4.8H5.9z",
  Facebook:
    "M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z",
  YouTube:
    "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15.1V8.9l5.2 3.1z",
  Instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.8-.1zm0 3.2A6.6 6.6 0 1018.6 12 6.6 6.6 0 0012 5.4zm0 10.9A4.3 4.3 0 1116.3 12 4.3 4.3 0 0112 16.3zm6.9-11.1a1.55 1.55 0 11-1.55-1.55A1.55 1.55 0 0118.9 5.2z",
};

export function SocialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const path = socialPaths[name] ?? socialPaths.X;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path className="fill-current" d={path} />
    </svg>
  );
}

/* ----------------------------------------------------------- primitives -- */

/**
 * Stands in for a real asset. `frame` = dashed content slot,
 * `plain` = flat block for full-bleed art (a dashed border there looks broken).
 * Swap this one component for next/image when the assets land.
 */
export function Placeholder({
  label,
  className = "",
  variant = "frame",
  tone = "light",
}: {
  label: string;
  className?: string;
  variant?: "frame" | "plain";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const skin = dark
    ? "bg-white/15 text-white/75"
    : "bg-linear-160 from-black/[0.045] to-black/[0.09] text-ink/35";
  const edge =
    variant === "frame"
      ? dark
        ? "border border-dashed border-white/25"
        : "border border-dashed border-ink/15"
      : "";

  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center overflow-hidden ${skin} ${edge} ${className}`}
    >
      <span className="px-3 text-center text-[10px] font-normal uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

/**
 * Renders the real asset when the content slot has a src, otherwise the
 * placeholder. Every image on the page goes through here, so filling in a
 * missing asset is a content edit — no component changes.
 */
export function Media({
  image,
  className = "",
  sizes = "100vw",
  variant = "frame",
  tone = "light",
  priority = false,
  fit = "cover",
}: {
  image: MediaSlot;
  className?: string;
  sizes?: string;
  variant?: "frame" | "plain";
  tone?: "light" | "dark";
  priority?: boolean;
  /**
   * How the image fills its box. `contain` keeps the whole picture visible
   * and letterboxes it; `cover` crops to fill.
   *
   * It has to be a prop: className lands on the wrapper, and object-fit only
   * means anything on the <img> inside it. Passing object-contain through
   * className looks like it should work and silently does nothing.
   */
  fit?: "cover" | "contain";
}) {
  if (!image.src) {
    return (
      <Placeholder
        label={image.alt}
        className={className}
        variant={variant}
        tone={tone}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === "contain" ? "object-contain" : "object-cover"}
      />
    </div>
  );
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export function Button({
  cta,
  variant = "primary",
  className = "",
}: {
  cta: Cta;
  variant?: "primary" | "outline" | "white" | "ghost-light";
  className?: string;
}) {
  const skin = {
    primary:
      "bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white",
    outline: "border border-black/10 bg-transparent text-ink hover:border-ink/25",
    white: "bg-white text-ink",
    "ghost-light": "text-ink/70 hover:text-brand",
  }[variant];

  // colour the pointer-origin fill grows in (see [data-fill] in globals.css).
  // Each one keeps the label readable both before and after the fill lands.
  const fill = {
    primary: "#6c31e9",
    outline: "var(--color-brand-soft)",
    white: "var(--color-brand-soft)",
    "ghost-light": undefined,
  }[variant];

  return (
    <a
      href={cta.href}
      data-fill={fill ? "" : undefined}
      style={fill ? ({ "--fill": fill } as React.CSSProperties) : undefined}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-[16px] font-medium transition-all duration-200 active:scale-[0.98] ${skin} ${focusRing} ${className}`}
    >
      {cta.label}
    </a>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/4 px-[18px] py-2 text-[16px] font-medium text-black">
      {children}
    </span>
  );
}

export function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-3.5" />
      ))}
    </div>
  );
}

/** Shared by both video sections. Parent needs `group` for the hover scale. */
export function PlayTarget({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`size-12 transition-transform duration-300 group-hover:scale-110 ${
        tone === "dark" ? "text-white" : "text-ink"
      }`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M24 42C26.3638 42 28.7044 41.5344 30.8883 40.6298C33.0722 39.7253 35.0565 38.3994 36.7279 36.7279C38.3994 35.0565 39.7253 33.0722 40.6298 30.8883C41.5344 28.7044 42 26.3638 42 24C42 21.6362 41.5344 19.2956 40.6298 17.1117C39.7253 14.9278 38.3994 12.9435 36.7279 11.2721C35.0565 9.60062 33.0722 8.27475 30.8883 7.37017C28.7044 6.46558 26.3638 6 24 6C19.2261 6 14.6477 7.89642 11.2721 11.2721C7.89642 14.6477 6 19.2261 6 24C6 28.7739 7.89642 33.3523 11.2721 36.7279C14.6477 40.1036 19.2261 42 24 42ZM21.566 15.98L32.854 22.252C33.1656 22.4253 33.4253 22.6787 33.6061 22.986C33.7868 23.2934 33.8821 23.6434 33.8821 24C33.8821 24.3566 33.7868 24.7066 33.6061 25.014C33.4253 25.3213 33.1656 25.5747 32.854 25.748L21.566 32.02C21.2005 32.2232 20.7883 32.3273 20.3701 32.3221C19.952 32.3169 19.5425 32.2025 19.1821 31.9903C18.8218 31.7781 18.5232 31.4755 18.3158 31.1123C18.1085 30.7492 17.9996 30.3382 18 29.92V18.08C17.9996 17.6618 18.1085 17.2508 18.3158 16.8877C18.5232 16.5245 18.8218 16.2219 19.1821 16.0097C19.5425 15.7975 19.952 15.6831 20.3701 15.6779C20.7883 15.6727 21.2005 15.7768 21.566 15.98Z"
      />
    </svg>
  );
}

export function SectionHead({
  badge,
  heading,
  subheading,
  className = "",
}: {
  badge?: string;
  heading: string;
  subheading?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {badge ? <Badge>{badge}</Badge> : null}
      <h2
        className={`max-w-[760px] text-balance text-[40px] font-medium leading-[112%] tracking-[-0.02em] text-ink sm:text-[38px] ${badge ? "mt-5" : ""}`}
      >
        {heading}
      </h2>
      {subheading ? (
        <p className="mt-4 max-w-[70ch] text-[16px] leading-[136%] text-[#1E1E1E]">
          {subheading}
        </p>
      ) : null}
    </div>
  );
}
