import { useId } from "react";

/**
 * The cards we take, under every plan button, drawn to the brands' own artwork:
 * the Visa wordmark with its navy-to-blue gradient in a hairline box, the
 * Mastercard interlocking circles, and the American Express blue box.
 * Inline SVG, so no image requests.
 */

/** A light box with a hairline edge, the way the Visa artwork is supplied. */
function Frame({ w, label, children, fill = "#fff" }: { w: number; label: string; children: React.ReactNode; fill?: string }) {
  return (
    <svg viewBox={`0 0 ${w} 24`} width={w} height={24} role="img" aria-label={label} className="shrink-0">
      <rect x="0.5" y="0.5" width={w - 1} height="23" rx="2" fill={fill} stroke={fill === "#fff" ? "#D4D4D4" : fill} />
      {children}
    </svg>
  );
}

function Visa() {
  // useId keeps the gradient unique: every plan card on a page draws its own copy
  const id = `visa-${useId().replace(/:/g, "")}`;
  return (
    <Frame w={72} label="Visa">
      {/* wordmark traced on the supplied artwork's grid; the box pads it as the artwork does */}
      <svg x="1.7" y="1" width="68.6" height="22" viewBox="272 431 1540 497" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="272" y1="927" x2="1812" y2="431">
            <stop stopColor="#222357" />
            <stop offset="1" stopColor="#254AA5" />
          </linearGradient>
        </defs>
        <g fill={`url(#${id})`}>
          {/* V */}
          <path d="M275 439H487C516 439 540 457 545 490L597 766L726 439H857L656 919H524L424 533C416 503 408 494 390 484C356 466 310 454 273 453Z" />
          {/* I */}
          <path d="M910 439H1034L932 919H808Z" />
          {/* S */}
          <path d="M1394 452C1368 442 1330 431 1279 431C1150 431 1068 499 1068 590C1067 659 1128 698 1175 720C1223 743 1241 758 1241 780C1241 811 1203 826 1167 826C1105 827 1070 811 1040 797L1017 901C1046 915 1100 927 1157 927C1290 927 1371 861 1372 763C1372 637 1197 630 1197 573C1197 556 1215 531 1272 531C1318 531 1350 542 1373 553Z" />
          {/* A, with its counter cut out */}
          <path
            fillRule="evenodd"
            d="M1605 439H1711L1812 919H1697L1682 848H1522L1496 919H1366L1551 476C1560 455 1580 439 1605 439ZM1558 749H1661L1622 569Z"
          />
        </g>
      </svg>
    </Frame>
  );
}

function Mastercard() {
  // the official symbol: equal circles whose centres sit ~1.02 radii apart
  return (
    <Frame w={38} label="Mastercard">
      <circle cx="14.8" cy="12" r="8.2" fill="#EB001B" />
      <circle cx="23.2" cy="12" r="8.2" fill="#F79E1B" />
      <path d="M19 4.96A8.2 8.2 0 0 1 19 19.04A8.2 8.2 0 0 1 19 4.96Z" fill="#FF5F00" />
    </Frame>
  );
}

function Amex() {
  // the blue box: the two-line wordmark set tight and heavy, stretched to the box like the logo
  const line = {
    x: 19,
    textAnchor: "middle" as const,
    fill: "#fff",
    fontFamily: "'Arial Black', Arial, Helvetica, sans-serif",
    fontSize: 6.2,
    fontWeight: 900,
    textLength: 30,
    lengthAdjust: "spacingAndGlyphs" as const,
  };
  return (
    <Frame w={38} label="American Express" fill="#006FCF">
      <text y="11.3" {...line}>
        AMERICAN
      </text>
      <text y="18.2" {...line}>
        EXPRESS
      </text>
    </Frame>
  );
}

export function PaymentMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Visa />
      <Mastercard />
      <Amex />
    </div>
  );
}
