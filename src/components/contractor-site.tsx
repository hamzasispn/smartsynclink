import { valuesOf } from "@/lib/stage-intro";
import { BrowserChrome, CARD, Field, MOBILE, type SiteMode } from "./site-mockup";
import { BOARD, Box, Ico, INK, MUTED, T } from "./suite-mockup";

/**
 * McNeel Plumbing's website, desktop and phone, drawn after their live site
 * (mcneelplumbing.net) with their own logo, hero photograph, reviewer avatars
 * and badges — the client asked on the call for it to look like the real one,
 * "more legit". McNeel is the client's own client; the assets are theirs.
 *
 * It sits on the med spa site's grid: the quote card and its fields are where
 * the med spa's booking card is, so the Suite intro's cursor, thumb and "New
 * lead" chip (CLICKS and TAPS in site-mockup) land on it unchanged.
 * `stage` / `static`: see SiteMode.
 */

const NAVY = "#0A1630";
const CRIMSON = "#A11D35";
const CRIMSON_DEEP = "#7B1228";
const BLUE = "#1F6BFF";
const SKY = "#5B95FF";
const A = "/images/work/mcneel/";
const HERO = `linear-gradient(90deg, rgba(9,20,45,.94) 0%, rgba(9,20,45,.84) 46%, rgba(9,20,45,.6) 100%), url(${A}hero.webp) center 30% / cover`;

const VALUES = valuesOf("contractor");
const ASK = ["Full Name *", "Phone *", "How may we assist you?"];
/** The live site's fields: light grey-blue on the dark glass card. */
const FIELD = { accent: CRIMSON, bg: "#D9E0EC", edge: "#D9E0EC", hint: "#5B6478" };
const field = (mode: SiteMode, i: number) => (mode === "stage" ? { value: VALUES[i] } : { placeholder: ASK[i] });

/** The top-right corner of the call button: where the SmartSync Site section's pin sits. */
export const CONTRACTOR_CALL: [number, number] = [676, 568];

const NAV: [string, number][] = [
  ["Home", 439],
  ["About Us", 526],
  ["Blog", 639],
  ["Services ▾", 712],
  ["Areas We Serve ▾", 838],
  ["Gallery", 1021],
  ["Reviews", 1117],
  ["Contact", 1223],
];

const BADGES: { icon: string; title: string; sub: string; w: number; blue?: boolean }[] = [
  { icon: "bbb", title: "BBB Listed", sub: "Trusted business", w: 186 },
  { icon: "google", title: "Google Rated", sub: "5.0 customer feedback", w: 220 },
  { icon: "facebook", title: "Facebook", sub: "Follow local updates", w: 204, blue: true },
];

/* eslint-disable @next/next/no-img-element -- photographs inside a scaled mockup */

/* --------------------------------------------------------------- desktop -- */

