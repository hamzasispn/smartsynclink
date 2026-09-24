"use client";

import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";
import { CAMPAIGN_LAYOUTS, CampaignArt, CHECK_IN, type CampaignLayout } from "./campaign-art";

gsap.registerPlugin(TextPlugin);

/**
 * The one-click campaign illustration, running.
 *
 * Twelve seconds, on a loop, in the order the feature actually happens: the
 * name and number are typed, the button is pressed, the wires draw, the four
 * weekly reminders light one at a time, the stars fill and the reminders stop —
 * and alongside it the twelve-month bar fills, dropping a text at months 1, 4,
 * 7 and 10 with the offer and the referral ask.
 *
 * It only runs while it is on screen (useGsap holds endless loops otherwise),
 * and not at all under reduced motion — where the markup is already the
 * finished sequence, which is what should be left on the page.
 */
const TYPE_PER_CHAR = 0.055;

// where the cursor rests on the check-in card before it reaches for the button
const START = { x: 210, y: 240 };
const BUTTON = { x: 130, y: 194 };

export function CampaignMotion({
  layout,
  className = "",
}: {
  layout: CampaignLayout;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const L = CAMPAIGN_LAYOUTS[layout];

  useGsap(ref, (gsap, el) => {
    const q = gsap.utils.selector(el);
    const values = q('[data-ca="value"]');
    const cursor = q('[data-ca="cursor"]');
    const launch = q('[data-a="launch"]');
    const wires = q('[data-ca="wire"]') as unknown as SVGPathElement[];
    const weeks = q('[data-a="week"]');
    const stars = q('[data-ca="star"]');
    const done = q('[data-ca="done"]');
    const bar = q('[data-a="bar"]');
    const months = q('[data-a="month"]');
    const bubbles = q('[data-a="bubble"]');

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: "power2.out" } });

    tl.set(values, { text: "" })
      .set(cursor, { x: START.x, y: START.y, opacity: 0 })
      .set(wires, { strokeDasharray: (i, t: SVGPathElement) => t.getTotalLength(), strokeDashoffset: (i, t: SVGPathElement) => t.getTotalLength() })
      .set([...weeks, ...stars, ...months, ...bubbles, ...done], { autoAlpha: 0 })
      .set(bar, { scaleX: 0, transformOrigin: "0 50%" })

      /* the front desk fills the card in */
      .to(cursor, { opacity: 1, duration: 0.3 }, 0.2)
      .to(values[0], { text: { value: CHECK_IN.name, delimiter: "" }, duration: CHECK_IN.name.length * TYPE_PER_CHAR, ease: "none" }, 0.6)
      .to(values[1], { text: { value: CHECK_IN.phone, delimiter: "" }, duration: CHECK_IN.phone.length * TYPE_PER_CHAR, ease: "none" }, 1.5)

      /* one click */
      .to(cursor, { x: BUTTON.x, y: BUTTON.y, duration: 0.5, ease: "power2.inOut" }, 2.7)
      .to(launch, { scale: 0.95, duration: 0.12 }, 3.2)
      .to(launch, { scale: 1, duration: 0.2 }, 3.32)
      .to(cursor, { opacity: 0, duration: 0.3 }, 3.6)

      /* it fans out */
      .to(wires, { strokeDashoffset: 0, duration: 0.7, stagger: 0.12 }, 3.5)

      /* four weeks of asking, then the review lands and it stops */
      .fromTo(
        weeks,
        { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.5, ease: "back.out(2)", immediateRender: false },
        4.3,
      )
      .fromTo(
        stars,
        { autoAlpha: 0, scale: 0.4 },
        { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.12, ease: "back.out(2.5)", immediateRender: false },
        6.6,
      )
      .to(done, { autoAlpha: 1, duration: 0.4 }, 7.4)

      /* and a year of staying in touch: months 1, 4, 7 and 10 as the bar fills */
      .to(bar, { scaleX: 1, duration: 4.4, ease: "none" }, 4.6)
      .fromTo(
        months,
        { autoAlpha: 0, scale: 0.3 },
        { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 1.2, ease: "back.out(2)", immediateRender: false },
        5,
      )
      .fromTo(
        bubbles,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 2.4, immediateRender: false },
        6.4,
      )

      /* a beat with the whole thing standing, then round again */
      .to({}, { duration: 1.6 }, 10.4);
  });

  return (
    <div
      ref={ref}
      role="img"
      aria-label="A client is checked in, and a year of review requests, return-visit offers and referral texts runs automatically"
      className={`suite-stage relative ${className}`}
      style={{ aspectRatio: `${L.w} / ${L.h}` }}
    >
      <div
        className="suite-board"
        style={{ width: L.w, height: L.h, ["--stage-w" as string]: `${L.w}px` }}
      >
        <CampaignArt layout={layout} />
      </div>
    </div>
  );
}

/**
 * The campaigns tile on the home bento, which becomes the feature for a while.
 *
 * The card reads as it is first — badge, heading, points — then the copy lifts
 * away and the same drawing plays as a sequence in its place: the check-in form
 * is filled and sent, it gives way to the review requests, the stars land, and
 * the year of follow-up runs. Then the copy comes back, and round again.
 *
 * The drawing is a layer over the copy rather than beside it, so the tile keeps
 * the height its copy gives it. Under reduced motion the layer never shows and
 * the tile is only the copy.
 */
