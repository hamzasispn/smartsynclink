"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { runAutopilotAction } from "@/app/admin/actions";
import { Btn, Field, inputClass } from "./ui";

type Result = { ok: true; title: string } | { ok: false; error: string } | null;

export function AutopilotRun({ autoPublish }: { autoPublish: boolean }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<Result>(null);

  return (
    <form
      action={(form) => {
        setResult(null);
        start(async () => setResult(await runAutopilotAction(form)));
      }}
      className="space-y-4"
    >
      <Field
        label="Topic"
        hint="Leave empty to pick one from the topic list at random."
      >
        <input
          name="topic"
          placeholder="e.g. What a missed call actually costs a contractor"
          className={inputClass}
        />
      </Field>

      <Btn type="submit" disabled={pending}>
        {pending ? "Writing…" : "Write one now"}
      </Btn>

      {result?.ok ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[14px] text-emerald-800">
          Wrote “{result.title}” as {autoPublish ? "a published post" : "a draft"}.{" "}
          <Link href="/admin/blog" className="underline">
            Open the blog
          </Link>
          .
        </p>
      ) : null}

      {result && !result.ok ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700"
        >
          {result.error}
        </p>
      ) : null}
    </form>
  );
}
