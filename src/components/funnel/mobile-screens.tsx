import { Box, Ico, INK, LINE, MUTED, T, TEXT, type IconName } from "../suite-mockup";
import { PAGES, PagePreview } from "./editor-screen";
import { CARDS, F_BLUE } from "./list-screen";
import { BAR_H, DROPS, KPIS, STAGES } from "./metrics-screen";

/**
 * The three SmartSync funnel screens, laid out for a phone.
 *
 * The desktop screens are a 1674px board; on a phone that scales to a fifth
 * and nothing on it reads. These are the same screens re-arranged at phone
 * width — the same funnels, pages and figures, from the desktop files — so on
 * a phone they draw at nearly full size. They carry the same data-fa hooks,
 * so the showcase animates them the same way.
 */
export const FUNNEL_MOBILE = { w: 390, h: 720 };

const PILL = "#F3F4F6";

function Screen({ bg = "#fff", children }: { bg?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: FUNNEL_MOBILE.w,
        height: FUNNEL_MOBILE.h,
        background: bg,
        overflow: "hidden",
        color: INK,
      }}
    >
      {children}
    </div>
  );
}

/** A row of tabs under the top bar, the active one on a pill. */
function Tabs({ tabs, active }: { tabs: [IconName, string][]; active: string }) {
  const w = (FUNNEL_MOBILE.w - 24) / tabs.length;
  return (
    <>
      <Box x={0} y={52} w={FUNNEL_MOBILE.w} h={44} style={{ background: "#fff" }} />
      {tabs.map(([icon, label], i) => {
        const x = 12 + i * w;
        const on = label === active;
        return (
          <span key={label}>
            {on ? <Box x={x + 2} y={58} w={w - 4} h={32} style={{ background: PILL, borderRadius: 8 }} /> : null}
            <Ico n={icon} x={x + 18} y={74} s={14} c={on ? INK : MUTED} sw={on ? 2.2 : 1.75} />
            <T x={x + 30} y={74} s={12.5} w={on ? 500 : 400} c={on ? INK : MUTED}>
              {label}
            </T>
          </span>
        );
      })}
      <Box x={0} y={96} w={FUNNEL_MOBILE.w} h={1} style={{ background: LINE }} />
    </>
  );
}

