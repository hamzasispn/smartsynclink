import { Box, Ico, INK, LINE, MUTED, T, type IconName } from "../suite-mockup";
import { F_BLUE, FUNNEL_BOARD } from "./list-screen";

/**
 * SmartSync funnel — the funnel editor, and the header it shares with Metrics.
 * Same crop as the list screen: recording x − 5, y − 120. The client's
 * business name, phone number and photo are replaced with invented ones.
 */

const PILL = "#F3F4F6";

type Tab = [IconName, string, number, number];

/** Icon centre and label start per tab; the two screens sit ~3px apart. */
const TABS: Record<"funnel" | "metrics", { tabs: Tab[]; pill: [number, number]; shift: number }> = {
  funnel: {
    tabs: [
      ["panel", "Funnel", 640, 658],
      ["chart", "Metrics", 745, 763],
      ["users", "Contacts", 855, 873],
      ["grid", "Apps", 975, 992],
    ],
    pill: [621, 91],
    shift: 0,
  },
  metrics: {
    tabs: [
      ["panel", "Funnel", 644, 662],
      ["chart", "Metrics", 748, 766],
      ["users", "Contacts", 859, 877],
      ["grid", "Apps", 978, 996],
    ],
    pill: [727, 98],
    shift: 3,
  },
};

