import { addFunction, updateEvent, updateFunction } from "@/lib/actions/events";
import { EVENT_STATUSES, FUNCTION_KINDS, functionDisplayName, labelFor } from "@/lib/constants";
import { formatDate, formatPkr } from "@/lib/format";
import { getOwnedEvent } from "@/lib/queries";

export default async function EventOverviewPage({
  params,
}: PageProps<"/dashboard/events/[id]">) {
  const { id } = await params;
  const event = await getOwnedEvent(id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <h2 className="display text-2xl">Functions</h2>
        {event.functions
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((fn) => (
            <form
              key={fn.id}
              action={updateFunction.bind(null, event.id)}
              className="space-y-3 rounded-2xl bg-white p-4"
            >
              <input type="hidden" name="functionId" value={fn.id} />
              <div className="flex items-center justify-between">
                <p className="font-medium">{functionDisplayName(fn)}</p>
                <p className="text-sm text-[#6b635a]">{formatDate(fn.date)}</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input name="customName" defaultValue={fn.customName ?? ""} placeholder="Custom name" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="date" type="date" defaultValue={fn.date ?? ""} className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="startTime" type="time" defaultValue={fn.startTime ?? ""} className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="endTime" type="time" defaultValue={fn.endTime ?? ""} className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="venueName" defaultValue={fn.venueName ?? ""} placeholder="Venue" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="city" defaultValue={fn.city ?? ""} placeholder="City" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="venueAddress" defaultValue={fn.venueAddress ?? ""} placeholder="Address" className="md:col-span-2 rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="expectedGuests" type="number" defaultValue={fn.expectedGuests ?? ""} placeholder="Expected guests" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
                <input name="budgetPkr" type="number" defaultValue={fn.budgetPkr ?? ""} placeholder="Budget PKR" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
              </div>
              <button className="text-sm text-[#0b4d3a]">Save function</button>
            </form>
          ))}

        <form action={addFunction.bind(null, event.id)} className="rounded-2xl border border-dashed border-[#d9c8a3] p-4">
          <p className="mb-2 text-sm font-medium">Add another function</p>
          <div className="flex flex-wrap gap-2">
            <select name="kind" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm">
              {FUNCTION_KINDS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input name="customName" placeholder="Name if other" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
            <input name="date" type="date" className="rounded-xl border border-[#e4d8c4] px-3 py-2 text-sm" />
            <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Add</button>
          </div>
        </form>
      </section>

      <form action={updateEvent.bind(null, event.id)} className="space-y-3 rounded-2xl bg-white p-5">
        <h2 className="display text-2xl">Event details</h2>
        <input name="title" defaultValue={event.title} className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="clientName" defaultValue={event.clientName} className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <select name="status" defaultValue={event.status} className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
          {EVENT_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <input name="clientPhone" defaultValue={event.clientPhone ?? ""} placeholder="Client phone" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="clientEmail" defaultValue={event.clientEmail ?? ""} placeholder="Client email" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="city" defaultValue={event.city ?? ""} placeholder="City" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="startDate" type="date" defaultValue={event.startDate ?? ""} className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="endDate" type="date" defaultValue={event.endDate ?? ""} className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="budgetPkr" type="number" defaultValue={event.budgetPkr ?? ""} placeholder="Budget PKR" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <textarea name="internalNotes" defaultValue={event.internalNotes ?? ""} placeholder="Internal notes" className="min-h-28 w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <p className="text-sm text-[#6b635a]">Budget {formatPkr(event.budgetPkr)} · {labelFor(EVENT_STATUSES, event.status)}</p>
        <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Save details</button>
      </form>
    </div>
  );
}
