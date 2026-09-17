"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Btn } from "./ui";

/**
 * A submit button that says what it is doing.
 *
 * The autopilot settings form saved perfectly well and looked like it had done
 * nothing at all: a server action, a revalidate, and a page that comes back
 * identical. Everything else in the dashboard shows "Saving…" and then the time
 * it saved, so it was reported as a button that could not be clicked.
 *
 * useFormStatus only reports pending, so "saved" is the falling edge of it —
 * which is also true to what happened: the action resolved and the page was
 * revalidated with what was sent.
 */
export function SaveRow({ label = "Save settings" }: { label?: string }) {
  const { pending } = useFormStatus();
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!pending) return;
    // the submit is in flight; record when it lands
    return () => setSavedAt(new Date().toLocaleTimeString());
  }, [pending]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Btn type="submit" disabled={pending}>
        {pending ? "Saving…" : label}
      </Btn>
      <span aria-live="polite" className="text-[14px] text-muted">
        {pending ? "Saving…" : savedAt ? `Saved ${savedAt}` : ""}
      </span>
    </div>
  );
}
