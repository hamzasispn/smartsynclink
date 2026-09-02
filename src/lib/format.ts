/**
 * Date strings that survive hydration.
 *
 * toLocaleDateString() / toLocaleString() with no locale use whatever the
 * runtime happens to default to: Node's locale and timezone when the server
 * renders, the visitor's own when React hydrates. For anyone outside the
 * server's timezone those two strings differ, and React reports the tree as
 * mismatched. Pinning both sides makes them agree.
 *
 * ponytail: fixed to UTC rather than plumbing the reader's timezone through.
 * Dates carry no time so nobody notices; timestamps say UTC out loud instead
 * of quietly being five hours off. Swap in a client-side converter only if
 * editors actually ask to see their own clock.
 */
const LOCALE = "en-US";
const ZONE = "UTC";

const day = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: ZONE,
});

const stamp = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: ZONE,
});

/** "September 3, 2026" */
export const formatDate = (value: string | Date) => day.format(new Date(value));

/** "Sep 3, 2026, 02:30 PM UTC" */
export const formatDateTime = (value: string | Date) =>
  `${stamp.format(new Date(value))} UTC`;
