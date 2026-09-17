import { VISITOR } from "@/lib/stage-intro";
import { BOARD, Box, Ico, INK, LINE, MUTED, T } from "./suite-mockup";

/**
 * A med spa's website, twice: the desktop page on the board's own rectangle,
 * and the same site on the phone. The booking form is filled in on both at
 * once — it is one visitor and one message, shown on the two screens the
 * business will read it on.
 *
 * Luna Med Spa is invented — the name already on the med spa artwork this site
 * borrows its look from. Nobody's real clinic belongs on a public page, and the
 * point of the shot is that any site feeds the inbox, not one particular one.
 *
 * The form's values are written into the markup, not left empty. StageMotion
 * clears them and types them back; wherever it does not run neither site is
 * shown at all, and what is left is the finished inbox, which is correct.
 */

const WINE = "#8B1538";
const WINE_DEEP = "#6E0F2B";
const BLUSH = "#F7E9E6";
const CREAM = "#FBF6F2";
const SERIF = "Georgia, 'Times New Roman', serif";
const PHOTO = "/images/med-spa.png";

const TREATMENTS = ["Facials", "Injectables", "Skin Rejuvenation", "Wellness"];

/** The clinic photograph on its blush panel — cut out on white, so it sits on the tint. */
function Portrait({ x, y, w, h, r = 18 }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <Box
      x={x}
      y={y}
      w={w}
      h={h}
      style={{
        background: `linear-gradient(160deg, ${BLUSH}, #EFD9D4)`,
        borderRadius: r,
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a photo inside a scaled mockup */}
      <img
        src={PHOTO}
        alt=""
        style={{
          position: "absolute",
          right: "4%",
          bottom: 0,
          height: "104%",
          objectFit: "contain",
          mixBlendMode: "multiply",
        }}
      />
    </Box>
  );
}

/**
 * One form row, on either site. The ring is what StageMotion brightens as the
 * cursor and the thumb arrive; the value is what it types into.
 */
function Field({
  x,
  y,
  w,
  h,
  s,
  value,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  s: number;
  value: string;
}) {
  return (
    <Box
      x={x}
      y={y}
      w={w}
      h={h}
      style={{ background: "#FAFAFB", border: `1px solid ${LINE}`, borderRadius: 10 }}
    >
      <Box
        a="ring"
        x={-1}
        y={-1}
        w={w + 2}
        h={h + 2}
        style={{ border: `2px solid ${WINE}`, borderRadius: 10, opacity: 0 }}
      />
      <T x={16} y={h > 56 ? 24 : h / 2} s={s} c={INK}>
        <span data-a="value">{value}</span>
      </T>
    </Box>
  );
}

/* --------------------------------------------------------------- desktop -- */

/** The booking card on the desktop page, and where the cursor has to be for it. */
const CARD = { x: 1000, y: 330, w: 580, h: 340 };
export const CLICKS: [number, number][] = [
  [1152, 423],
  [1152, 481],
  [1152, 538],
  [1290, 621],
];

