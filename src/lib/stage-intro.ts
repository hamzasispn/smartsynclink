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

export type Visitor = { name: string; phone: string; message: string };

/** Who fills the form in. She is also the top thread in the inbox it lands in. */
export const VISITOR: Visitor = {
  name: "Ava Bennett",
  phone: "(512) 555-0142",
  message: "Hi! I'd like to book a Hydrafacial.",
};

/**
 * The same story told for a trade. The med spa is the default everywhere; the
 * contractors page gets a plumber's website, a homeowner's quote request and a
 * plumber's inbox, so nothing on it reads med spa. The message is kept to the
 * med spa's length — it has to fit the phone's field and the clock below.
 */
export type Story = "medspa" | "contractor";
export const STORIES: Record<Story, { visitor: Visitor; account: { name: string; place: string; initials: string } }> = {
  medspa: { visitor: VISITOR, account: { name: "Radiance Med Spa - Oak ...", place: "Austin, TX", initials: "RM" } },
  contractor: {
    visitor: { name: "Jake Morris", phone: "(830) 555-0198", message: "Can I get a quote on a water heater?" },
    account: { name: "McNeel Plumbing - Spri...", place: "Spring Branch, TX", initials: "MP" },
  },
};

/** Which story a page tells, by its builder page key. */
export const storyFor = (pageKey: string): Story => (pageKey === "industry:contractors" ? "contractor" : "medspa");

/** In the order the thumb taps them. */
export const valuesOf = (story: Story) => {
  const { name, phone, message } = STORIES[story].visitor;
  return [name, phone, message];
};
export const VALUES = valuesOf("medspa");

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

/** When the press on the send button has finished, for a given set of field values. */
export const pressedAt = (values: string[]) => fieldCues(values).end + REACH + PRESS_DOWN + PRESS_UP;

/** When the thumb reaches the button, and when the press has finished. */
export const REACHES_SEND = fieldCues(VALUES).end;
export const PRESSED = pressedAt(VALUES);

/** When the inbox takes both frames. Never before the press. */
export const HANDOVER = 5.6;

/**
 * How long the whole shot runs, so the inbox does not start answering a message
 * that, on screen, has not been sent yet.
 */
export const INTRO_MS = 7000;
