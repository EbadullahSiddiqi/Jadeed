import Link from "next/link";
import UserBadge from "@/components/UserBadge";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/events", label: "Events" },
  { href: "/dashboard/vendors", label: "Vendor book" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-[#e4d8c4] bg-[#07382b] text-[#f6f1e8] md:flex md:flex-col">
        <Link href="/dashboard" className="display px-6 py-6 text-3xl">
          Jadeeed
        </Link>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm text-[#d9c8a3] hover:bg-[#0b4d3a] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="px-6 pb-6 text-xs text-[#9cae9f]">Planner workspace</p>
      </aside>
      <div className="md:pl-60">
        <header className="flex items-center justify-between border-b border-[#e4d8c4] bg-white/70 px-4 py-3 backdrop-blur md:px-8">
          <Link href="/dashboard" className="display text-2xl text-[#07382b] md:hidden">
            Jadeeed
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <UserBadge />
          </div>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-[#e4d8c4] px-4 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
