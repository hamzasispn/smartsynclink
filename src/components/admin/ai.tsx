"use client";

import { useState, useTransition } from "react";
import { assistAction, type Assist, type AssistResult } from "@/app/admin/ai-actions";

export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`size-3.5 ${className}`}>
      <path
        className="fill-current"
        d="M8 0.8l1.5 4.2 4.2 1.5-4.2 1.5L8 12.2 6.5 8 2.3 6.5 6.5 5zM13 10.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"
      />
    </svg>
  );
}

/**
 * Drives every AI button in the dashboard: one in-flight request at a time,
 * keyed so each button can show its own spinner, with the error surfaced to
 * the caller instead of thrown.
 */
export function useAssist() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  function run(key: string, input: Assist, onDone: (r: AssistResult) => void) {
    setBusy(key);
    setError(null);
    start(async () => {
      const result = await assistAction(input);
      if (!result.ok) setError(result.error);
      else onDone(result);
      setBusy(null);
    });
  }

  return { busy, error, setError, run };
}

export function AiBtn({
  label,
  busyLabel = "Working…",
  active,
  disabled,
  onClick,
}: {
  label: string;
  busyLabel?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || active}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/[0.06] px-3.5 py-1.5 text-[13px] text-brand transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Spark />
      {active ? busyLabel : label}
    </button>
  );
}

export function AiError({
  error,
  onDismiss,
}: {
  error: string | null;
  onDismiss: () => void;
}) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="flex items-start justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700"
    >
      <span>{error}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="shrink-0">
        ✕
      </button>
    </p>
  );
}

/** Picker shown when an assist returns several options to choose from. */
export function AiChoices({
  options,
  onPick,
  onClose,
}: {
  options: string[];
  onPick: (value: string) => void;
  onClose: () => void;
}) {
  if (!options.length) return null;
  return (
    <div className="rounded-xl border border-line bg-page p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#1e1e1e]">Pick one</span>
        <button type="button" onClick={onClose} className="text-[13px] text-muted">
          Close
        </button>
      </div>
      <ul className="space-y-1.5">
        {options.map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => onPick(option)}
              className="w-full rounded-lg bg-white px-3.5 py-2.5 text-left text-[15px] text-[#1e1e1e] transition-colors hover:bg-brand/[0.06]"
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
