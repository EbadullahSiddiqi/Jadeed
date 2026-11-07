"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { portalSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPin } from "@/lib/crypto";

export async function unlockPortal(token: string, formData: FormData) {
  const db = getDb();
  const portal = await db.query.portalSettings.findFirst({
    where: eq(portalSettings.token, token),
  });
  if (!portal?.pinHash) redirect(`/p/${token}`);
  const pin = String(formData.get("pin") ?? "");
  if (!verifyPin(pin, portal.pinHash)) {
    redirect(`/p/${token}?error=pin`);
  }
  const jar = await cookies();
  jar.set(`jadeed-portal-${token}`, "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: `/p/${token}`,
  });
  redirect(`/p/${token}`);
}
