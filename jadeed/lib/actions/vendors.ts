"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { vendors } from "@/db/schema";
import { requireOrganization } from "@/lib/auth";
import { emptyToNull } from "@/lib/format";

export async function createVendor(formData: FormData) {
  const org = await requireOrganization();
  const db = getDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Vendor name is required.");
  await db.insert(vendors).values({
    organizationId: org.id,
    name,
    category: String(
      formData.get("category") ?? "other",
    ) as typeof vendors.$inferInsert.category,
    phone: emptyToNull(formData.get("phone")),
    whatsapp: emptyToNull(formData.get("whatsapp")),
    email: emptyToNull(formData.get("email")),
    city: emptyToNull(formData.get("city")),
    instagram: emptyToNull(formData.get("instagram")),
    notes: emptyToNull(formData.get("notes")),
  });
  revalidatePath("/dashboard/vendors");
}
