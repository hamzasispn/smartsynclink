// Self-check for the Suite section's website intro: `node scripts/check-stage-intro.ts`
// The sequence is timed off the length of the visitor's copy on her phone, so a
// longer message silently pushes the booking press past the moment the website
// hands both frames to the inbox — she would still be typing as it fades out.
import assert from "node:assert/strict";
import {
  fieldCues,
  HANDOVER,
  INTRO_MS,
  PRESSED,
  VALUES,
  typingTime,
} from "../src/lib/stage-intro.ts";

const { cues } = fieldCues(VALUES);

assert.equal(cues.length, VALUES.length, "one cue per form field");
assert.ok(
  cues.every((cue, i) => i === 0 || cue > cues[i - 1] + typingTime(VALUES[i - 1])),
  "each field waits for the one before it to finish typing",
);

assert.ok(
  PRESSED <= HANDOVER,
  `the form is still being filled in when the website leaves: pressed at ${PRESSED.toFixed(2)}s, handover at ${HANDOVER}s. Shorten the copy in src/lib/stage-intro.ts or raise HANDOVER.`,
);

// the ping drops 0.05s after the press and takes 0.5s to land — see StageMotion
assert.ok(
  PRESSED + 0.55 <= HANDOVER,
  `the phone's lead alert has no time to land before the inbox takes over: ${(PRESSED + 0.55).toFixed(2)}s vs ${HANDOVER}s`,
);

assert.ok(
  HANDOVER * 1000 < INTRO_MS,
  "the inbox would start answering before the message has landed in it",
);

console.log(
  `stage intro ok — types for ${cues.at(-1)!.toFixed(2)}s, pressed at ${PRESSED.toFixed(2)}s, inbox at ${HANDOVER}s`,
);
