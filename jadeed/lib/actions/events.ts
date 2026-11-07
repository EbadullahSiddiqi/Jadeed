"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import {
  documents,
  eventFunctions,
  events,
  eventVendors,
  guestInvites,
  guests,
  portalSettings,
  tasks,
} from "@/db/schema";
import { requireOrganization } from "@/lib/auth";
import { EVENT_FUNCTION_TEMPLATES } from "@/lib/constants";
import { createPortalToken } from "@/lib/crypto";
import { emptyToNull, toInt } from "@/lib/format";

export async function createEvent(formData: FormData) {
  const org = await requireOrganization();
  const db = getDb();
  const title = String(formData.get("title") ?? "").trim();
  const clientName = String(formData.get("clientName") ?? "").trim();
  if (!title || !clientName) {
    throw new Error("Event title and client name are required.");
  }

  const eventType = String(formData.get("eventType") ?? "wedding");
  const [event] = await db
    .insert(events)
    .values({
      organizationId: org.id,
      title,
      clientName,
      eventType: eventType as typeof events.$inferInsert.eventType,
      status: "planning",
      clientPhone: emptyToNull(formData.get("clientPhone")),
      clientEmail: emptyToNull(formData.get("clientEmail")),
      city: emptyToNull(formData.get("city")),
      startDate: emptyToNull(formData.get("startDate")),
      endDate: emptyToNull(formData.get("endDate")),
      budgetPkr: toInt(formData.get("budgetPkr")),
    })
    .returning();

  const selected = formData.getAll("functions").map(String);
  const template =
    EVENT_FUNCTION_TEMPLATES[eventType] ?? EVENT_FUNCTION_TEMPLATES.other;
  const kinds = selected.length
    ? template.filter((item) => selected.includes(item.kind))
    : template;

  if (kinds.length) {
    await db.insert(eventFunctions).values(
      kinds.map((item) => ({
        eventId: event.id,
        kind: item.kind,
        sortOrder: item.sortOrder,
      })),
    );
  }

  await db.insert(portalSettings).values({
    eventId: event.id,
    token: createPortalToken(),
    welcomeMessage: `Assalamualaikum — here is everything for ${title}.`,
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/events/${event.id}`);
}

export async function updateEvent(eventId: string, formData: FormData) {
  const org = await requireOrganization();
  const db = getDb();
  await db
    .update(events)
    .set({
      title: String(formData.get("title") ?? "").trim(),
      clientName: String(formData.get("clientName") ?? "").trim(),
      status: String(
        formData.get("status") ?? "planning",
      ) as typeof events.$inferInsert.status,
      clientPhone: emptyToNull(formData.get("clientPhone")),
      clientEmail: emptyToNull(formData.get("clientEmail")),
      city: emptyToNull(formData.get("city")),
      startDate: emptyToNull(formData.get("startDate")),
      endDate: emptyToNull(formData.get("endDate")),
      budgetPkr: toInt(formData.get("budgetPkr")),
      internalNotes: emptyToNull(formData.get("internalNotes")),
      updatedAt: new Date(),
    })
    .where(and(eq(events.id, eventId), eq(events.organizationId, org.id)));
  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function addFunction(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  await db.insert(eventFunctions).values({
    eventId,
    kind: String(
      formData.get("kind") ?? "other",
    ) as typeof eventFunctions.$inferInsert.kind,
    customName: emptyToNull(formData.get("customName")),
    date: emptyToNull(formData.get("date")),
    startTime: emptyToNull(formData.get("startTime")),
    venueName: emptyToNull(formData.get("venueName")),
    venueAddress: emptyToNull(formData.get("venueAddress")),
    city: emptyToNull(formData.get("city")),
    expectedGuests: toInt(formData.get("expectedGuests")),
    sortOrder: toInt(formData.get("sortOrder")) ?? 99,
  });
  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function updateFunction(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  const functionId = String(formData.get("functionId"));
  await db
    .update(eventFunctions)
    .set({
      date: emptyToNull(formData.get("date")),
      startTime: emptyToNull(formData.get("startTime")),
      endTime: emptyToNull(formData.get("endTime")),
      venueName: emptyToNull(formData.get("venueName")),
      venueAddress: emptyToNull(formData.get("venueAddress")),
      city: emptyToNull(formData.get("city")),
      expectedGuests: toInt(formData.get("expectedGuests")),
      budgetPkr: toInt(formData.get("budgetPkr")),
      notes: emptyToNull(formData.get("notes")),
      customName: emptyToNull(formData.get("customName")),
    })
    .where(
      and(eq(eventFunctions.id, functionId), eq(eventFunctions.eventId, eventId)),
    );
  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function addGuest(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Guest name is required.");
  const [guest] = await db
    .insert(guests)
    .values({
      eventId,
      name,
      phone: emptyToNull(formData.get("phone")),
      side: String(
        formData.get("side") ?? "shared",
      ) as typeof guests.$inferInsert.side,
      household: emptyToNull(formData.get("household")),
      partySize: toInt(formData.get("partySize")) ?? 1,
      notes: emptyToNull(formData.get("notes")),
    })
    .returning();

  const functionIds = formData.getAll("functionIds").map(String);
  if (functionIds.length) {
    await db.insert(guestInvites).values(
      functionIds.map((functionId) => ({
        guestId: guest.id,
        functionId,
      })),
    );
  }
  revalidatePath(`/dashboard/events/${eventId}/guests`);
}

export async function updateInvite(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  await db
    .update(guestInvites)
    .set({
      rsvpStatus: String(
        formData.get("rsvpStatus") ?? "pending",
      ) as typeof guestInvites.$inferInsert.rsvpStatus,
      attendingCount: toInt(formData.get("attendingCount")),
    })
    .where(eq(guestInvites.id, String(formData.get("inviteId"))));
  revalidatePath(`/dashboard/events/${eventId}/guests`);
}

export async function addTask(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Task title is required.");
  await db.insert(tasks).values({
    eventId,
    title,
    description: emptyToNull(formData.get("description")),
    functionId: emptyToNull(formData.get("functionId")),
    dueDate: emptyToNull(formData.get("dueDate")),
    owner: String(
      formData.get("owner") ?? "planner",
    ) as typeof tasks.$inferInsert.owner,
    visibleToClient: formData.get("visibleToClient") === "on",
  });
  revalidatePath(`/dashboard/events/${eventId}/tasks`);
}

export async function updateTaskStatus(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  await db
    .update(tasks)
    .set({
      status: String(
        formData.get("status") ?? "todo",
      ) as typeof tasks.$inferInsert.status,
    })
    .where(and(eq(tasks.id, String(formData.get("taskId"))), eq(tasks.eventId, eventId)));
  revalidatePath(`/dashboard/events/${eventId}/tasks`);
}

export async function addDocument(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required.");
  await db.insert(documents).values({
    eventId,
    title,
    body: String(formData.get("body") ?? ""),
    kind: String(
      formData.get("kind") ?? "note",
    ) as typeof documents.$inferInsert.kind,
    functionId: emptyToNull(formData.get("functionId")),
    visibleToClient: formData.get("visibleToClient") === "on",
  });
  revalidatePath(`/dashboard/events/${eventId}/docs`);
}

export async function assignVendor(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  await db.insert(eventVendors).values({
    eventId,
    vendorId: emptyToNull(formData.get("vendorId")),
    functionId: emptyToNull(formData.get("functionId")),
    category: String(
      formData.get("category") ?? "other",
    ) as typeof eventVendors.$inferInsert.category,
    displayName: String(formData.get("displayName") ?? "").trim(),
    quotedPkr: toInt(formData.get("quotedPkr")),
    paidPkr: toInt(formData.get("paidPkr")),
    status: String(
      formData.get("status") ?? "inquiry",
    ) as typeof eventVendors.$inferInsert.status,
    notes: emptyToNull(formData.get("notes")),
    visibleToClient: formData.get("visibleToClient") === "on",
  });
  revalidatePath(`/dashboard/events/${eventId}/vendors`);
}

export async function updateBookingStatus(eventId: string, formData: FormData) {
  await assertEvent(eventId);
  const db = getDb();
  await db
    .update(eventVendors)
    .set({
      status: String(
        formData.get("status") ?? "inquiry",
      ) as typeof eventVendors.$inferInsert.status,
      paidPkr: toInt(formData.get("paidPkr")),
    })
    .where(
      and(
        eq(eventVendors.id, String(formData.get("bookingId"))),
        eq(eventVendors.eventId, eventId),
      ),
    );
  revalidatePath(`/dashboard/events/${eventId}/vendors`);
}

async function assertEvent(eventId: string) {
  const org = await requireOrganization();
  const db = getDb();
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.organizationId, org.id)),
  });
  if (!event) throw new Error("Event not found.");
  return event;
}
