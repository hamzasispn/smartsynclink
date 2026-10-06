import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./icons";

/**
 * The hero picture of each solution page, drawn rather than photographed: the
 * product doing the thing the page is about. Drawn on a fixed 560×460 board and
 * scaled as one piece (the .suite-stage / .suite-board pair <StageScale> sizes),
 * so a phone shows exactly what a desktop does, only smaller.
 *
 * The names, numbers and businesses are made up for the pictures, the same way
 * the drawn sites elsewhere on the site are.
 */

const W = 560;
const H = 460;

/* ------------------------------------------------------------ primitives -- */

function At({ x, y, w, h, className = "", style, children }: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className={`absolute ${className}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

/** A floating white card. */
function Card(props: Parameters<typeof At>[0]) {
  return (
    <At
      {...props}
      className={`rounded-[18px] bg-white text-ink shadow-[0_24px_48px_-16px_rgba(10,8,60,0.45),0_2px_6px_rgba(10,8,60,0.08)] ${props.className ?? ""}`}
    />
  );
}

function Av({ text, bg = "#DDEBFD", fg = "#2B4C80", size = 32 }: { text: string; bg?: string; fg?: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-medium"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
    >
      {text}
    </span>
  );
}

function Dot({ c = "#12B76A" }: { c?: string }) {
  return (
    <span className="relative flex size-2">
      <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: c }} />
      <span className="relative size-2 rounded-full" style={{ background: c }} />
    </span>
  );
}

function Tile({ n, c = "#3300EA", bg = "#ECEAFE", size = 34 }: { n: IconName; c?: string; bg?: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-[10px]" style={{ width: size, height: size, background: bg, color: c }}>
      <Icon n={n} className="size-[18px]" sw={2} />
    </span>
  );
}

const In = ({ children, w = 220 }: { children: ReactNode; w?: number }) => (
  <p className="rounded-[14px] rounded-bl-[4px] bg-[#F1F1F4] px-3 py-2 text-[13px] leading-[1.4] text-ink" style={{ maxWidth: w }}>
    {children}
  </p>
);
const Out = ({ children, w = 220 }: { children: ReactNode; w?: number }) => (
  <p
    className="ml-auto rounded-[14px] rounded-br-[4px] bg-gradient-to-br from-[#2C4BFF] to-[#5A2BFF] px-3 py-2 text-[13px] leading-[1.4] text-white"
    style={{ maxWidth: w }}
  >
    {children}
  </p>
);

/** A small "event" card: icon, a bold line, a quiet line. */
function Event({ x, y, w = 230, n, c, bg, title, sub }: {
  x: number;
  y: number;
  w?: number;
  n: IconName;
  c?: string;
  bg?: string;
  title: string;
  sub: string;
}) {
  return (
    <Card x={x} y={y} w={w} className="flex items-center gap-3 p-3.5">
      <Tile n={n} c={c} bg={bg} />
      <div className="min-w-0">
        <p className="text-[13.5px] leading-tight font-medium">{title}</p>
        <p className="mt-0.5 truncate text-[12px] text-[#6B6B78]">{sub}</p>
      </div>
    </Card>
  );
}

const GREEN = { c: "#0E9F5B", bg: "#DDF6E9" };
const AMBER = { c: "#B7791F", bg: "#FDF1D8" };
const RED = { c: "#D93636", bg: "#FDECEC" };

/* ------------------------------------------------------------- the pictures -- */

function Voice() {
  return (
    <>
      <Card x={34} y={40} w={268} h={380} className="flex flex-col items-center p-6">
        <div className="flex w-full items-center justify-between text-[12px] text-[#6B6B78]">
          <span>Incoming call</span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#DDF6E9] px-2 py-1 font-medium text-[#0E9F5B]">
            <Dot /> AI answering
          </span>
        </div>
        <span className="mt-8">
          <Av text="JM" size={76} />
        </span>
        <p className="mt-4 text-[20px] font-medium tracking-[-0.01em]">Jake Morris</p>
        <p className="mt-1 text-[13px] text-[#6B6B78]">(830) 555-0198</p>
        <div className="mt-7 flex h-10 items-center gap-[5px]" aria-hidden="true">
          {[10, 22, 34, 18, 40, 26, 14, 30, 38, 20, 12, 28, 16].map((h, i) => (
            <span key={i} className="sol-wave w-[5px] rounded-full bg-gradient-to-b from-[#2C4BFF] to-[#5A2BFF]" style={{ height: h, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[#6B6B78]">00:42</p>
        <div className="mt-auto flex gap-5">
          <span className="grid size-11 place-items-center rounded-full bg-[#F1F1F4] text-[#6B6B78]">
            <Icon n="mic" className="size-5" />
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-[#EF4444] text-white">
            <Icon n="phone" className="size-5 rotate-[135deg]" />
          </span>
        </div>
      </Card>
      <Card x={262} y={128} w={266} className="p-4">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#3300EA]">
          <Icon n="sparkle" className="size-3.5" sw={2} /> Live transcript
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <In w={200}>Water heater&apos;s leaking. Can someone come today?</In>
          <Out w={210}>I can get a tech out at 2:30 today. What&apos;s the address?</Out>
          <In w={200}>1204 Cypress Bend, Spring Branch</In>
        </div>
      </Card>
      <Event x={286} y={348} w={242} n="calendar" {...GREEN} title="Booked · Today, 2:30 PM" sub="Added to calendar and pipeline" />
    </>
  );
}

const THREADS: { name: string; av: [string, string, string]; n: IconName; c: string; text: string; time: string; unread?: boolean }[] = [
  { name: "Maria Lopez", av: ["ML", "#F6E3F7", "#6B3F75"], n: "instagram", c: "#D6249F", text: "Do you have anything Saturday?", time: "2m", unread: true },
  { name: "Jake Morris", av: ["JM", "#DDEBFD", "#2B4C80"], n: "sms", c: "#0E9F5B", text: "Here's a photo of the leak", time: "5m", unread: true },
  { name: "Emily Carter", av: ["EC", "#FBE3C2", "#7C5A2E"], n: "chat", c: "#3300EA", text: "Is 412 Oak Lane still available?", time: "12m" },
  { name: "Tom Reed", av: ["TR", "#DDF6E9", "#1E6B47"], n: "facebook", c: "#1877F2", text: "What are your hours on Sunday?", time: "1h" },
  { name: "Ana Silva", av: ["AS", "#EDEDF1", "#4B4B57"], n: "mail", c: "#6B6B78", text: "Re: your estimate", time: "3h" },
];

function Inbox() {
  const channels: [IconName, string][] = [
    ["sms", "#0E9F5B"],
    ["instagram", "#D6249F"],
    ["facebook", "#1877F2"],
    ["mail", "#6B6B78"],
    ["chat", "#3300EA"],
  ];
  return (
    <>
      <svg className="absolute inset-0" width={W} height={H} aria-hidden="true">
        {channels.map((_, i) => (
          <path key={i} d={`M 456 ${70 + i * 58} C 420 ${70 + i * 58}, 420 230, 392 230`} fill="none" stroke="rgba(255,255,255,0.35)" strokeDasharray="4 5" />
        ))}
      </svg>
      {channels.map(([n, c], i) => (
        <Card key={n} x={456} y={48 + i * 58} w={46} h={46} className="grid place-items-center rounded-[14px]" style={{ color: c }}>
          <Icon n={n} className="size-5" sw={2} />
        </Card>
      ))}
      <Card x={28} y={36} w={364} h={388} className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-medium tracking-[-0.01em]">Inbox</p>
          <span className="rounded-full bg-[#ECEAFE] px-2.5 py-1 text-[11.5px] font-medium text-[#3300EA]">All channels</span>
        </div>
        <div className="mt-3 flex gap-1.5 text-[12px]">
          <span className="rounded-full bg-ink px-2.5 py-1 text-white">All 12</span>
          <span className="rounded-full bg-[#F1F1F4] px-2.5 py-1 text-[#4B4B57]">Unread</span>
          <span className="rounded-full bg-[#F1F1F4] px-2.5 py-1 text-[#4B4B57]">Assigned</span>
        </div>
        <div className="mt-3">
          {THREADS.map((t, i) => (
            <div key={t.name} className={`flex items-center gap-3 rounded-xl px-2 py-2.5 ${i === 0 ? "bg-[#F5F3FF]" : ""}`}>
              <span className="relative">
                <Av text={t.av[0]} bg={t.av[1]} fg={t.av[2]} size={36} />
                <span className="absolute -right-1 -bottom-1 grid size-[18px] place-items-center rounded-full bg-white shadow" style={{ color: t.c }}>
                  <Icon n={t.n} className="size-[11px]" sw={2.4} />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-medium">{t.name}</p>
                  <span className="text-[11px] text-[#9A9AA5]">{t.time}</span>
                </div>
                <p className={`truncate text-[12.5px] ${t.unread ? "text-ink" : "text-[#6B6B78]"}`}>{t.text}</p>
              </div>
              {t.unread ? <span className="size-2 rounded-full bg-[#3300EA]" /> : null}
            </div>
          ))}
        </div>
      </Card>
      <Card x={300} y={330} w={226} className="p-4" style={{ background: "#FFF8DB" }}>
        <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#8A6A10]">
          <Icon n="pen" className="size-3.5" sw={2} /> Internal note
        </p>
        <p className="mt-1.5 text-[13px] leading-[1.4]">Quoted her $850, she&apos;s checking with her husband.</p>
        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[11.5px] font-medium">
          <Av text="S" size={16} bg="#ECEAFE" fg="#3300EA" /> Assigned to Sarah
        </span>
      </Card>
    </>
  );
}

function Website() {
  return (
    <>
      <Card x={22} y={34} w={430} h={300} className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#EDEDF1] bg-[#F7F7F9] px-3.5 py-2.5">
          <span className="flex gap-1.5">
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span className="ml-3 flex flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-[#6B6B78]">
            <Icon n="globe" className="size-3" /> yourbusiness.com
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <span className="flex items-center gap-1.5 text-[13px] font-medium">
            <span className="size-4 rounded-md bg-gradient-to-br from-[#052EFF] to-[#3300EA]" /> Summit Roofing
          </span>
          <span className="flex items-center gap-3 text-[11px] text-[#6B6B78]">
            Services <span>Areas</span> <span>Reviews</span>
            <span className="rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-2.5 py-1 font-medium text-white">Book now</span>
          </span>
        </div>
        <div className="relative px-5 pt-3">
          <p className="w-[200px] text-[22px] leading-[1.12] font-medium tracking-[-0.02em]">Roof repairs you can count on</p>
          <p className="mt-2 w-[190px] text-[11.5px] leading-[1.45] text-[#6B6B78]">Free inspections, insurance help and same-week repairs.</p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-white">Get a quote</span>
            <span className="flex items-center gap-1 rounded-full border border-[#E3E3E8] px-3 py-1.5 text-[11px] font-medium">
              <Icon n="phone" className="size-3" /> Call
            </span>
          </div>
          <div className="absolute top-0 right-4 w-[176px] rounded-2xl border border-[#EDEDF1] bg-white p-3 shadow-[0_12px_30px_-14px_rgba(10,8,60,0.35)]">
            <p className="text-[12px] font-medium">Book a free inspection</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[10.5px]">
              {["Mon 12", "Tue 13", "Wed 14"].map((d, i) => (
                <span key={d} className={`rounded-lg py-1.5 ${i === 1 ? "bg-[#ECEAFE] font-medium text-[#3300EA]" : "bg-[#F5F5F7] text-[#4B4B57]"}`}>
                  {d}
                </span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-center text-[10.5px]">
              {["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"].map((t, i) => (
                <span key={t} className={`rounded-lg py-1.5 ${i === 1 ? "bg-gradient-to-r from-[#052EFF] to-[#3300EA] font-medium text-white" : "border border-[#EDEDF1]"}`}>
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-2 block rounded-lg bg-ink py-1.5 text-center text-[10.5px] font-medium text-white">Confirm</span>
          </div>
        </div>
      </Card>
      <Card x={318} y={300} w={214} className="p-3.5">
        <p className="flex items-center gap-2 text-[12px] font-medium">
          <Av text="AI" size={22} bg="#ECEAFE" fg="#3300EA" /> Chat
          <span className="ml-auto flex items-center gap-1 text-[10.5px] font-normal text-[#0E9F5B]">
            <Dot /> Online
          </span>
        </p>
        <div className="mt-2.5">
          <In w={190}>Hi! Want me to book your free roof inspection?</In>
        </div>
      </Card>
      <Event x={30} y={360} w={276} n="userPlus" {...GREEN} title="New lead · Quote request form" sub="Text sent in 3 seconds · Added to pipeline" />
      <Card x={402} y={14} w={140} className="flex items-center gap-2 px-3 py-2.5">
        <span className="text-[#F5A623]">
          <Icon n="star" className="size-4 fill-current" sw={1} />
        </span>
        <span className="text-[13px] font-medium">4.9 on Google</span>
      </Card>
    </>
  );
}

function Conversation() {
  const chips: [IconName, string, string][] = [
    ["sms", "Text", "#0E9F5B"],
    ["facebook", "Messenger", "#1877F2"],
    ["chat", "Web chat", "#3300EA"],
    ["pin", "Google", "#EA4335"],
  ];
  return (
    <>
      <Card x={40} y={28} w={306} h={404} className="flex flex-col p-4">
        <div className="flex items-center gap-2.5 border-b border-[#EDEDF1] pb-3">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white">
            <Icon n="instagram" className="size-[18px]" sw={2} />
          </span>
          <div>
            <p className="text-[13.5px] font-medium">Instagram DM</p>
            <p className="text-[11px] text-[#6B6B78]">Radiance Med Spa · 10:15 PM</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-2.5 pt-3">
          <p className="mb-auto self-center rounded-full bg-[#F1F1F4] px-2.5 py-1 text-[11px] text-[#6B6B78]">Today 10:15 PM</p>
          <In w={210}>hi how much is lip filler and do you have anything this week</In>
          <Out w={230}>Hi! Lip filler starts with a consult so the provider can recommend the right amount. Thursday 4:30 or Friday 11?</Out>
          <In w={210}>thursday works!</In>
          <Out w={230}>
            You&apos;re booked for Thursday at 4:30 <span aria-hidden="true">✓</span> See you then!
          </Out>
        </div>
      </Card>
      {chips.map(([n, label, c], i) => (
        <Card key={label} x={374} y={46 + i * 62} w={150} className="flex items-center gap-2.5 px-3 py-2.5">
          <span className="grid size-8 place-items-center rounded-full" style={{ background: `${c}18`, color: c }}>
            <Icon n={n} className="size-4" sw={2} />
          </span>
          <span className="text-[13px] font-medium">{label}</span>
          <span className="ml-auto">
            <Dot />
          </span>
        </Card>
      ))}
      <Event x={360} y={318} w={176} n="zap" title="Replied in 4 sec" sub="Lead booked" />
    </>
  );
}

function GoogleProfile() {
  return (
    <>
      <Card x={26} y={30} w={330} h={400} className="overflow-hidden">
        <div className="relative h-[120px] bg-[#E8F0E3]">
          <svg width="330" height="120" className="absolute inset-0" aria-hidden="true">
            <path d="M0 80 L120 60 L200 90 L330 50" stroke="#fff" strokeWidth="10" fill="none" />
            <path d="M80 0 L110 120" stroke="#fff" strokeWidth="8" fill="none" />
            <path d="M240 0 L220 120" stroke="#FCE7A6" strokeWidth="9" fill="none" />
            <rect x="140" y="10" width="50" height="34" rx="6" fill="#D5E5CC" />
            <rect x="20" y="92" width="40" height="22" rx="5" fill="#D5E5CC" />
          </svg>
          <span className="absolute top-6 left-[150px] text-[#EA4335]">
            <svg width="28" height="36" viewBox="0 0 24 30" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 30 12 30s12-9.5 12-18.3C24 5.2 18.6 0 12 0z" fill="currentColor" />
              <circle cx="12" cy="11.5" r="4.5" fill="#fff" />
            </svg>
          </span>
        </div>
        <div className="p-5">
          <p className="text-[20px] font-medium tracking-[-0.01em]">Summit Roofing</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px]">
            4.9
            <span className="flex text-[#F5A623]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} n="star" className="size-3.5 fill-current" sw={1} />
              ))}
            </span>
            <span className="text-[#6B6B78]">(128)</span>
          </p>
          <p className="mt-1 text-[12.5px] text-[#6B6B78]">Roofing contractor · Austin, TX</p>
          <p className="mt-1 text-[12.5px]">
            <span className="font-medium text-[#0E9F5B]">Open</span> · Closes 6 PM
          </p>
          <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11.5px] font-medium text-[#1A57D6]">
            {(
              [
                ["phone", "Call"],
                ["globe", "Website"],
                ["pin", "Directions"],
                ["calendar", "Book"],
              ] as [IconName, string][]
            ).map(([n, label], i) => (
              <span key={label} className="flex flex-col items-center gap-1.5">
                <span className={`grid size-10 place-items-center rounded-full ${i === 0 ? "bg-[#1A57D6] text-white" : "border border-[#DADCE0]"}`}>
                  <Icon n={n} className="size-[18px]" sw={2} />
                </span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </Card>
      <Event x={322} y={56} w={214} n="phone" {...GREEN} title="Call answered by AI" sub="Picked up on the first ring" />
      <Event x={340} y={160} w={196} n="sms" title="Missed call → text sent" sub="“Sorry we missed you…”" />
      <Event x={330} y={264} w={206} n="star" {...AMBER} title="New 5-star review" sub="AI reply drafted for you" />
    </>
  );
}

function Workflow() {
  const node = "flex items-center gap-3 px-4 py-3";
  return (
    <>
      <svg className="absolute inset-0" width={W} height={H} aria-hidden="true">
        <g stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeDasharray="5 5">
          <path d="M280 96 V122" />
          <path d="M280 184 V206" />
          <path d="M280 254 V276" />
          <path d="M280 324 V340 H150 V362" />
          <path d="M280 340 H410 V362" />
        </g>
      </svg>
      <Card x={150} y={34} w={260} className={`${node} text-white`} style={{ background: "linear-gradient(90deg, #0E0E14, #2A2A3A)" }}>
        <Tile n="zap" c="#fff" bg="rgba(255,255,255,0.14)" />
        <div>
          <p className="text-[11px] tracking-[0.08em] text-white/60 uppercase">Trigger</p>
          <p className="text-[14px] font-medium">Quote form submitted</p>
        </div>
      </Card>
      <Card x={150} y={122} w={260} className={node}>
        <Tile n="sms" />
        <div>
          <p className="text-[14px] font-medium">Text and email the lead</p>
          <p className="text-[11.5px] text-[#6B6B78]">Within seconds</p>
        </div>
      </Card>
      <Card x={190} y={206} w={180} className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] font-medium">
        <Icon n="clock" className="size-4 text-[#6B6B78]" sw={2} /> Wait 1 day
      </Card>
      <Card x={196} y={276} w={168} className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13px] font-medium">
        <Icon n="filter" className="size-4 text-[#3300EA]" sw={2} /> Replied?
      </Card>
      <Card x={40} y={362} w={220} className={node}>
        <Tile n="layers" {...GREEN} />
        <div>
          <p className="text-[11px] font-medium text-[#0E9F5B]">Yes</p>
          <p className="text-[13.5px] font-medium">Move to Booked</p>
        </div>
      </Card>
      <Card x={300} y={362} w={220} className={node}>
        <Tile n="send" {...AMBER} />
        <div>
          <p className="text-[11px] font-medium text-[#B7791F]">No</p>
          <p className="text-[13.5px] font-medium">Send a friendly check-in</p>
        </div>
      </Card>
      <Card x={420} y={40} w={118} className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium">
        <Dot /> Active
      </Card>
    </>
  );
}

function Expert() {
  const sources: [IconName, string][] = [
    ["dollar", "Services & pricing"],
    ["pin", "Service areas"],
    ["shield", "Policies"],
    ["chat", "Common questions"],
  ];
  return (
    <>
      <svg className="absolute inset-0" width={W} height={H} aria-hidden="true">
        {sources.map((_, i) => (
          <path key={i} d={`M 192 ${84 + i * 66} C 222 ${84 + i * 66}, 214 214, 236 214`} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="4 5" />
        ))}
        <path d="M 316 214 H 330" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="4 5" />
      </svg>
      {sources.map(([n, label], i) => (
        <Card key={label} x={22} y={62 + i * 66} w={170} className="flex items-center gap-2.5 px-3 py-2.5">
          <Tile n={n} size={30} />
          <div>
            <p className="text-[12.5px] leading-tight font-medium">{label}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-[#0E9F5B]">
              <Icon n="check" className="size-3" sw={3} /> Learned
            </p>
          </div>
        </Card>
      ))}
      <At x={236} y={174} w={80} h={80} className="grid place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
        <span className="grid size-14 place-items-center rounded-full bg-white text-[#3300EA] shadow-[0_0_40px_rgba(255,255,255,0.55)]">
          <Icon n="sparkle" className="size-7" sw={1.8} />
        </span>
      </At>
      <Card x={330} y={70} w={210} className="p-4">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#3300EA]">
          <Icon n="sparkle" className="size-3.5" sw={2} /> Expert AI
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <In w={180}>Do you service Pflugerville? How much is a tune-up?</In>
          <Out w={190}>Yes, Pflugerville is in our area. Tune-ups are a flat rate. Wednesday or Friday?</Out>
        </div>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#F1F1F4] px-2 py-1 text-[10.5px] text-[#4B4B57]">
          <Icon n="book" className="size-3" sw={2} /> From: Service areas
        </span>
      </Card>
      <Card x={104} y={366} w={436} className="flex items-center gap-2 px-4 py-3 whitespace-nowrap">
        <span className="text-[12px] text-[#6B6B78]">Same answers on</span>
        {(
          [
            ["phone", "Phone"],
            ["sms", "Text"],
            ["chat", "Web chat"],
            ["instagram", "Social"],
          ] as [IconName, string][]
        ).map(([n, label]) => (
          <span key={label} className="flex items-center gap-1 rounded-full bg-[#ECEAFE] px-2 py-1 text-[11px] font-medium text-[#3300EA]">
            <Icon n={n} className="size-3" sw={2.2} /> {label}
          </span>
        ))}
      </Card>
    </>
  );
}

function MissedCall() {
  return (
    <>
      <At x={156} y={16} w={256} h={428} className="rounded-[44px] bg-[#0E0E14] p-[9px] shadow-[0_30px_60px_-20px_rgba(10,8,60,0.6)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[36px] bg-white">
          <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-medium">
            <span>9:41</span>
            <span className="h-[18px] w-[72px] rounded-full bg-[#0E0E14]" />
            <span className="flex gap-1">
              <span className="h-2 w-3.5 rounded-sm bg-ink" />
            </span>
          </div>
          <div className="mt-3 flex flex-col items-center border-b border-[#EDEDF1] pb-3">
            <Av text="LS" size={38} bg="#DDF6E9" fg="#1E6B47" />
            <p className="mt-1 text-[12.5px] font-medium">Lone Star Plumbing</p>
          </div>
          <div className="flex flex-1 flex-col gap-2 px-3 pt-3">
            <p className="mx-auto flex items-center gap-1.5 rounded-full bg-[#FDECEC] px-2.5 py-1 text-[11px] font-medium text-[#D93636]">
              <Icon n="phone" className="size-3" sw={2.4} /> Missed call · 2:14 PM
            </p>
            <In w={190}>Hi, this is Lone Star Plumbing. Sorry we missed your call! How can we help?</In>
            <Out w={170}>My water heater is leaking</Out>
            <In w={190}>Sorry to hear that! We can be there at 4:30 today. Want me to book it?</In>
            <Out w={120}>Yes please!</Out>
          </div>
        </div>
      </At>
      <Event x={8} y={84} w={164} n="zap" title="Texted back" sub="4 seconds later" />
      <Event x={398} y={248} w={154} n="userPlus" {...GREEN} title="Lead saved" sub="Synced to CRM" />
    </>
  );
}

const COLUMNS: { name: string; dot: string; cards: [string, string, string][] }[] = [
  { name: "New lead", dot: "#9A9AA5", cards: [["Ana Silva", "Consultation", "$1,200"], ["Tom Reed", "Roof repair", "$3,400"], ["Jake Morris", "Water heater", "$850"]] },
  { name: "Contacted", dot: "#3B82F6", cards: [["Maria Lopez", "Lip filler", "$600"], ["Ben Ortiz", "AC install", "$2,100"]] },
  { name: "Quote sent", dot: "#F59E0B", cards: [["Kim Lee", "Remodel", "$9,800"], ["Sam Price", "Panel upgrade", "$1,450"]] },
  { name: "Won", dot: "#12B76A", cards: [["Emily Carter", "Listing", "$12,000"], ["Lisa Wong", "Package", "$980"]] },
];

function Pipeline() {
  return (
    <>
      <Card x={18} y={34} w={524} h={392} className="p-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-[16px] font-medium">Sales pipeline</p>
          <span className="rounded-full bg-[#ECEAFE] px-2.5 py-1 text-[11.5px] font-medium text-[#3300EA]">$48,250 open</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {COLUMNS.map((col) => (
            <div key={col.name} className="rounded-xl bg-[#F6F6F8] p-2">
              <p className="flex items-center gap-1.5 px-1 pb-2 text-[11.5px] font-medium">
                <span className="size-2 rounded-full" style={{ background: col.dot }} />
                {col.name}
                <span className="ml-auto text-[#9A9AA5]">{col.cards.length}</span>
              </p>
              <div className="flex flex-col gap-1.5">
                {col.cards.map(([name, what, value]) => (
                  <div key={name} className="rounded-lg bg-white p-2 shadow-[0_1px_2px_rgba(14,14,20,0.06)]">
                    <p className="truncate text-[11.5px] font-medium">{name}</p>
                    <p className="truncate text-[10.5px] text-[#6B6B78]">{what}</p>
                    <p className="mt-1 text-[11px] font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card x={228} y={258} w={122} className="rotate-[5deg] p-2.5 ring-2 ring-[#3300EA]">
        <p className="text-[11.5px] font-medium">Rosa Diaz</p>
        <p className="text-[10.5px] text-[#6B6B78]">Estimate</p>
        <p className="mt-1 text-[11px] font-medium">$4,300</p>
      </Card>
      <Event x={306} y={378} w={226} n="zap" {...GREEN} title="Moved to Won automatically" sub="Invoice paid · review request sent" />
    </>
  );
}

function ChatWidget() {
  return (
    <>
      <Card x={18} y={26} w={380} h={310} className="overflow-hidden opacity-95">
        <div className="flex items-center gap-1.5 border-b border-[#EDEDF1] bg-[#F7F7F9] px-3 py-2.5">
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-3 rounded-md bg-white px-2.5 py-1 text-[11px] text-[#6B6B78]">comfortairhvac.com</span>
        </div>
        <div className="p-5">
          <p className="text-[13px] font-medium">Comfort Air HVAC</p>
          <p className="mt-4 w-[210px] text-[21px] leading-[1.12] font-medium tracking-[-0.02em]">Heating and cooling, done right</p>
          <div className="mt-4 flex flex-col gap-2">
            <span className="h-2 w-[180px] rounded bg-[#EDEDF1]" />
            <span className="h-2 w-[150px] rounded bg-[#EDEDF1]" />
            <span className="h-2 w-[165px] rounded bg-[#EDEDF1]" />
          </div>
          <span className="mt-5 inline-block rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-white">Schedule service</span>
        </div>
      </Card>
      <Card x={262} y={58} w={276} h={376} className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-4 py-3 text-white">
          <Av text="CA" size={30} bg="rgba(255,255,255,0.2)" fg="#fff" />
          <div>
            <p className="text-[13px] font-medium">Comfort Air assistant</p>
            <p className="flex items-center gap-1 text-[10.5px] text-white/80">
              <Dot c="#5BF0A8" /> Online · replies instantly
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3.5">
          <In w={210}>Have a question about pricing or availability? Ask me here.</In>
          <Out w={190}>How much is a furnace replacement?</Out>
          <In w={220}>It depends on the home, so we offer a free in-home estimate. Tomorrow at 9 AM or 1 PM?</In>
          <div className="flex gap-1.5">
            {["9 AM", "1 PM"].map((t) => (
              <span key={t} className="rounded-full border border-[#3300EA]/30 px-3 py-1 text-[11.5px] font-medium text-[#3300EA]">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="mx-3.5 mb-3.5 flex items-center justify-between rounded-full border border-[#EDEDF1] px-3.5 py-2 text-[11.5px] text-[#9A9AA5]">
          Type a message…
          <Icon n="send" className="size-3.5 text-[#3300EA]" sw={2} />
        </div>
      </Card>
      <Event x={28} y={362} w={214} n="userPlus" {...GREEN} title="Lead captured" sub="Name, phone and address saved" />
    </>
  );
}

function Reviews() {
  return (
    <>
      <Card x={24} y={36} w={268} className="p-4">
        <p className="flex items-center gap-2 border-b border-[#EDEDF1] pb-3 text-[13px] font-medium">
          <Av text="BA" size={28} bg="#F6E3F7" fg="#6B3F75" /> Bella Aesthetics
          <span className="ml-auto text-[11px] font-normal text-[#9A9AA5]">2:05 PM</span>
        </p>
        <div className="mt-3">
          <In w={236}>Hi Sarah, thanks for choosing Bella Aesthetics today! If you have a minute, a quick Google review helps us a lot.</In>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#ECEAFE] px-3 py-1.5 text-[12px] font-medium text-[#3300EA]">
            <Icon n="star" className="size-3.5" sw={2} /> Leave a review
          </span>
        </div>
      </Card>
      <Card x={318} y={36} w={216} className="p-4">
        <p className="text-[12px] text-[#6B6B78]">Google rating</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-[34px] leading-none font-medium tracking-[-0.02em]">4.9</span>
          <span className="mb-1 flex text-[#F5A623]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} n="star" className="size-3.5 fill-current" sw={1} />
            ))}
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          {[92, 6, 1, 1, 0].map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-[#6B6B78]">
              {5 - i}
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1F1F4]">
                <span className="block h-full rounded-full bg-[#F5A623]" style={{ width: `${w}%` }} />
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card x={188} y={236} w={300} className="p-4">
        <div className="flex items-center gap-2.5">
          <Av text="SM" size={34} bg="#FBE3C2" fg="#7C5A2E" />
          <div>
            <p className="text-[13.5px] font-medium">Sarah M.</p>
            <span className="flex text-[#F5A623]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} n="star" className="size-3 fill-current" sw={1} />
              ))}
            </span>
          </div>
          <span className="ml-auto rounded-full bg-[#DDF6E9] px-2 py-0.5 text-[10.5px] font-medium text-[#0E9F5B]">New</span>
        </div>
        <p className="mt-2.5 text-[13px] leading-[1.45]">So easy to book and everyone was lovely. I&apos;ll be back!</p>
      </Card>
      <Event x={40} y={372} w={280} n="sparkle" title="AI-suggested reply ready" sub="“Thank you, Sarah! We loved having you…”" />
    </>
  );
}

const ART: Record<string, { draw: () => ReactNode; label: string }> = {
  "ai-voice-agent": { draw: Voice, label: "The AI Voice Agent answering a call and booking the job" },
  "unified-inbox": { draw: Inbox, label: "One inbox with texts, Instagram, Facebook, email and web chats" },
  "smart-website": { draw: Website, label: "A website with online booking, chat and a lead landing in the pipeline" },
  "ai-conversation-assistant": { draw: Conversation, label: "The AI replying to an Instagram DM and booking a consult" },
  "google-business-profile": { draw: GoogleProfile, label: "A Google Business Profile whose calls, missed calls and reviews are handled" },
  "automation-workflows": { draw: Workflow, label: "A follow-up workflow from a form to a booking" },
  "expert-ai": { draw: Expert, label: "Expert AI answering from the business's own information" },
  "missed-call-text-back": { draw: MissedCall, label: "A missed call answered by text within seconds" },
  "sales-pipeline-crm": { draw: Pipeline, label: "A sales pipeline with deals moving through its stages" },
  "website-chat-widget": { draw: ChatWidget, label: "An AI chat on a website booking an estimate" },
  "google-review-automation": { draw: Reviews, label: "A review request text, a new five-star review and the rating" },
};

export function hasArt(slug: string) {
  return slug in ART;
}

/** The picture for a solution, in the brand frame; null for a solution without one. */
export function SolutionArt({ slug, className = "" }: { slug: string; className?: string }) {
  const art = ART[slug];
  if (!art) return null;
  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#052EFF] via-[#2414F2] to-[#3300EA] shadow-[0_40px_80px_-40px_rgba(51,0,234,0.75)] ${className}`}>
      <span aria-hidden="true" className="sol-art-grid pointer-events-none absolute inset-0" />
      <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 size-80 rounded-full bg-white/15 blur-3xl" />
      <div role="img" aria-label={art.label} className="suite-stage relative" style={{ aspectRatio: `${W} / ${H}` }}>
        <div className="suite-board" style={{ width: W, height: H, ["--stage-w" as string]: `${W}px` }}>
          {art.draw()}
        </div>
      </div>
    </div>
  );
}
