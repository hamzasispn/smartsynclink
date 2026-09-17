"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Our own booking form, in place of the GHL widget.
 *
 * It reads the same calendar over GHL's API — free slots out, contact and
 * appointment back — so what a visitor sees is the site's own type, spacing and
 * colour rather than an iframe that cannot be styled.
 *
 * The shape is the one the client picked out: eyebrow and length across the
 * top, the ask, then day chips, times, and the details in two columns under a
 * single button. The colours and the type are the site's own.
 *
 * `onUnavailable` is the safety net: no times to show, a dead calendar, a
 * network failure — anything that means we cannot offer a real slot — and the
 * popup puts the GHL widget back. A booking form that cannot book is worse
 * than an ugly one.
 */
type Slots = Record<string, string[]>;

const TZ = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

/** The one dropdown, in place of the reference's trade picker. */
const NEEDS = [
  "AI receptionist for calls",
  "One inbox for every message",
  "Funnels and booking pages",
  "Everything — the full setup",
];

export function BookingForm({
  calendarId,
  eyebrow,
  title,
  subtitle,
  onUnavailable,
}: {
  calendarId: string;
  /** Small caps line above the heading. */
  eyebrow: string;
  /** The heading, and what names the appointment in GHL. */
  title: string;
  subtitle?: string;
  onUnavailable: () => void;
}) {
  const [slots, setSlots] = useState<Slots | null>(null);
  const [minutes, setMinutes] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);
  // settled once on mount: it is read during render, so it cannot be a ref
  const [timezone] = useState(TZ);

  useEffect(() => {
    let live = true;
    const url = `/api/booking/slots?calendar=${encodeURIComponent(calendarId)}&tz=${encodeURIComponent(timezone)}`;
    fetch(url)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("slots"))))
      .then((data: { days?: Slots; minutes?: number }) => {
        if (!live) return;
        if (!data.days || !Object.keys(data.days).length) {
          onUnavailable();
          return;
        }
        setSlots(data.days);
        setMinutes(data.minutes ?? 0);
        setDay(Object.keys(data.days).sort()[0]);
      })
      .catch(() => live && onUnavailable());
    return () => {
      live = false;
    };
  }, [calendarId, timezone, onUnavailable]);

  const days = useMemo(() => Object.keys(slots ?? {}).sort(), [slots]);

  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    });

  // the key is a plain calendar date; noon keeps it on that date in any zone
  const dayDate = (key: string) => new Date(`${key}T12:00:00`);
  const longLabel = (key: string) =>
    dayDate(key)
      .toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
      .toUpperCase();
  /** Just the city: "America/Chicago" is too long for a phone's header row. */
  const place = timezone.split("/").pop()?.replace(/_/g, " ") ?? timezone;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!slot || sending) return;
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendar: calendarId,
          slot,
          timezone,
          title,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          city: form.get("city") || undefined,
          notes: form.get("needs") || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "booking failed, please try again");
      setBooked(slot);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "booking failed, please try again");
    } finally {
      setSending(false);
    }
  }

  if (booked) {
    return (
      <div className="flex flex-col items-center px-7 py-16 text-center sm:px-9">
        <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <p className="mt-5 text-[24px] font-medium tracking-[-0.02em] text-ink">You are booked in</p>
        <p className="mt-2 text-[16px] text-muted">
          {new Date(booked).toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: timezone,
          })}
          {" · "}
          {time(booked)}
        </p>
        <p className="mt-1 text-[14px] text-muted">A confirmation is on its way to your inbox.</p>
      </div>
    );
  }

  if (!slots) {
    return (
      <div className="grid place-items-center px-7 py-24">
        <span
          className="size-7 animate-spin rounded-full border-2 border-line border-t-brand"
          aria-label="Loading times"
        />
      </div>
    );
  }

  const field =
    "w-full rounded-[10px] border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-white";
  const on = "border-transparent bg-gradient-to-r from-[#052EFF] to-[#3300EA] text-white";
  const off = "border-line bg-white text-ink hover:border-brand";

  return (
    <form onSubmit={submit} className="px-5 pt-6 pb-7 sm:px-8 sm:pt-8 sm:pb-8">
      {/* pr-12 keeps the eyebrow clear of the close button, which sits inside
          the card on a phone and outside its corner from sm up */}
      <div className="flex items-center justify-between gap-3 pr-12 sm:pr-0">
        <p className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{eyebrow}</p>
        {minutes ? (
          <p className="shrink-0 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
            {minutes} min
          </p>
        ) : null}
      </div>

      <h2 className="mt-3 max-w-[22ch] text-[23px] leading-[1.18] font-medium tracking-[-0.03em] text-ink sm:mt-4 sm:text-[28px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2.5 max-w-[54ch] text-[14px] leading-[1.6] text-muted sm:text-[15px]">
          {subtitle}
        </p>
      ) : null}

      <hr className="mt-5 border-line sm:mt-6" />

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className="truncate text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
          {day ? longLabel(day) : ""}
        </p>
        <p className="shrink-0 text-[12px] text-muted">Times in {place}</p>
      </div>

      {/* two lines per chip: half the width of "Fri, Sep 18", so a phone shows
          four days at once instead of two */}
      <div className="booking-scroll mt-3 flex gap-2 overflow-x-auto pb-2.5">
        {days.map((key) => {
          const date = dayDate(key);
          return (
            <button
              key={key}
              type="button"
              aria-pressed={key === day}
              aria-label={longLabel(key)}
              onClick={() => {
                setDay(key);
                setSlot(null);
              }}
              className={`w-[62px] shrink-0 rounded-[12px] border py-2 text-center transition-colors ${
                key === day ? on : off
              }`}
            >
              <span className="block text-[11px] uppercase opacity-70">
                {date.toLocaleDateString([], { weekday: "short" })}
              </span>
              <span className="block text-[17px] leading-tight font-semibold">
                {date.toLocaleDateString([], { day: "numeric" })}
              </span>
              <span className="block text-[11px] opacity-70">
                {date.toLocaleDateString([], { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid max-h-[152px] grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2 overflow-y-auto sm:max-h-[176px]">
        {(day ? slots[day] : []).map((iso) => (
          <button
            key={iso}
            type="button"
            aria-pressed={iso === slot}
            onClick={() => setSlot(iso)}
            className={`rounded-[10px] border px-2 py-2.5 text-center text-[14px] font-medium transition-colors ${
              iso === slot ? on : off
            }`}
          >
            {time(iso)}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <input name="name" required autoComplete="name" placeholder="Full name" className={field} />
        <input name="phone" required type="tel" autoComplete="tel" placeholder="Mobile number" className={field} />
        <input name="email" required type="email" autoComplete="email" placeholder="Email" className={field} />
        <input name="city" autoComplete="address-level2" placeholder="City (optional)" className={field} />
        <select name="needs" defaultValue="" className={`${field} sm:col-span-2`}>
          <option value="" disabled>
            What do you need most?
          </option>
          {NEEDS.map((need) => (
            <option key={need} value={need}>
              {need}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-[13px] font-medium text-[#B42318]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!slot || sending}
        className="mt-4 w-full rounded-[12px] bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-6 py-3.5 text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {sending ? "Booking…" : slot ? `Book ${time(slot)} →` : "Pick a time first"}
      </button>
    </form>
  );
}
