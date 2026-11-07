"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { events, organizations, portalSettings } from "@/db/schema";
import { requireOrganization } from "@/lib/auth";
import { createPortalToken, hashPin } from "@/lib/crypto";
import { emptyToNull } from "@/lib/format";

export async function updateSettings(formData: FormData) {
  const org = await requireOrganization();
  const db = getDb();
  await db
    .update(organizations)
    .set({
      name: String(formData.get("name") ?? "").trim() || org.name,
      phone: emptyToNull(formData.get("phone")),
      whatsapp: emptyToNull(formData.get("whatsapp")),
      email: emptyToNull(formData.get("email")),
      city: emptyToNull(formData.get("city")),
      tagline: emptyToNull(formData.get("tagline")),
      brandColor: emptyToNull(formData.get("brandColor")) ?? "#0B4D3A",
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, org.id));
  revalidatePath("/dashboard/settings");
}

export async function updatePortal(eventId: string, formData: FormData) {
  const org = await requireOrganization();
  const db = getDb();
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.organizationId, org.id)),
  });
  if (!event) throw new Error("Event not found.");

  const pin = String(formData.get("pin") ?? "").trim();
  await db
    .update(portalSettings)
    .set({
      isEnabled: formData.get("isEnabled") === "on",
      welcomeMessage: emptyToNull(formData.get("welcomeMessage")),
      showTimeline: formData.get("showTimeline") === "on",
      showGuests: formData.get("showGuests") === "on",
      showVendors: formData.get("showVendors") === "on",
      showTasks: formData.get("showTasks") === "on",
      showDocuments: formData.get("showDocuments") === "on",
      showBudget: formData.get("showBudget") === "on",
      ...(pin ? { pinHash: hashPin(pin) } : {}),
    })
    .where(eq(portalSettings.eventId, eventId));
  revalidatePath(`/dashboard/events/${eventId}/portal`);
}

export async function regeneratePortalToken(eventId: string) {
  const org = await requireOrganization();
  const db = getDb();
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.organizationId, org.id)),
  });
  if (!event) throw new Error("Event not found.");
  await db
    .update(portalSettings)
    .set({ token: createPortalToken() })
    .where(eq(portalSettings.eventId, eventId));
  revalidatePath(`/dashboard/events/${eventId}/portal`);
}

export async function clearPortalPin(eventId: string) {
  const org = await requireOrganization();
  const db = getDb();
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.organizationId, org.id)),
  });
  if (!event) throw new Error("Event not found.");
  await db
    .update(portalSettings)
    .set({ pinHash: null })
    .where(eq(portalSettings.eventId, eventId));
  revalidatePath(`/dashboard/events/${eventId}/portal`);
}
