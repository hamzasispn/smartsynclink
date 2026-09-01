"use client";

import { useState } from "react";
import { AiBtn, AiError, useAssist } from "./ai";
import { Field, inputClass } from "./ui";

export function TopicsField({ initial }: { initial: string[] }) {
  const [topics, setTopics] = useState(initial.join("\n"));
  const { busy, error, setError, run } = useAssist();

  const existing = topics
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3">
      <Field label="Topics" hint="One per line. A random one is used each run.">
        <textarea
          name="topics"
          rows={8}
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className={`${inputClass} resize-y leading-[1.7]`}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <AiBtn
          label={existing.length ? "Suggest 8 more" : "Suggest topics"}
          busyLabel="Thinking…"
          active={busy === "topics"}
          onClick={() =>
            run("topics", { kind: "topics", count: 8, existing }, (r) => {
              if (r.ok && r.kind === "topics") {
                // append, so a suggestion never wipes what is already there
                setTopics([...existing, ...r.topics].join("\n"));
              }
            })
          }
        />
        {existing.length ? (
          <span className="text-[13px] text-muted">
            {existing.length} topic{existing.length === 1 ? "" : "s"} queued
          </span>
        ) : null}
      </div>

      <AiError error={error} onDismiss={() => setError(null)} />
    </div>
  );
}
