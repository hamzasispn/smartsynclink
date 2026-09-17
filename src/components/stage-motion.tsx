"use client";

import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  fieldCues,
  HANDOVER,
  INTRO_MS,
  PRESS_DOWN,
  PRESS_UP,
  PRESSED,
  REACH_FOR,
  typingTime,
  VALUES,
} from "@/lib/stage-intro";
import { useGsap } from "@/lib/use-gsap";
import { CLICKS, TAPS } from "./site-mockup";
import { ChatContext, TypedContext, useChatCycle } from "./live-suite";

gsap.registerPlugin(TextPlugin);

/** Where the chip lands, measured from the desktop booking button it leaves. */
const LANDING: [number, number] = [448 - 1290, 257 - 621];

/**
 * Entrance and idle motion for the SmartSync Suite stage.
 *
 * The mockup itself is server-rendered markup; this only finds its hooks —
 * [data-sa] on the two shots, [data-a] on the thread rows — and moves them.
 * Everything animates *in* with from(), so with reduced motion (where useGsap
 * does nothing) the stage simply sits there complete.
 *
 * With `intro` both screens open on a med spa's website instead: the page on
 * the desktop and the same site on the phone, with the booking form filled in
 * on both at once — a cursor on one, a thumb on the other — and sent. The phone
 * pings with the lead, the desk catches a chip of it, and only then do the two
 * screens become the inbox, holding that exact message. That is the one thing a
 * screenshot of an inbox cannot say on its own: where the messages come from.
 *
 * The website is pure decoration: it is hidden in CSS and only this timeline
 * reveals it, so with reduced motion the stage is the finished screens and
 * nothing is covered up.
 */
