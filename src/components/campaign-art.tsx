import { Box, Ico, INK, LINE, MUTED, T } from "./suite-mockup";

/**
 * What one click after an appointment sets off, drawn.
 *
 * The front desk types a client's first name and mobile number into a check-in
 * card and presses Launch campaign. Two rows run from it: four weekly review
 * requests that stop the moment a review lands, and a twelve-month line of
 * texts carrying the returning-client offer and a referral ask.
 *
 * Drawn on a fixed artboard with the same primitives as the Suite mockups, and
 * scaled as one piece by .suite-board — so it is one drawing at every width
 * rather than a layout that reflows. Two arrangements of the same cards: side
 * by side where there is room, stacked on a phone.
 *
 * Every hook here is [data-ca]; CampaignMotion is what moves them. The markup
 * is the finished state on purpose — with reduced motion nothing runs, and
 * what is left is the sequence already complete, which is still the point.
 */

const BLUE = "#052EFF";
const VIOLET = "#3300EA";
const GOLD = "#F5B301";
const GREEN = "#16A34A";
const GREEN_SOFT = "#DCFCE7";
const FIELD = "#FAFAFB";
const CARD_W = 372;

export const CAMPAIGN_LAYOUTS = {
  wide: {
    w: 800,
    h: 500,
    form: { x: 24, y: 132 },
    review: { x: 380, y: 40 },
    follow: { x: 380, y: 262 },
    wires: ["M300 250 C 340 250, 344 148, 376 148", "M300 250 C 340 250, 344 372, 376 372"],
  },
  tall: {
    w: 420,
    h: 820,
    form: { x: 74, y: 16 },
    review: { x: 24, y: 296 },
    follow: { x: 24, y: 528 },
    wires: ["M210 256 C 210 276, 210 276, 210 292", "M210 500 C 210 514, 210 514, 210 524"],
  },
  /**
   * The home bento's campaigns tile, which plays it as a sequence rather than
   * all at once: the form alone in the middle, then the two cards in its place.
   * They share the board, so there is nothing to wire.
   */
  tile: {
    w: 420,
    h: 504,
    form: { x: 74, y: 134 },
    review: { x: 24, y: 24 },
    follow: { x: 24, y: 244 },
    wires: [],
  },
} as const;

export type CampaignLayout = keyof typeof CAMPAIGN_LAYOUTS;

/** The visitor's first name and number, as the front desk would type them. */
export const CHECK_IN = { name: "Anna", phone: "(512) 555-0142" };

function Field({ y, label, value }: { y: number; label: string; value: string }) {
  return (
    <>
      <T x={22} y={y} s={11} w={700} c={MUTED} style={{ letterSpacing: 0.8 }}>
        {label}
      </T>
      <Box
        x={22}
        y={y + 12}
        w={228}
        h={40}
        style={{ background: FIELD, border: `1px solid ${LINE}`, borderRadius: 9 }}
      >
        <T x={14} y={20} s={14} c={INK}>
          <span data-ca="value">{value}</span>
        </T>
      </Box>
    </>
  );
}

function CheckInCard({ x, y }: { x: number; y: number }) {
  return (
    <Box
      a="form"
      x={x}
      y={y}
      w={272}
      h={236}
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        boxShadow: "0 18px 40px -26px rgba(14,14,20,.35)",
      }}
    >
      <T x={22} y={30} s={14} w={600} c={INK}>
        New client check-in
      </T>
      <Field y={58} label="FIRST NAME" value={CHECK_IN.name} />
      <Field y={120} label="MOBILE" value={CHECK_IN.phone} />

      <Box
        a="launch"
        x={22}
        y={182}
        w={228}
        h={38}
        style={{
          background: `linear-gradient(90deg, ${BLUE}, ${VIOLET})`,
          borderRadius: 19,
          boxShadow: "0 10px 20px -12px rgba(5,46,255,.9)",
        }}
      >
        <T x={114} y={19} s={13.5} w={600} c="#fff" align="center">
          Launch campaign
        </T>
      </Box>

      {/* the hand that presses it */}
      <svg
        data-ca="cursor"
        viewBox="0 0 24 24"
        width={22}
        height={22}
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 2px 4px rgba(17,24,39,.3))" }}
      >
        <path d="M5 2.5 19.5 11l-6.6 1.5-2.7 6.4z" fill={INK} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </Box>
  );
}

