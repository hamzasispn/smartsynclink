import type { ReactNode } from "react";

/** Line icons for the solution pages, on a 24px grid, drawn with the current colour. */
const PATHS = {
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  ),
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M8 15h3" />
    </>
  ),
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  sms: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  filter: <path d="M22 3H2l8 9.5V19l4 2v-8.5z" />,
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  history: <path d="M3 12a9 9 0 1 0 9-9 9.8 9.8 0 0 0-6.7 2.7L3 8M3 3v5h5M12 7v5l4 2" />,
  send: <path d="M14.5 21.7a.5.5 0 0 0 .9 0l6.5-19a.5.5 0 0 0-.6-.6l-19 6.5a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13.1" />,
  sparkle: (
    <path d="M12 3l1.8 5.4a2 2 0 0 0 1.3 1.3L20.5 11.5l-5.4 1.8a2 2 0 0 0-1.3 1.3L12 20l-1.8-5.4a2 2 0 0 0-1.3-1.3L3.5 11.5l5.4-1.8a2 2 0 0 0 1.3-1.3zM19 3v4M21 5h-4" />
  ),
  star: (
    <path d="M11.5 2.3a.5.5 0 0 1 1 0l2.3 4.7a2.1 2.1 0 0 0 1.6 1.2l5.2.8a.5.5 0 0 1 .3.9l-3.7 3.6a2.1 2.1 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6l-4.6-2.4a2.1 2.1 0 0 0-2 0L6.4 21a.5.5 0 0 1-.8-.6l.9-5.1a2.1 2.1 0 0 0-.6-1.9L2.2 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2.1 2.1 0 0 0 1.6-1.2z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m20.5 20.5-4-4" />
    </>
  ),
  pen: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z" />,
  userPlus: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M19 8v6M22 11h-6" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  chart: <path d="M3 3v18h18M8 17v-4M13 17V8M18 17v-7" />,
  layers: (
    <>
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10" y="4" width="5" height="11" rx="1.5" />
      <rect x="17" y="4" width="4" height="7" rx="1.5" />
    </>
  ),
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />,
  refresh: <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5" />,
  book: <path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 19.5A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 11h5" />,
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.6c0 4.7 3.2 8.2 7.5 9.4 4.3-1.2 7.5-4.7 7.5-9.4V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  zap: (
    <path d="M4 14a1 1 0 0 1-.8-1.6l9.9-10.2a.5.5 0 0 1 .9.5l-1.9 6A1 1 0 0 0 13 10h7a1 1 0 0 1 .8 1.6l-9.9 10.2a.5.5 0 0 1-.9-.5l1.9-6A1 1 0 0 0 11 14z" />
  ),
  nodes: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  dollar: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  link: <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  mobile: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.5-4.5L6 21" />
    </>
  ),
  megaphone: <path d="M3 11v2a2 2 0 0 0 2 2h1l5 4V5L6 9H5a2 2 0 0 0-2 2zM15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />
  ),
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  heart: (
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
  ),
  scale: <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" />,
  store: (
    <>
      <path d="M3 9l1.5-5h15L21 9v11H3zM3 9h18" />
      <path d="M9 20v-5h6v5" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  mic: (
    <>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
    </>
  ),
  inbox: (
    <path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z" />
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

/** Every icon there is, for pickers and for checking a name before drawing it. */
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export function Icon({ n, className = "size-5", sw = 1.75 }: { n: IconName; className?: string; sw?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[n]}
    </svg>
  );
}

/**
 * An icon for a feature, picked from its words: the title first, then the body.
 * ponytail: keyword rules, so a new feature gets a sensible icon without
 * anyone choosing one; the sparkle is the fallback.
 */
const FEATURE: [RegExp, IconName][] = [
  // the products by name, for the breadcrumb and the cards that link to them
  [/voice agent|receptionist/i, "phone"],
  [/\binbox\b/i, "inbox"],
  [/conversation assistant/i, "chat"],
  [/expert ai/i, "book"],
  [/instagram/i, "instagram"],
  [/facebook|messenger/i, "facebook"],
  [/\be-?mail\b/i, "mail"],
  [/google business|google search|\bmaps\b/i, "pin"],
  [/website chat|chat widget|live chat|web chat/i, "chat"],
  // then what a feature does; the specific words before the ones they contain
  // ("Qualifies the caller" is about qualifying, not calls)
  [/qualif/i, "filter"],
  [/\b(report|numbers|volume|rate|value|speed)/i, "chart"],
  [/review|reputation/i, "star"],
  [/remind|alert|notif/i, "bell"],
  [/pipeline|\bdeals?\b|stage/i, "layers"],
  [/lead capture|captur|contact info|\blead\b/i, "userPlus"],
  [/quote|estimate|invoice|\bpric/i, "dollar"],
  [/rebook|reactivat|referral|up to date|update/i, "refresh"],
  [/channel|everywhere/i, "nodes"],
  [/24\/7|first ring|instantly|right moment|timing|delay/i, "clock"],
  [/\b(sms|mms)\b|texting|text back|click-to-text|\btext/i, "sms"],
  [/calendar|booking|\bbooks?\b|appointment|schedul/i, "calendar"],
  [/phone|\bcalls?\b|caller/i, "phone"],
  [/ai answers|chatgpt|gemini/i, "sparkle"],
  [/\bfaqs?\b|question|answer/i, "chat"],
  [/human|hand.?off|hands off|team|assign|staff|takeover/i, "users"],
  [/\blogs?\b|history|record|transcript|timeline/i, "history"],
  [/\bnotes?\b|\bedit/i, "pen"],
  [/follow.?up|go quiet|nurtur|check-in/i, "send"],
  [/sound|voice|brand|tone|looks like/i, "sparkle"],
  [/mobile|\bapp\b/i, "mobile"],
  [/\bseo\b|search|found|\brank/i, "search"],
  [/website|\bpage|design/i, "globe"],
  [/train|knowledge|business info|knows/i, "book"],
  [/accurate|honest|secure|right way|control/i, "shield"],
  [/automat|workflow|trigger/i, "zap"],
  [/\blink|\btap/i, "link"],
  [/categor|services/i, "list"],
  [/photo/i, "image"],
  [/\bposts?\b|offer|event/i, "megaphone"],
  [/\binfo|request/i, "file"],
];

export function iconFor(title: string, body = ""): IconName {
  for (const text of [title, body]) {
    const hit = FEATURE.find(([rule]) => rule.test(text));
    if (hit) return hit[1];
  }
  return "sparkle";
}

/** An icon for an industry card, in the order that keeps mixed lists right. */
const INDUSTRY: [RegExp, IconName][] = [
  [/restaurant|gym|fitness|auto|retail|e-commerce|school/i, "store"],
  [/law|legal|accountant|insurance|professional/i, "scale"],
  [/contractor|home service|plumb|hvac|roof|electric|remodel|garage|pest/i, "wrench"],
  [/med spa|aesthetic|salon|spa\b|spas\b|barber|beauty/i, "sparkle"],
  [/real estate|realtor|agent|property/i, "home"],
  [/dental|chiro|clinic|wellness|health|medical|veterin|physical|patient/i, "heart"],
];

export function industryIcon(title: string): IconName {
  return INDUSTRY.find(([rule]) => rule.test(title))?.[1] ?? "store";
}
