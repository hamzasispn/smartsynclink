import { Poppins } from "next/font/google";

// The wordmark is set in Poppins in the supplied logo sheet — Inter's "S" and
// "y" are visibly different, so the site font would not pass as the logo.
const poppins = Poppins({ subsets: ["latin"], weight: ["500"], display: "swap" });

/**
 * The SmartSync Suite mark, drawn from the logo sheet on a 148 grid:
 * a gradient tile, a white inner square, and a corner bracket along its top
 * and right edges, 9 in from each side.
 *
 * `id` must be unique on the page. The gradient is referenced by id, and when
 * two marks share one Chrome paints the second from the first — which fails
 * outright if the first sits inside a display:none copy (the mobile-only phone).
 */
export function SuiteMark({
  id,
  size = 40,
  inverse = false,
  className = "",
}: {
  id: string;
  size?: number;
  /** For use on the brand gradient: white tile, gradient square, white bracket. */
  inverse?: boolean;
  className?: string;
}) {
  const grad = `url(#${id})`;
  return (
    <svg
      viewBox="0 0 148 148"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="148" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#052EFF" />
          <stop offset="1" stopColor="#3300EA" />
        </linearGradient>
      </defs>
      <rect width="148" height="148" rx="30" fill={inverse ? "#fff" : grad} />
      <rect x="31" y="31" width="86" height="86" rx="11" fill={inverse ? grad : "#fff"} />
      <path d="M40 45H103V108" fill="none" stroke={inverse ? "#fff" : grad} strokeWidth="10" />
    </svg>
  );
}


/**
 * The SmartSync funnel mark, from its logo sheet on the same 148 grid: two
 * tapering bands over a short stem. Each shape is filled and stroked in the
 * same colour so the sheet's softly rounded corners come for free; the
 * coordinates sit 2 inside the traced edges to pay for the stroke.
 */
export function FunnelMark({
  id,
  size = 40,
  inverse = false,
  className = "",
}: {
  id: string;
  size?: number;
  inverse?: boolean;
  className?: string;
}) {
  const grad = `url(#${id})`;
  const ink = inverse ? grad : "#fff";
  return (
    <svg
      viewBox="0 0 148 148"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="148" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#052EFF" />
          <stop offset="1" stopColor="#3300EA" />
        </linearGradient>
      </defs>
      <rect width="148" height="148" rx="30" fill={inverse ? "#fff" : grad} />
      <g fill={ink} stroke={ink} strokeWidth="4" strokeLinejoin="round">
        <path d="M27 34H121L108 54H40Z" />
        <path d="M44 66H104L93 81H55Z" />
        <rect x="55" y="92" width="38" height="21" />
      </g>
    </svg>
  );
}

/** Mark + wordmark ("SmartSync Suite" or "SmartSync funnel"), spaced the way the logo sheet spaces them. */
export function SuiteLockup({
  id,
  size = 40,
  inverse = false,
  product = "suite",
  className = "",
}: {
  id: string;
  /** Which product the lockup names. Both share the wordmark treatment. */
  product?: "suite" | "funnel";
  size?: number;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: size * 0.25 }}
      aria-label={product === "funnel" ? "SmartSync funnel" : "SmartSync Suite"}
      role="img"
    >
      {product === "funnel" ? (
        <FunnelMark id={id} size={size} inverse={inverse} />
      ) : (
        <SuiteMark id={id} size={size} inverse={inverse} />
      )}
      <span
        className={poppins.className}
        style={{
          fontSize: size * 0.92,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          color: inverse ? "#fff" : "#000",
          fontWeight: 500,
        }}
      >
        {product === "funnel" ? "SmartSync funnel" : "SmartSync Suite"}
      </span>
    </span>
  );
}
