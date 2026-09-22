import { Box, Ico, INK, LINE, MUTED, T } from "../suite-mockup";

/**
 * SmartSync funnel — the "All Funnels" workspace screen.
 *
 * Traced from the client's recording with the browser chrome cropped off
 * (their tabs and bookmarks are not ours to publish): x is the recording's
 * position less 5, y less 120. The photographs on the cards are the client's
 * own treatment shots, not the recording's.
 */

export const FUNNEL_BOARD = { w: 1674, h: 784 };
export const F_BLUE = "#2F6FEB";
const PILL = "#F3F4F6";

type Card = {
  x: number;
  y: number;
  image: string;
  title: string;
  contacts: string;
  contactsW: number;
  hover?: boolean;
};

/**
 * One card per supplied photograph, each paired with the treatment it shows.
 * Three to a row — the grid's right edge lines up with the New Funnel button —
 * so the fourth wraps, the way the real workspace wraps.
 */
const CARDS: Card[] = [
  {
    x: 294,
    y: 200,
    image: "/images/funnel-editor-imgs/img3.jpeg",
    title: "BODY CONTOURING $37 - Appoi...",
    contacts: "371 Contacts",
    contactsW: 95,
  },
  {
    x: 671,
    y: 198,
    image: "/images/funnel-editor-imgs/img1.webp",
    title: "Hydrafacial $149 — Skin Diagnost...",
    contacts: "37 Contacts",
    contactsW: 90,
    hover: true,
  },
  {
    x: 1046,
    y: 200,
    image: "/images/funnel-editor-imgs/img4.jpeg",
    title: "Glow & Co. Hydrafacial-Special ...",
    contacts: "1 Contact",
    contactsW: 77,
  },
  {
    x: 294,
    y: 500,
    image: "/images/funnel-editor-imgs/img2.jpeg",
    title: "Microneedling $199 — Free Consu...",
    contacts: "128 Contacts",
    contactsW: 95,
  },
];

function FunnelCard({ card }: { card: Card }) {
  return (
    <div
      data-fa="card"
      style={{
        position: "absolute",
        left: card.x,
        top: card.y,
        width: 329,
        height: 280,
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        boxShadow: card.hover ? "0 10px 24px -12px rgba(17,24,39,.22)" : undefined,
      }}
    >
      <Box
        x={8}
        y={card.hover ? 7 : 9}
        w={313}
        h={147}
        style={{ borderRadius: 8, overflow: "hidden", background: "#0B0B0B" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a thumbnail inside a scaled mockup */}
        <img
          src={card.image}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </Box>

      {card.hover ? (
        <>
          {[257, 296].map((cx, i) => (
            <Box
              key={cx}
              x={cx - 13}
              y={17}
              w={26}
              h={26}
              style={{ background: "rgba(55,65,81,.82)", borderRadius: 6 }}
            >
              <Ico n={i === 0 ? "star" : "sparkle"} x={13} y={13} s={14} c="#fff" sw={2} />
            </Box>
          ))}
        </>
      ) : null}

      <T
        x={16}
        y={card.hover ? 183 : 185}
        s={19}
        w={500}
        c={INK}
        style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {card.title}
      </T>
      <T x={16} y={card.hover ? 207 : 209} s={13} c={MUTED}>
        Last edited at Sep 9, 2026
      </T>

      {(() => {
        const row = card.hover ? 230 : 232;
        return (
          <>
            <Box x={15} y={row} w={32} h={32} style={{ background: PILL, borderRadius: 6 }} />
            <Ico n="link" x={31} y={row + 16} s={14} c={MUTED} sw={2} />
            <Box x={55} y={row} w={45} h={32} style={{ background: "#ECFDF3", borderRadius: 6 }} />
            <T x={77.5} y={row + 16} s={13} c="#16A34A" align="center">
              Live
            </T>
            <Box
              x={108}
              y={row}
              w={card.contactsW}
              h={32}
              style={{ background: "#EFF6FF", borderRadius: 6 }}
            />
            <T x={108 + card.contactsW / 2} y={row + 16} s={13} c="#2563EB" align="center">
              {card.contacts}
            </T>
            <Ico n="dotsH" x={297} y={row + 16} s={20} c={INK} sw={2.5} />
          </>
        );
      })()}
    </div>
  );
}

export function FunnelListScreen() {
  return (
    <div
      style={{
        position: "relative",
        width: FUNNEL_BOARD.w,
        height: FUNNEL_BOARD.h,
        background: "#fff",
        overflow: "hidden",
        color: INK,
      }}
    >
      {/* workspace header */}
      <Box x={0} y={61} w={FUNNEL_BOARD.w} h={1} style={{ background: LINE }} />
      <Box x={15} y={14} w={32} h={32} style={{ border: `1px solid ${LINE}`, borderRadius: 8 }} />
      <Box x={23} y={22} w={16} h={16} style={{ borderRadius: "50%", background: "#E5E7EB" }} />
      <T x={62} y={30} s={15} w={600}>
        Beauty
      </T>
      <Ico n="updown" x={123} y={30} s={14} c={INK} sw={2} />

      <Box x={606} y={11} w={99} h={38} style={{ background: PILL, borderRadius: 8 }} />
      <Ico n="panel" x={625} y={30} s={17} c={INK} sw={2.2} />
      <T x={643} y={30} s={15} w={500}>
        Funnels
      </T>
      <Ico n="chart" x={737} y={30} s={17} c={MUTED} />
      <T x={755} y={30} s={15} c={MUTED}>
        Performance
      </T>
      <Ico n="msgSquare" x={881} y={30} s={17} c={MUTED} />
      <T x={899} y={30} s={15} c={MUTED}>
        Inbox
      </T>
      <Ico n="gift" x={978} y={30} s={17} c={MUTED} />
      <T x={996} y={30} s={15} c={MUTED}>
        Referrals
      </T>

      <Box x={1476} y={11} w={89} h={38} style={{ background: PILL, borderRadius: 8 }} />
      <Ico n="userPlus" x={1498} y={30} s={16} c={INK} />
      <T x={1514} y={30} s={15}>
        Invite
      </T>
      <Ico n="cap" x={1591} y={30} s={19} c={MUTED} />
      <Box
        x={1617}
        y={10}
        w={40}
        h={40}
        style={{
          borderRadius: "50%",
          background: F_BLUE,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        SM
      </Box>

      {/* title row */}
      <T x={294} y={135} s={29} w={700}>
        All Funnels
      </T>
      <Ico n="updown" x={461} y={136} s={16} c={INK} sw={2} />
      <Ico n="search" x={1179} y={134} s={22} c={INK} />
      <Ico n="list" x={1233} y={134} s={22} c={INK} />
      <Box x={1268} y={116} w={107} h={38} style={{ background: F_BLUE, borderRadius: 6 }} />
      <T x={1321.5} y={135} s={15} w={500} c="#fff" align="center">
        New Funnel
      </T>

      {CARDS.map((card) => (
        <FunnelCard key={card.title} card={card} />
      ))}
    </div>
  );
}
