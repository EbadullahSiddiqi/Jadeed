"use client";

import { functionDisplayName, GUEST_SIDES, RSVP_STATUSES } from "@/lib/constants";
import { addGuest, updateInvite, useOwnedEvent } from "@/lib/store";

export default function GuestsPage() {
  const { event } = useOwnedEvent();
  if (!event) return null;
  const functions = event.functions.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form action={addGuest.bind(null, event.id)} className="h-fit space-y-3 rounded-2xl bg-white p-5">
        <h2 className="display text-2xl">Add guest</h2>
        <p className="text-sm text-[#6b635a]">
          Invite the same household to selected functions only — Mehendi lists
          are often smaller than Barat.
        </p>
        <input name="name" required placeholder="Name" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="phone" placeholder="Phone" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="household" placeholder="Household / family name" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <div className="grid grid-cols-2 gap-2">
          <select name="side" className="rounded-xl border border-[#e4d8c4] px-3 py-2">
            {GUEST_SIDES.map((item) => (
              <option key={item.value} value={item.value}>{item.label} side</option>
            ))}
          </select>
          <input name="partySize" type="number" defaultValue={1} className="rounded-xl border border-[#e4d8c4] px-3 py-2" />
        </div>
        <div className="space-y-1">
          {functions.map((fn) => (
            <label key={fn.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="functionIds" value={fn.id} defaultChecked />
              {functionDisplayName(fn)}
            </label>
          ))}
        </div>
        <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Add guest</button>
      </form>

      <div className="space-y-4">
        {event.guests.map((guest) => (
          <article key={guest.id} className="rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{guest.name}</p>
                <p className="text-sm text-[#6b635a]">
                  {guest.household ?? "Household"} · party of {guest.partySize} · {guest.side}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {guest.invites.map((invite) => {
                const fn = functions.find((item) => item.id === invite.functionId);
                return (
                  <form
                    key={invite.id}
                    action={updateInvite.bind(null, event.id)}
                    className="flex flex-wrap items-center gap-2 text-sm"
                  >
                    <input type="hidden" name="inviteId" value={invite.id} />
                    <span className="w-28">{fn ? functionDisplayName(fn) : "Function"}</span>
                    <select key={invite.rsvpStatus} name="rsvpStatus" defaultValue={invite.rsvpStatus} className="rounded-lg border border-[#e4d8c4] px-2 py-1">
                      {RSVP_STATUSES.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    <input
                      name="attendingCount"
                      type="number"
                      defaultValue={invite.attendingCount ?? guest.partySize}
                      className="w-20 rounded-lg border border-[#e4d8c4] px-2 py-1"
                    />
                    <button className="text-[#0b4d3a]">Save</button>
                  </form>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
