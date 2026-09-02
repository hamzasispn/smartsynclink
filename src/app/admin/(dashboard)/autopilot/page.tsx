import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { Btn, Card, Field, PageHeader, Pill, inputClass } from "@/components/admin/ui";
import { AutopilotRun } from "@/components/admin/autopilot-run";
import { TopicsField } from "@/components/admin/topics-field";
import { getAiStatus } from "@/lib/ai-settings";
import { getAutopilot } from "@/lib/autopilot";
import { saveAutopilotAction } from "@/app/admin/actions";

export default async function AutopilotPage() {
  const [cfg, ai] = await Promise.all([getAutopilot(), getAiStatus()]);
  const providerName =
    ai.provider === "anthropic" ? "Anthropic" : ai.base_url || "OpenAI-compatible";

  return (
    <>
      <PageHeader
        title="Blog autopilot"
        subtitle="The brief the AI writes from, and how often it runs."
        action={
          <Pill tone={cfg.enabled ? "good" : "neutral"}>
            {cfg.enabled ? "On" : "Off"}
          </Pill>
        }
      />

      {!ai.keySet ? (
        <p className="mb-5 rounded-2xl bg-amber-50 px-5 py-4 text-[15px] leading-[1.7] text-amber-800">
          <strong className="font-medium">AI is not connected yet.</strong> Add a
          provider and key under{" "}
          <Link href="/admin/settings" className="underline">
            Settings → AI connection
          </Link>
          . Everything on this page can be set up first.
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <form action={saveAutopilotAction}>
          <Card className="space-y-5">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                name="enabled"
                defaultChecked={cfg.enabled}
                className="size-4 accent-[#3300ea]"
              />
              <span className="text-[15px] text-[#1e1e1e]">
                Write posts automatically
              </span>
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="How often (hours)">
                <input
                  name="every_hours"
                  type="number"
                  min={1}
                  defaultValue={cfg.every_hours}
                  className={inputClass}
                />
              </Field>
              <Field label="Length (words)">
                <input
                  name="words"
                  type="number"
                  min={200}
                  step={50}
                  defaultValue={cfg.words}
                  className={inputClass}
                />
              </Field>
            </div>

            <TopicsField initial={cfg.topics} />

            <Field label="Who it is written for">
              <input
                name="audience"
                defaultValue={cfg.audience}
                className={inputClass}
              />
            </Field>

            <Field label="Tone">
              <textarea
                name="tone"
                rows={2}
                defaultValue={cfg.tone}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                name="auto_publish"
                defaultChecked={cfg.auto_publish}
                className="size-4 accent-[#3300ea]"
              />
              <span className="text-[15px] text-[#1e1e1e]">
                Publish immediately instead of saving a draft
              </span>
            </label>

            <Btn type="submit">Save settings</Btn>
          </Card>
        </form>

        <div className="space-y-5">
          <Card>
            <h2 className="mb-4 text-[16px] font-medium text-[#1e1e1e]">Try it</h2>
            <AutopilotRun autoPublish={cfg.auto_publish} />
          </Card>

          <Card>
            <h2 className="mb-4 text-[16px] font-medium text-[#1e1e1e]">Schedule</h2>
            <dl className="space-y-2.5 text-[15px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Writing with</dt>
                <dd className="truncate text-right text-[#1e1e1e]">
                  {providerName}
                  {ai.keySet ? "" : " (no key)"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Model</dt>
                <dd className="truncate text-right text-[#1e1e1e]">{ai.model}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Last run</dt>
                <dd className="text-[#1e1e1e]">
                  {cfg.last_run_at
                    ? formatDateTime(cfg.last_run_at)
                    : "never"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Next run</dt>
                <dd className="text-[#1e1e1e]">
                  {cfg.next_run_at
                    ? formatDateTime(cfg.next_run_at)
                    : "—"}
                </dd>
              </div>
            </dl>

            {cfg.last_error ? (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">
                {cfg.last_error}
              </p>
            ) : null}

            <p className="mt-4 text-[13px] leading-[1.7] text-muted">
              The schedule only fires when something calls{" "}
              <code className="rounded bg-page px-1.5 py-0.5">
                /api/cron/autopilot
              </code>
              . On Vercel that is wired up in{" "}
              <code className="rounded bg-page px-1.5 py-0.5">vercel.json</code>;
              anywhere else, point a cron service at it with the{" "}
              <code className="rounded bg-page px-1.5 py-0.5">CRON_SECRET</code>{" "}
              bearer token.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
