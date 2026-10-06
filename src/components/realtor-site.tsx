import { valuesOf } from "@/lib/stage-intro";
import { BrowserChrome, CARD, Field, MOBILE, type SiteMode } from "./site-mockup";
import { BOARD, Box, Ico, INK, LINE, MUTED, T } from "./suite-mockup";

/**
 * An agent's website, desktop and phone — Oakline Realty, invented like Luna
 * Med Spa — on the med spa site's grid, so the Suite intro's cursor, thumb and
 * chip land on its showing form unchanged (CLICKS and TAPS in site-mockup).
 * The listing card over the form is the home Emily asks to tour.
 * `stage` / `static`: see SiteMode.
 */

const GREEN = "#14503B";
const GREEN_DEEP = "#0C3628";
const GOLD = "#B8913F";
const CREAM = "#F6F3EC";
const SERIF = "Georgia, 'Times New Roman', serif";
const PHOTO = "/images/real-estate.png";

const VALUES = valuesOf("realtor");
const ASK = ["Your name", "Phone number", "Which home would you like to see?"];
const field = (mode: SiteMode, i: number) => (mode === "stage" ? { value: VALUES[i] } : { placeholder: ASK[i] });

/** The top-right corner of the call button: where the SmartSync Site section's pin sits. */
export const REALTOR_CALL: [number, number] = [274, 566];

const STATS: [string, string][] = [
  ["120+", "homes sold"],
  ["4.9★", "client rating"],
  ["Same-day", "showings"],
];

/* --------------------------------------------------------------- desktop -- */

