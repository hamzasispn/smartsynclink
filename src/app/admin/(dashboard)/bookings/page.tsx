import { Card, Empty, PageHeader, Pill } from "@/components/admin/ui";
import { listBookings } from "@/lib/bookings";
import { ghlReady } from "@/lib/ghl";

export const dynamic = "force-dynamic";

/** The slot is stored as the visitor read it, so it is shown the same way. */
function when(slot: string, timezone: string) {
  const date = new Date(slot);
  if (Number.isNaN(date.getTime())) return slot;
  return `${date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })} · ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} (${timezone})`;
}

export default async function BookingsPage() {
  const bookings = await listBookings();

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle={
          ghlReady()
            ? "Taken by the booking popup and written through to the GHL calendar."
            : "Taken by the booking popup. GHL is not connected yet, so these are requests to confirm by hand."
        }
      />

      {bookings.length ? (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {bookings.map((booking) => (
              <li key={booking.id} className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] text-[#1e1e1e]">{booking.name}</p>
                    <p className="mt-0.5 truncate text-[13px] text-muted">
                      {booking.email} · {booking.phone}
                      {booking.city ? ` · ${booking.city}` : ""}
                    </p>
                  </div>
                  <Pill tone={ghlReady() ? "good" : "neutral"}>
                    {when(booking.slot, booking.timezone)}
                  </Pill>
                </div>
                {booking.notes ? (
                  <p className="mt-2 text-[13px] text-muted">{booking.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Empty>No bookings yet.</Empty>
      )}
    </>
  );
}
