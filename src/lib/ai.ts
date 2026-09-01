import { z } from "zod";
import type { Autopilot } from "./autopilot";
import { completeStructured } from "./ai-provider";

export { AiNotConfigured } from "./ai-provider";

/** Shared product context — every assist call is grounded in the same brief. */
function brandContext(cfg: Pick<Autopilot, "audience" | "tone">) {
  return [
    "SmartSyncLink sells AI phone answering, a unified inbox, appointment",
    "booking and follow-up automation to small service businesses",
    "(real estate, medspas, contractors).",
    "",
    `Audience: ${cfg.audience}`,
    `Tone: ${cfg.tone}`,
    "",
    "Never invent statistics, customer names, or case studies.",
    "No hype, no 'In today's fast-paced world', no filler headings.",
  ].join("\n");
}

/**
 * One call site for every AI feature in the dashboard.
 *
 * Each task declares its own zod schema; the provider layer guarantees the
 * response satisfies it, so callers get a typed object rather than prose that
 * needs parsing, and a malformed answer fails here instead of reaching the
 * database. Which vendor actually runs is decided in ./ai-provider.
 */
async function call<T extends z.ZodType>(
  cfg: Pick<Autopilot, "audience" | "tone">,
  schema: T,
  prompt: string,
  extraSystem = "",
): Promise<z.infer<T>> {
  return completeStructured(schema, {
    system: [brandContext(cfg), extraSystem].filter(Boolean).join("\n\n"),
    prompt,
  });
}

/* ------------------------------------------------------------ full post -- */

const DraftSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  body_markdown: z.string(),
});
export type Draft = z.infer<typeof DraftSchema>;

export async function generatePost(
  cfg: Pick<Autopilot, "tone" | "audience" | "words" | "topics">,
  opts: { topic?: string; avoidTitles?: string[] } = {},
): Promise<Draft> {
  const topic =
    opts.topic?.trim() ||
    cfg.topics[Math.floor(Math.random() * cfg.topics.length)] ||
    "How automation helps small service businesses win more customers";

  const avoid = opts.avoidTitles?.length
    ? `\n\nAlready published — pick a genuinely different angle:\n${opts.avoidTitles.map((t) => `- ${t}`).join("\n")}`
    : "";

  return call(
    cfg,
    DraftSchema,
    `Write a blog post about: ${topic}${avoid}`,
    [
      `Around ${cfg.words} words.`,
      "Markdown body. Start at '## ', never repeat the title as a heading.",
      "Mention the product only where it genuinely answers the problem.",
    ].join("\n"),
  );
}

/* --------------------------------------------------------- post helpers -- */

export async function suggestTitles(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: { topic: string; body?: string },
) {
  const { titles } = await call(
    cfg,
    z.object({ titles: z.array(z.string()) }),
    [
      `Topic: ${input.topic || "(none given — use the draft)"}`,
      input.body ? `\nDraft:\n${input.body.slice(0, 6000)}` : "",
      "\nGive 6 headline options. Vary the angle: one plain, one question,",
      "one number-led, one contrarian. No clickbait, no colons everywhere.",
    ].join("\n"),
  );
  return titles;
}

export async function writeExcerpt(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: { title: string; body: string },
) {
  const { excerpt } = await call(
    cfg,
    z.object({ excerpt: z.string() }),
    `Write a one-or-two sentence summary for this post, used on the blog index.\n\nTitle: ${input.title}\n\n${input.body.slice(0, 8000)}`,
  );
  return excerpt;
}

export async function suggestTags(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: { title: string; body: string },
) {
  const { tags } = await call(
    cfg,
    z.object({ tags: z.array(z.string()) }),
    `Give 3-5 lowercase tags for this post. Short, reusable across the blog — no one-off phrases.\n\nTitle: ${input.title}\n\n${input.body.slice(0, 6000)}`,
  );
  return tags;
}

export async function improveDraft(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: { title: string; body: string; instruction?: string },
) {
  const { body_markdown } = await call(
    cfg,
    z.object({ body_markdown: z.string() }),
    [
      `Title: ${input.title}`,
      `\nInstruction: ${input.instruction?.trim() || "Tighten it. Cut filler, keep every concrete detail, keep the structure."}`,
      `\nCurrent draft:\n${input.body}`,
    ].join("\n"),
    "Return the full rewritten Markdown body. Keep any heading structure that works.",
  );
  return body_markdown;
}

/* ------------------------------------------------------------- autopilot -- */

export async function suggestTopics(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: { count: number; existing: string[] },
) {
  const { topics } = await call(
    cfg,
    z.object({ topics: z.array(z.string()) }),
    [
      `Give ${input.count} blog topics this business could own.`,
      "Each one a specific question or problem the audience actually has —",
      "not a category. Something you could write 900 useful words about.",
      input.existing.length
        ? `\nDo not repeat these:\n${input.existing.map((t) => `- ${t}`).join("\n")}`
        : "",
    ].join("\n"),
  );
  return topics;
}

/* --------------------------------------------------------------- service -- */

export async function describeService(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: { title: string; notes?: string },
) {
  return call(
    cfg,
    z.object({ excerpt: z.string(), body_markdown: z.string() }),
    [
      `Service: ${input.title}`,
      input.notes?.trim() ? `\nWhat it involves: ${input.notes}` : "",
      "\nWrite the page for it: a one-line excerpt for the listing, and a body",
      "covering what it does, who it suits, and what setup looks like.",
    ].join("\n"),
    "Body is Markdown, around 350 words, starting at '## '.",
  );
}

/* ------------------------------------------------------------ free text -- */

export async function rewriteText(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: { text: string; instruction: string; context?: string },
) {
  const { text } = await call(
    cfg,
    z.object({ text: z.string() }),
    [
      input.context
        ? `This is the "${input.context}" field on the website.`
        : "",
      `\nInstruction: ${input.instruction}`,
      `\nCurrent text:\n${input.text}`,
    ].join("\n"),
    "Return only the replacement text. Match the original's length and format unless told otherwise — no quotes around it, no commentary.",
  );
  return text;
}
