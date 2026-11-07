import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { events } from "@/db/schema";
import { requireOrganization } from "@/lib/auth";
import { EVENT_STATUSES, EVENT_TYPES, labelFor } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export default async function EventsPage() {
  const org = await requireOrganization();
  const db = getDb();
  const rows = await db.query.events.findMany({
    where: eq(events.organizationId, org.id),
    orderBy: [desc(events.createdAt)],
    with: { functions: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-4xl text-[#07382b]">Events</h1>
        <Link
          href="/dashboard/events/new"
          className="rounded-full bg-[#0b4d3a] px-5 py-2 text-sm text-white"
        >
          Create event
        </Link>
      </div>
      <div className="grid gap-4">
        {rows.map((row) => (
          <Link
            key={row.id}
            href={`/dashboard/events/${row.id}`}
            className="rounded-2xl border border-[#e4d8c4] bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium">{row.title}</p>
                <p className="text-sm text-[#6b635a]">
                  {row.clientName}
                  {row.city ? ` · ${row.city}` : ""} · {formatDate(row.startDate)}
                </p>
              </div>
              <p className="text-sm text-[#0b4d3a]">
                {labelFor(EVENT_TYPES, row.eventType)} ·{" "}
                {row.functions.length} functions ·{" "}
                {labelFor(EVENT_STATUSES, row.status)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