export function VisitorSite() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", color: INK }}>
      {/* site header */}
      <T x={60} y={92} s={23} w={500} c={WINE_DEEP} style={{ fontFamily: SERIF }}>
        Luna Med Spa
      </T>
      {[
        ["Treatments", 1010],
        ["About", 1136],
        ["Contact", 1226],
      ].map(([label, x]) => (
        <T key={label} x={x as number} y={92} s={15} c="#4B5563">
          {label}
        </T>
      ))}
      <Box x={1480} y={73} w={170} h={40} style={{ background: WINE, borderRadius: 20 }}>
        <T x={85} y={20} s={15} w={600} c="#fff" align="center">
          Book Now
        </T>
      </Box>
      <Box x={0} y={130} w={BOARD.w} h={1} style={{ background: LINE }} />

      {/* hero */}
      <T x={60} y={200} s={13} w={700} c={WINE} style={{ letterSpacing: 3 }}>
        MED SPA · SKIN CLINIC · AUSTIN, TX
      </T>
      {["Look good.", "Feel better."].map((line, i) => (
        <T
          key={line}
          x={58}
          y={276 + i * 84}
          s={74}
          w={400}
          c={WINE_DEEP}
          style={{ fontFamily: SERIF, letterSpacing: -1.5 }}
        >
          {line}
        </T>
      ))}
      {[
        "Advanced treatments, real results — hydrafacials,",
        "injectables and skin analysis by licensed clinicians.",
      ].map((line, i) => (
        <T key={line} x={60} y={410 + i * 30} s={18} c={MUTED}>
          {line}
        </T>
      ))}

      {/* what they do */}
      {TREATMENTS.map((name, i) => (
        <Box key={name} x={60 + i * 210} y={588} w={190} h={112} style={{ background: CREAM, borderRadius: 14 }}>
          <Box x={16} y={16} w={36} h={36} style={{ background: BLUSH, borderRadius: "50%" }}>
            <Ico n="sparkle" x={18} y={18} s={17} c={WINE} sw={1.8} />
          </Box>
          <T x={16} y={78} s={15} w={600} c={WINE_DEEP}>
            {name}
          </T>
          <T x={16} y={98} s={12.5} c={MUTED}>
            from $149
          </T>
        </Box>
      ))}

      <Portrait x={940} y={176} w={700} h={524} />

      {/* the booking card, floating on the photograph */}
      <Box
        x={CARD.x}
        y={CARD.y}
        w={CARD.w}
        h={CARD.h}
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 30px 70px -34px rgba(17,24,39,.55)",
        }}
      >
        <T x={32} y={44} s={21} w={600} c={WINE_DEEP}>
          Book your visit
        </T>
        <T x={548} y={44} s={13} c={MUTED} align="right">
          Replies in a minute
        </T>
        <Field x={32} y={70} w={516} h={46} s={15} value={VISITOR.name} />
        <Field x={32} y={128} w={516} h={46} s={15} value={VISITOR.phone} />
        <Field x={32} y={186} w={516} h={64} s={15} value={VISITOR.message} />
        <Box
          a="send"
          x={32}
          y={266}
          w={516}
          h={50}
          style={{
            background: `linear-gradient(180deg, ${WINE}, ${WINE_DEEP})`,
            borderRadius: 25,
            boxShadow: "0 12px 24px -14px rgba(139,21,56,.9)",
          }}
        >
          <T x={258} y={25} s={16} w={600} c="#fff" align="center">
            Book my visit
          </T>
        </Box>
      </Box>

      {/* the visitor's cursor */}
      <svg
        data-a="pointer"
        viewBox="0 0 24 24"
        width={30}
        height={30}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0,
          filter: "drop-shadow(0 3px 6px rgba(17,24,39,.35))",
        }}
      >
        <path
          d="M5 2.5 19.5 11l-6.6 1.5-2.7 6.4z"
          fill={INK}
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* browser chrome, painted over the page it frames */}
      <Box x={0} y={0} w={BOARD.w} h={46} style={{ background: "#F1F2F4", zIndex: 1 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((colour, i) => (
          <Box
            key={colour}
            x={22 + i * 20}
            y={19}
            w={10}
            h={10}
            style={{ background: colour, borderRadius: "50%" }}
          />
        ))}
        <Box
          x={120}
          y={11}
          w={420}
          h={24}
          style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12 }}
        >
          <Ico n="link" x={18} y={12} s={11} c={MUTED} sw={2} />
          <T x={32} y={12} s={12.5} c={MUTED}>
            www.lunamedspa.com
          </T>
        </Box>
        <Box x={0} y={45} w={BOARD.w} h={1} style={{ background: LINE }} />
      </Box>
    </div>
  );
}

/* ---------------------------------------------------------------- mobile -- */

/** The phone's screen below the status bar: the same site, the same form. */
export const MOBILE = { x: 0, y: 44, w: 308, h: 602 };

/** Where the thumb taps, in the mobile site's own pixels: three fields, then Book. */
export const TAPS: [number, number][] = [
  [154, 263],
  [154, 315],
  [154, 374],
  [154, 439],
];

