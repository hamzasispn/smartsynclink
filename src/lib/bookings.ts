import { sql } from "./db";

/**
 * The booking popup's own form works whether or not GHL is connected.
 *
 * With a token it reads real availability and writes a real appointment (see
 * ghl.ts). Without one it still takes the booking — suggested times here, the
 * request saved to our own table and listed in the admin — because a form the
 * client can see on the site today is the point, and a lead is not something
 * to drop while we wait for a key.
 */

/** Suggested hours, when GHL is not the one answering. */
const OPEN = 9;
const CLOSE = 17;
const STEP_MINUTES = 30;
const DAYS = 21;

export type Booking = {
  id: string;
  calendarId: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
  slot: string;
  timezone: string;
  createdAt: string;
};

/**
 * Wall-clock slots — "2026-09-19T09:00" — with no offset on purpose: the
 * browser reads them in its own zone, which is the zone they were offered in.
 *
 * Starts tomorrow rather than today. The server's date and the visitor's can
 * differ by a day either way, and a whole day of slack is cheaper than the
 * timezone arithmetic needed to offer this afternoon correctly.
 *
 * ponytail: suggested times, not held ones — two people can ask for the same
 * slot and a human sorts it out. Connect GHL and real availability takes over.
 */
export function suggestedSlots() {
  const days: Record<string, string[]> = {};
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  for (let day = 1; day <= DAYS; day++) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() === 0 || cursor.getDay() === 6) continue;

    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(
      cursor.getDate(),
    ).padStart(2, "0")}`;
    const slots: string[] = [];
    for (let minutes = OPEN * 60; minutes < CLOSE * 60; minutes += STEP_MINUTES) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      slots.push(`${key}T${hour}:${minute}`);
    }
    days[key] = slots;
  }
  return days;
}

export async function saveBooking(booking: Omit<Booking, "id" | "createdAt">) {
  const [row] = await sql`
    insert into bookings (calendar_id, title, name, email, phone, city, notes, slot, timezone)
    values (${booking.calendarId}, ${booking.title}, ${booking.name}, ${booking.email},
            ${booking.phone}, ${booking.city}, ${booking.notes}, ${booking.slot}, ${booking.timezone})
    returning id`;
  return row.id as string;
}

export async function listBookings(limit = 100): Promise<Booking[]> {
  const rows = await sql`
    select id, calendar_id, title, name, email, phone, city, notes, slot, timezone, created_at
    from bookings
    order by created_at desc
    limit ${limit}`;
  return rows.map((row) => ({
    id: row.id,
    calendarId: row.calendar_id,
    title: row.title,
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    notes: row.notes,
    slot: row.slot,
    timezone: row.timezone,
    createdAt: row.created_at,
  }));
}
