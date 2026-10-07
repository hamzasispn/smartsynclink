import { z } from "zod";
import type { Autopilot } from "./autopilot";
import { ICON_NAMES } from "@/components/solution/icons";
import { completeStructured, type AiImage } from "./ai-provider";
import { conform, conformCustom, mediaOf, type Catalogue } from "./builder/conform";
import { COLUMN_WIDTHS, CUSTOM_PRESETS, SECTION_FIELDS, WIDGETS, type Field } from "./builder/widgets";

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
  opts: { images?: AiImage[]; model?: string } = {},
): Promise<z.infer<T>> {
  return completeStructured(schema, {
    system: [brandContext(cfg), extraSystem].filter(Boolean).join("\n\n"),
    prompt,
    ...opts,
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

/* ------------------------------------------------------- page builder -- */

/**
 * "Customize with AI" in the page builder: one section's content rewritten to
 * an instruction. The model gets the section's fields (its defaults, which are
 * everything its design can show) and its current content, and sends the whole
 * content back; conform() then fits the answer to those fields, so the design
 * can't be broken by anything it says.
 */
export async function customizeSection(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: {
    name: string;
    about?: string;
    instruction: string;
    value: unknown;
    shape: unknown;
    /** Pictures attached to the request, for the model to look at. */
    images?: AiImage[];
    /** URLs of attached pictures the section may use. */
    place?: string[];
    model?: string;
  },
) {
  const out = await call(
    cfg,
    z.object({ summary: z.string(), json: z.string() }),
    [
      `Section: ${input.name}${input.about ? ` — ${input.about}` : ""}`,
      "",
      "The fields this section has, with example values. Its design shows exactly these:",
      JSON.stringify(input.shape),
      "",
      "Its content now:",
      JSON.stringify(input.value),
      "",
      input.place?.length
        ? `Pictures you may put in the section (as an image src): ${input.place.join(", ")}`
        : "",
      input.images?.length ? `${input.images.length} picture(s) attached — look at them for what's asked.` : "",
      `Instruction: ${input.instruction}`,
    ].join("\n"),
    [
      "You edit the content of one section in a website's page builder. The design is fixed; you change only its content.",
      "Return `json`: the section's complete content after the change, as a JSON object string with the same keys and value types it has now.",
      "- Change only what the instruction asks for; copy everything else exactly as it is.",
      "- Use only the fields above. Lists may gain, lose or reorder items; a new item has the same fields as the others.",
      "- Keep every image and video `src` as it is: you may move or remove one, never invent a URL.",
      "- Links are a page on the site (/pricing-table), an anchor (#call opens the demo calendar, #contact the appointment one), tel:, mailto: or a full https URL.",
      "- Match the voice, length and capitalisation of the text around it. Headings stay short.",
      "- Put each thing only in a field meant for that kind of content (an address in an address field, not tacked onto a paragraph). When no field is meant for it, leave that part out and say plainly that this section has no place for it — never force it into another field.",
      "Return `summary`: one or two plain sentences, for the person who asked, on what you changed.",
    ].join("\n"),
    { images: input.images, model: input.model },
  );

  let answer: unknown;
  try {
    answer = JSON.parse(out.json);
  } catch {
    throw new Error("The AI's answer could not be read. Try again.");
  }
  const media = mediaOf(input.value);
  input.place?.forEach((url) => media.add(url));
  return {
    summary: out.summary,
    value: conform(answer, input.shape, input.value, media),
  };
}

/* -------------------------------------------------- a section from words -- */

/** The blocks the AI may build with — every one but embed, which holds raw HTML. */
const { embed: _embed, ...AI_WIDGETS } = WIDGETS;
const { columns: _columns, ...SECTION_DEFAULTS } = CUSTOM_PRESETS[0].build();

const CATALOGUE: Catalogue = {
  widgets: AI_WIDGETS,
  sectionFields: SECTION_FIELDS,
  sectionDefaults: SECTION_DEFAULTS,
  columnWidths: COLUMN_WIDTHS.map((w) => w.value),
  icons: ICON_NAMES,
};

/** One field, as the model needs to read it. */
function describeField(f: Field): string {
  switch (f.kind) {
    case "select":
      return `${f.key}: one of ${f.options?.map((o) => `"${o.value}"`).join(" | ")}`;
    case "toggle":
      return `${f.key}: true | false`;
    case "image":
    case "video":
      return `${f.key}: {"src","alt"}`;
    case "link":
      return `${f.key}: {"label","href"}`;
    case "list":
      return `${f.key}: [strings]`;
    case "icon":
      return `${f.key}: an icon name`;
    case "items":
      return `${f.key}: [{ ${(f.itemFields ?? []).map(describeField).join("; ")} }]`;
    case "markdown":
      return `${f.key}: text (Markdown: **bold**, [link](href))`;
    default:
      return `${f.key}: text`;
  }
}

/**
 * The block library in words, from the same catalogue the editor uses — a
 * block added to widgets.ts is something the AI can build with, no prompt edit.
 */
function describeCatalogue() {
  return Object.entries(AI_WIDGETS)
    .map(([type, w]) => `- "${type}" — ${w.description}\n  ${w.fields.map(describeField).join("; ") || "no fields"}`)
    .join("\n");
}

/**
 * "Create with AI": a whole custom section from an instruction, built from the
 * block library and fitted to it by conformCustom, so it can only ever be
 * something the site's own blocks draw.
 */
export async function createSection(
  cfg: Pick<Autopilot, "audience" | "tone">,
  input: {
    instruction: string;
    page: { label: string; sections: string[] };
    images?: AiImage[];
    place?: string[];
    model?: string;
    /** The section as it is now, when an existing one is being changed rather than a new one built. */
    current?: unknown;
  },
) {
  // the pictures it may use: the ones attached to be placed, and the ones the section already has
  const media = mediaOf(input.current);
  input.place?.forEach((url) => media.add(url));
  media.delete("");
  const out = await call(
    cfg,
    z.object({ label: z.string(), summary: z.string(), json: z.string() }),
    [
      "Block library:",
      describeCatalogue(),
      "",
      `Section settings: ${SECTION_FIELDS.map(describeField).join("; ")}`,
      `Icon names: ${ICON_NAMES.join(", ")}`,
      "",
      `The page: ${input.page.label}. Its sections now: ${input.page.sections.join(", ") || "none yet"}.`,
      media.size ? `Images you may use (as an image src): ${[...media].join(", ")}` : "Images you may use: none — use no image or video blocks.",
      input.images?.length ? `${input.images.length} picture(s) attached — use them as a reference for layout, style or content, as the instruction says.` : "",
      "",
      `Instruction: ${input.instruction}`,
    ].join("\n"),
    [
      "You design one section for this website's page builder. You build it only from the block library given; the site draws every block in its own fixed design (fonts, colours, spacing, phone layout), so you choose blocks and fill in their fields — never HTML or CSS.",
      "A section has settings and columns. Columns sit on a 12-column grid: each has a width of 12, 9, 8, 6, 4 or 3, they flow left to right and wrap when a row adds up to 12, and each holds blocks top to bottom. On phones every column stacks.",
      "Make it look designed:",
      "- Open with a heading block (a short uppercase eyebrow of 1–3 words helps) and, where it adds something, one line of text under it.",
      '- Use the rich blocks for groups of things: "features" for 3–7 benefits ("bento" style for 4–7), "steps" for a process, "faq" for questions, "testimonial" for a quote (two or three side by side in 6- or 4-wide columns), "stat" for numbers.',
      '- A call-to-action band: background "brand" or "dark", width "narrow", textAlign "center", then a heading, a line of text and a "white" button.',
      '- Set a section apart with its background: "none", "page", "surface", "soft" (light brand), "brand" (blue gradient, white text) or "dark" (white text).',
      "- Copy is short and concrete: headings under ten words, a feature in one or two sentences. No hype. No invented statistics, prices or customer names — use those only when the instruction gives them.",
      "- Buttons link to #call (book a live demo), #contact (book an appointment), /pricing-table (the plans), or a page the instruction names.",
      "- Images only from the list given; with none, no image or video blocks.",
      "- Fit the page it goes on and its audience.",
      'Return `json`: the section as a JSON object string — its settings, then "columns": [{"width": "12", "widgets": [{"type": "heading", ...its fields}]}].',
      "Return `label`: a two-to-four-word name for the builder's section list. Return `summary`: one plain sentence on what you built.",
    ].join("\n"),
    { images: input.images, model: input.model },
  );

  let answer: unknown;
  try {
    answer = JSON.parse(out.json);
  } catch {
    throw new Error("The AI's answer could not be read. Try again.");
  }
  const props = conformCustom(answer, CATALOGUE, media);
  if (!(props.columns as unknown[]).length) throw new Error("The AI didn't build anything usable. Try describing the section differently.");
  return { label: out.label.trim().slice(0, 60), summary: out.summary, props };
}