export function VisitorSiteMobile() {
  return (
    <Box
      a="mobile-site"
      x={MOBILE.x}
      y={MOBILE.y}
      w={MOBILE.w}
      h={MOBILE.h}
      // hidden like .stage-cue, and for the same reason: where the timeline
      // never runs, the phone must be the inbox rather than a website over it
      style={{ background: "#fff", overflow: "hidden", visibility: "hidden", opacity: 0 }}
    >
      {/* the browser it is being read in — this is her own phone, not the app */}
      <Box x={12} y={6} w={284} h={30} style={{ background: "#F1F2F4", borderRadius: 15 }}>
        <Ico n="link" x={20} y={15} s={10} c={MUTED} sw={2} />
        <T x={154} y={15} s={12} c={MUTED} align="center">
          lunamedspa.com
        </T>
      </Box>

      <T x={154} y={56} s={16} w={500} c={WINE_DEEP} align="center" style={{ fontFamily: SERIF }}>
        Luna Med Spa
      </T>

      <Portrait x={12} y={72} w={284} h={132} r={14} />
      {/* kept clear of the photograph on the panel's right */}
      {["Look good.", "Feel better."].map((line, i) => (
        <T
          key={line}
          x={24}
          y={112 + i * 26}
          s={19}
          w={400}
          c={WINE_DEEP}
          style={{ fontFamily: SERIF, letterSpacing: -0.4 }}
        >
          {line}
        </T>
      ))}

      <T x={16} y={228} s={15} w={600}>
        Book your visit
      </T>
      <Field x={12} y={242} w={284} h={42} s={13.5} value={VISITOR.name} />
      <Field x={12} y={294} w={284} h={42} s={13.5} value={VISITOR.phone} />
      <Field x={12} y={346} w={284} h={56} s={13.5} value={VISITOR.message} />

      <Box
        a="send"
        x={12}
        y={416}
        w={284}
        h={46}
        style={{
          background: `linear-gradient(180deg, ${WINE}, ${WINE_DEEP})`,
          borderRadius: 23,
          boxShadow: "0 10px 20px -12px rgba(139,21,56,.9)",
        }}
      >
        <T x={142} y={23} s={15} w={600} c="#fff" align="center">
          Book my visit
        </T>
      </Box>
      <T x={154} y={478} s={11.5} c={MUTED} align="center">
        No card required · takes 30 seconds
      </T>

      {TREATMENTS.slice(0, 3).map((name, i) => (
        <Box key={name} x={12 + i * 96} y={504} w={88} h={62} style={{ background: CREAM, borderRadius: 12 }}>
          <Ico n="sparkle" x={44} y={24} s={15} c={WINE} sw={1.8} />
          <T x={44} y={47} s={10.5} w={600} c={WINE_DEEP} align="center">
            {name.split(" ")[0]}
          </T>
        </Box>
      ))}

      {/* her thumb */}
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
    </Box>
  );
}

/** The ping on the phone the moment the form is sent. */
export function LeadAlert() {
  return (
    <Box
      a="alert"
      x={10}
      y={52}
      w={288}
      h={70}
      style={{
        background: "rgba(255,255,255,.96)",
        borderRadius: 18,
        border: `1px solid ${LINE}`,
        boxShadow: "0 18px 34px -16px rgba(14,14,20,.45)",
        backdropFilter: "blur(6px)",
        visibility: "hidden",
        opacity: 0,
      }}
    >
      <Box x={14} y={14} w={26} h={26} style={{ background: "#052EFF", borderRadius: 8 }}>
        <Ico n="bubble" x={13} y={13} s={14} c="#fff" sw={2} />
      </Box>
      <T x={50} y={22} s={12} w={700} c={MUTED} style={{ letterSpacing: 0.4 }}>
        SMARTSYNC · NOW
      </T>
      <T x={50} y={42} s={13.5} w={600}>
        New lead · {VISITOR.name}
      </T>
      <T x={50} y={58} s={12} c={MUTED} style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>
        {VISITOR.message}
      </T>
    </Box>
  );
}