export function RealtorSite({ mode = "stage" }: { mode?: SiteMode }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", color: INK }}>
      {/* site header */}
      <Box x={60} y={70} w={44} h={44} style={{ background: GREEN, borderRadius: 12 }}>
        <Ico n="home" x={22} y={22} s={22} c="#fff" sw={2} />
      </Box>
      <T x={114} y={84} s={26} w={700} c={GREEN_DEEP} style={{ fontFamily: SERIF }}>
        Oakline
      </T>
      <T x={116} y={106} s={10.5} w={700} c={GOLD} style={{ letterSpacing: 4 }}>
        REALTY
      </T>
      {(
        [
          ["Buy", 720],
          ["Sell", 786],
          ["Neighborhoods", 852],
          ["About", 1000],
        ] as const
      ).map(([label, x]) => (
        <T key={label} x={x} y={92} s={15} c="#4B5563">
          {label}
        </T>
      ))}
      <Ico n="phone" x={1200} y={92} s={16} c={GREEN} sw={2} />
      <T x={1216} y={92} s={15} w={700} c={GREEN_DEEP}>
        (512) 555-0110
      </T>
      <Box x={1480} y={73} w={170} h={40} style={{ background: GREEN, borderRadius: 20 }}>
        <T x={85} y={20} s={15} w={600} c="#fff" align="center">
          Book a Showing
        </T>
      </Box>
      <Box x={0} y={130} w={BOARD.w} h={1} style={{ background: LINE }} />

      {/* hero */}
      <Box x={0} y={131} w={BOARD.w} h={BOARD.h - 131} style={{ background: CREAM }} />
      <T x={60} y={200} s={13} w={700} c={GOLD} style={{ letterSpacing: 3 }}>
        AUSTIN, TX · HOMES FOR SALE
      </T>
      <T x={56} y={274} s={72} w={700} c={GREEN_DEEP} style={{ fontFamily: SERIF, letterSpacing: -1.5 }}>
        Find Your Next
      </T>
      <T x={56} y={354} s={72} w={700} c={GREEN_DEEP} style={{ fontFamily: SERIF, letterSpacing: -1.5 }}>
        Front <span style={{ color: GOLD }}>Door.</span>
      </T>
      {["Local agents, real answers and showings booked", "around your schedule — not ours."].map((line, i) => (
        <T key={line} x={60} y={420 + i * 30} s={18} c={MUTED}>
          {line}
        </T>
      ))}

      {/* search, then one-tap call */}
      <Box x={60} y={486} w={520} h={58} style={{ background: "#fff", borderRadius: 29, boxShadow: "0 14px 30px -18px rgba(12,54,40,.45)" }}>
        <Ico n="search" x={30} y={29} s={17} c={MUTED} sw={2} />
        <T x={52} y={29} s={15} c="#9CA3AF">
          City, neighborhood or ZIP
        </T>
        <Box x={388} y={7} w={124} h={44} style={{ background: GREEN, borderRadius: 22 }}>
          <T x={62} y={22} s={15} w={600} c="#fff" align="center">
            Search
          </T>
        </Box>
      </Box>
      <Box x={60} y={566} w={214} h={46} style={{ border: `1.5px solid ${GREEN}`, borderRadius: 23 }}>
        <Ico n="phone" x={40} y={23} s={16} c={GREEN} sw={2} />
        <T x={58} y={23} s={15} w={600} c={GREEN_DEEP}>
          Call an Agent
        </T>
      </Box>

      {STATS.map(([big, small], i) => (
        <span key={small}>
          <T x={60 + i * 190} y={668} s={26} w={700} c={GREEN_DEEP} style={{ fontFamily: SERIF }}>
            {big}
          </T>
          <T x={60 + i * 190} y={698} s={13} c={MUTED}>
            {small}
          </T>
        </span>
      ))}

      {/* the home, standing between the copy and the form */}
      <Box x={600} y={690} w={420} h={40} style={{ background: "radial-gradient(closest-side, rgba(12,54,40,.22), transparent)" }} />
      {/* eslint-disable-next-line @next/next/no-img-element -- a photo inside a scaled mockup */}
      <img src={PHOTO} alt="" style={{ position: "absolute", left: 612, top: 248, height: 470 }} />

      {/* the listing she asks about, over the form */}
      <Box x={CARD.x} y={196} w={CARD.w} h={104} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 22px 50px -30px rgba(12,54,40,.5)" }}>
        <Box x={16} y={16} w={72} h={72} style={{ background: `linear-gradient(150deg, #E6EFE9, #CFE0D5)`, borderRadius: 12 }}>
          <Ico n="home" x={36} y={36} s={28} c={GREEN} sw={1.8} />
        </Box>
        <T x={106} y={30} s={11.5} w={700} c={GOLD} style={{ letterSpacing: 2 }}>
          JUST LISTED
        </T>
        <T x={106} y={54} s={18} w={700} c={INK}>
          412 Oak Lane, Austin
        </T>
        <T x={106} y={78} s={14} c={MUTED}>
          $649,000 · 4 bd · 3 ba · 2,340 sqft
        </T>
        <Box x={462} y={36} w={100} h={32} style={{ background: "#E8F1EC", borderRadius: 16 }}>
          <T x={50} y={16} s={13} w={600} c={GREEN} align="center">
            Open Sat
          </T>
        </Box>
      </Box>

      <Box
        x={CARD.x}
        y={CARD.y}
        w={CARD.w}
        h={CARD.h}
        style={{ background: "#fff", borderRadius: 18, boxShadow: "0 30px 70px -34px rgba(12,54,40,.55)" }}
      >
        <T x={32} y={44} s={21} w={600} c={GREEN_DEEP}>
          Book a Showing
        </T>
        <T x={548} y={44} s={13} c={MUTED} align="right">
          Replies in a minute
        </T>
        <Field x={32} y={70} w={516} h={46} s={15} accent={GREEN} {...field(mode, 0)} />
        <Field x={32} y={128} w={516} h={46} s={15} accent={GREEN} {...field(mode, 1)} />
        <Field x={32} y={186} w={516} h={64} s={15} accent={GREEN} {...field(mode, 2)} />
        <Box
          a="send"
          x={32}
          y={266}
          w={516}
          h={50}
          style={{
            background: `linear-gradient(180deg, ${GREEN}, ${GREEN_DEEP})`,
            borderRadius: 25,
            boxShadow: "0 12px 24px -14px rgba(12,54,40,.9)",
          }}
        >
          <T x={258} y={25} s={16} w={600} c="#fff" align="center">
            Request a Showing
          </T>
        </Box>
      </Box>

      {/* the site's chat */}
      <Box x={1626} y={762} w={54} h={54} style={{ background: GREEN, borderRadius: "50%", boxShadow: "0 12px 24px -10px rgba(12,54,40,.8)" }}>
        <Ico n="bubble" x={27} y={27} s={24} c="#fff" sw={2} />
      </Box>

      {mode === "stage" ? (
        // the visitor's cursor
        <svg
          data-a="pointer"
          viewBox="0 0 24 24"
          width={30}
          height={30}
          aria-hidden="true"
          style={{ position: "absolute", left: 0, top: 0, opacity: 0, filter: "drop-shadow(0 3px 6px rgba(17,24,39,.35))" }}
        >
          <path d="M5 2.5 19.5 11l-6.6 1.5-2.7 6.4z" fill={INK} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ) : null}

      <BrowserChrome url="www.oaklinerealty.com" />
    </div>
  );
}

/* ---------------------------------------------------------------- mobile -- */