/** The funnel's own top bar: home, its name, Publish; then its tabs. */
function FunnelHeader({ active }: { active: "Funnel" | "Metrics" }) {
  return (
    <>
      <Box x={0} y={0} w={FUNNEL_MOBILE.w} h={52} style={{ background: "#fff" }} />
      <Ico n="home" x={22} y={26} s={18} c={INK} />
      <T x={42} y={26} s={14} w={600} style={{ maxWidth: 232, overflow: "hidden", textOverflow: "ellipsis" }}>
        Hydrafacial $149 — Skin Diagnostic (Oak ...
      </T>
      <Box x={290} y={10} w={86} h={32} style={{ background: F_BLUE, borderRadius: 8 }} />
      <T x={333} y={26} s={13.5} w={500} c="#fff" align="center">
        Publish
      </T>
      <Tabs
        active={active}
        tabs={[
          ["panel", "Funnel"],
          ["chart", "Metrics"],
          ["users", "Contacts"],
          ["grid", "Apps"],
        ]}
      />
    </>
  );
}

/* ------------------------------------------------------------------ list -- */

const CARD = { w: 173, h: 168, gap: 12, top: 156 };

export function FunnelListMobile() {
  return (
    <Screen>
      {/* workspace bar */}
      <Box x={16} y={10} w={32} h={32} style={{ border: `1px solid ${LINE}`, borderRadius: 8 }} />
      <Box x={24} y={18} w={16} h={16} style={{ borderRadius: "50%", background: "#E5E7EB" }} />
      <T x={60} y={26} s={15} w={600}>
        Beauty
      </T>
      <Ico n="updown" x={115} y={26} s={13} c={INK} sw={2} />
      <Box
        x={342}
        y={10}
        w={32}
        h={32}
        style={{
          borderRadius: "50%",
          background: F_BLUE,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        SM
      </Box>
      <Tabs
        active="Funnels"
        tabs={[
          ["panel", "Funnels"],
          ["chart", "Performance"],
          ["msgSquare", "Inbox"],
        ]}
      />

      <T x={16} y={128} s={22} w={700}>
        All Funnels
      </T>
      <Ico n="updown" x={143} y={129} s={14} c={INK} sw={2} />
      <Box x={272} y={111} w={102} h={34} style={{ background: F_BLUE, borderRadius: 6 }} />
      <T x={323} y={128} s={13.5} w={500} c="#fff" align="center">
        New Funnel
      </T>

      {/* every funnel, two to a row */}
      {CARDS.map((card, i) => (
        <div
          key={card.title}
          data-fa="card"
          style={{
            position: "absolute",
            left: 16 + (i % 2) * (CARD.w + CARD.gap),
            top: CARD.top + Math.floor(i / 2) * (CARD.h + CARD.gap),
            width: CARD.w,
            height: CARD.h,
            background: "#fff",
            border: `1px solid ${LINE}`,
            borderRadius: 10,
            boxShadow: card.hover ? "0 10px 24px -12px rgba(17,24,39,.22)" : undefined,
          }}
        >
          <Box x={6} y={6} w={CARD.w - 14} h={80} style={{ borderRadius: 7, overflow: "hidden", background: "#0B0B0B" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a thumbnail inside a scaled mockup */}
            <img
              src={card.image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>
          <T
            x={10}
            y={102}
            s={12.5}
            w={600}
            c={INK}
            style={{ maxWidth: CARD.w - 20, overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {card.title}
          </T>
          <T x={10} y={120} s={10.5} c={MUTED}>
            Edited Sep 9, 2026
          </T>
          <Box x={10} y={134} w={34} h={24} style={{ background: "#ECFDF3", borderRadius: 5 }} />
          <T x={27} y={146} s={10.5} c="#16A34A" align="center">
            Live
          </T>
          <Box x={50} y={134} w={90} h={24} style={{ background: "#EFF6FF", borderRadius: 5 }} />
          <T x={95} y={146} s={10.5} c="#2563EB" align="center">
            {card.contacts.toLocaleString("en-US")} Contacts
          </T>
          <Ico n="dotsH" x={155} y={146} s={14} c={INK} sw={2.5} />
        </div>
      ))}
    </Screen>
  );
}

/* ---------------------------------------------------------------- editor -- */

const STEP = { x: 16, w: (FUNNEL_MOBILE.w - 32 - 7 * 5) / 8, gap: 5 };

export function FunnelEditorMobile() {
  return (
    <Screen bg="#FAFAFA">
      <FunnelHeader active="Funnel" />

      <T x={16} y={116} s={15} w={600}>
        Pages
      </T>
      <T x={374} y={116} s={11.5} c={MUTED} align="right">
        {PAGES.length} pages · 1 result
      </T>
      {/* the pages as steps; the showcase lights them in turn, the way a
          visitor moves through them */}
      {PAGES.map((page, i) => (
        <div
          key={page}
          data-fa="page-step"
          style={{
            position: "absolute",
            left: STEP.x + i * (STEP.w + STEP.gap),
            top: 134,
            width: STEP.w,
            height: 6,
            borderRadius: 3,
            background: F_BLUE,
          }}
        />
      ))}
      <T x={16} y={154} s={11} w={500} c="#2563EB">
        1 · {PAGES[0]}
      </T>
      <T x={374} y={154} s={11} c={MUTED} align="right">
        {PAGES.length} · {PAGES[PAGES.length - 1]}
      </T>

      <PagePreview x={10} y={172} h={FUNNEL_MOBILE.h - 172 + 16} />
    </Screen>
  );
}

/* --------------------------------------------------------------- metrics -- */

const KPI = { w: 173, h: 92, gap: 12, top: 150 };
const ROW = { top: 408, h: 32, barX: 110, barW: 180 };

export function FunnelMetricsMobile() {
  return (
    <Screen>
      <FunnelHeader active="Metrics" />

      <T x={16} y={124} s={22} w={700}>
        Metrics
      </T>
      <Box x={214} y={108} w={96} h={32} style={{ border: `1px solid ${LINE}`, borderRadius: 8 }} />
      <T x={226} y={124} s={12.5} c={TEXT}>
        All time
      </T>
      <Ico n="updown" x={295} y={124} s={12} c={TEXT} sw={2} />
      <Box x={316} y={108} w={26} h={32} style={{ border: `1px solid ${LINE}`, borderRadius: 8 }} />
      <Ico n="dotsH" x={329} y={124} s={14} c={TEXT} sw={2.5} />
      <Box x={348} y={108} w={26} h={32} style={{ background: F_BLUE, borderRadius: 8 }} />
      <Ico n="plusPlain" x={361} y={124} s={14} c="#fff" sw={2.2} />

      {KPIS.map((kpi, i) => (
        <div
          key={kpi.label}
          data-fa="kpi"
          style={{
            position: "absolute",
            left: 16 + (i % 2) * (KPI.w + KPI.gap),
            top: KPI.top + Math.floor(i / 2) * (KPI.h + KPI.gap),
            width: KPI.w,
            height: KPI.h,
            border: `1px solid ${LINE}`,
            borderRadius: 12,
            boxShadow: "0 1px 2px rgba(17,24,39,.04)",
          }}
        >
          <T x={14} y={22} s={12} c={TEXT}>
            {kpi.label}
          </T>
          {kpi.arrow ? <Ico n="arrowUR" x={156} y={22} s={13} c={TEXT} /> : null}
          <T x={14} y={52} s={26} w={600} c={INK}>
            <span data-fa="count" data-to={kpi.to} data-decimals={kpi.suffix ? 2 : 0}>
              {kpi.value}
            </span>
            {kpi.suffix ? <span style={{ fontSize: 14, marginLeft: 1 }}>{kpi.suffix}</span> : null}
          </T>
          <T x={14} y={76} s={10.5} c={MUTED}>
            No comparison data
          </T>
        </div>
      ))}

      {/* page to page conversion, as rows: a bar chart this narrow is nine
          slivers, so the stages run down the card instead of across it */}
      <Box x={16} y={358} w={358} h={348} style={{ border: `1px solid ${LINE}`, borderRadius: 12 }} />
      <T x={30} y={382} s={13} c={TEXT}>
        Page to Page Conversion Rate
      </T>
      {STAGES.map((stage, i) => {
        const y = ROW.top + i * ROW.h + ROW.h / 2;
        return (
          <span key={stage}>
            <T x={30} y={y} s={11.5} c={TEXT}>
              {stage}
            </T>
            <Box x={ROW.barX} y={y - 7} w={ROW.barW} h={14} style={{ background: "#F3F4F6", borderRadius: 4 }} />
            <div
              data-fa="hbar"
              style={{
                position: "absolute",
                left: ROW.barX,
                top: y - 7,
                width: Math.max(3, (BAR_H[i] / BAR_H[0]) * ROW.barW),
                height: 14,
                background: F_BLUE,
                borderRadius: 4,
                transformOrigin: "0 50%",
              }}
            />
            {i ? (
              <div
                data-fa="drop"
                style={{
                  position: "absolute",
                  left: 304,
                  top: y - 9,
                  width: 54,
                  height: 18,
                  background: "#F3F4F6",
                  borderRadius: 4,
                }}
              >
                <Ico n="trendDown" x={11} y={9} s={10} c="#4B5563" sw={2.5} />
                <T x={20} y={9} s={11} c="#4B5563">
                  {DROPS[i - 1]}
                </T>
              </div>
            ) : (
              <T x={358} y={y} s={11.5} w={500} c={INK} align="right">
                {KPIS[0].value}
              </T>
            )}
          </span>
        );
      })}
    </Screen>
  );
}
