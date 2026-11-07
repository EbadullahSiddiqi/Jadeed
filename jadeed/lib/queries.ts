import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { events } from "@/db/schema";
import { requireOrganization } from "@/lib/auth";

export async function getOwnedEvent(eventId: string) {
  const org = await requireOrganization();
  const db = getDb();
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.organizationId, org.id)),
    with: {
      functions: true,
      guests: { with: { invites: true } },
      eventVendors: { with: { vendor: true, function: true } },
      tasks: { with: { function: true } },
      documents: { with: { function: true } },
      portal: true,
      organization: true,
    },
  });
  if (!event) notFound();
  return event;
}
