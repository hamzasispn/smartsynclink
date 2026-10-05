import { valuesOf } from "@/lib/stage-intro";
import { BrowserChrome, CARD, Field, MOBILE } from "./site-mockup";
import { BOARD, Box, Ico, INK, LINE, MUTED, T } from "./suite-mockup";

/**
 * A plumber's website, desktop and phone — McNeel Plumbing's, drawn after
 * their live site — on the med spa site's grid: the quote card and its fields
 * sit exactly where the med spa's booking card does, so the cursor, the thumb
 * and the "New lead" chip in the Suite intro (CLICKS and TAPS in site-mockup)
 * land on it unchanged.
 *
 * `stage` is how the Suite intro uses it: Jake's details written in for
 * StageMotion to clear and type back, the cursor and thumb on the page, the
 * phone site hidden until the timeline shows it. `static` is how the SmartSync
 * Site section shows it: an empty form, nothing hidden, nothing to animate.
 */

type Mode = "stage" | "static";

const NAVY = "#0B1736";
const NAVY_2 = "#17306A";
const CRIMSON = "#A11D35";
const CRIMSON_DEEP = "#7B1228";
const SKY = "#5B95FF";
const SERIF = "Georgia, 'Times New Roman', serif";
const PHOTO = "/images/constrution.png";
const HERO = `radial-gradient(55% 75% at 50% 100%, rgba(91,149,255,.3), transparent 70%), linear-gradient(120deg, ${NAVY} 0%, ${NAVY_2} 58%, ${NAVY} 100%)`;

const VALUES = valuesOf("contractor");
const ASK = ["Full name", "Phone number", "What do you need help with?"];
const field = (mode: Mode, i: number) => (mode === "stage" ? { value: VALUES[i] } : { placeholder: ASK[i] });

const BADGES: ["shield" | "star" | "zap", string, string][] = [
  ["shield", "Licensed & Insured", "Fully covered work"],
  ["star", "Google Rated", "5.0 from homeowners"],
  ["zap", "24/7 Emergency", "Same-day service"],
];

/* --------------------------------------------------------------- desktop -- */

