import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07382b] text-[#f6f1e8]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="display text-3xl tracking-wide">Jadeeed</p>
        <Link
          href="/dashboard"
          className="rounded-full bg-[#c4a35a] px-5 py-2 text-sm font-medium text-[#07382b]"
        >
          Open workspace
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <p className="text-sm uppercase tracking-[0.3em] text-[#c4a35a]">
          جدید · for Pakistani event planners
        </p>
        <h1 className="display mt-4 max-w-3xl text-5xl leading-tight md:text-7xl">
          Every function, from Mehendi to Walima, in one workspace.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#d9c8a3]">
          Jadeeed is built around how Pakistani events actually work: one
          wedding, many functions, one guest list that changes by night, and a
          client portal families can open on WhatsApp.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-[#f6f1e8] px-6 py-3 font-medium text-[#07382b]"
          >
            Go to dashboard
          </Link>
        </div>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Functions, not just events",
              body: "Create a wedding once, then plan Mayun, Dholki, Mehendi, Nikkah, Barat, Rukhsati and Walima with their own venues, timings and guest counts.",
            },
            {
              title: "Vendor book + bookings",
              body: "Keep a reusable directory of caterers, decorators and makeup artists, then assign them to a specific function with quotes and status.",
            },
            {
              title: "A portal clients love",
              body: "Share one beautiful link. Clients see the timeline, their tasks, approved vendors, and notes — without logging into your workspace.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#1a6b54] bg-[#0b4d3a] p-6"
            >
              <h2 className="display text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#d9c8a3]">{item.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
