import type { CSSProperties, ReactNode } from "react";
import { SuiteMark } from "./suite-logo";

/**
 * The SmartSync Suite product shots — the desktop conversations screen and the
 * same inbox on a phone — drawn in HTML, not pasted in as images.
 *
 * The desktop screen is a fixed 1709×839 artboard: the client's screenshot is
 * 3418×1678 at 2x, so every left/top below is that screenshot's position in
 * CSS pixels. Absolute placement is deliberate. The goal is the screenshot,
 * item for item, and flex layout would only approximate where things land.
 * The whole board is scaled as one piece by `.suite-board` in globals.css.
 *
 * People and business names are invented. The screenshot is a live client
 * inbox, and real customers' names and messages don't belong on a public page.
 */

/* ----------------------------------------------------------------- primitives */

export const BLUE = "#2563EB";
export const INK = "#111827";
export const TEXT = "#374151";
export const MUTED = "#6B7280";
export const LINE = "#E5E7EB";

export function Box({
  x,
  y,
  w,
  h,
  a,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Animation hook, rendered as data-a for the stage timeline to find. */
  a?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div data-a={a} style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

/** Text placed by its vertical centre, which is what the screenshot gives. */
export function T({
  x,
  y,
  s = 14,
  w = 400,
  c = INK,
  align = "left",
  style,
  children,
}: {
  x: number;
  y: number;
  s?: number;
  w?: number;
  c?: string;
  align?: "left" | "center" | "right";
  style?: CSSProperties;
  children: ReactNode;
}) {
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}, -50%)`,
        fontSize: s,
        fontWeight: w,
        color: c,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

const ICONS = {
  glasses: (
    <>
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M14 15a2 2 0 0 0-4 0M2.5 13 5 7c.7-1.3 1.4-2 3-2M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />
    </>
  ),
  send: (
    <path d="M14.5 21.7a.5.5 0 0 0 .9 0l6.5-19a.5.5 0 0 0-.6-.6l-19 6.5a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13.1" />
  ),
  radar: (
    <>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.1 19.1 19" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  chats: (
    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zM18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  bars: <path d="M3 3v18h18M7 16h8M7 11h12M7 6h3" />,
  nodes: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />
  ),
  gear: (
    <>
      <path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m20.5 20.5-4-4" />
    </>
  ),
  zap: (
    <path d="M4 14a1 1 0 0 1-.8-1.6l9.9-10.2a.5.5 0 0 1 .9.5l-1.9 6A1 1 0 0 0 13 10h7a1 1 0 0 1 .8 1.6l-9.9 10.2a.5.5 0 0 1-.9-.5l1.9-6A1 1 0 0 0 11 14z" />
  ),
  updown: <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />,
  chevR: <path d="m9 18 6-6-6-6" />,
  chevD: <path d="m6 9 6 6 6-6" />,
  chevU: <path d="m18 15-6-6-6 6" />,
  chevL: <path d="m15 18-6-6 6-6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </>
  ),
  msgPlus: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22ZM8 12h8M12 8v8" />,
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  tri: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="m11 7-5 10M13 7l5 10M7 19h10" />
    </>
  ),
  archive: (
    <>
      <rect width="18" height="16" x="3" y="4" rx="2" />
      <path d="M3 9h18" />
      <circle cx="12" cy="14" r="2.5" />
    </>
  ),
  filter: <path d="M3 6h18M7 12h10M10 18h4" />,
  sort: <path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" />,
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7" />
    </>
  ),
  inbox: (
    <path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z" />
  ),
  history: <path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8M3 3v5h5M12 7v5l4 2" />,
  star: (
    <path d="M11.5 2.3a.5.5 0 0 1 1 0l2.3 4.7a2.1 2.1 0 0 0 1.6 1.2l5.2.8a.5.5 0 0 1 .3.9l-3.7 3.6a2.1 2.1 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6l-4.6-2.4a2.1 2.1 0 0 0-2 0L6.4 21a.5.5 0 0 1-.8-.6l.9-5.1a2.1 2.1 0 0 0-.6-1.9L2.2 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2.1 2.1 0 0 0 1.6-1.2z" />
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
  bubble: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  trash: <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />,
  mailOpen: (
    <path d="M21.2 8.4c.5.4.8 1 .8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0zM22 10l-9 5.7a2 2 0 0 1-2 0L2 10" />
  ),
  dots: (
    <>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
  ext: <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />,
  plus: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </>
  ),
  userCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.7V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.7" />
    </>
  ),
  fork: (
    <>
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9M12 12v3" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  clipCheck: (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 14l2 2 4-4" />
    </>
  ),
  pen: (
    <path d="M12 20h9M16.4 3.6a1 1 0 0 1 3 3L7.4 18.6a2 2 0 0 1-.9.5l-2.9.8a.5.5 0 0 1-.6-.6l.8-2.9a2 2 0 0 1 .5-.9z" />
  ),
  file: <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />,
  dollar: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6" />
    </>
  ),
  sparkle: (
    <path d="M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z" />
  ),
  fb: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M13.5 22v-8h2.6l.4-3h-3V9.2c0-.9.3-1.5 1.5-1.5h1.6V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V11H8v3h2.5v8" />
    </>
  ),
  ig: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  home: <path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  link: <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  userPlus: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M19 8v6M22 11h-6" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  cap: <path d="M21.4 10.9a1 1 0 0 0 0-1.8L12.8 5.2a2 2 0 0 0-1.7 0L2.6 9.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.7 0zM22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5" />,
  eye: (
    <>
      <path d="M2.1 12.3a1 1 0 0 1 0-.7 10.8 10.8 0 0 1 19.8 0 1 1 0 0 1 0 .7 10.8 10.8 0 0 1-19.8 0" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  arrowUR: <path d="M7 17 17 7M7 7h10v10" />,
  arrowR: <path d="M5 12h14M12 5l7 7-7 7" />,
  trendDown: <path d="M7 7l10 10M17 9v8H9" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C9 3 11 5 12 8c1-3 3-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </>
  ),
  chart: <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />,
  panel: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </>
  ),
  dotsH: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  plusPlain: <path d="M12 5v14M5 12h14" />,
  msgSquare: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

/** An icon placed by its centre. */
export function Ico({
  n,
  x,
  y,
  s = 18,
  c = TEXT,
  sw = 1.75,
  fill = "none",
}: {
  n: IconName;
  x: number;
  y: number;
  s?: number;
  c?: string;
  sw?: number;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={s}
      height={s}
      fill={fill}
      stroke={c}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}
    >
      {ICONS[n]}
    </svg>
  );
}

/* ------------------------------------------------------------------ the data */

type Channel = "fb" | "ig" | "phone" | "chat";
type Face = { initials?: string; bg?: string; fg?: string; photo?: boolean };
type Thread = {
  name: string;
  time: string;
  preview: string;
  count: number;
  channel: Channel;
  face: Face;
};

const PEACH: Face = { bg: "#FBE3C2", fg: "#7C5A2E" };
const LILAC: Face = { bg: "#F6E3F7", fg: "#6B3F75" };
const SKY: Face = { bg: "#DDEBFD", fg: "#2B4C80" };

const THREADS: Thread[] = [
  { name: "Emma Brooks", time: "3:37 PM", preview: "no", count: 1, channel: "fb", face: { ...PEACH, initials: "EB" } },
  { name: "Sophia Esposito Ma...", time: "1:41 PM", preview: "Call", count: 1, channel: "phone", face: { ...LILAC, initials: "SE" } },
  { name: "Tessa Evans", time: "10:17 AM", preview: "Stop", count: 1, channel: "chat", face: { ...LILAC, initials: "TE" } },
  { name: "lunamarie", time: "Sep 8", preview: "Do you have anything open on Friday?", count: 1, channel: "ig", face: { photo: true } },
  { name: "Bella Cruz", time: "Sep 8", preview: "Call", count: 1, channel: "phone", face: { ...SKY, initials: "BC" } },
  { name: "nadia2209", time: "Sep 3", preview: "Yes", count: 1, channel: "ig", face: {} },
  { name: "Clara Hoffmann", time: "Jan 24", preview: "✅ Your account and Page are now ...", count: 2, channel: "ig", face: {} },
];

/** What the AI sends back in the live demo, in THREADS order. The demo cycles through these threads. */
export const REPLIES = [
  "No problem! Want me to hold a spot for next week instead?",
  "Sorry we missed you — calling you back in 2 minutes.",
  "You're unsubscribed. Reply START anytime to rejoin.",
  "Yes! Friday at 2:30 PM is open. Shall I book it?",
  "Hi Bella, just tried you. When is a good time to call?",
];
export const LIVE_COUNT = REPLIES.length;

/** Where the scripted demo is: the open thread, how far its reply has got, and which threads are answered. */
export type ChatState = {
  active: number;
  phase: "incoming" | "typing" | "sent";
  typed: string;
  read: number[];
};
export const STATIC_CHAT: ChatState = { active: 0, phase: "incoming", typed: "", read: [] };

const CHANNEL: Record<Channel, { icon: IconName; color: string }> = {
  fb: { icon: "fb", color: "#1877F2" },
  ig: { icon: "ig", color: "#E1306C" },
  phone: { icon: "phone", color: "#6B7280" },
  chat: { icon: "bubble", color: "#2563EB" },
};

/** Avatar and its channel badge, centred on (x, y). */
export function Avatar({
  face,
  channel,
  x,
  y,
  d,
  badge,
}: {
  face: Face;
  channel?: Channel;
  x: number;
  y: number;
  d: number;
  badge?: number;
}) {
  const b = badge ?? Math.round(d * 0.5);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - d / 2,
          top: y - d / 2,
          width: d,
          height: d,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          fontSize: d * 0.38,
          fontWeight: 500,
          color: face.fg ?? "#9CA3AF",
          background: face.photo
            ? "linear-gradient(160deg, #b9a48f 0%, #6d5a4a 55%, #3b3029 100%)"
            : (face.bg ?? "#F3F4F6"),
        }}
      >
        {face.photo ? (
          <svg viewBox="0 0 24 24" width={d} height={d} aria-hidden="true">
            <circle cx="12" cy="9.5" r="4.2" fill="#e9cfb4" />
            <path d="M3.5 24c.8-5 4.3-8 8.5-8s7.7 3 8.5 8z" fill="#2f3b4d" />
          </svg>
        ) : face.initials ? (
          face.initials
        ) : (
          <svg
            viewBox="0 0 24 24"
            width={d * 0.62}
            height={d * 0.62}
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="2"
            aria-hidden="true"
          >
            {ICONS.user}
          </svg>
        )}
      </div>
      {channel ? (
        <div
          style={{
            position: "absolute",
            left: x + d * 0.46 - b / 2,
            top: y + d * 0.38 - b / 2,
            width: b,
            height: b,
            borderRadius: "50%",
            background: "#fff",
          }}
        >
          <Ico
            n={CHANNEL[channel].icon}
            x={b / 2}
            y={b / 2}
            s={b * 0.86}
            c={CHANNEL[channel].color}
            sw={2.2}
          />
        </div>
      ) : null}
    </>
  );
}

function Check({ x, y }: { x: number; y: number }) {
  return (
    <Box
      x={x - 7}
      y={y - 7}
      w={14}
      h={14}
      style={{ border: "1.5px solid #9CA3AF", borderRadius: 3, background: "#fff" }}
    />
  );
}

export function Count({
  x,
  y,
  w,
  h,
  n,
  r = 3,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  n: number;
  r?: number;
}) {
  return (
    <Box
      x={x}
      y={y}
      w={w}
      h={h}
      style={{
        background: BLUE,
        borderRadius: r,
        color: "#fff",
        fontSize: h * 0.58,
        fontWeight: 600,
        display: "grid",
        placeItems: "center",
        lineHeight: 1,
      }}
    >
      {n}
    </Box>
  );
}

/* ------------------------------------------------------------ desktop board */

export const BOARD = { w: 1709, h: 839 };

const NAV: [IconName, string, number][] = [
  ["glasses", "Home", 151],
  ["send", "Campaigns", 187],
  ["radar", "Competitor Radar", 223],
  ["chats", "Conversations", 259],
  ["users", "Track Leads", 295],
  ["bars", "Reporting", 331],
  ["nodes", "Request Ad Integration", 367],
];

const TABS: [string, number][] = [
  ["Conversations", 375],
  ["Manual Actions", 489],
  ["Snippets", 611],
  ["Trigger Links", 690],
  ["Analytics", 796],
  ["Settings", 878],
];

const INBOX_TABS: [IconName, string, number][] = [
  ["mail", "Unread", 324],
  ["inbox", "All", 406],
  ["history", "Recent", 488],
  ["star", "Starred", 570],
];

const RAIL_RIGHT: IconName[] = [
  "userCircle",
  "history",
  "fork",
  "grid",
  "clipCheck",
  "pen",
  "calendar",
  "file",
  "dollar",
  "sparkle",
];

const FIELDS: [string, string, boolean][] = [
  ["First name", "Emma", false],
  ["Last name", "Brooks", false],
  ["Email", "--", true],
  ["Phone", "--", true],
  ["Date of birth", "--", false],
  ["Contact source", "--", false],
  ["Contact type", "Lead", false],
];

/** Row pitch of the thread list: 105.17px in the 2x screenshot. */
const PITCH = 89.87;

export function SuiteDashboard({ chat = STATIC_CHAT }: { chat?: ChatState }) {
  const top = THREADS[chat.active] ?? THREADS[0];
  // handles like "nadia2209" have no surname to split off
  const [first, ...rest] = top.name.replace(/\.\.\.$/, "").split(" ");
  const surname = rest.length && !/\d/.test(top.name) ? rest.join(" ") : "--";

  return (
    <div
      style={{
        position: "relative",
        width: BOARD.w,
        height: BOARD.h,
        overflow: "hidden",
        background: "#EFF1F4",
        fontSize: 14,
        color: INK,
      }}
    >
      {/* ---------------- sidebar ---------------- */}
      <Box x={0} y={0} w={214} h={839} style={{ background: "#F4F4F5" }} />

      <Box x={6} y={24} w={201} h={41} style={{ background: "#E7E7EA", borderRadius: 8 }} />
      <Box x={9} y={34} w={21} h={21} style={{ borderRadius: "50%", border: "1.5px solid #6B7280" }} />
      <Ico n="user" x={19.5} y={44.5} s={12} c={MUTED} sw={2} />
      <T x={38} y={38.5} s={12.5} w={500}>
        Radiance Med Spa - Oak ...
      </T>
      <T x={38} y={54} s={12} c={MUTED}>
        Austin, TX
      </T>
      <Ico n="updown" x={193} y={44.5} s={12} c={MUTED} sw={2} />

      <Box x={0} y={82} w={174} h={26} style={{ background: "#EAEAEC", borderRadius: 6 }} />
      <Ico n="search" x={11} y={95} s={14} c={TEXT} sw={2} />
      <T x={24} y={95} s={13.5} c="#4B5563">
        Search
      </T>
      <Box x={141} y={86} w={27} h={18} style={{ background: "#DADADD", borderRadius: 4 }} />
      <T x={154.5} y={95} s={10.5} w={500} c={TEXT} align="center">
        ⌘K
      </T>
      <Box x={181} y={83} w={24} h={24} style={{ background: "#DCFCE7", borderRadius: 6 }} />
      <Ico n="zap" x={193} y={95} s={13} c="#22C55E" fill="#22C55E" sw={1} />

      <Box x={0} y={242} w={214} h={35} style={{ background: "#E7E7EA", borderRadius: 6 }} />
      {NAV.map(([icon, label, cy]) => (
        <span key={label}>
          <Ico n={icon} x={17} y={cy} s={16} c={INK} sw={2} />
          <T x={35} y={cy} s={14} w={label === "Conversations" ? 500 : 400}>
            {label}
          </T>
        </span>
      ))}
      <Box x={137} y={251} w={24} h={16} style={{ background: "#991B1B", borderRadius: 8 }} />
      <T x={149} y={259} s={10.5} w={600} c="#fff" align="center">
        23
      </T>

      <Box x={7} y={402} w={191} h={1} style={{ background: LINE }} />
      <Ico n="wrench" x={17} y={436} s={16} c={INK} sw={2} />
      <T x={35} y={436} s={14}>
        Advanced Tools
      </T>
      <Ico n="chevR" x={193} y={436} s={15} c={INK} sw={2} />

      <Ico n="gear" x={17} y={807} s={16} c={TEXT} />
      <T x={35} y={807} s={14}>
        Settings
      </T>
      <Box x={204} y={800} w={19} h={19} style={{ background: "#86EFAC", borderRadius: "50%" }} />
      <Ico n="chevL" x={213.5} y={809.5} s={11} c="#166534" sw={2.5} />

      {/* ---------------- top bar ---------------- */}
      <Box
        x={214}
        y={0}
        w={1495}
        h={41}
        style={{ background: "#fff", borderBottom: `1px solid ${LINE}` }}
      />
      <T x={231} y={17} s={18} w={600}>
        Conversations
      </T>
      {TABS.map(([label, x], i) => (
        <T key={label} x={x} y={18} s={14} w={i === 0 ? 500 : 400} c={i === 0 ? BLUE : TEXT}>
          {label}
        </T>
      ))}
      <Box x={367} y={38} w={106} h={2.5} style={{ background: BLUE, borderRadius: 2 }} />

      {/* ---------------- icon rail ---------------- */}
      <Box x={224} y={62} w={34} h={34} style={{ background: BLUE, borderRadius: 7 }} />
      <Ico n="msgPlus" x={241} y={79} s={18} c="#fff" sw={2} />
      <Ico n="download" x={241} y={119} s={18} />
      <Ico n="search" x={241} y={151} s={18} />
      <Ico n="user" x={241} y={208} s={18} />
      <Box
        x={224}
        y={232}
        w={34}
        h={36}
        style={{ border: `1.5px solid ${BLUE}`, background: "#EFF6FF", borderRadius: 7 }}
      />
      <Ico n="users" x={241} y={250} s={18} c={BLUE} />
      <Ico n="tri" x={241} y={292} s={18} />
      <Box x={226} y={320} w={30} h={1} style={{ background: "#D1D5DB" }} />
      <Ico n="archive" x={241} y={347} s={18} />

      {/* ---------------- inbox + thread card ---------------- */}
      <Box x={268} y={54} w={1061} h={777} style={{ background: "#fff", borderRadius: 10 }} />
      <Box x={628} y={54} w={1} h={777} style={{ background: LINE }} />

      <T x={285} y={80} s={17} w={600}>
        Team inbox
      </T>
      <Ico n="filter" x={566} y={80} s={20} c={INK} />
      <Ico n="sort" x={600} y={80} s={20} c={INK} />

      {INBOX_TABS.map(([icon, label, cx], i) => (
        <span key={label}>
          <Ico n={icon} x={cx} y={121} s={18} />
          <T x={cx} y={145} s={14} w={i === 0 ? 500 : 400} c={i === 0 ? INK : TEXT} align="center">
            {label}
          </T>
        </span>
      ))}
      <Count x={325} y={108} w={19} h={13} n={23} r={4} />
      <Box x={286} y={159} w={80} h={2.5} style={{ background: BLUE, borderRadius: 2 }} />
      <Box x={286} y={162} w={326} h={1} style={{ background: LINE }} />

      <Check x={306} y={187} />
      <T x={321} y={187} s={14} c={TEXT}>
        Select all
      </T>

      <Box x={283} y={212} w={329} h={619} style={{ overflow: "hidden" }}>
        {/* the open thread's outline slides to whichever row is live */}
        <Box
          x={0}
          y={chat.active * PITCH}
          w={329}
          h={PITCH}
          style={{
            border: `1.5px solid ${BLUE}`,
            borderRadius: 5,
            zIndex: 1,
            transition: "top .45s cubic-bezier(.22,1,.36,1)",
          }}
        />
        {THREADS.map((t, i) => (
          <Box
            key={t.name}
            a="row"
            x={0}
            y={i * PITCH}
            w={329}
            h={PITCH}
            style={{ borderBottom: i < THREADS.length - 1 ? `1px solid ${LINE}` : undefined }}
          >
            <Check x={23} y={32} />
            <Avatar face={t.face} channel={t.channel} x={50} y={32} d={24} badge={12} />
            <T x={78} y={32} s={15} w={600}>
              {t.name}
            </T>
            <T x={283} y={32} s={12.5} c={MUTED} align="right">
              {t.time}
            </T>
            {chat.read.includes(i) ? null : <Count x={295} y={18} w={17} h={19} n={t.count} />}
            <T x={40} y={61} s={14} c={MUTED} style={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis" }}>
              {chat.read.includes(i) ? `You: ${REPLIES[i]}` : t.preview}
            </T>
            <Ico n="star" x={305} y={61} s={14} c="#9CA3AF" />
          </Box>
        ))}
      </Box>

      {/* thread header */}
      <Avatar face={top.face} x={661} y={80} d={32} />
      <T x={689} y={80} s={17} w={500}>
        {top.name}
      </T>
      <Ico n="bubble" x={1159} y={80} s={22} />
      <Ico n="chevD" x={1186} y={80} s={12} sw={2.25} />
      <Ico n="star" x={1222} y={80} s={22} />
      <Ico n="mailOpen" x={1262} y={80} s={22} />
      <Ico n="trash" x={1302} y={80} s={22} />
      <Box x={629} y={109} w={700} h={1} style={{ background: LINE }} />

      {/* thread body */}
      <Box x={943} y={138} w={74} h={22} style={{ background: "#F3F4F6", borderRadius: 6 }} />
      <Ico n="calendar" x={957} y={149} s={13} />
      <T x={970} y={149} s={13.5} c={TEXT}>
        Today
      </T>

      <Box x={645} y={195} w={7} h={1} style={{ background: "#93C5FD" }} />
      <T x={658} y={195} s={14} c="#3B82F6">
        New
      </T>
      <Box x={694} y={195} w={620} h={1} style={{ background: "#93C5FD" }} />

      <Avatar face={top.face} channel={top.channel} x={661} y={237} d={30} badge={14} />
      <div
        key={`in-${chat.active}`}
        className="suite-pop"
        style={{
          position: "absolute",
          left: 688,
          top: 220,
          height: 41,
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          background: "#F3F4F6",
          borderRadius: 8,
          fontSize: 15,
          whiteSpace: "nowrap",
          color: INK,
        }}
      >
        {top.preview}
      </div>
      <T x={693} y={272} s={12.5} c={MUTED}>
        03:37 PM
      </T>
      <Ico n="dots" x={757} y={272} s={13} c={MUTED} sw={2.5} />

      {chat.phase === "sent" ? (
        <div
          key={`out-${chat.active}`}
          className="suite-pop"
          style={{ position: "absolute", right: BOARD.w - 1314, top: 300, textAlign: "right" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 41,
              padding: "0 14px",
              background: BLUE,
              color: "#fff",
              borderRadius: "12px 12px 4px 12px",
              fontSize: 15,
              whiteSpace: "nowrap",
            }}
          >
            {REPLIES[chat.active]}
          </div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: MUTED }}>Sent by AI · just now</div>
        </div>
      ) : null}
      {chat.phase === "typing" ? (
        <div
          style={{
            position: "absolute",
            left: 648,
            top: 752,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            color: MUTED,
          }}
        >
          <span className="suite-dots">
            <i />
            <i />
            <i />
          </span>
          AI is typing…
        </div>
      ) : null}

      {/* composer */}
      <Box
        x={645}
        y={782}
        w={669}
        h={41}
        style={{ border: "1px solid #D1D5DB", borderRadius: 6, background: "#fff" }}
      />
      <Ico n="fb" x={664} y={802.5} s={16} c="#1877F2" sw={2} />
      <Ico n="chevD" x={681} y={802.5} s={10} sw={2.5} />
      <Box x={699} y={782} w={1} h={41} style={{ background: "#D1D5DB" }} />
      <T x={705} y={802.5} s={15} c={chat.phase === "typing" ? INK : MUTED}>
        {chat.phase === "typing" ? (
          <>
            {chat.typed}
            <span className="suite-caret" />
          </>
        ) : (
          "Type a message"
        )}
      </T>
      <Box
        x={1277}
        y={790}
        w={29}
        h={25}
        style={{ background: chat.typed ? BLUE : "#93B4FB", borderRadius: 4, transition: "background .2s" }}
      />
      <Ico n="send" x={1291.5} y={802.5} s={14} c="#fff" sw={2} />

      <Box x={836} y={830} w={37} h={6} style={{ background: "#6B7280", borderRadius: 3 }} />

      {/* ---------------- contact details ---------------- */}
      <Box
        x={1344}
        y={54}
        w={321}
        h={777}
        style={{ background: "#fff", borderRadius: 10, overflow: "hidden" }}
      >
        <T x={15} y={23} s={15} w={500}>
          Contact Details
        </T>
        <Ico n="x" x={290} y={23} s={16} sw={2} />

        <Box x={15} y={40} w={289} h={164} style={{ border: `1px solid ${LINE}`, borderRadius: 8 }} />
        <Avatar face={top.face} x={45} y={68} d={32} />
        <T x={77} y={68} s={15} w={600}>
          {top.name}
        </T>
        <Ico n="ext" x={285} y={68} s={16} />

        <T x={28} y={110} s={14} c={TEXT}>
          Owner
        </T>
        <T x={170} y={110} s={14} c={TEXT}>
          Followers
        </T>
        <Box x={29} y={125} w={128} h={26} style={{ border: "1px solid #D1D5DB", borderRadius: 13 }} />
        <Ico n="user" x={42} y={138} s={13} c={MUTED} sw={2} />
        <T x={55} y={138} s={13.5} c={MUTED}>
          Unassigned
        </T>
        <Ico n="chevD" x={145} y={138} s={11} sw={2.25} />
        <Box x={170} y={125} w={50} h={26} style={{ border: "1px solid #D1D5DB", borderRadius: 13 }} />
        <Ico n="user" x={184} y={138} s={13} sw={2} />
        <Ico n="chevD" x={206} y={138} s={11} sw={2.25} />
        <T x={28} y={178} s={14} c={TEXT}>
          Tags
        </T>
        <Ico n="plus" x={74} y={178} s={13} c="#3B82F6" />

        <Box x={15} y={213} w={289} h={25} style={{ background: "#F3F4F6", borderRadius: 6 }} />
        <Box
          x={17}
          y={215}
          w={96}
          h={21}
          style={{ background: "#fff", borderRadius: 5, boxShadow: `0 0 0 1px ${LINE}` }}
        />
        <T x={65} y={225.5} s={14} w={500} align="center">
          All fields
        </T>
        <T x={160} y={225.5} s={14} c={TEXT} align="center">
          DND
        </T>
        <T x={256} y={225.5} s={14} c={TEXT} align="center">
          Actions
        </T>

        <Box x={15} y={247} w={289} h={36} style={{ border: "1px solid #D1D5DB", borderRadius: 6 }} />
        <Ico n="search" x={30} y={265} s={13} sw={2} />
        <T x={42} y={265} s={14} c={TEXT}>
          Search fields and folders
        </T>
        <Ico n="filter" x={290} y={265} s={14} sw={2} />

        <Box x={16} y={295} w={288} h={500} style={{ border: `1px solid ${LINE}`, borderRadius: 6 }} />
        <Box
          x={16}
          y={295}
          w={288}
          h={43}
          style={{ background: "#F3F4F6", borderRadius: "6px 6px 0 0" }}
        />
        <T x={32} y={316.5} s={15} w={500}>
          Contact
        </T>
        <Ico n="chevU" x={280} y={316.5} s={14} sw={2.25} />

        {FIELDS.map(([label, value, addable], i) => (
          <span key={label}>
            <T x={32} y={361 + i * 63.2} s={14} c={MUTED}>
              {label}
            </T>
            {addable ? (
              <Ico
                n="plus"
                x={label === "Email" ? 79 : 86}
                y={361 + i * 63.2}
                s={13}
                c="#3B82F6"
              />
            ) : null}
            <T x={32} y={387 + i * 63.2} s={15}>
              {i === 0 ? first : i === 1 ? surname : value}
            </T>
          </span>
        ))}
        <T x={232} y={576} s={13.5} c="#D1D5DB">
          Select
        </T>
        <Ico n="chevD" x={278} y={576} s={11} c="#D1D5DB" sw={2.25} />
      </Box>

      {/* ---------------- right rail ---------------- */}
      <Box x={1667} y={41} w={42} h={798} style={{ background: "#fff" }} />
      {RAIL_RIGHT.map((icon, i) => (
        <Ico key={icon} n={icon} x={1690} y={68 + i * 40.1} s={20} c={i === 0 ? BLUE : INK} />
      ))}
      <Box
        x={1657}
        y={790}
        w={46}
        h={46}
        style={{ background: "#1F2937", borderRadius: "50%", border: "2px solid #374151" }}
      />
      <Ico n="pen" x={1680} y={813} s={18} c="#4ADE80" sw={2} />
    </div>
  );
}

/* --------------------------------------------------------------- the phone */

export const PHONE = { w: 330, h: 680 };

const PHONE_TABS: [IconName, string, number][] = [
  ["mail", "Unread", 38.5],
  ["inbox", "All", 115.5],
  ["history", "Recent", 192.5],
  ["star", "Starred", 269.5],
];

const PHONE_NAV: [IconName, string, number][] = [
  ["home", "Home", 31],
  ["chats", "Inbox", 92],
  ["users", "Contacts", 154],
  ["calendar", "Calendar", 216],
  ["menu", "More", 277],
];

function StatusIcons({ x, y }: { x: number; y: number }) {
  return (
    <svg
      viewBox="0 0 66 12"
      width={66}
      height={12}
      aria-hidden="true"
      style={{ position: "absolute", left: x, top: y - 6 }}
    >
      <rect x="0" y="8" width="3" height="4" rx="1" fill={INK} />
      <rect x="4.5" y="6" width="3" height="6" rx="1" fill={INK} />
      <rect x="9" y="3.5" width="3" height="8.5" rx="1" fill={INK} />
      <rect x="13.5" y="1" width="3" height="11" rx="1" fill={INK} />
      <path
        d="M23 4.6a9 9 0 0 1 12 0M25.2 7a5.6 5.6 0 0 1 7.6 0"
        fill="none"
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="29" cy="10" r="1.5" fill={INK} />
      <rect x="40.5" y="1" width="22" height="11" rx="3" fill="none" stroke={INK} strokeOpacity=".4" />
      <rect x="42.5" y="3" width="16" height="7" rx="1.5" fill={INK} />
      <rect x="63.5" y="4.5" width="1.8" height="4" rx=".9" fill={INK} fillOpacity=".4" />
    </svg>
  );
}

/**
 * The same inbox on the SmartSync mobile app. There is no screenshot of the
 * app, so this follows the desktop screen's data, colours and type, re-flowed
 * into a phone's single column.
 */
export function SuitePhone({ idPrefix, chat = STATIC_CHAT }: { idPrefix: string; chat?: ChatState }) {
  const ROW = 74;
  return (
    <div
      style={{
        position: "relative",
        width: PHONE.w,
        height: PHONE.h,
        borderRadius: 54,
        background: "#0E0E14",
        boxShadow: "0 40px 80px -30px rgba(14,14,20,.55), inset 0 0 0 2px #2a2a33",
        color: INK,
      }}
    >
      <Box
        x={11}
        y={11}
        w={308}
        h={658}
        style={{ borderRadius: 44, background: "#fff", overflow: "hidden" }}
      >
        <Box x={104} y={11} w={100} h={30} style={{ background: "#000", borderRadius: 15 }} />
        <T x={34} y={26} s={15} w={600}>
          9:41
        </T>
        <StatusIcons x={222} y={26} />

        {/* app header */}
        <div style={{ position: "absolute", left: 16, top: 56 }}>
          <SuiteMark id={`${idPrefix}-mark`} size={28} />
        </div>
        <T x={52} y={70} s={20} w={600}>
          Inbox
        </T>
        <Ico n="search" x={250} y={70} s={20} c={INK} sw={2} />
        <Avatar face={{ initials: "RM", bg: "#E0E7FF", fg: "#3730A3" }} x={282} y={70} d={30} />

        {/* search */}
        <Box x={16} y={96} w={276} h={36} style={{ background: "#F3F4F6", borderRadius: 18 }} />
        <Ico n="search" x={36} y={114} s={14} c="#9CA3AF" sw={2} />
        <T x={50} y={114} s={13.5} c="#9CA3AF">
          Search conversations
        </T>

        {/* tabs */}
        {PHONE_TABS.map(([icon, label, cx], i) => (
          <span key={label}>
            <Ico n={icon} x={cx} y={158} s={18} c={i === 0 ? INK : TEXT} />
            <T
              x={cx}
              y={181}
              s={12.5}
              w={i === 0 ? 600 : 400}
              c={i === 0 ? INK : MUTED}
              align="center"
            >
              {label}
            </T>
          </span>
        ))}
        <Count x={39} y={145} w={19} h={13} n={23} r={4} />
        <Box x={12} y={195} w={53} h={2.5} style={{ background: BLUE, borderRadius: 2 }} />
        <Box x={0} y={197} w={308} h={1} style={{ background: LINE }} />

        {/* threads */}
        <Box x={0} y={198} w={308} h={376} style={{ overflow: "hidden" }}>
          <Box
            x={0}
            y={chat.active * ROW}
            w={308}
            h={ROW}
            style={{ background: "#EFF6FF", transition: "top .45s cubic-bezier(.22,1,.36,1)" }}
          />
          {THREADS.map((t, i) => (
            <Box
              key={t.name}
              a="prow"
              x={0}
              y={i * ROW}
              w={308}
              h={ROW}
            >
              <Avatar face={t.face} channel={t.channel} x={36} y={37} d={40} badge={16} />
              <T
                x={66}
                y={27}
                s={15}
                w={600}
                style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {t.name.replace(/\.\.\.$/, "")}
              </T>
              <T x={292} y={27} s={12} c={MUTED} align="right">
                {t.time}
              </T>
              <T
                x={66}
                y={50}
                s={13.5}
                c={chat.active === i && chat.phase === "typing" ? BLUE : MUTED}
                style={{ maxWidth: 196, overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {chat.active === i && chat.phase === "typing"
                  ? "typing…"
                  : chat.read.includes(i)
                    ? `You: ${REPLIES[i]}`
                    : t.preview}
              </T>
              {chat.read.includes(i) ? null : <Count x={274} y={41} w={18} h={18} n={t.count} r={9} />}
              <Box x={66} y={ROW - 1} w={242} h={1} style={{ background: "#F1F2F4" }} />
            </Box>
          ))}
        </Box>

        {/* tab bar */}
        <Box
          x={0}
          y={574}
          w={308}
          h={84}
          style={{ background: "#fff", borderTop: "1px solid #EEF0F3" }}
        />
        {PHONE_NAV.map(([icon, label, cx]) => {
          const on = label === "Inbox";
          return (
            <span key={label}>
              <Ico n={icon} x={cx} y={598} s={21} c={on ? BLUE : MUTED} sw={on ? 2.1 : 1.75} />
              <T x={cx} y={622} s={10.5} w={on ? 600 : 400} c={on ? BLUE : MUTED} align="center">
                {label}
              </T>
            </span>
          );
        })}
        <Count x={100} y={584} w={20} h={14} n={23} r={7} />
        <Box x={94} y={646} w={120} h={5} style={{ background: INK, borderRadius: 3 }} />
      </Box>
    </div>
  );
}
