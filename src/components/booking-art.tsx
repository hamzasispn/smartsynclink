"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

/**
 * The illustration in the booking band: a tilted phone with a booked slot on
 * screen, social tiles, a paper plane and a ribbon, drawn in the brand palette.
 * Drawn rather than sourced so it carries our colours exactly and needs no
 * licence. Every piece floats on its own period once it has arrived, so the
 * band never settles into a still.
 */
export function BookingArt({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGsap(ref, (gsap, el) => {
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    tl.from(q("[data-art=phone]"), { y: 90, rotate: 6, autoAlpha: 0, duration: 1, svgOrigin: "180 215" })
      .from(q("[data-art=slot]"), { scale: 0.6, autoAlpha: 0, duration: 0.5, transformOrigin: "50% 50%" }, "-=0.35")
      .from(
        q("[data-art=tile]"),
        { scale: 0, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: "back.out(2)", transformOrigin: "50% 50%" },
        "-=0.3",
      )
      .from(q("[data-art=plane]"), { x: -60, y: 40, autoAlpha: 0, duration: 0.8 }, "-=0.4")
      .from(q("[data-art=ribbon]"), { scaleX: 0, autoAlpha: 0, duration: 0.7, transformOrigin: "0% 50%" }, "-=0.5");

    q("[data-art=tile]").forEach((tile: Element, i: number) =>
      gsap.to(tile, { y: -8, duration: 2.2 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 }),
    );
    gsap.to(q("[data-art=plane]"), { x: 10, y: -8, rotate: 4, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8, transformOrigin: "50% 50%" });
    gsap.to(q("[data-art=ribbon]"), { rotate: -6, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8, transformOrigin: "0% 50%" });
    gsap.to(q("[data-art=phone]"), { y: -5, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 360 215"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="ba-phone" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#D9D3FF" />
          <stop offset="1" stopColor="#A89CFF" />
        </linearGradient>
        <linearGradient id="ba-tile" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#052EFF" />
          <stop offset="1" stopColor="#3300EA" />
        </linearGradient>
        <linearGradient id="ba-ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#C026D3" />
          <stop offset="1" stopColor="#FF7A7A" />
        </linearGradient>
        <radialGradient id="ba-glow">
          <stop stopColor="#7C6BFF" stopOpacity=".55" />
          <stop offset="1" stopColor="#7C6BFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="180" cy="150" r="110" fill="url(#ba-glow)" />

      {/* phone */}
      <g data-art="phone">
        <g transform="rotate(-16 180 150)">
          <rect x="128" y="40" width="112" height="210" rx="22" fill="url(#ba-phone)" />
          <rect x="136" y="48" width="96" height="194" rx="16" fill="#EEEBFF" />
          <rect x="166" y="54" width="36" height="6" rx="3" fill="#8F82F5" />
          <rect x="146" y="74" width="60" height="6" rx="3" fill="#B8AEFF" />
          <rect x="146" y="86" width="40" height="5" rx="2.5" fill="#CEC7FF" />
          <g data-art="slot">
            <rect x="144" y="104" width="80" height="44" rx="9" fill="#fff" />
            <rect x="152" y="114" width="36" height="5" rx="2.5" fill="#3300EA" />
            <rect x="152" y="124" width="52" height="4" rx="2" fill="#C9C3FF" />
            <rect x="152" y="133" width="30" height="4" rx="2" fill="#C9C3FF" />
            <circle cx="210" cy="126" r="8" fill="#22C55E" />
            <path d="m206.5 126 2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <rect x="144" y="156" width="80" height="18" rx="9" fill="url(#ba-tile)" />
        </g>
      </g>

      {/* social tiles */}
      <g data-art="tile">
        <g transform="rotate(-10 96 110)">
          <rect x="72" y="86" width="48" height="48" rx="11" fill="url(#ba-tile)" />
          <rect x="72" y="86" width="48" height="6" rx="3" fill="#fff" fillOpacity=".18" />
          <rect x="84" y="98" width="24" height="24" rx="7" stroke="#fff" strokeWidth="2.6" />
          <circle cx="96" cy="110" r="5.2" stroke="#fff" strokeWidth="2.6" />
          <circle cx="103.2" cy="102.8" r="1.6" fill="#fff" />
        </g>
      </g>
      <g data-art="tile">
        <g transform="rotate(8 172 176)">
          <rect x="148" y="152" width="48" height="48" rx="11" fill="#3B4BFF" />
          <rect x="148" y="152" width="48" height="6" rx="3" fill="#fff" fillOpacity=".2" />
          <path
            d="M175.5 193v-15h4.6l.7-5.4h-5.3v-3.4c0-1.5.4-2.6 2.6-2.6h2.8v-4.8c-.5-.1-2.1-.2-4-.2-4 0-6.8 2.4-6.8 7v4H165v5.4h4.6V193"
            fill="#fff"
          />
        </g>
      </g>
      <g data-art="tile">
        <g transform="rotate(12 262 150)">
          <rect x="246" y="134" width="32" height="32" rx="8" fill="#fff" />
          <path d="M254 145h16M254 151h11M254 157h7" stroke="#3300EA" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </g>

      {/* plane + its dotted wake */}
      <path d="M150 40c20-18 48-24 74-18" stroke="#BFD0FF" strokeWidth="1.6" strokeDasharray="2 5" strokeLinecap="round" />
      <g data-art="plane">
        <path d="m232 6 42 12-22 8-6 16-5-14-15-6z" fill="#E4ECFF" />
        <path d="m252 26 22-8-28 10z" fill="#9DB6FF" />
      </g>

      {/* ribbon */}
      <path
        data-art="ribbon"
        d="M246 72c10-10 20 4 30-6s18 2 26-8 14 2 20-4"
        stroke="url(#ba-ribbon)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path d="M58 58c6-8 14-10 22-8" stroke="#8F82F5" strokeWidth="2" strokeLinecap="round" />
      <path d="M296 108a14 14 0 0 1 18 6" stroke="#fff" strokeOpacity=".8" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="300" cy="120" r="3" fill="#fff" />
    </svg>
  );
}
