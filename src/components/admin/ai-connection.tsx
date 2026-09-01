"use client";

import { useState, useTransition } from "react";
import { clearAiKeyAction, saveAiSettingsAction } from "@/app/admin/actions";
import { testAiAction } from "@/app/admin/ai-actions";
import { AiBtn } from "./ai";
import { Btn, Card, Field, Pill, inputClass } from "./ui";

type Status = {
  provider: string;
  base_url: string;
  model: string;
  keySet: boolean;
  keyHint: string;
  fromEnv: boolean;
};

/** Ready-made endpoints, so nobody has to hunt for a base URL. */
const PRESETS = [
  { label: "OpenAI", url: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  {
    label: "Google Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.5-flash",
  },
  { label: "Groq", url: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile" },
  { label: "OpenRouter", url: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini" },
  { label: "DeepSeek", url: "https://api.deepseek.com/v1", model: "deepseek-chat" },
  { label: "Ollama (local)", url: "http://localhost:11434/v1", model: "llama3.1" },
];

type TestResult =
  | { ok: true; provider: string; model: string; reply: string }
  | { ok: false; error: string }
  | null;

export function AiConnection({ status }: { status: Status }) {
  const [provider, setProvider] = useState(status.provider);
  const [baseUrl, setBaseUrl] = useState(status.base_url);
  const [model, setModel] = useState(status.model);
  const [testing, startTest] = useTransition();
  const [result, setResult] = useState<TestResult>(null);

  const compatible = provider === "openai-compatible";

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[16px] font-medium text-[#1e1e1e]">AI connection</h2>
        <Pill tone={status.keySet ? "good" : "warn"}>
          {status.keySet ? "Connected" : "No key"}
        </Pill>
      </div>

      <form action={saveAiSettingsAction} className="space-y-5">
        <Field label="Provider">
          <select
            name="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={inputClass}
          >
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="openai-compatible">
              OpenAI-compatible (OpenAI, Gemini, Groq, OpenRouter, Ollama…)
            </option>
          </select>
        </Field>

        {compatible ? (
          <>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setBaseUrl(preset.url);
                    setModel(preset.model);
                  }}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] text-[#1e1e1e] transition-colors hover:border-brand hover:text-brand"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <Field label="Base URL" hint="Must end at /v1 (or the provider's equivalent).">
              <input
                name="base_url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.groq.com/openai/v1"
                className={inputClass}
              />
            </Field>
          </>
        ) : (
          <input type="hidden" name="base_url" value={baseUrl} />
        )}

        <Field
          label="Model"
          hint={
            compatible
              ? "Exactly as that provider names it."
              : "e.g. claude-opus-5, claude-sonnet-5, claude-haiku-4-5"
          }
        >
          <input
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          label="API key"
          hint={
            status.fromEnv
              ? "Currently coming from an environment variable. Saving a key here overrides it."
              : status.keySet
                ? `A key is saved (${status.keyHint}). Leave blank to keep it.`
                : "Stored in your database, never shown again after saving."
          }
        >
          <input
            name="api_key"
            type="password"
            autoComplete="off"
            placeholder={status.keySet ? "••••••••  (unchanged)" : "Paste the key"}
            className={inputClass}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <Btn type="submit">Save connection</Btn>
          <AiBtn
            label="Test connection"
            busyLabel="Testing…"
            active={testing}
            onClick={() =>
              startTest(async () => {
                setResult(null);
                setResult(await testAiAction());
              })
            }
          />
          {status.keySet && !status.fromEnv ? (
            <button
              type="button"
              onClick={() => startTest(async () => void (await clearAiKeyAction()))}
              className="text-[13px] text-red-600 hover:underline"
            >
              Remove key
            </button>
          ) : null}
        </div>
      </form>

      {result?.ok ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[14px] text-emerald-800">
          {result.provider} answered with “{result.reply}” using{" "}
          <code className="rounded bg-white/70 px-1.5 py-0.5">{result.model}</code>.
          Everything is wired up.
        </p>
      ) : null}

      {result && !result.ok ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {result.error}
        </p>
      ) : null}

      <p className="text-[13px] leading-[1.7] text-muted">
        Test after saving — the button uses what is stored, not what is typed.
      </p>
    </Card>
  );
}
