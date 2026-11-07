import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { portalSettings } from "@/db/schema";
import { unlockPortal } from "@/lib/actions/portal";
import {
  VENDOR_CATEGORIES,
  functionDisplayName,
  labelFor,
} from "@/lib/constants";
import { formatDate, formatPkr } from "@/lib/format";

export default async function ClientPortalPage({
  params,
  searchParams,
}: PageProps<"/p/[token]">) {
  const { token } = await params;
  const query = await searchParams;
  const db = getDb();
  const portal = await db.query.portalSettings.findFirst({
    where: eq(portalSettings.token, token),
    with: {
      event: {
        with: {
          organization: true,
          functions: true,
          guests: { with: { invites: true } },
          eventVendors: { with: { function: true } },
          tasks: { with: { function: true } },
          documents: { with: { function: true } },
        },
      },
    },
  });
  if (!portal || !portal.isEnabled) notFound();
  const event = portal.event;
  const brand = event.organization.brandColor ?? "#0B4D3A";

  if (portal.pinHash) {
    const jar = await cookies();
    const unlocked = jar.get(`jadeed-portal-${token}`)?.value === "ok";
    if (!unlocked) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#07382b] px-4">
          <form action={unlockPortal.bind(null, token)} className="w-full max-w-sm rounded-3xl bg-[#f6f1e8] p-6">
            <p className="display text-3xl text-[#07382b]">{event.organization.name}</p>
            <h1 className="mt-2 text-lg font-medium">{event.title}</h1>
            <p className="mt-2 text-sm text-[#6b635a]">Enter the PIN your planner shared.</p>
            {query.error ? <p className="mt-2 text-sm text-red-700">That PIN is not right.</p> : null}
            <input name="pin" className="mt-4 w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
            <button className="mt-4 w-full rounded-full bg-[#0b4d3a] py-2 text-white">Open portal</button>
          </form>
        </div>
      );
    }
  }

  const functions = event.functions.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const nextFunction = functions.find((fn) => fn.date) ?? functions[0];
  const clientTasks = event.tasks.filter((task) => task.visibleToClient && task.owner === "client");
  const sharedDocs = event.documents.filter((doc) => doc.visibleToClient);
  const sharedVendors = event.eventVendors.filter((booking) => booking.visibleToClient);

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e8" }}>
      <header className="px-6 py-10 text-[#f6f1e8]" style={{ background: brand }}>
        <p className="text-sm uppercase tracking-[0.25em] text-[#c4a35a]">
          {event.organization.name}
        </p>
        <h1 className="display mt-3 text-5xl">{event.title}</h1>
        <p className="mt-3 max-w-2xl text-[#f6f1e8]/80">
          {portal.welcomeMessage}
        </p>
        {event.organization.tagline ? (
          <p className="mt-2 text-sm text-[#c4a35a]">{event.organization.tagline}</p>
        ) : null}
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        {nextFunction ? (
          <section className="rounded-3xl bg-white p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[#c4a35a]">Next function</p>
            <h2 className="display text-4xl text-[#07382b]">{functionDisplayName(nextFunction)}</h2>
            <p className="mt-2 text-[#6b635a]">
              {formatDate(nextFunction.date)}
              {nextFunction.startTime ? ` · ${nextFunction.startTime}` : ""}
              {nextFunction.venueName ? ` · ${nextFunction.venueName}` : ""}
            </p>
          </section>
        ) : null}

        {portal.showTimeline ? (
          <section>
            <h2 className="display mb-4 text-3xl text-[#07382b]">The functions</h2>
            <ol className="relative space-y-4 border-l border-[#d9c8a3] pl-6">
              {functions.map((fn) => (
                <li key={fn.id}>
                  <span className="absolute -left-1.5 mt-2 h-3 w-3 rounded-full bg-[#0b4d3a]" />
                  <p className="font-medium">{functionDisplayName(fn)}</p>
                  <p className="text-sm text-[#6b635a]">
                    {formatDate(fn.date)}
                    {fn.venueName ? ` · ${fn.venueName}` : ""}
                    {fn.venueAddress ? ` · ${fn.venueAddress}` : ""}
                    {fn.expectedGuests ? ` · ${fn.expectedGuests} guests expected` : ""}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {portal.showVendors ? (
          <section>
            <h2 className="display mb-4 text-3xl text-[#07382b]">Vendors looking after you</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {sharedVendors.map((booking) => (
                <article key={booking.id} className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-[#c4a35a]">
                    {labelFor(VENDOR_CATEGORIES, booking.category)}
                  </p>
                  <p className="font-medium">{booking.displayName}</p>
                  <p className="text-sm text-[#6b635a]">
                    {booking.function ? functionDisplayName(booking.function) : "All functions"}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {portal.showTasks ? (
          <section>
            <h2 className="display mb-4 text-3xl text-[#07382b]">Your checklist</h2>
            <div className="space-y-2">
              {clientTasks.map((task) => (
                <article key={task.id} className="rounded-2xl bg-white p-4">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-[#6b635a]">
                    {task.function ? functionDisplayName(task.function) : "Event"} · {task.status.replace("_", " ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {portal.showDocuments ? (
          <section>
            <h2 className="display mb-4 text-3xl text-[#07382b]">Notes from your planner</h2>
            <div className="space-y-3">
              {sharedDocs.map((doc) => (
                <article key={doc.id} className="rounded-2xl bg-white p-4">
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6b635a]">{doc.body}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {portal.showGuests ? (
          <section>
            <h2 className="display mb-4 text-3xl text-[#07382b]">Guest list</h2>
            <div className="space-y-2">
              {event.guests.map((guest) => (
                <article key={guest.id} className="rounded-2xl bg-white p-4">
                  <p className="font-medium">{guest.name}</p>
                  <p className="text-sm text-[#6b635a]">
                    {guest.side} · party of {guest.partySize}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {portal.showBudget ? (
          <section className="rounded-2xl bg-white p-4">
            <h2 className="display text-2xl">Budget</h2>
            <p>{formatPkr(event.budgetPkr)}</p>
          </section>
        ) : null}

        <footer className="pb-10 text-sm text-[#6b635a]">
          Questions? {event.organization.whatsapp || event.organization.phone || event.organization.email || "Message your planner."}
        </footer>
      </main>
    </div>
  );
}
