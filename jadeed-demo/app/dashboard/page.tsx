"use client";

import Link from "next/link";
import { labelFor, EVENT_STATUSES, EVENT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { useDemoState } from "@/lib/store";

export default function DashboardPage() {
  const state = useDemoState();
  if (!state) return null;

  const org = state.organization;
  const rows = state.events
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((event) => ({
      ...event,
      functions: state.functions.filter((fn) => fn.eventId === event.id),
      portal: state.portals.find((portal) => portal.eventId === event.id) ?? null,
    }));

  const active = rows.filter((row) =>
    ["inquiry", "planning", "confirmed"].includes(row.status),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#0b4d3a]">
            {org.name}
          </p>
          <h1 className="display text-4xl text-[#07382b]">Workspace</h1>
        </div>
        <Link
          href="/dashboard/events/new"
          className="rounded-full bg-[#0b4d3a] px-5 py-2 text-sm text-white"
        >
          Create event
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="Active events" value={String(active.length)} />
        <Stat
          label="Functions on the calendar"
          value={String(rows.reduce((sum, row) => sum + row.functions.length, 0))}
        />
        <Stat
          label="Client portals live"
          value={String(rows.filter((row) => row.portal?.isEnabled).length)}
        />
      </section>

      <section>
        <h2 className="display mb-4 text-2xl">Recent events</h2>
        {rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d9c8a3] bg-white p-10 text-center">
            <p className="display text-2xl">No events yet</p>
            <p className="mt-2 text-sm text-[#6b635a]">
              Start with a wedding and Jadeeed will add Mehendi, Barat, Walima
              and the rest as functions you can schedule.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {rows.slice(0, 8).map((row) => (
              <Link
                key={row.id}
                href={`/dashboard/events/${row.id}`}
                className="rounded-2xl border border-[#e4d8c4] bg-white p-5 hover:border-[#0b4d3a]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{row.title}</p>
                    <p className="text-sm text-[#6b635a]">
                      {row.clientName} · {labelFor(EVENT_TYPES, row.eventType)} ·{" "}
                      {formatDate(row.startDate)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f6f1e8] px-3 py-1 text-xs">
                    {labelFor(EVENT_STATUSES, row.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-[#6b635a]">{label}</p>
      <p className="display mt-2 text-4xl text-[#0b4d3a]">{value}</p>
    </div>
  );
}
