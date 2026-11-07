import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { organizations } from "@/db/schema";

export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}

export async function requireOrganization() {
  const userId = await requireUserId();
  if (!process.env.DATABASE_URL) {
    redirect("/dashboard/setup");
  }
  const db = getDb();
  const existing = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  });
  if (existing) return existing;

  const user = await currentUser();
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.fullName ||
    "Jadeeed Planner";
  const [created] = await db
    .insert(organizations)
    .values({
      clerkUserId: userId,
      name: `${name}'s Studio`,
      email: user?.primaryEmailAddress?.emailAddress,
    })
    .returning();
  return created;
}
