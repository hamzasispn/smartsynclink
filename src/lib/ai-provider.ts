import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { getAiSettings } from "./ai-settings";

/**
 * One structured-output call, whichever provider is configured.
 *
 * Almost every vendor now speaks OpenAI's /chat/completions shape, so instead
 * of one integration per vendor there are two paths: Anthropic's own SDK, and
 * a generic OpenAI-compatible one driven entirely by AI_BASE_URL. That covers
 * OpenAI, Google Gemini, Groq, OpenRouter, DeepSeek, Together, Mistral, xAI
 * and anything self-hosted (Ollama, vLLM) without another code path.
 *
 * Both paths must return data that satisfies `schema`, so callers never deal
 * with provider differences or with parsing prose.
 */

export type Provider = "anthropic" | "openai-compatible";

export type ResolvedAi = {
  provider: Provider;
  baseUrl: string;
  apiKey: string;
  model: string;
};

/**
 * Settings saved in the dashboard win; environment variables are the fallback
 * so a deployment can inject a key without anyone opening the admin UI.
 */
export async function resolveAi(): Promise<ResolvedAi> {
  const saved = await getAiSettings();

  const envProvider = process.env.AI_PROVIDER?.trim().toLowerCase();
  const provider: Provider =
    saved.provider === "openai-compatible" || envProvider === "openai-compatible"
      ? "openai-compatible"
      : "anthropic";

  const apiKey =
    saved.api_key ||
    (provider === "anthropic"
      ? (process.env.ANTHROPIC_API_KEY ?? "")
      : (process.env.AI_API_KEY ?? ""));

  const baseUrl = (
    saved.base_url ||
    process.env.AI_BASE_URL ||
    "https://api.openai.com/v1"
  ).replace(/\/+$/, "");

  return {
    provider,
    baseUrl,
    apiKey,
    model: saved.model || (provider === "anthropic" ? "claude-opus-5" : "gpt-4o-mini"),
  };
}

export function providerLabel(ai: ResolvedAi) {
  if (ai.provider === "anthropic") return "Anthropic";
  try {
    return new URL(ai.baseUrl).host;
  } catch {
    return "OpenAI-compatible";
  }
}

export class AiNotConfigured extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiNotConfigured";
  }
}

function assertConfigured(ai: ResolvedAi) {
  if (ai.apiKey) return;
  throw new AiNotConfigured(
    ai.provider === "anthropic"
      ? "No Anthropic API key. Add one under Settings → AI connection."
      : `No API key for ${providerLabel(ai)}. Add one under Settings → AI connection.`,
  );
}

/* ------------------------------------------------------------- anthropic -- */

async function viaAnthropic<T extends z.ZodType>(
  ai: ResolvedAi,
  schema: T,
  system: string,
  prompt: string,
): Promise<z.infer<T>> {
  const client = new Anthropic({ apiKey: ai.apiKey });
  const model = ai.model;
  const response = await client.messages.parse({
    model,
    max_tokens: 16000,
    system,
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(schema) },
  });

  if (response.stop_reason === "refusal") {
    throw new Error(
      `The model declined this request (${response.stop_details?.category ?? "unknown"}).`,
    );
  }
  if (!response.parsed_output) throw new Error("The model returned nothing usable.");
  return response.parsed_output;
}

/* ----------------------------------------------------- openai-compatible -- */

async function post(ai: ResolvedAi, body: unknown) {
  const response = await fetch(`${ai.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ai.apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, text };
}

async function viaOpenAiCompatible<T extends z.ZodType>(
  ai: ResolvedAi,
  schema: T,
  system: string,
  prompt: string,
): Promise<z.infer<T>> {
  const model = ai.model;
  const jsonSchema = z.toJSONSchema(schema);
  const messages = [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ];
  const base = { model, messages, max_tokens: 8000 };

  // Strict json_schema is the best answer where it exists (OpenAI, Groq,
  // OpenRouter, Together). Providers that reject it — including several Gemini
  // and Ollama builds — still honour plain JSON mode, so fall back once rather
  // than forcing every user onto the lowest common denominator.
  let out = await post(ai, {
    ...base,
    response_format: {
      type: "json_schema",
      json_schema: { name: "result", schema: jsonSchema, strict: true },
    },
  });

  if (!out.ok && out.status === 400) {
    out = await post(ai, {
      ...base,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${system}\n\nReply with JSON only, matching this schema:\n${JSON.stringify(jsonSchema)}`,
        },
        { role: "user", content: prompt },
      ],
    });
  }

  if (!out.ok) {
    throw new Error(
      `${providerLabel(ai)} returned ${out.status}: ${out.text.slice(0, 300)}`,
    );
  }

  let content: string;
  try {
    content = JSON.parse(out.text).choices?.[0]?.message?.content ?? "";
  } catch {
    throw new Error(`${providerLabel(ai)} sent a malformed response.`);
  }
  if (!content.trim()) throw new Error("The model returned an empty response.");

  // Some models wrap JSON in a ```json fence even in JSON mode.
  const cleaned = content.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("The model did not return valid JSON. Try again, or use a stronger model.");
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `The model's JSON did not match what this feature needs (${result.error.issues[0]?.message ?? "invalid shape"}).`,
    );
  }
  return result.data;
}

/* -------------------------------------------------------------- dispatch -- */

export async function completeStructured<T extends z.ZodType>(
  schema: T,
  opts: { system: string; prompt: string },
): Promise<z.infer<T>> {
  const ai = await resolveAi();
  assertConfigured(ai);
  return ai.provider === "anthropic"
    ? viaAnthropic(ai, schema, opts.system, opts.prompt)
    : viaOpenAiCompatible(ai, schema, opts.system, opts.prompt);
}