export function ContractorSite({ mode = "stage" }: { mode?: SiteMode }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", color: INK }}>
      {/* the offer bar */}
      <Box x={0} y={46} w={BOARD.w} h={44} style={{ background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 55%, ${CRIMSON_DEEP} 100%)` }}>
        <Box x={142} y={9} w={200} h={26} style={{ border: "1px solid rgba(255,255,255,.35)", borderRadius: 13, background: "rgba(255,255,255,.06)" }}>
          <T x={100} y={13} s={11.5} w={800} c="#fff" align="center">
            HURRY! <span style={{ color: SKY }}>SPRING SAVINGS</span>
          </T>
        </Box>
        <T x={700} y={22} s={13} w={700} c="#fff">
          Spring Savings Offer
        </T>
        <Box x={858} y={11} w={84} h={22} style={{ background: CRIMSON, borderRadius: 6 }}>
          <T x={42} y={11} s={12} w={800} c="#fff" align="center">
            $200 OFF
          </T>
        </Box>
        <T x={952} y={22} s={13} w={700} c="#fff">
          Tankless Water Heaters
        </T>
        <Ico n="phone" x={1316} y={22} s={13} c="#fff" sw={2.2} />
        <T x={1330} y={22} s={13.5} w={700} c="#fff">
          +1 830-357-7114
        </T>
        <T x={1452} y={22} s={13.5} w={700} c="rgba(255,255,255,.6)">
          |
        </T>
        <Ico n="mail" x={1472} y={22} s={13} c="#fff" sw={2.2} />
        <T x={1486} y={22} s={13.5} w={700} c="#fff">
          mcneelplumbing@gmail.com
        </T>
      </Box>

      {/* the header: a white card floating over the page */}
      <Box x={142} y={104} w={1425} h={84} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 12px 32px -14px rgba(15,23,42,.28)" }}>
        <img src={`${A}logo.webp`} alt="" style={{ position: "absolute", left: 70, top: 12, height: 60 }} />
        {NAV.map(([label, x]) => (
          <T key={label} x={x - 142} y={42} s={15.5} w={600} c="#1F2A44">
            {label}
          </T>
        ))}
        <Box x={1208} y={17} w={196} h={50} style={{ background: `linear-gradient(180deg, ${CRIMSON}, ${CRIMSON_DEEP})`, borderRadius: 10 }}>
          <T x={98} y={25} s={15.5} w={700} c="#fff" align="center">
            Get Free Quote →
          </T>
        </Box>
      </Box>

      {/* the hero: their photograph under the navy */}
      <Box x={0} y={200} w={BOARD.w} h={BOARD.h - 200} style={{ background: HERO }} />
      <Box x={142} y={230} w={300} h={38} style={{ background: "#E8F0FF", borderRadius: 19 }}>
        <T x={150} y={19} s={14} w={800} c="#1E5EFF" align="center" style={{ letterSpacing: 1.4 }}>
          LICENSED. INSURED. TRUSTED.
        </T>
      </Box>
      {["PLUMBING", "SOLUTIONS"].map((line, i) => (
        <T key={line} x={140} y={306 + i * 64} s={60} w={500} c="#fff" style={{ letterSpacing: -1.2 }}>
          {line}
        </T>
      ))}
      <T x={140} y={434} s={60} w={500} c="#fff" style={{ letterSpacing: -1.2 }}>
        YOU CAN <span style={{ color: SKY }}>COUNT ON</span>
      </T>
      {[
        "From quick repairs to full installations, McNeel Plumbing provides",
        "reliable solutions with honest pricing and exceptional service you",
        "can count on.",
      ].map((line, i) => (
        <T key={line} x={142} y={488 + i * 25} s={17} w={700} c="rgba(255,255,255,.92)">
          {line}
        </T>
      ))}

      <Box x={142} y={568} w={262} h={50} style={{ background: BLUE, borderRadius: 8 }}>
        <T x={131} y={25} s={15} w={700} c="#fff" align="center">
          Explore Service Options →
        </T>
      </Box>
      <Box x={420} y={568} w={256} h={50} style={{ background: `linear-gradient(180deg, ${CRIMSON}, ${CRIMSON_DEEP})`, borderRadius: 8 }}>
        <Ico n="phone" x={34} y={25} s={17} c="#fff" sw={2} />
        <T x={54} y={25} s={15} w={700} c="#fff">
          Call McNeel Plumbing
        </T>
      </Box>

      {/* reviews, then the badges */}
      {[1, 2, 3, 4].map((n, i) => (
        <img
          key={n}
          src={`${A}avatar${n}.webp`}
          alt=""
          style={{ position: "absolute", left: 142 + i * 30, top: 642, width: 42, height: 42, borderRadius: "50%", border: "2px solid #fff", objectFit: "cover" }}
        />
      ))}
      <T x={286} y={663} s={20} w={700} c="#fff">
        5.0
      </T>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ico key={i} n="star" x={332 + i * 18} y={663} s={15} c="#FBBF24" fill="#FBBF24" sw={1} />
      ))}
      <T x={432} y={663} s={13} w={700} c="#fff">
        Trusted by homeowners in Spring Branch
      </T>
      {BADGES.reduce<{ x: number; out: React.ReactNode[] }>(
        (acc, badge) => {
          acc.out.push(
            <Box
              key={badge.title}
              x={acc.x}
              y={700}
              w={badge.w}
              h={64}
              style={{ background: badge.blue ? BLUE : "rgba(255,255,255,.94)", borderRadius: 12, border: badge.blue ? "1px solid rgba(255,255,255,.4)" : "none" }}
            >
              <img src={`${A}${badge.icon}.webp`} alt="" style={{ position: "absolute", left: 14, top: 15, width: 34, height: 34 }} />
              <T x={60} y={24} s={13.5} w={800} c={badge.blue ? "#fff" : NAVY}>
                {badge.title}
              </T>
              <T x={60} y={43} s={11.5} w={600} c={badge.blue ? "rgba(255,255,255,.85)" : MUTED}>
                {badge.sub}
              </T>
            </Box>,
          );
          acc.x += badge.w + 14;
          return acc;
        },
        { x: 142, out: [] },
      ).out}

      {/* the quote form: dark glass, a crimson header, light fields */}
      <Box
        x={CARD.x}
        y={CARD.y}
        w={CARD.w}
        h={CARD.h}
        style={{ background: "rgba(24,38,74,.78)", border: "1px solid rgba(255,255,255,.22)", borderRadius: 18, overflow: "hidden", boxShadow: "0 34px 80px -30px rgba(0,0,0,.6)" }}
      >
        <Box x={0} y={0} w={CARD.w} h={58} style={{ background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_DEEP})` }}>
          <Box x={22} y={12} w={34} h={34} style={{ border: "2px solid rgba(255,255,255,.75)", borderRadius: "50%" }}>
            <Ico n="file" x={15} y={15} s={15} c="#fff" sw={2} />
          </Box>
          <T x={70} y={29} s={21} w={800} c="#fff">
            Get A Free Quote
          </T>
          <T x={556} y={29} s={12.5} w={700} c="#fff" align="right">
            Fast response. No obligation.
          </T>
        </Box>
        <Field x={32} y={70} w={516} h={46} s={15} {...FIELD} {...field(mode, 0)} />
        <Field x={32} y={128} w={516} h={46} s={15} {...FIELD} {...field(mode, 1)} />
        <Field x={32} y={186} w={516} h={64} s={15} {...FIELD} {...field(mode, 2)} />
        <Box
          a="send"
          x={32}
          y={266}
          w={516}
          h={50}
          style={{ background: `linear-gradient(180deg, ${CRIMSON}, ${CRIMSON_DEEP})`, borderRadius: 10, boxShadow: "0 12px 24px -14px rgba(161,29,53,.9)" }}
        >
          <T x={258} y={25} s={16} w={700} c="#fff" align="center">
            Get My Free Quote →
          </T>
        </Box>
      </Box>

      {/* the site's chat */}
      <Box x={1626} y={762} w={54} h={54} style={{ background: "#2F8CFF", borderRadius: "50%", boxShadow: "0 12px 24px -10px rgba(47,140,255,.8)" }}>
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

      <BrowserChrome url="mcneelplumbing.net" />
    </div>
  );
}

