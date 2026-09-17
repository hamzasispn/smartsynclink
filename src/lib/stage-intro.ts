/**
 * The script and the clock for the website shot that opens the Suite section.
 *
 * The story: a med spa's website is up on the desktop, a visitor is on the same
 * site on her phone, she fills the booking form there and sends it — the phone
 * pings with the lead and the desktop catches it too, and then both screens
 * turn into the inbox holding that exact message.
 *
 * It lives apart from the components because the whole sequence is timed off
 * the length of the copy below — lengthen a field and the typing runs on.
 * Here it can be asserted: `node scripts/check-stage-intro.ts`.
 */

/** Who fills the form in. She is also the top thread in the inbox it lands in. */
export const VISITOR = {
  name: "Ava Bennett",
  phone: "(512) 555-0142",
  message: "Hi! I'd like to book a Hydrafacial.",
};

/** In the order the thumb taps them. */
export const VALUES = [VISITOR.name, VISITOR.phone, VISITOR.message];

/** Seconds: before the first field, moving to it, and per typed character. */
const OPENS_AT = 0.9;
const REACH = 0.4;
const SETTLE = 0.05;
const PER_CHARACTER = 0.026;
/** The dip and spring of the booking button. */
export const PRESS_DOWN = 0.12;
export const PRESS_UP = 0.18;
export const REACH_FOR = REACH;

export const typingTime = (text: string) => 0.1 + text.length * PER_CHARACTER;

/** When each field's tap lands, and where the last one leaves off. */
export function fieldCues(values: string[]) {
  const cues: number[] = [];
  let at = OPENS_AT;
  for (const value of values) {
    cues.push(at);
    at += REACH + typingTime(value) + SETTLE;
  }
  return { cues, end: at };
}

/** When the thumb reaches the button, and when the press has finished. */
export const REACHES_SEND = fieldCues(VALUES).end;
export const PRESSED = REACHES_SEND + REACH + PRESS_DOWN + PRESS_UP;

/** When the inbox takes both frames. Never before the press. */
export const HANDOVER = 5.6;

/**
 * How long the whole shot runs, so the inbox does not start answering a message
 * that, on screen, has not been sent yet.
 */
export const INTRO_MS = 7000;
