import { suggestedSlots } from "@/lib/bookings";
import { calendarInfo, freeSlots, ghlReady, isGhlId } from "@/lib/ghl";

/** How far ahead the popup offers, in days. */
const WINDOW = 21;

/**
 * Times for one calendar, in the visitor's own timezone.
 *
 * Two modes, and which one is running matters:
 *
 *   GHL connected — the times are really free, and booking one writes a real
 *     appointment. If it has none to give (a closed booking window, a full
 *     team) the answer is an empty day list, never invented times: the popup
 *     falls back to GHL's own widget, and nobody is offered a slot that the
 *     booking call would then refuse.
 *
 *   No token — our own suggested hours, and the booking is saved as a request
 *     for someone to confirm. See lib/bookings.ts.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const calendarId = searchParams.get("calendar") ?? "";
  const timezone = searchParams.get("tz") || "UTC";

  if (!isGhlId(calendarId)) {
    return Response.json({ error: "unknown calendar" }, { status: 400 });
  }

  if (!ghlReady()) {
    return Response.json({ live: false, timezone, days: suggestedSlots() });
  }

  const start = Date.now();
  try {
    // the card wants the length of the appointment too — "15 MIN" on the header
    const [days, info] = await Promise.all([
      freeSlots(calendarId, start, start + WINDOW * 86_400_000, timezone),
      calendarInfo(calendarId).catch(() => ({ minutes: 0 })),
    ]);
    return Response.json({ live: true, timezone, days, minutes: info.minutes });
  } catch (error) {
    console.error("free slots failed, falling back to the widget:", error);
    return Response.json({ live: true, timezone, days: {} });
  }
}