/* ---------------------------------------------------------------- mobile -- */

/** The same site on a phone's screen, below the status bar, with the same form. */
export function ContractorSiteMobile({ mode = "stage" }: { mode?: SiteMode }) {
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
          mcneelplumbing.net
        </T>
      </Box>

      {/* header: their logo, one-tap call, the menu */}
      <img src={`${A}logo.webp`} alt="" style={{ position: "absolute", left: 14, top: 40, height: 32 }} />
      <Box x={234} y={43} w={28} h={28} style={{ background: CRIMSON, borderRadius: "50%" }}>
        <Ico n="phone" x={14} y={14} s={13} c="#fff" sw={2} />
      </Box>
      <Box x={268} y={42} w={30} h={30} style={{ border: "1px solid #E2E8F0", borderRadius: 8 }}>
        <Ico n="menu" x={15} y={15} s={17} c={NAVY} sw={2} />
      </Box>

      {/* the hero, their photograph under the navy */}
      <Box x={0} y={78} w={308} h={134} style={{ background: HERO }}>
        <Box x={14} y={12} w={156} h={18} style={{ background: "#E8F0FF", borderRadius: 9 }}>
          <T x={78} y={9} s={7.5} w={800} c="#1E5EFF" align="center" style={{ letterSpacing: 0.6 }}>
            LICENSED. INSURED. TRUSTED.
          </T>
        </Box>
        <T x={14} y={50} s={19} w={500} c="#fff">
          PLUMBING SOLUTIONS
        </T>
        <T x={14} y={73} s={19} w={500} c="#fff">
          YOU CAN <span style={{ color: SKY }}>COUNT ON</span>
        </T>
        <T x={14} y={100} s={9} w={700} c="rgba(255,255,255,.9)">
          Honest pricing and service you can count on.
        </T>
        <T x={14} y={119} s={9} w={700} c="#fff">
          5.0 <span style={{ color: "#FBBF24" }}>★★★★★</span> Trusted in Spring Branch
        </T>
      </Box>

      {/* the quote form, dark glass as on the live site */}
      <Box x={6} y={216} w={296} h={276} style={{ background: "#16264A", borderRadius: 14 }} />
      <T x={16} y={228} s={14} w={800} c="#fff">
        Get A Free Quote
      </T>
      <Field x={12} y={242} w={284} h={42} s={13.5} {...FIELD} {...field(mode, 0)} />
      <Field x={12} y={294} w={284} h={42} s={13.5} {...FIELD} {...field(mode, 1)} />
      <Field x={12} y={346} w={284} h={56} s={13.5} {...FIELD} {...field(mode, 2)} />
      <Box
        a="send"
        x={12}
        y={416}
        w={284}
        h={46}
        style={{ background: `linear-gradient(180deg, ${CRIMSON}, ${CRIMSON_DEEP})`, borderRadius: 10, boxShadow: "0 10px 20px -12px rgba(161,29,53,.9)" }}
      >
        <T x={142} y={23} s={15} w={700} c="#fff" align="center">
          Get My Free Quote →
        </T>
      </Box>
      <T x={154} y={478} s={11} w={600} c="rgba(255,255,255,.75)" align="center">
        Fast response. No obligation.
      </T>

      {(
        [
          ["wrench", "Repairs"],
          ["drop", "Water Heaters"],
          ["zap", "Emergency"],
        ] as const
      ).map(([icon, name], i) => (
        <Box key={name} x={12 + i * 96} y={500} w={88} h={54} style={{ background: "#F1F5FC", borderRadius: 12 }}>
          <Ico n={icon} x={44} y={20} s={16} c={NAVY} sw={1.9} />
          <T x={44} y={40} s={10} w={600} c={NAVY} align="center">
            {name}
          </T>
        </Box>
      ))}

      {/* the site's chat */}
      <Box x={262} y={562} w={34} h={34} style={{ background: "#2F8CFF", borderRadius: "50%" }}>
        <Ico n="bubble" x={17} y={17} s={16} c="#fff" sw={2} />
      </Box>

      {mode === "stage" ? (
        // his thumb
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