export function AppHeader({ active }: { active: "funnel" | "metrics" }) {
  const { tabs, pill, shift } = TABS[active];
  const on = active === "funnel" ? "Funnel" : "Metrics";
  return (
    <>
      <Box x={0} y={62} w={FUNNEL_BOARD.w} h={1} style={{ background: LINE }} />
      <Ico n="home" x={27 + shift} y={32} s={20} c={INK} />
      <T x={60 + shift} y={32} s={17} w={600}>
        Hydrafacial $149 — Skin Diagnostic (Oak ...
      </T>
      <Box x={413 + shift * 4} y={16} w={67} h={32} style={{ background: PILL, borderRadius: 8 }} />
      <Ico n="sparkle" x={428 + shift * 4} y={32} s={13} c={INK} sw={2} />
      <T x={441 + shift * 4} y={32} s={14} w={500}>
        Beta
      </T>

      <Box x={pill[0]} y={13} w={pill[1]} h={38} style={{ background: PILL, borderRadius: 8 }} />
      {tabs.map(([icon, label, ix, lx]) => (
        <span key={label}>
          <Ico n={icon} x={ix} y={32} s={17} c={label === on ? INK : MUTED} sw={label === on ? 2.2 : 1.75} />
          <T x={lx} y={32} s={15} w={label === on ? 500 : 400} c={label === on ? INK : MUTED}>
            {label}
          </T>
        </span>
      ))}

      <Ico n="eye" x={1414 + shift} y={32} s={20} c={MUTED} />
      <Ico n="gear" x={1464 + shift} y={32} s={20} c={MUTED} />
      <Box x={1496 + shift} y={13} w={108} h={38} style={{ background: F_BLUE, borderRadius: "8px 0 0 8px" }} />
      <T x={1550 + shift} y={32} s={15} w={500} c="#fff" align="center">
        Publish
      </T>
      <Box x={1604 + shift} y={13} w={1} h={38} style={{ background: "rgba(255,255,255,.35)" }} />
      <Box x={1605 + shift} y={13} w={46} h={38} style={{ background: F_BLUE, borderRadius: "0 8px 8px 0" }} />
      <Ico n="zap" x={1628 + shift} y={32} s={16} c="#fff" fill="#fff" sw={1} />
    </>
  );
}

const PAGES = ["Start", "Concern", "Behavior", "Experience", "Reason", "Location", "Result", "Book"];
const GOLD = "#8B6F2E";

export function FunnelEditorScreen() {
  return (
    <div
      style={{
        position: "relative",
        width: FUNNEL_BOARD.w,
        height: FUNNEL_BOARD.h,
        background: "#FAFAFA",
        overflow: "hidden",
        color: INK,
      }}
    >
      <Box x={0} y={0} w={FUNNEL_BOARD.w} h={62} style={{ background: "#fff" }} />
      <AppHeader active="funnel" />

      {/* pages panel */}
      <Box
        x={3}
        y={70}
        w={364}
        h={740}
        style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12 }}
      />
      <Box x={24} y={87} w={320} h={41} style={{ background: PILL, borderRadius: 10 }} />
      <Box
        x={28}
        y={91}
        w={155}
        h={33}
        style={{ background: "#fff", borderRadius: 8, boxShadow: "0 1px 2px rgba(17,24,39,.08)" }}
      />
      <T x={105.5} y={107.5} s={15} w={500} align="center">
        Overview
      </T>
      <T x={262} y={107.5} s={15} c={MUTED} align="center">
        AI Chat
      </T>

      <T x={25} y={166} s={19} w={600}>
        Pages
      </T>
      <div
        data-fa="page-active"
        style={{ position: "absolute", left: 24, top: 194, width: 320, height: 40, background: "#EFF6FF", borderRadius: 8 }}
      />
      {PAGES.map((page, i) => {
        const y = 214 + i * 42.4;
        return (
          <span key={page}>
            <T x={43} y={y} s={13} c={i === 0 ? "#3B82F6" : "#9CA3AF"}>
              {i + 1}
            </T>
            <T x={63} y={y} s={15} c={i === 0 ? "#2563EB" : "#4B5563"}>
              {page}
            </T>
          </span>
        );
      })}

      <T x={25} y={590} s={19} w={600}>
        Results
      </T>
      <T x={43} y={638} s={13} c="#9CA3AF">
        A
      </T>
      <T x={63} y={638} s={15} c="#4B5563">
        Confirmed
      </T>
      <T x={25} y={718} s={19} w={600}>
        Messages
      </T>
      <Ico n="plusPlain" x={47} y={774} s={14} c={MUTED} sw={2} />
      <T x={63} y={774} s={15} c={MUTED}>
        New message
      </T>

      {/* the page itself, as a phone-width preview */}
      <div
        data-fa="preview"
        style={{
          position: "absolute",
          left: 830,
          top: 110,
          width: 370,
          height: 720,
          background: "#fff",
          border: "1px solid #EEF0F3",
          borderRadius: 16,
          boxShadow: "0 12px 32px -18px rgba(17,24,39,.18)",
          overflow: "hidden",
        }}
      >
        <T x={19} y={31} s={14} w={600} c="#3A3A3A" style={{ fontFamily: "Georgia, serif" }}>
          Glow &amp; Co.
        </T>
        <T x={19} y={44} s={5} c="#8A8A8A" style={{ letterSpacing: 1 }}>
          AESTHETICS &amp; WELLNESS
        </T>
        <Ico n="phone" x={255} y={32} s={14} c="#7A5C1E" sw={2} />
        <T x={268} y={32} s={13} w={600} c="#7A5C1E">
          (512) 555-0142
        </T>

        <T x={185} y={104} s={12} w={600} c={GOLD} align="center" style={{ letterSpacing: 2.4 }}>
          FIRST-TIME HYDRAFACIAL · $149{" "}
          <span style={{ color: "#C9BC9F", textDecoration: "line-through" }}>REG. $220</span>
        </T>

        {["Your first", "Hydrafacial,", "guided by a real"].map((line, i) => (
          <T key={line} x={185} y={149 + i * 36.7} s={36} w={800} c="#1F2A24" align="center" style={{ letterSpacing: -1 }}>
            {line}
          </T>
        ))}
        <T x={185} y={259} s={36} w={800} c="#1F2A24" align="center" style={{ letterSpacing: -1 }}>
          <span style={{ color: "#B08A3E", fontStyle: "italic" }}>skin analysis</span>.
        </T>

        {[
          "Most facials start with a guess. Yours starts",
          "with a professional skin analysis — and five",
          "quick questions that get sent ahead to",
          "your esthetician.",
        ].map((line, i) => (
          <T key={line} x={185} y={308 + i * 25} s={16} c="#4B5563" align="center">
            {line}
          </T>
        ))}

        <div
          data-fa="cta"
          style={{
            position: "absolute",
            left: 19,
            top: 428,
            width: 332,
            height: 46,
            borderRadius: 23,
            background: "linear-gradient(180deg, #94722F, #7A5C22)",
            boxShadow: "0 6px 14px -8px rgba(122,92,34,.8)",
          }}
        >
          <T x={158} y={23} s={16} w={600} c="#fff" align="center">
            Start my skin check
          </T>
          <Ico n="arrowR" x={251} y={23} s={16} c="#fff" sw={2.2} />
        </div>
        <T x={185} y={493} s={11.5} c="#9CA3AF" align="center">
          5 quick questions · about 60 seconds · no card required
        </T>
        <T x={185} y={509} s={11.5} c="#9CA3AF" align="center">
          to start
        </T>

        <Box x={20} y={553} w={330} h={180} style={{ borderRadius: 12, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a photo inside a scaled mockup */}
          <img
            src="/images/industries/medspa/3.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </Box>
      </div>
    </div>
  );
}
