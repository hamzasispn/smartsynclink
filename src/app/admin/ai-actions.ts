"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAutopilot } from "@/lib/autopilot";
import {
  CLAUDE_MODELS,
  completeStructured,
  resolveAi,
  providerLabel,
  type AiImage,
} from "@/lib/ai-provider";
import { readMedia } from "@/lib/media";
import { z } from "zod";
import { defaultGlobal } from "@/content/global";
import { SECTIONS } from "@/lib/builder/sections";
import {
  createSection,
  customizeSection,
  describeService,
  generatePost,
  improveDraft,
  rewriteText,
  suggestTags,
  suggestTitles,
  suggestTopics,
  writeExcerpt,
} from "@/lib/ai";

/** Server actions are public endpoints — each one re-checks the session. */
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
}

export type Assist =
  | { kind: "titles"; topic: string; body?: string }
  | { kind: "excerpt"; title: string; body: string }
  | { kind: "tags"; title: string; body: string }
  | { kind: "improve"; title: string; body: string; instruction?: string }
  | { kind: "draft"; topic: string }
  | { kind: "topics"; count: number; existing: string[] }
  | { kind: "service"; title: string; notes?: string }
  | { kind: "rewrite"; text: string; instruction: string; context?: string };

export type AssistResult =
  | { ok: true; kind: "titles"; titles: string[] }
  | { ok: true; kind: "excerpt"; excerpt: string }
  | { ok: true; kind: "tags"; tags: string[] }
  | { ok: true; kind: "improve"; body: string }
  | {
      ok: true;
      kind: "draft";
      title: string;
      excerpt: string;
      tags: string[];
      body: string;
    }
  | { ok: true; kind: "topics"; topics: string[] }
  | { ok: true; kind: "service"; excerpt: string; body: string }
  | { ok: true; kind: "rewrite"; text: string }
  | { ok: false; error: string };

/**
 * Smallest possible round-trip to the configured provider. Proves the key,
 * the base URL, the model name and JSON support in one click — the four
 * things that are actually wrong when "it doesn't work".
 */
export async function testAiAction(): Promise<
  | { ok: true; provider: string; model: string; reply: string }
  | { ok: false; error: string }
