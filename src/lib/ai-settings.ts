import { sql } from "./db";

export type AiSettings = {
  provider: "anthropic" | "openai-compatible";
  base_url: string;
  api_key: string;
  model: string;
};

/** Never leaves the server — the api_key is in here. */
export async function getAiSettings(): Promise<AiSettings> {
  const rows = await sql`select provider, base_url, api_key, model from ai_settings where id = 1`;
  const row = rows[0] as AiSettings | undefined;
  return (
    row ?? {
      provider: "anthropic",
      base_url: "",
      api_key: "",
      model: "claude-opus-5",
    }
  );
}

/**
 * What the dashboard is allowed to see. The key itself is never sent to the
 * browser — only whether one exists and its last four characters, which is
 * enough to tell two keys apart without being able to use either.
 */
export async function getAiStatus() {
  const s = await getAiSettings();
  const envKey =
    s.provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.AI_API_KEY;

  return {
    provider: s.provider,
    base_url: s.base_url,
    model: s.model,
    keySet: Boolean(s.api_key || envKey),
    keyHint: s.api_key ? `…${s.api_key.slice(-4)}` : "",
    fromEnv: Boolean(!s.api_key && envKey),
  };
}

/** An empty api_key means "leave the stored one alone", not "erase it". */
export async function saveAiSettings(next: Partial<AiSettings>) {
  const current = await getAiSettings();
  const merged = { ...current, ...next };
  const apiKey = next.api_key?.trim() ? next.api_key.trim() : current.api_key;

  await sql`
    update ai_settings set
      provider = ${merged.provider},
      base_url = ${merged.base_url.trim()},
      api_key  = ${apiKey},
      model    = ${merged.model.trim()},
      updated_at = now()
    where id = 1`;
}

export async function clearAiKey() {
  await sql`update ai_settings set api_key = '', updated_at = now() where id = 1`;
}
