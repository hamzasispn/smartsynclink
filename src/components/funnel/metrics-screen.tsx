import { Box, Ico, INK, LINE, MUTED, T, TEXT } from "../suite-mockup";
import { AppHeader } from "./editor-screen";
import { F_BLUE, FUNNEL_BOARD } from "./list-screen";

/**
 * SmartSync funnel — Metrics. Same crop as the other two screens.
 *
 * The numbers are the client's own showcase figures. Bars, values and the drop
 * off pills carry data-fa hooks: the section counts the values up and grows
 * the bars from the baseline each time this screen comes round.
 */

export const KPIS: { label: string; value: string; to: number; suffix?: string; info: number; arrow: boolean }[] = [
  { label: "Funnel Visits", value: "1,937", to: 1937, info: 134, arrow: true },
  { label: "New Conversions", value: "39", to: 39, info: 170, arrow: true },
  { label: "Conversion Rate", value: "2.01", to: 2.01, suffix: "%", info: 162, arrow: false },
  { label: "Messages Sent", value: "0", to: 0, info: 154, arrow: true },
];

export const STAGES = ["Start", "Concern", "Behavior", "Experience", "Reason", "Location", "Result", "Book", "Confirmed"];
const BAR_X = [353, 477, 601, 726, 850, 975, 1099, 1224, 1349];
export const BAR_H = [185, 28, 22, 21, 21, 21, 20, 11, 3];
export const DROPS = ["15%", "78%", "94%", "99%", "98%", "95%", "60%", "33%"];
const DROP_Y = [522, 603, 608, 609, 608, 609, 614, 621];
const BASE = 621;

export function FunnelMetricsScreen() {
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
      <AppHeader active="metrics" />

      <T x={229} y={120} s={29} w={700}>
        Metrics
      </T>
      <Box x={1234} y={101} w={106} h={38} style={{ border: `1px solid ${LINE}`, borderRadius: 8 }} />
      <T x={1250} y={120} s={14} c={TEXT}>
        All time
      </T>
      <Ico n="updown" x={1315} y={120} s={13} c={TEXT} sw={2} />
      <Box x={1350} y={101} w={36} h={38} style={{ border: `1px solid ${LINE}`, borderRadius: 8 }} />
      <Ico n="dotsH" x={1368} y={120} s={18} c={TEXT} sw={2.5} />
      <Box x={1396} y={101} w={38} h={38} style={{ background: F_BLUE, borderRadius: 8 }} />
      <Ico n="plusPlain" x={1415} y={120} s={18} c="#fff" sw={2.2} />

      {KPIS.map((kpi, i) => {
        const x = 229 + i * 307;
        return (
          <div
            key={kpi.label}
            data-fa="kpi"
            style={{
              position: "absolute",
              left: x,
              top: 163,
              width: 284,
              height: 147,
              border: `1px solid ${LINE}`,
              borderRadius: 12,
              boxShadow: "0 1px 2px rgba(17,24,39,.04)",
            }}
          >
            <T x={23} y={32} s={16} c={TEXT}>
              {kpi.label}
            </T>
            <Ico n="info" x={kpi.info} y={32} s={15} c="#9CA3AF" />
            {kpi.arrow ? <Ico n="arrowUR" x={245} y={32} s={16} c={TEXT} /> : null}
            <T x={23} y={77} s={36} w={600} c={INK}>
              <span data-fa="count" data-to={kpi.to} data-decimals={kpi.suffix ? 2 : 0}>
                {kpi.value}
              </span>
              {kpi.suffix ? <span style={{ fontSize: 18, marginLeft: 1 }}>{kpi.suffix}</span> : null}
            </T>
            <T x={23} y={121} s={14} c={MUTED}>
              No comparison data
            </T>
          </div>
        );
      })}

      {/* page to page conversion */}
      <Box x={229} y={335} w={1205} h={345} style={{ border: `1px solid ${LINE}`, borderRadius: 12 }} />
      <T x={252} y={372} s={16} c={TEXT}>
        Page to Page Conversion Rate
      </T>
      <Ico n="info" x={492} y={372} s={15} c="#9CA3AF" />

      {["2,000", "1,500", "1,000", "500", "0"].map((label, i) => (
        <span key={label}>
          <T x={283} y={430 + i * 47.75} s={12.5} c={TEXT} align="right">
            {label}
          </T>
          {i < 4 ? (
            <Box x={300} y={430 + i * 47.75} w={1110} h={1} style={{ background: "#F3F4F6" }} />
          ) : null}
        </span>
      ))}

      <svg
        aria-hidden="true"
        width={FUNNEL_BOARD.w}
        height={FUNNEL_BOARD.h}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <polygon points="371,436 459,593 459,621 371,621" fill="rgba(47,111,235,.07)" />
      </svg>

      {BAR_X.map((cx, i) => (
        <div
          key={STAGES[i]}
          data-fa="bar"
          style={{
            position: "absolute",
            left: cx - 18,
            top: BASE - BAR_H[i],
            width: 36,
            height: BAR_H[i],
            background: F_BLUE,
            borderRadius: BAR_H[i] > 8 ? 6 : 2,
            transformOrigin: "50% 100%",
          }}
        />
      ))}

      {DROPS.map((drop, i) => (
        <div
          key={drop + i}
          data-fa="drop"
          style={{
            position: "absolute",
            left: (BAR_X[i] + BAR_X[i + 1]) / 2 - 22,
            top: DROP_Y[i] - 8,
            width: 44,
            height: 16,
            background: "#F3F4F6",
            borderRadius: 4,
          }}
        >
          <Ico n="trendDown" x={9} y={8} s={9} c="#4B5563" sw={2.5} />
          <T x={16} y={8} s={10.5} c="#4B5563">
            {drop}
          </T>
        </div>
      ))}

      {STAGES.map((stage, i) => (
        <T key={stage} x={BAR_X[i]} y={648} s={13} c={TEXT} align="center">
          {stage}
        </T>
      ))}

      {/* conversion over time — cut by the board edge, as in the recording */}
      <Box x={229} y={705} w={1205} h={120} style={{ border: `1px solid ${LINE}`, borderRadius: 12 }} />
      <T x={252} y={742} s={16} c={TEXT}>
        Conversion Rate Over Time
      </T>
      <Ico n="info" x={470} y={742} s={15} c="#9CA3AF" />
      {(
        [
          ["Visitors", 253, "#E5E7EB", false],
          ["Leads", 336, F_BLUE, true],
          ["Conversion Rate", 400, "#7C3AED", true],
        ] as [string, number, string, boolean][]
      ).map(([label, x, color, checked]) => (
        <span key={label}>
          <Box
            x={x - 8}
            y={763}
            w={16}
            h={16}
            style={{
              borderRadius: 4,
              background: checked ? color : "#fff",
              border: checked ? "none" : `1.5px solid ${color}`,
            }}
          />
          {checked ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              width={16}
              height={16}
              style={{ position: "absolute", left: x - 8, top: 763 }}
            >
              <path d="M4 8.5 6.8 11 12 5.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
          <T x={x + 20} y={771} s={13} c={checked ? TEXT : "#9CA3AF"}>
            {label}
          </T>
        </span>
      ))}
    </div>
  );
}
