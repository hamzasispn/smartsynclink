"use client";

import { useId, useState, type FormEvent } from "react";

/**
 * The newsletter sign-up, wherever it sits: a name, an email and the button,
 * posted to /api/newsletter, which puts the person into GHL as a tagged
 * contact. `where` becomes their tag, so the team can see which form they
 * used.
 *
 * With `details` (the footer) it also asks for a phone, a business name and
 * an industry — name, email and industry required, the rest optional — and
 * the button runs the full width under them.
 *
 * Every field is 16px: iOS Safari zooms the page into any input set smaller
 * than that the moment it is tapped.
 */
export type NewsletterDetails = {
  phonePlaceholder: string;
  businessPlaceholder: string;
  industryPlaceholder: string;
  industries: string[];
  note: string;
};
type Size = "md" | "lg";

const FIELD: Record<Size, string> = {
  md: "w-full rounded-full border border-line bg-white px-4 py-2.5 text-[16px] text-[#1e1e1e] outline-none placeholder:text-muted focus-visible:border-brand",
  lg: "h-[52px] w-full rounded-full border border-line bg-white px-6 text-[16px] text-ink outline-none placeholder:text-muted focus-visible:border-brand",
};

export function NewsletterForm({
  where,
  namePlaceholder,
  emailPlaceholder,
  cta,
  success,
  size = "md",
  details,
  className = "",
}: {
  where: "footer" | "blog";
  namePlaceholder: string;
  emailPlaceholder: string;
  cta: string;
  success: string;
  size?: Size;
  details?: NewsletterDetails;
  className?: string;
}) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          ...(details
            ? { phone: form.get("phone") || undefined, business: form.get("business") || undefined, industry: form.get("industry") }
            : {}),
          where,
          page: window.location.pathname,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "That didn't go through — please try again.");
      setState("done");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "That didn't go through — please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className={`flex items-center gap-2 text-[15px] font-medium text-ink ${className}`}>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#dcfce7]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 stroke-[#16a34a]" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        {success}
      </p>
    );
  }

  const sending = state === "sending";

  return (
    <form onSubmit={submit} className={`flex flex-col gap-2.5 ${className}`}>
      {/* the honeypot: out of sight and out of the tab order for people */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <label className="sr-only" htmlFor={`${id}-name`}>
        {namePlaceholder}
      </label>
      <input
        id={`${id}-name`}
        name="name"
        type="text"
        required
        minLength={2}
        maxLength={80}
        autoComplete="name"
        placeholder={namePlaceholder}
        className={FIELD[size]}
      />

      <label className="sr-only" htmlFor={`${id}-email`}>
        {emailPlaceholder}
      </label>
      {details ? (
        <>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder={emailPlaceholder}
            className={FIELD.md}
          />
          <div className="grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2">
            <label className="sr-only" htmlFor={`${id}-phone`}>
              {details.phonePlaceholder}
            </label>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              maxLength={30}
              autoComplete="tel"
              placeholder={details.phonePlaceholder}
              className={FIELD.md}
            />
            <label className="sr-only" htmlFor={`${id}-business`}>
              {details.businessPlaceholder}
            </label>
            <input
              id={`${id}-business`}
              name="business"
              type="text"
              maxLength={120}
              autoComplete="organization"
              placeholder={details.businessPlaceholder}
              className={FIELD.md}
            />
          </div>
          <label className="sr-only" htmlFor={`${id}-industry`}>
            {details.industryPlaceholder}
          </label>
          <div className="relative">
            <select
              id={`${id}-industry`}
              name="industry"
              required
              defaultValue=""
              className={`${FIELD.md} appearance-none pr-10 invalid:text-muted`}
            >
              <option value="" disabled>
                {details.industryPlaceholder}
              </option>
              {details.industries.map((industry) => (
                <option key={industry} value={industry} className="text-[#1e1e1e]">
                  {industry}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="mt-1 rounded-full bg-brand px-5 py-3 text-[16px] font-medium text-white transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {sending ? "Sending…" : cta}
          </button>
          {details.note ? <p className="px-2 text-[13px] leading-snug text-muted">{details.note}</p> : null}
        </>
      ) : size === "lg" ? (
        <div className="relative">
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder={emailPlaceholder}
            className={`${FIELD.lg} pr-[112px]`}
          />
          <button
            type="submit"
            disabled={sending}
            className="absolute top-1.5 right-1.5 h-10 rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-5 text-[16px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "…" : cta}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-line bg-white p-1 pl-4 focus-within:border-brand">
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder={emailPlaceholder}
            className="w-full min-w-0 flex-1 bg-transparent text-[16px] text-[#1e1e1e] outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={sending}
            className="shrink-0 rounded-full bg-brand px-5 py-2 text-[16px] font-normal text-white transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {sending ? "…" : cta}
          </button>
        </div>
      )}

      {state === "error" ? (
        <p role="alert" className="px-2 text-[14px] text-[#b91c1c]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
