import { z } from "zod";
import { saveBooking } from "@/lib/bookings";
import { createAppointment, ghlReady, GhlError, isGhlId, upsertContact } from "@/lib/ghl";

/**
 * Books one appointment: the person first, then the slot.
 *
 * Everything is validated here rather than in the form alone — this route is
 * open to the internet, and the values go on to GHL as a real contact.
 */
const Booking = z.object({
  calendar: z.string().refine(isGhlId, "unknown calendar"),
  // the exact string free-slots returned, offset and all
  slot: z.string().min(10).max(40),
  timezone: z.string().min(1).max(64),
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  phone: z.string().trim().min(6).max(32),
  city: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(500).optional(),
  title: z.string().trim().max(120).optional(),
});

export async function POST(request: Request) {
  const parsed = Booking.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "check the details and try again" }, { status: 400 });
  }
  const booking = parsed.data;

  if (Number.isNaN(Date.parse(booking.slot))) {
    return Response.json({ error: "that time is no longer available" }, { status: 400 });
  }

  // Every booking is kept here, GHL or not: this table is the record the admin
  // lists, and it is the whole booking while no token is set.
  const title = booking.title || `${booking.name} — SmartSyncLink`;
  try {
    await saveBooking({
      calendarId: booking.calendar,
      title,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      city: booking.city ?? "",
      notes: booking.notes ?? "",
      slot: booking.slot,
      timezone: booking.timezone,
    });
  } catch (error) {
    console.error("booking could not be saved:", error);
    if (!ghlReady()) {
      return Response.json({ error: "booking failed, please try again" }, { status: 502 });
    }
  }

  if (!ghlReady()) return Response.json({ ok: true, slot: booking.slot });

  try {
    const contactId = await upsertContact(booking);
    await createAppointment({
      calendarId: booking.calendar,
      contactId,
      startTime: booking.slot,
      timezone: booking.timezone,
      title,
      notes: booking.notes,
    });
    return Response.json({ ok: true, slot: booking.slot });
  } catch (error) {
    console.error("booking failed:", error);
    // 4xx from GHL is nearly always the slot going while the form was open
    const taken = error instanceof GhlError && error.status > 0 && error.status < 500;
    return Response.json(
      { error: taken ? "that time was just taken — pick another" : "booking failed, please try again" },
      { status: taken ? 409 : 502 },
    );
  }
}
