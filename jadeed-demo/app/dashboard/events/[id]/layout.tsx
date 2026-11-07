"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useOwnedEvent } from "@/lib/store";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, state, event } = useOwnedEvent();
  if (!state) return null;
  if (!event) notFound();

  const tabs = [
    { href: `/dashboard/events/${id}`, label: "Overview" },
    { href: `/dashboard/events/${id}/guests`, label: "Guests" },
    { href: `/dashboard/events/${id}/vendors`, label: "Vendors" },
    { href: `/dashboard/events/${id}/tasks`, label: "Tasks" },
    { href: `/dashboard/events/${id}/docs`, label: "Notes & docs" },
    { href: `/dashboard/events/${id}/portal`, label: "Client portal" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#6b635a]">{event.clientName}</p>
        <h1 className="display text-4xl text-[#07382b]">{event.title}</h1>
      </div>
      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-full bg-white px-4 py-1.5 text-sm border border-[#e4d8c4]"
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
