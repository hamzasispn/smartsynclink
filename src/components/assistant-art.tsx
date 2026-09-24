"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

/** A four-point sparkle centred on x, y. */
const sparkle = (x: number, y: number, s: number) =>
  `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;

/** The orb's centre and radius, and the ellipse the badges travel. */
const C = { x: 180, y: 118 };
const R = 58;
const ORBIT = { rx: 150, ry: 80 };

/** Mouth waveform bar heights, left to right. */
const BARS = [6, 12, 18, 12, 6];

/**
 * What Sofia handles, orbiting her, each drawn in a 24-unit box. Their
 * starting angles spread them evenly; the orbit never crosses the orb, so
 * there is no front and back to sort — nearer ones are just larger.
 */
const BADGES = [
  {
    label: "calls",
    at: -135,
    icon: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  },
  {
    label: "messages",
    at: -45,
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
  {
    label: "bookings",
    at: 45,
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
  },
  {
    label: "after hours",
    at: 135,
    icon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  },
];

const DEG = Math.PI / 180;
const onOrbit = (a: number) => ({
  x: C.x + ORBIT.rx * Math.cos(a),
  y: C.y + ORBIT.ry * Math.sin(a),
  // 0 at the top of the ellipse (furthest away), 1 at the bottom (nearest)
  near: (Math.sin(a) + 1) / 2,
});

/**
 * The illustration in Sofia's band: an AI orb, in the family of the closing
 * call-to-action's — a dark core under a turning neon rim — with her face on
 * it, a waveform for a mouth that moves as she talks, and what she handles
 * (calls, messages, bookings, after hours) circling her. The markup is the
 * resting frame, so reduced motion still gets the whole picture.
 */
export function AssistantArt({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGsap(ref, (gsap, el) => {
    const q = gsap.utils.selector(el);
    const origin = `${C.x} ${C.y}`;

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      })
      .from(q("[data-art=orb]"), { scale: 0.6, autoAlpha: 0, duration: 1, svgOrigin: origin })
      .from(q("[data-art=orbit]"), { autoAlpha: 0, duration: 0.8 }, "-=0.5")
      .from(q("[data-art=spark]"), { scale: 0, autoAlpha: 0, duration: 0.5, stagger: 0.1, transformOrigin: "50% 50%" }, "-=0.4");

    // the rim turns, the orb breathes
    gsap.to(q("[data-art=bloom]"), { rotation: 360, svgOrigin: origin, duration: 14, ease: "none", repeat: -1 });
    gsap.to(q("[data-art=core]"), { scale: 1.035, svgOrigin: origin, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // she talks, and now and then she blinks
    q("[data-art=bar]").forEach((bar: Element, i: number) =>
      gsap.to(bar, { scaleY: 0.3, duration: 0.3 + i * 0.06, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1, transformOrigin: "50% 50%" }),
    );
    gsap
      .timeline({ repeat: -1, repeatDelay: 3.6, delay: 1.5 })
      .to(q("[data-art=eye]"), { scaleY: 0.12, duration: 0.09, transformOrigin: "50% 50%" })
      .to(q("[data-art=eye]"), { scaleY: 1, duration: 0.12 });

    // what she handles, going round
    const badges = q("[data-orbit]");
    const spin = { t: 0 };
    gsap.to(spin, {
      t: 1,
      duration: 26,
      ease: "none",
      repeat: -1,
      onUpdate: () =>
        badges.forEach((badge: Element, i: number) => {
          const p = onOrbit(BADGES[i].at * DEG + spin.t * Math.PI * 2);
          gsap.set(badge, {
            x: p.x,
            y: p.y,
            scale: 0.78 + 0.22 * p.near,
            opacity: 0.55 + 0.45 * p.near,
            transformOrigin: "50% 50%",
          });
        }),
    });

    q("[data-art=spark]").forEach((spark: Element, i: number) =>
      gsap.to(spark, { scale: 0.55, autoAlpha: 0.55, duration: 1.2 + i * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2, transformOrigin: "50% 50%" }),
    );
  });

  return (
    <svg ref={ref} viewBox="0 0 360 215" className={className} aria-hidden="true" fill="none">
      <defs>
        <radialGradient id="aa-glow">
          <stop stopColor="#7C6BFF" stopOpacity=".5" />
          <stop offset="1" stopColor="#7C6BFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="aa-core" cx=".42" cy=".36" r=".7">
          <stop stopColor="#2B2456" />
          <stop offset=".62" stopColor="#15151F" />
          <stop offset="1" stopColor="#0B0B12" />
        </radialGradient>
        <linearGradient id="aa-rim" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22D3EE" />
          <stop offset=".5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="aa-voice" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#F0ABFC" />
        </linearGradient>
        <filter id="aa-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
      </defs>

      <circle cx={C.x} cy={C.y} r="112" fill="url(#aa-glow)" />
      <ellipse
        cx={C.x}
        cy={C.y}
        rx={ORBIT.rx}
        ry={ORBIT.ry}
        stroke="#fff"
        strokeOpacity=".22"
        strokeWidth=".8"
        strokeDasharray="3.5 3.5"
      />

      <g data-art="orb">
        {/* the neon rim: four colours turning behind the core, blurred into one */}
        <g data-art="bloom" filter="url(#aa-blur)">
          <circle cx={C.x - 22} cy={C.y - 18} r="42" fill="#22D3EE" />
          <circle cx={C.x + 24} cy={C.y - 20} r="42" fill="#8B5CF6" />
          <circle cx={C.x + 22} cy={C.y + 22} r="42" fill="#EC4899" />
          <circle cx={C.x - 24} cy={C.y + 20} r="42" fill="#3B82F6" />
        </g>

        <g data-art="core">
          <circle cx={C.x} cy={C.y} r={R} fill="url(#aa-core)" />
          <circle cx={C.x} cy={C.y} r={R} stroke="url(#aa-rim)" strokeWidth="1.4" strokeOpacity=".75" />
          {/* glass */}
          <ellipse cx={C.x - 20} cy={C.y - 34} rx="22" ry="8" fill="#fff" fillOpacity=".1" transform={`rotate(-24 ${C.x - 20} ${C.y - 34})`} />

          {/* her face: two eyes, and a voice for a mouth */}
          <rect data-art="eye" x={C.x - 19} y={C.y - 20} width="9" height="16" rx="4.5" fill="#fff" />
          <rect data-art="eye" x={C.x + 10} y={C.y - 20} width="9" height="16" rx="4.5" fill="#fff" />
          {BARS.map((h, i) => (
            <rect
              key={i}
              data-art="bar"
              x={C.x - 14.6 + i * 6}
              y={C.y + 16 - h / 2}
              width="3.2"
              height={h}
              rx="1.6"
              fill="url(#aa-voice)"
            />
          ))}
        </g>
      </g>

      {/* what she handles, on the orbit — placed at their starting angles.
          Rounded: the server's Math.cos and Safari's differ in the last digit,
          and React treats that as a hydration mismatch. */}
      <g data-art="orbit">
        {BADGES.map((badge) => {
          const p = onOrbit(badge.at * DEG);
          const s = 0.78 + 0.22 * p.near;
          return (
            <g
              key={badge.label}
              data-orbit={badge.label}
              transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${s.toFixed(3)})`}
              opacity={(0.55 + 0.45 * p.near).toFixed(3)}
            >
              <circle r="17" fill="#fff" fillOpacity=".16" stroke="#fff" strokeOpacity=".4" strokeWidth=".8" />
              <g
                transform="translate(-8.4 -8.4) scale(.7)"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {badge.icon}
              </g>
            </g>
          );
        })}
      </g>

      <path data-art="spark" d={sparkle(52, 24, 7)} fill="#fff" />
      <path data-art="spark" d={sparkle(316, 28, 6)} fill="#FFDB4C" />
      <path data-art="spark" d={sparkle(250, 200, 5)} fill="#BFD0FF" />
      <path data-art="spark" d={sparkle(22, 150, 5)} fill="#BFD0FF" />
    </svg>
  );
}
