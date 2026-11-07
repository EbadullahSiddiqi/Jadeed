import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DatabaseSetupPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="max-w-xl rounded-3xl bg-white p-6">
      <h1 className="display text-4xl text-[#07382b]">Connect Neon</h1>
      <p className="mt-3 text-sm leading-6 text-[#6b635a]">
        Jadeeed is ready. Add a Neon Postgres connection string as{" "}
        <code>DATABASE_URL</code> in <code>.env.local</code>, then run{" "}
        <code>npm run db:push</code> to create tables. Clerk is already wired
        for sign-in only — keep sign-up invite-only in the Clerk dashboard.
      </p>
    </div>
  );
}
