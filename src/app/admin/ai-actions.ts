"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAutopilot } from "@/lib/autopilot";
import {
  completeStructured,
  resolveAi,
  providerLabel,
} from "@/lib/ai-provider";
import { z } from "zod";
import {
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
