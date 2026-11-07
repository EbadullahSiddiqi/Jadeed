import { eq } from "drizzle-orm";
import { assignVendor, updateBookingStatus } from "@/lib/actions/events";
import { getDb } from "@/db";
import { vendors } from "@/db/schema";
import { requireOrganization } from "@/lib/auth";
import {
  BOOKING_STATUSES,
  VENDOR_CATEGORIES,
  functionDisplayName,
  labelFor,
} from "@/lib/constants";
import { formatPkr } from "@/lib/format";
import { getOwnedEvent } from "@/lib/queries";

export default async function EventVendorsPage({
  params,
}: PageProps<"/dashboard/events/[id]/vendors">) {
  const { id } = await params;
  const event = await getOwnedEvent(id);
  const org = await requireOrganization();
  const db = getDb();
  const directory = await db.query.vendors.findMany({
    where: eq(vendors.organizationId, org.id),
  });

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-[#6b635a]">
        Vendors live in two layers: your reusable <strong>vendor book</strong>,
        and <strong>bookings</strong> on this event. Assign a caterer to Walima
        only, or a photographer across every function.
      </p>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form action={assignVendor.bind(null, event.id)} className="h-fit space-y-3 rounded-2xl bg-white p-5">
          <h2 className="display text-2xl">Assign vendor</h2>
          <select name="vendorId" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
            <option value="">One-off / not in book</option>
            {directory.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name} · {labelFor(VENDOR_CATEGORIES, vendor.category)}
              </option>
            ))}
          </select>
          <input name="displayName" required placeholder="Name shown on this event" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
          <select name="category" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
            {VENDOR_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <select name="functionId" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
            <option value="">Whole event</option>
            {event.functions.map((fn) => (
              <option key={fn.id} value={fn.id}>{functionDisplayName(fn)}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input name="quotedPkr" type="number" placeholder="Quoted PKR" className="rounded-xl border border-[#e4d8c4] px-3 py-2" />
            <input name="paidPkr" type="number" placeholder="Paid PKR" className="rounded-xl border border-[#e4d8c4] px-3 py-2" />
          </div>
          <select name="status" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
            {BOOKING_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visibleToClient" defaultChecked />
            Visible on client portal
          </label>
          <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Assign</button>
        </form>

        <div className="space-y-3">
          {event.eventVendors.map((booking) => (
            <form
              key={booking.id}
              action={updateBookingStatus.bind(null, event.id)}
              className="rounded-2xl bg-white p-4"
            >
              <input type="hidden" name="bookingId" value={booking.id} />
              <p className="font-medium">{booking.displayName}</p>
              <p className="text-sm text-[#6b635a]">
                {labelFor(VENDOR_CATEGORIES, booking.category)} ·{" "}
                {booking.function ? functionDisplayName(booking.function) : "All functions"} · quoted{" "}
                {formatPkr(booking.quotedPkr)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <select name="status" defaultValue={booking.status} className="rounded-lg border border-[#e4d8c4] px-2 py-1 text-sm">
                  {BOOKING_STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <input name="paidPkr" type="number" defaultValue={booking.paidPkr ?? ""} placeholder="Paid" className="w-28 rounded-lg border border-[#e4d8c4] px-2 py-1 text-sm" />
                <button className="text-sm text-[#0b4d3a]">Update</button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