export function StageMotion({
  children,
  className,
  style,
  label,
  intro = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  label: string;
  intro?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { chat, typed } = useChatCycle(ref, intro ? INTRO_MS : 0);

  useGsap(ref, (gsap, el) => {
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
    });

    const board = q('[data-sa="board"]');
    const phone = q('[data-sa="phone"]');
    const rows = q('[data-a="row"]');
    const prows = q('[data-a="prow"]');
    const site = q('[data-a="site"]');

    if (!site.length) {
      // the bento tile: both screens simply arrive
      tl.from(board, { y: 60, autoAlpha: 0, duration: 0.9 })
        .from(rows, { x: -24, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, "-=0.45")
        .from(phone, { y: 160, rotate: 5, autoAlpha: 0, duration: 1, ease: "back.out(1.2)" }, "-=0.6")
        .from(prows, { y: 18, autoAlpha: 0, duration: 0.45, stagger: 0.08 }, "-=0.5")
        .to(q('[data-sa="float"]'), { y: -14, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      return;
    }

    const mobile = q('[data-a="mobile-site"]');
    const alert = q('[data-a="alert"]');
    const chip = q('[data-a="chip"]');
    // the same form on both screens, so each hook is looked up per site
    const tap = q('[data-a="mobile-site"] [data-a="tap"]');
    const pointer = q('[data-a="site"] [data-a="pointer"]');
    const rings = (i: number) => [
      q('[data-a="site"] [data-a="ring"]')[i],
      q('[data-a="mobile-site"] [data-a="ring"]')[i],
    ];
    const fields = (i: number) => [
      q('[data-a="site"] [data-a="value"]')[i],
      q('[data-a="mobile-site"] [data-a="value"]')[i],
    ];
    const buttons = q('[data-a="send"]');
    const { cues, end } = fieldCues(VALUES);

    // both screens, showing the same website
    tl.set(q('[data-a="value"]'), { text: "" })
      .set(tap, { x: TAPS[0][0], y: TAPS[0][1] - 90 })
      .set(pointer, { x: CLICKS[0][0] - 120, y: CLICKS[0][1] + 150 })
      .fromTo(site, { autoAlpha: 0, y: 26, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.65 }, 0)
      .fromTo(mobile, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.15)
      .from(phone, { y: 160, rotate: 5, autoAlpha: 0, duration: 1, ease: "back.out(1.2)" }, 0);

    // cursor and thumb together: to each field, a press, then the typing
    VALUES.forEach((text, i) => {
      const cue = cues[i];
      const typing = typingTime(text);
      const landed = cue + REACH_FOR;
      const move = { duration: REACH_FOR, ease: "power2.inOut" };
      tl.to(tap, { x: TAPS[i][0], y: TAPS[i][1], opacity: 0.55, ...move }, cue)
        .to(pointer, { x: CLICKS[i][0], y: CLICKS[i][1], opacity: 1, ...move }, cue)
        .to([...tap, ...pointer], { scale: 0.72, duration: 0.1 }, landed - 0.08)
        .to([...tap, ...pointer], { scale: 1, duration: 0.18 }, landed + 0.02)
        .to(rings(i), { opacity: 1, duration: 0.18 }, landed)
        .to(fields(i), { text: { value: text, delimiter: "" }, duration: typing, ease: "none" }, landed + 0.05)
        .to(rings(i), { opacity: 0, duration: 0.22 }, landed + 0.05 + typing);
    });

    // booking it on both, and the ping that lands the moment she does
    tl.to(tap, { x: TAPS[3][0], y: TAPS[3][1], duration: REACH_FOR, ease: "power2.inOut" }, end)
      .to(pointer, { x: CLICKS[3][0], y: CLICKS[3][1], duration: REACH_FOR, ease: "power2.inOut" }, end)
      .to([...tap, ...pointer, ...buttons], { scale: 0.94, duration: PRESS_DOWN }, end + REACH_FOR)
      .to([...tap, ...pointer, ...buttons], { scale: 1, duration: PRESS_UP }, end + REACH_FOR + PRESS_DOWN)
      .to([...tap, ...pointer], { opacity: 0, duration: 0.25 }, PRESSED)
      .fromTo(
        alert,
        { y: -100, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)", immediateRender: false },
        PRESSED + 0.05,
      );

    // the desk takes the lead, then the phone puts the app back up
    tl.to(site, { autoAlpha: 0, y: -18, scale: 0.965, duration: 0.5 }, HANDOVER - 0.1)
      .from(board, { y: 60, autoAlpha: 0, duration: 0.9 }, HANDOVER)
      .from(rows, { x: -24, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, HANDOVER + 0.45)
      .to(alert, { y: -100, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, HANDOVER + 0.8)
      .to(mobile, { autoAlpha: 0, duration: 0.45 }, HANDOVER + 0.95)
      .from(prows, { y: 18, autoAlpha: 0, duration: 0.45, stagger: 0.08 }, HANDOVER + 1.15)
      .to(
        q('[data-sa="float"]'),
        { y: -14, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 },
        HANDOVER + 2,
      );

    // the chip crossing from her phone to the desk, and the row it lands on
    const flight = HANDOVER + 0.15;
    tl.fromTo(chip, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, flight)
      .to(chip, { x: LANDING[0], y: LANDING[1], duration: 0.95, ease: "power2.inOut" }, flight)
      .to(chip, { autoAlpha: 0, scale: 0.6, duration: 0.25 }, flight + 0.8)
      .fromTo(
        rows[0],
        { backgroundColor: "rgba(5,46,255,0.16)" },
        // without this the row would be painted blue from page load —
        // a from-tween renders its start state the moment it is built
        { backgroundColor: "rgba(5,46,255,0)", duration: 1.1, immediateRender: false },
        flight + 0.95,
      )
      .fromTo(
        prows[0],
        { backgroundColor: "rgba(5,46,255,0.16)" },
        { backgroundColor: "rgba(5,46,255,0)", duration: 1.1, immediateRender: false },
        HANDOVER + 1.5,
      );
  });

  return (
    <div ref={ref} role="img" aria-label={label} className={className} style={style}>
      <ChatContext.Provider value={chat}>
        <TypedContext.Provider value={typed}>{children}</TypedContext.Provider>
      </ChatContext.Provider>
    </div>
  );
}