export function CampaignTile({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  /**
   * The tile's copy, inside a [data-tile="copy"] wrapper; its children fade
   * one by one. Anything outside that wrapper stays, and can restyle itself
   * off the tile's data-cta="arrow" while the drawing plays.
   */
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const L = CAMPAIGN_LAYOUTS.tile;

  useGsap(ref, (gsap, el) => {
    const q = gsap.utils.selector(el);
    const copy = q('[data-tile="copy"] > *');
    const art = q('[data-tile="art"]');
    const form = q('[data-a="form"]');
    const cards = q('[data-a="card"]');
    const values = q('[data-ca="value"]');
    const cursor = q('[data-ca="cursor"]');
    const launch = q('[data-a="launch"]');
    const weeks = q('[data-a="week"]');
    const stars = q('[data-ca="star"]');
    const done = q('[data-ca="done"]');
    const bar = q('[data-a="bar"]');
    const months = q('[data-a="month"]');
    const bubbles = q('[data-a="bubble"]');

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });

    tl.set(values, { text: "" })
      .set(cursor, { x: START.x, y: START.y, opacity: 0 })
      .set([...cards, ...weeks, ...stars, ...months, ...bubbles, ...done], { autoAlpha: 0 })
      .set(form, { autoAlpha: 0, y: 0, scale: 0.94 })
      .set(bar, { scaleX: 0, transformOrigin: "0 50%" })

      /* the card as it is, long enough to read, then the copy lifts away —
         and its button folds into an arrow in the corner (CSS, keyed on this) */
      .call(() => el.setAttribute("data-cta", "arrow"), [], 4)
      .to(copy, { autoAlpha: 0, y: -12, duration: 0.35, stagger: 0.06, ease: "power2.in" }, 4)
      .to(art, { autoAlpha: 1, duration: 0.4 }, 4.4)

      /* the form, filled in and sent */
      .to(form, { autoAlpha: 1, scale: 1, duration: 0.5 }, 4.6)
      .to(cursor, { opacity: 1, duration: 0.3 }, 4.9)
      .to(values[0], { text: { value: CHECK_IN.name, delimiter: "" }, duration: CHECK_IN.name.length * TYPE_PER_CHAR, ease: "none" }, 5.2)
      .to(values[1], { text: { value: CHECK_IN.phone, delimiter: "" }, duration: CHECK_IN.phone.length * TYPE_PER_CHAR, ease: "none" }, 6)
      .to(cursor, { x: BUTTON.x, y: BUTTON.y, duration: 0.5, ease: "power2.inOut" }, 7.1)
      .to(launch, { scale: 0.95, duration: 0.12 }, 7.6)
      .to(launch, { scale: 1, duration: 0.2 }, 7.72)
      .to(form, { autoAlpha: 0, y: -24, scale: 0.96, duration: 0.45, ease: "power2.in" }, 8)

      /* the 5-star requests: four weeks of asking, then the review lands */
      .fromTo(cards[0], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, 8.4)
      .fromTo(
        weeks,
        { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.4, ease: "back.out(2)", immediateRender: false },
        8.8,
      )
      .fromTo(
        stars,
        { autoAlpha: 0, scale: 0.4 },
        { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.1, ease: "back.out(2.5)", immediateRender: false },
        10.4,
      )
      .to(done, { autoAlpha: 1, duration: 0.4 }, 11)

      /* and the follow-up, through the year */
      .fromTo(cards[1], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, 11.4)
      .to(bar, { scaleX: 1, duration: 3, ease: "none" }, 11.8)
      .fromTo(
        months,
        { autoAlpha: 0, scale: 0.3 },
        { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.8, ease: "back.out(2)", immediateRender: false },
        12,
      )
      .fromTo(
        bubbles,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 1.2, immediateRender: false },
        12.8,
      )

      /* a beat with it all standing, then the card again, button and all */
      .to(art, { autoAlpha: 0, duration: 0.5 }, 16.6)
      .call(() => el.removeAttribute("data-cta"), [], 16.9)
      .fromTo(
        copy,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, immediateRender: false },
        16.9,
      );
  });

  return (
    <article ref={ref} className={className} style={style}>
      {children}
      <div
        data-tile="art"
        role="img"
        aria-label="A client is checked in, then review requests and a year of follow-up texts go out automatically"
        className="invisible absolute inset-0 grid place-items-center bg-surface p-4 opacity-0 [container-type:size]"
      >
        {/* as large as the tile allows either way, never cropped */}
        <div
          className="suite-stage relative"
          style={{ aspectRatio: `${L.w} / ${L.h}`, width: `min(100cqw, calc(100cqh * ${L.w / L.h}))` }}
        >
          <div className="suite-board" style={{ width: L.w, height: L.h, ["--stage-w" as string]: `${L.w}px` }}>
            <CampaignArt layout="tile" />
          </div>
        </div>
      </div>
    </article>
  );
}