function Card({
  x,
  y,
  h,
  title,
  note,
  children,
}: {
  x: number;
  y: number;
  h: number;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      a="card"
      x={x}
      y={y}
      w={CARD_W}
      h={h}
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        boxShadow: "0 18px 40px -28px rgba(14,14,20,.3)",
      }}
    >
      <T x={22} y={30} s={14} w={600} c={INK}>
        {title}
      </T>
      <T x={CARD_W - 22} y={30} s={11.5} c={MUTED} align="right">
        {note}
      </T>
      <Box x={22} y={48} w={CARD_W - 44} h={1} style={{ background: LINE }} />
      {children}
    </Box>
  );
}

/** Four weekly nudges, five stars, and the moment it all stops. */
function ReviewCard({ x, y }: { x: number; y: number }) {
  return (
    <Card x={x} y={y} h={200} title="5-star review requests" note="SMS">
      {[1, 2, 3, 4].map((week, i) => (
        <span key={week}>
          {i ? (
            <Box
              x={54 + (i - 1) * 78}
              y={87}
              w={78}
              h={2}
              style={{ background: LINE, borderRadius: 1 }}
            />
          ) : null}
          <Box
            a="week"
            x={36 + i * 78}
            y={72}
            w={32}
            h={32}
            style={{
              background: GREEN_SOFT,
              border: `2px solid ${GREEN}`,
              borderRadius: "50%",
            }}
          >
            <Ico n="bubble" x={16} y={16} s={14} c={GREEN} sw={2} />
          </Box>
          <T x={52 + i * 78} y={120} s={11} c={MUTED} align="center">
            Week {week}
          </T>
        </span>
      ))}

      <Box x={22} y={140} w={CARD_W - 44} h={42} style={{ background: "#F7F7F9", borderRadius: 10 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            data-ca="star"
            viewBox="0 0 24 24"
            width={17}
            height={17}
            aria-hidden="true"
            style={{ position: "absolute", left: 14 + i * 21, top: 12 }}
          >
            <path
              d="M12 3.2l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.6l6-.9z"
              fill={GOLD}
            />
          </svg>
        ))}
        <T x={130} y={21} s={12.5} w={600} c={GREEN}>
          <span data-ca="done">Review left — reminders stop</span>
        </T>
      </Box>
    </Card>
  );
}

/** A year of texts, with the offer and the referral riding along. */
function FollowUpCard({ x, y }: { x: number; y: number }) {
  const barX = 22;
  const barW = CARD_W - 44;
  const months = [1, 4, 7, 10];

  return (
    <Card x={x} y={y} h={236} title="12-month follow-up" note="every 2–3 months">
      <Box x={barX} y={74} w={barW} h={6} style={{ background: "#EFEFF3", borderRadius: 3 }}>
        <Box a="bar" x={0} y={0} w={barW} h={6} style={{ background: BLUE, borderRadius: 3 }} />
      </Box>

      {months.map((month) => {
        const left = barX + ((month - 0.5) / 12) * barW;
        return (
          <span key={month}>
            <Box
              a="month"
              x={left - 7}
              y={70}
              w={14}
              h={14}
              style={{ background: "#fff", border: `3px solid ${VIOLET}`, borderRadius: "50%" }}
            />
            <T x={left} y={98} s={10.5} c={MUTED} align="center">
              Mo {month}
            </T>
          </span>
        );
      })}

      {[
        { text: `${CHECK_IN.name}, 20% off your next visit`, y: 122 },
        { text: "Refer a friend, get a free facial", y: 174 },
      ].map((bubble) => (
        <Box
          key={bubble.text}
          a="bubble"
          x={22}
          y={bubble.y}
          w={CARD_W - 44}
          h={40}
          style={{
            background: `linear-gradient(90deg, ${BLUE}, ${VIOLET})`,
            borderRadius: "14px 14px 14px 4px",
          }}
        >
          <Ico n="bubble" x={24} y={20} s={15} c="#fff" sw={2} />
          <T x={44} y={20} s={13} w={500} c="#fff">
            {bubble.text}
          </T>
        </Box>
      ))}
    </Card>
  );
}

export function CampaignArt({ layout }: { layout: CampaignLayout }) {
  const L = CAMPAIGN_LAYOUTS[layout];
  return (
    <>
      {/* the wires the campaign runs down, drawn under the cards */}
      <svg
        viewBox={`0 0 ${L.w} ${L.h}`}
        width={L.w}
        height={L.h}
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {L.wires.map((d) => (
          <path
            key={d}
            data-ca="wire"
            d={d}
            fill="none"
            stroke={LINE}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <CheckInCard x={L.form.x} y={L.form.y} />
      <ReviewCard x={L.review.x} y={L.review.y} />
      <FollowUpCard x={L.follow.x} y={L.follow.y} />
    </>
  );
}