> {
  await requireAdmin();
  try {
    const ai = await resolveAi();
    const out = await completeStructured(
      z.object({ ok: z.boolean(), word: z.string() }),
      {
        system: "You are a connection test. Answer literally.",
        prompt: 'Reply with ok = true and word = "connected".',
      },
    );
    return {
      ok: true,
      provider: providerLabel(ai),
      model: ai.model,
      reply: out.word,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Single entry point for every AI button in the dashboard. One guarded action
 * instead of eight keeps the auth check and the error contract in one place —
 * a new assist is a new branch, not a new endpoint.
 */
export async function assistAction(input: Assist): Promise<AssistResult> {
  await requireAdmin();
  const cfg = await getAutopilot();

  try {
    switch (input.kind) {
      case "titles":
        return {
          ok: true,
          kind: "titles",
          titles: await suggestTitles(cfg, input),
        };

      case "excerpt":
        return {
          ok: true,
          kind: "excerpt",
          excerpt: await writeExcerpt(cfg, input),
        };

      case "tags":
        return { ok: true, kind: "tags", tags: await suggestTags(cfg, input) };

      case "improve":
        return {
          ok: true,
          kind: "improve",
          body: await improveDraft(cfg, input),
        };

      case "draft": {
        const draft = await generatePost(cfg, { topic: input.topic });
        return {
          ok: true,
          kind: "draft",
          title: draft.title,
          excerpt: draft.excerpt,
          tags: draft.tags,
          body: draft.body_markdown,
        };
      }

      case "topics":
        return {
          ok: true,
          kind: "topics",
          topics: await suggestTopics(cfg, input),
        };

      case "service": {
        const out = await describeService(cfg, input);
        return {
          ok: true,
          kind: "service",
          excerpt: out.excerpt,
          body: out.body_markdown,
        };
      }

      case "rewrite":
        return {
          ok: true,
          kind: "rewrite",
          text: await rewriteText(cfg, input),
        };
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/* ------------------------------------------------------- page builder -- */

/** What "Customize with AI" is pointed at: a placed section, or the header or footer. */
export type CustomizeTarget = { kind: "section"; type: string; label?: string } | { kind: "header" } | { kind: "footer" };

/** What the builder's AI boxes offer: the connection, its saved model, and the models to pick from. */
export async function aiOptionsAction() {
  await requireAdmin();
  const ai = await resolveAi();
  return {
    provider: providerLabel(ai),
    configured: Boolean(ai.apiKey),
    model: ai.model,
    models: ai.provider === "anthropic" ? CLAUDE_MODELS.map((m) => ({ ...m })) : [],
  };
}

/** A picture attached in an AI box: uploaded to the media library first, then sent by id. */
export type AttachedImage = { id: string; url: string };

const VISION = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/** The attached pictures, read back from the media library for the model to see. Four at most. */
async function loadImages(images: AttachedImage[] = []): Promise<AiImage[]> {
  const out: AiImage[] = [];
  for (const image of images.slice(0, 4)) {
    const file = await readMedia(image.id);
    if (file && VISION.has(file.mime)) out.push({ mediaType: file.mime as AiImage["mediaType"], base64: file.body.toString("base64") });
  }
  return out;
}

/** A chosen model is only ever one of the offered ones. */
const pickModel = (model?: string) => (CLAUDE_MODELS.some((m) => m.id === model) ? model : undefined);

/**
 * Rewrites one section's content to an instruction. Nothing is saved here: the
 * builder applies the answer as an ordinary edit, so it lands in the draft and
 * Undo takes it back. The section's fields come from the catalogue on the
 * server, never from the request.
 */
export async function customizeAction(input: {
  target: CustomizeTarget;
  instruction: string;
  value: unknown;
  model?: string;
  images?: AttachedImage[];
  /** true: the attached pictures may go into the section; false: they are only to look at. */
  placeImages?: boolean;
}): Promise<{ ok: true; value: unknown; summary: string } | { ok: false; error: string }> {
  await requireAdmin();
  const instruction = input.instruction.trim().slice(0, 2000);
  if (!instruction) return { ok: false, error: "Write what you'd like changed." };
  if (JSON.stringify(input.value ?? {}).length > 200_000) return { ok: false, error: "This section is too large to send to the AI." };

  const t = input.target;
  const options = { images: await loadImages(input.images), place: input.placeImages ? input.images?.map((i) => i.url) : undefined, model: pickModel(input.model) };

  // a custom section is blocks, not fixed fields: it is rebuilt from the block library, starting from itself
  if (t.kind === "section" && t.type === "custom") {
    try {
      const out = await createSection(await getAutopilot(), { ...options, instruction, page: { label: t.label || "Custom section", sections: [] }, current: input.value });
      return { ok: true, value: out.props, summary: out.summary };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  const meta = t.kind === "section" ? SECTIONS[t.type] : undefined;
  const target =
    t.kind === "header"
      ? { name: "Header and menu", about: "the logo, the menu links and their dropdown panels, and the header buttons", shape: { brand: defaultGlobal.brand, nav: defaultGlobal.nav } }
      : t.kind === "footer"
        ? { name: "Footer", about: "the about text, link columns, newsletter form, contact details, copyright line and badges", shape: defaultGlobal.footer }
        : meta && t.type !== "custom"
          ? { name: t.label || meta.label, about: meta.description, shape: meta.defaults }
          : null;
  if (!target) return { ok: false, error: "This section can't be customized with AI." };

  try {
    const out = await customizeSection(await getAutopilot(), {
      ...target,
      instruction,
      value: input.value ?? {},
      ...options,
    });
    return { ok: true, ...out };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * "Create with AI": a new custom section from an instruction. Like customize,
 * nothing is saved here — the builder adds the section as an ordinary edit.
 */
export async function createSectionAction(input: {
  instruction: string;
  page: { label: string; sections: string[] };
  model?: string;
  images?: AttachedImage[];
  placeImages?: boolean;
}): Promise<
  { ok: true; label: string; summary: string; props: Record<string, unknown> } | { ok: false; error: string }
> {
  await requireAdmin();
  const instruction = input.instruction.trim().slice(0, 3000);
  if (!instruction) return { ok: false, error: "Describe the section you want." };
  try {
    const out = await createSection(await getAutopilot(), {
      instruction,
      page: { label: String(input.page.label).slice(0, 80), sections: input.page.sections.slice(0, 40).map((s) => String(s).slice(0, 60)) },
      images: await loadImages(input.images),
      place: input.placeImages ? input.images?.map((i) => i.url) : undefined,
      model: pickModel(input.model),
    });
    return { ok: true, ...out };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
