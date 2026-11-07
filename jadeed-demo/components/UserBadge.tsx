"use client";

import { useDemoState } from "@/lib/store";

/** Stand-in for Clerk's <UserButton /> — the demo has no auth. */
export default function UserBadge() {
  const state = useDemoState();
  const initial = state?.organization.name.trim().charAt(0).toUpperCase() ?? "";
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b4d3a] text-sm font-medium text-white">
      {initial}
    </div>
  );
}
