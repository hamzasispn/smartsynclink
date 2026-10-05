// Self-check for the Suite section's website intro: `node scripts/check-stage-intro.ts`
// The sequence is timed off the length of the visitor's copy on her phone, so a
// longer message silently pushes the booking press past the moment the website
// hands both frames to the inbox — she would still be typing as it fades out.
// Every story is checked: the contractor one runs on the same clock.
import assert from "node:assert/strict";
import {
  fieldCues,
  HANDOVER,
  INTRO_MS,
  pressedAt,
  STORIES,
  type Story,
  typingTime,
  valuesOf,
} from "../src/lib/stage-intro.ts";

assert.ok(HANDOVER * 1000 < INTRO_MS, "the inbox would start answering before the message has landed in it");

for (const story of Object.keys(STORIES) as Story[]) {
  const values = valuesOf(story);
  const { cues } = fieldCues(values);
  const pressed = pressedAt(values);

  assert.equal(cues.length, values.length, `${story}: one cue per form field`);
  assert.ok(
    cues.every((cue, i) => i === 0 || cue > cues[i - 1] + typingTime(values[i - 1])),
    `${story}: each field waits for the one before it to finish typing`,
  );
  assert.ok(
    pressed <= HANDOVER,
    `${story}: the form is still being filled in when the website leaves: pressed at ${pressed.toFixed(2)}s, handover at ${HANDOVER}s. Shorten the copy in src/lib/stage-intro.ts or raise HANDOVER.`,
  );
  // the ping drops 0.05s after the press and takes 0.5s to land — see StageMotion
  assert.ok(
    pressed + 0.55 <= HANDOVER,
    `${story}: the phone's lead alert has no time to land before the inbox takes over: ${(pressed + 0.55).toFixed(2)}s vs ${HANDOVER}s`,
  );

  console.log(`${story} intro ok — types for ${cues.at(-1)!.toFixed(2)}s, pressed at ${pressed.toFixed(2)}s, inbox at ${HANDOVER}s`);
}