export function ContractorSite({ mode = "stage" }: { mode?: Mode }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", color: INK }}>
      {/* site header */}
      <Box x={60} y={70} w={44} h={44} style={{ background: NAVY, borderRadius: "50%" }}>
        <Ico n="star" x={22} y={22} s={20} c="#fff" fill="#fff" sw={1.5} />
      </Box>
      <T x={114} y={84} s={27} w={700} c={NAVY} style={{ fontFamily: SERIF, fontStyle: "italic", letterSpacing: -0.5 }}>
        McNeel
      </T>
      <T x={116} y={106} s={10.5} w={700} c={MUTED} style={{ letterSpacing: 3.5 }}>
        PLUMBING
      </T>
      {(
        [
          ["Services", 700],
          ["Areas We Serve", 806],
          ["Reviews", 950],
          ["Contact", 1042],
        ] as const
      ).map(([label, x]) => (
        <T key={label} x={x} y={92} s={15} c="#4B5563">
          {label}
        </T>
      ))}
      <Ico n="phone" x={1200} y={92} s={16} c={CRIMSON} sw={2} />
      <T x={1216} y={92} s={15} w={700} c={NAVY}>
        (830) 357-7114
      </T>
      <Box x={1480} y={73} w={170} h={40} style={{ background: CRIMSON, borderRadius: 10 }}>
        <T x={85} y={20} s={15} w={600} c="#fff" align="center">
          Get Free Quote
        </T>
      </Box>
      <Box x={0} y={130} w={BOARD.w} h={1} style={{ background: LINE }} />

      {/* hero */}
      <Box x={0} y={131} w={BOARD.w} h={BOARD.h - 131} style={{ background: HERO }} />
      <Box
        x={60}
        y={202}
        w={318}
        h={34}
        style={{ background: "rgba(91,149,255,.14)", border: "1px solid rgba(91,149,255,.45)", borderRadius: 17 }}
      >
        <T x={159} y={17} s={12.5} w={700} c={SKY} align="center" style={{ letterSpacing: 2.2 }}>
          LICENSED · INSURED · TRUSTED
        </T>
      </Box>
      <T x={58} y={292} s={56} w={800} c="#fff" style={{ letterSpacing: -1.2 }}>
        PLUMBING SOLUTIONS
      </T>
      <T x={58} y={358} s={56} w={800} c="#fff" style={{ letterSpacing: -1.2 }}>
        YOU CAN <span style={{ color: SKY }}>COUNT ON</span>
      </T>
      {["From quick repairs to full installations, honest pricing", "and service your home can count on."].map((line, i) => (
        <T key={line} x={60} y={422 + i * 28} s={17} c="rgba(255,255,255,.78)">
          {line}
        </T>
      ))}

      <Box x={60} y={490} w={214} h={50} style={{ background: "#2F6BFF", borderRadius: 10 }}>
        <T x={107} y={25} s={15} w={700} c="#fff" align="center">
          Explore Services →
        </T>
      </Box>
      <Box x={288} y={490} w={250} h={50} style={{ background: CRIMSON, borderRadius: 10 }}>
        <Ico n="phone" x={34} y={25} s={17} c="#fff" sw={2} />
        <T x={54} y={25} s={15} w={700} c="#fff">
          Call McNeel Plumbing
        </T>
      </Box>

      {/* rating, then the trust badges */}
      {["#F59E0B", "#10B981", "#6366F1", "#EC4899"].map((bg, i) => (
        <Box
          key={bg}
          x={60 + i * 26}
          y={570}
          w={40}
          h={40}
          style={{ background: bg, borderRadius: "50%", border: `3px solid ${NAVY}` }}
        >
          <Ico n="user" x={17} y={17} s={17} c="#fff" sw={2} />
        </Box>
      ))}
      <T x={180} y={590} s={20} w={700} c="#fff">
        5.0
      </T>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ico key={i} n="star" x={226 + i * 20} y={590} s={16} c="#FBBF24" fill="#FBBF24" sw={1} />
      ))}
      <T x={332} y={590} s={13.5} c="rgba(255,255,255,.75)">
        Trusted by homeowners in Spring Branch
      </T>
      {BADGES.map(([icon, title, sub], i) => (
        <Box
          key={title}
          x={60 + i * 192}
          y={636}
          w={180}
          h={60}
          style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 12 }}
        >
          <Box x={12} y={14} w={32} h={32} style={{ background: "rgba(91,149,255,.18)", borderRadius: "50%" }}>
            <Ico n={icon} x={16} y={16} s={16} c={SKY} sw={2} />
          </Box>
          <T x={54} y={22} s={13} w={700} c="#fff">
            {title}
          </T>
          <T x={54} y={41} s={11.5} c="rgba(255,255,255,.6)">
            {sub}
          </T>
        </Box>
      ))}

      {/* the plumber, standing behind the quote card */}
      {/* eslint-disable-next-line @next/next/no-img-element -- a photo inside a scaled mockup */}
      <img src={PHOTO} alt="" style={{ position: "absolute", left: 640, top: 355, height: 484 }} />

      <Box
        x={CARD.x}
        y={CARD.y}
        w={CARD.w}
        h={CARD.h}
        style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 34px 80px -30px rgba(0,0,0,.6)" }}
      >
        <Box x={0} y={0} w={CARD.w} h={58} style={{ background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_DEEP})` }}>
          <Box x={24} y={13} w={32} h={32} style={{ background: "rgba(255,255,255,.18)", borderRadius: "50%" }}>
            <Ico n="file" x={16} y={16} s={15} c="#fff" sw={2} />
          </Box>
          <T x={68} y={29} s={20} w={700} c="#fff">
            Get A Free Quote
          </T>
          <T x={556} y={29} s={12.5} c="rgba(255,255,255,.85)" align="right">
            Fast response · No obligation
          </T>
        </Box>
        <Field x={32} y={70} w={516} h={46} s={15} accent={CRIMSON} {...field(mode, 0)} />
        <Field x={32} y={128} w={516} h={46} s={15} accent={CRIMSON} {...field(mode, 1)} />
        <Field x={32} y={186} w={516} h={64} s={15} accent={CRIMSON} {...field(mode, 2)} />
        <Box
          a="send"
          x={32}
          y={266}
          w={516}
          h={50}
          style={{
            background: `linear-gradient(180deg, ${CRIMSON}, ${CRIMSON_DEEP})`,
            borderRadius: 12,
            boxShadow: "0 12px 24px -14px rgba(161,29,53,.9)",
          }}
        >
          <T x={258} y={25} s={16} w={600} c="#fff" align="center">
            Get My Free Quote
          </T>
        </Box>
      </Box>

      {/* the site's chat */}
      <Box x={1626} y={762} w={54} h={54} style={{ background: "#2F6BFF", borderRadius: "50%", boxShadow: "0 12px 24px -10px rgba(47,107,255,.8)" }}>
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

      <BrowserChrome url="www.mcneelplumbing.net" />
    </div>
  );
}

/* ---------------------------------------------------------------- mobile -- */

/** The same site on a phone's screen, below the status bar, with the same form. */
export function ContractorSiteMobile({ mode = "stage" }: { mode?: Mode }) {
  return (
    <Box
      a={mode === "stage" ? "mobile-site" : undefined}
      x={MOBILE.x}
      y={MOBILE.y}
      w={MOBILE.w}
      h={MOBILE.h}
      // on the stage it is hidden like .stage-cue, for the same reason: where the
      // timeline never runs, the phone must be the inbox rather than a website
      style={{ background: "#fff", overflow: "hidden", ...(mode === "stage" ? { visibility: "hidden", opacity: 0 } : {}) }}
    >
      <Box x={12} y={6} w={284} h={30} style={{ background: "#F1F2F4", borderRadius: 15 }}>
        <Ico n="link" x={20} y={15} s={10} c={MUTED} sw={2} />
        <T x={154} y={15} s={12} c={MUTED} align="center">
          mcneelplumbing.net
        </T>
      </Box>

      {/* header: the mark, one-tap call, the menu */}
      <Box x={16} y={45} w={24} h={24} style={{ background: NAVY, borderRadius: "50%" }}>
        <Ico n="star" x={12} y={12} s={12} c="#fff" fill="#fff" sw={1} />
      </Box>
      <T x={46} y={53} s={15} w={700} c={NAVY} style={{ fontFamily: SERIF, fontStyle: "italic" }}>
        McNeel
      </T>
      <T x={47} y={66} s={6.5} w={700} c={MUTED} style={{ letterSpacing: 2 }}>
        PLUMBING
      </T>
      <Box x={234} y={43} w={28} h={28} style={{ background: CRIMSON, borderRadius: "50%" }}>
        <Ico n="phone" x={14} y={14} s={13} c="#fff" sw={2} />
      </Box>
      <Ico n="menu" x={282} y={57} s={20} c={NAVY} sw={2} />

      <Box x={12} y={76} w={284} h={132} style={{ background: HERO, borderRadius: 14, overflow: "hidden" }}>
        <T x={14} y={20} s={8} w={700} c={SKY} style={{ letterSpacing: 1.4 }}>
          LICENSED · INSURED · TRUSTED
        </T>
        <T x={14} y={44} s={17} w={800} c="#fff">
          PLUMBING
        </T>
        <T x={14} y={65} s={17} w={800} c="#fff">
          SOLUTIONS YOU
        </T>
        <T x={14} y={86} s={17} w={800} c={SKY}>
          CAN COUNT ON
        </T>
        <T x={14} y={112} s={9.5} c="rgba(255,255,255,.75)">
          ★★★★★ 5.0 · Spring Branch, TX
        </T>
        {/* eslint-disable-next-line @next/next/no-img-element -- a photo inside a scaled mockup */}
        <img src={PHOTO} alt="" style={{ position: "absolute", right: -4, bottom: 0, height: 124 }} />
      </Box>

      <T x={16} y={228} s={15} w={700} c={NAVY}>
        Get A Free Quote
      </T>
      <Field x={12} y={242} w={284} h={42} s={13.5} accent={CRIMSON} {...field(mode, 0)} />
      <Field x={12} y={294} w={284} h={42} s={13.5} accent={CRIMSON} {...field(mode, 1)} />
      <Field x={12} y={346} w={284} h={56} s={13.5} accent={CRIMSON} {...field(mode, 2)} />
      <Box
        a="send"
        x={12}
        y={416}
        w={284}
        h={46}
        style={{
          background: `linear-gradient(180deg, ${CRIMSON}, ${CRIMSON_DEEP})`,
          borderRadius: 12,
          boxShadow: "0 10px 20px -12px rgba(161,29,53,.9)",
        }}
      >
        <T x={142} y={23} s={15} w={600} c="#fff" align="center">
          Get My Free Quote
        </T>
      </Box>
      <T x={154} y={478} s={11.5} c={MUTED} align="center">
        Fast response · No obligation
      </T>

      {(
        [
          ["wrench", "Repairs"],
          ["drop", "Water Heaters"],
          ["zap", "Emergency"],
        ] as const
      ).map(([icon, name], i) => (
        <Box key={name} x={12 + i * 96} y={496} w={88} h={58} style={{ background: "#F3F6FD", borderRadius: 12 }}>
          <Ico n={icon} x={44} y={22} s={16} c={NAVY} sw={1.9} />
          <T x={44} y={44} s={10} w={600} c={NAVY} align="center">
            {name}
          </T>
        </Box>
      ))}

      {/* the site's chat */}
      <Box x={262} y={562} w={34} h={34} style={{ background: "#2F6BFF", borderRadius: "50%" }}>
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
