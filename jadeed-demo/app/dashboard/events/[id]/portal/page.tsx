"use client";

import CopyLink from "@/components/CopyLink";
import {
  clearPortalPin,
  regeneratePortalToken,
  updatePortal,
  useOwnedEvent,
} from "@/lib/store";

export default function PortalSettingsPage() {
  const { event } = useOwnedEvent();
  if (!event) return null;
  const portal = event.portal;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const path = portal ? `/p/${portal.token}` : "";
  const url = origin ? `${origin}${path}` : path;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl bg-[#07382b] p-6 text-[#f6f1e8]">
        <p className="text-sm uppercase tracking-[0.2em] text-[#c4a35a]">
          Client portal
        </p>
        <h2 className="display mt-2 text-3xl">One link for the whole family</h2>
        <p className="mt-3 text-sm text-[#d9c8a3]">
          Share the timeline, client tasks, approved vendors and notes. Guests
          and budget stay hidden unless you turn them on.
        </p>
        {portal ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <code className="rounded-full bg-black/20 px-3 py-1 text-xs">{url || path}</code>
            <CopyLink value={url || path} />
          </div>
        ) : null}
      </div>

      {portal ? (
        <form action={updatePortal.bind(null, event.id)} className="space-y-3 rounded-2xl bg-white p-5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isEnabled" defaultChecked={portal.isEnabled} />
            Portal enabled
          </label>
          <textarea
            name="welcomeMessage"
            defaultValue={portal.welcomeMessage ?? ""}
            className="min-h-24 w-full rounded-xl border border-[#e4d8c4] px-3 py-2"
          />
          {[
            ["showTimeline", "Show function timeline", portal.showTimeline],
            ["showGuests", "Show guest list", portal.showGuests],
            ["showVendors", "Show vendors", portal.showVendors],
            ["showTasks", "Show client tasks", portal.showTasks],
            ["showDocuments", "Show shared notes", portal.showDocuments],
            ["showBudget", "Show budget", portal.showBudget],
          ].map(([name, label, checked]) => (
            <label key={String(name)} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={String(name)} defaultChecked={Boolean(checked)} />
              {label}
            </label>
          ))}
          <input name="pin" placeholder="Optional PIN (leave blank to keep current)" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
          <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Save portal</button>
        </form>
      ) : null}

      {portal ? (
        <div className="flex gap-3">
          <form action={regeneratePortalToken.bind(null, event.id)}>
            <button className="text-sm text-[#0b4d3a]">Regenerate link</button>
          </form>
          <form action={clearPortalPin.bind(null, event.id)}>
            <button className="text-sm text-[#6b635a]">Remove PIN</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