/** The same site on a phone's screen, below the status bar, with the same form. */
export function RealtorSiteMobile({ mode = "stage" }: { mode?: SiteMode }) {
  return (
    <Box
      a={mode === "stage" ? "mobile-site" : undefined}
      x={MOBILE.x}
      y={MOBILE.y}
      w={MOBILE.w}
      h={MOBILE.h}
      // on the stage it is hidden like .stage-cue: where the timeline never
      // runs, the phone must be the inbox rather than a website
      style={{ background: "#fff", overflow: "hidden", ...(mode === "stage" ? { visibility: "hidden", opacity: 0 } : {}) }}
    >
      <Box x={12} y={6} w={284} h={30} style={{ background: "#F1F2F4", borderRadius: 15 }}>
        <Ico n="link" x={20} y={15} s={10} c={MUTED} sw={2} />
        <T x={154} y={15} s={12} c={MUTED} align="center">
          oaklinerealty.com
        </T>
      </Box>

      {/* header: the mark, one-tap call, the menu */}
      <Box x={16} y={45} w={24} h={24} style={{ background: GREEN, borderRadius: 7 }}>
        <Ico n="home" x={12} y={12} s={13} c="#fff" sw={2} />
      </Box>
      <T x={46} y={53} s={15} w={700} c={GREEN_DEEP} style={{ fontFamily: SERIF }}>
        Oakline
      </T>
      <T x={47} y={66} s={6.5} w={700} c={GOLD} style={{ letterSpacing: 2 }}>
        REALTY
      </T>
      <Box x={234} y={43} w={28} h={28} style={{ background: GREEN, borderRadius: "50%" }}>
        <Ico n="phone" x={14} y={14} s={13} c="#fff" sw={2} />
      </Box>
      <Ico n="menu" x={282} y={57} s={20} c={GREEN_DEEP} sw={2} />

      <Box x={12} y={76} w={284} h={132} style={{ background: CREAM, borderRadius: 14, overflow: "hidden" }}>
        <T x={14} y={20} s={8} w={700} c={GOLD} style={{ letterSpacing: 1.4 }}>
          AUSTIN · HOMES FOR SALE
        </T>
        <T x={14} y={46} s={19} w={700} c={GREEN_DEEP} style={{ fontFamily: SERIF }}>
          Find Your Next
        </T>
        <T x={14} y={70} s={19} w={700} c={GREEN_DEEP} style={{ fontFamily: SERIF }}>
          Front <span style={{ color: GOLD }}>Door.</span>
        </T>
        <T x={14} y={108} s={9.5} c={MUTED}>
          Just listed · 412 Oak Lane
        </T>
        {/* eslint-disable-next-line @next/next/no-img-element -- a photo inside a scaled mockup */}
        <img src={PHOTO} alt="" style={{ position: "absolute", right: -6, bottom: 0, height: 124 }} />
      </Box>

      <T x={16} y={228} s={15} w={700} c={GREEN_DEEP}>
        Book a Showing
      </T>
      <Field x={12} y={242} w={284} h={42} s={13.5} accent={GREEN} {...field(mode, 0)} />
      <Field x={12} y={294} w={284} h={42} s={13.5} accent={GREEN} {...field(mode, 1)} />
      <Field x={12} y={346} w={284} h={56} s={13.5} accent={GREEN} {...field(mode, 2)} />
      <Box
        a="send"
        x={12}
        y={416}
        w={284}
        h={46}
        style={{
          background: `linear-gradient(180deg, ${GREEN}, ${GREEN_DEEP})`,
          borderRadius: 23,
          boxShadow: "0 10px 20px -12px rgba(12,54,40,.9)",
        }}
      >
        <T x={142} y={23} s={15} w={600} c="#fff" align="center">
          Request a Showing
        </T>
      </Box>
      <T x={154} y={478} s={11.5} c={MUTED} align="center">
        Replies in a minute · No obligation
      </T>

      {(
        [
          ["home", "Buy"],
          ["dollar", "Sell"],
          ["chart", "Home Value"],
        ] as const
      ).map(([icon, name], i) => (
        <Box key={name} x={12 + i * 96} y={496} w={88} h={58} style={{ background: "#EEF4F0", borderRadius: 12 }}>
          <Ico n={icon} x={44} y={22} s={16} c={GREEN_DEEP} sw={1.9} />
          <T x={44} y={44} s={10} w={600} c={GREEN_DEEP} align="center">
            {name}
          </T>
        </Box>
      ))}

      {/* the site's chat */}
      <Box x={262} y={562} w={34} h={34} style={{ background: GREEN, borderRadius: "50%" }}>
        <Ico n="bubble" x={17} y={17} s={16} c="#fff" sw={2} />
      </Box>

      {mode === "stage" ? (
        // her thumb
        <Box
          a="tap"
          x={-17}
          y={-17}
          w={34}
          h={34}
          style={{
            background: "rgba(17,24,39,.22)",
            border: "2px solid rgba(17,24,39,.35)",
            borderRadius: "50%",
            opacity: 0,
          }}
        />
      ) : null}
    </Box>
  );
}
