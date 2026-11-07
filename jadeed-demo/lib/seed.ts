import type {
  DemoEvent,
  DemoState,
  EventDocument,
  EventFunction,
  EventVendor,
  Guest,
  GuestInvite,
  Portal,
  Task,
  Vendor,
} from "@/lib/store";

/**
 * Sample workspace shown on first launch (and after "Reset demo data").
 * All names, numbers and venues are fictional. Dates are relative to today so
 * the demo never looks stale.
 */

function isoDay(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoStamp(daysAgo: number) {
  return new Date(Date.now() - daysAgo * 86_400_000).toISOString();
}

export function createSeed(): DemoState {
  /* ----------------------------- Vendor book ----------------------------- */
  const vendors: Vendor[] = [
    { id: "v-zaika", name: "Zaika Caterers", category: "caterer", phone: "0300 1112233", whatsapp: "0300 1112233", email: null, city: "Lahore", instagram: "@zaikacaterers", notes: "Best for large Barat and Walima menus." },
    { id: "v-roshan", name: "Roshan Decor & Lights", category: "decorator", phone: "0321 4445566", whatsapp: "0321 4445566", email: null, city: "Lahore", instagram: "@roshandecor", notes: null },
    { id: "v-lens", name: "Lens & Lace Photography", category: "photographer", phone: "0333 7778899", whatsapp: "0333 7778899", email: null, city: "Lahore", instagram: "@lensandlace", notes: null },
    { id: "v-sadia", name: "Henna by Sadia", category: "mehendi_artist", phone: "0345 2223344", whatsapp: "0345 2223344", email: null, city: "Lahore", instagram: "@hennabysadia", notes: null },
    { id: "v-noor", name: "Noor Makeup Studio", category: "makeup", phone: "0312 5556677", whatsapp: "0312 5556677", email: null, city: "Lahore", instagram: "@noormakeupstudio", notes: null },
    { id: "v-bilal", name: "Beats by Bilal", category: "dj", phone: "0301 8889900", whatsapp: "0301 8889900", email: null, city: "Lahore", instagram: null, notes: null },
    { id: "v-qadri", name: "Qadri Qawwali Group", category: "qawwal", phone: "0322 1234567", whatsapp: null, email: null, city: "Lahore", instagram: null, notes: null },
    { id: "v-gulab", name: "Gulab Florists", category: "florist", phone: "0334 9871234", whatsapp: "0334 9871234", email: null, city: "Islamabad", instagram: "@gulabflorists", notes: null },
    { id: "v-rangrez", name: "Rangrez Invitations", category: "invitations", phone: "0315 4567123", whatsapp: "0315 4567123", email: null, city: "Lahore", instagram: null, notes: null },
    { id: "v-safar", name: "Safar Transport", category: "transport", phone: "0302 6543210", whatsapp: null, email: null, city: "Lahore", instagram: null, notes: null },
  ];

  /* ------------------------------- Events -------------------------------- */
  const events: DemoEvent[] = [
    {
      id: "e-wedding",
      title: "Ahmed & Fatima",
      eventType: "wedding",
      status: "planning",
      clientName: "Tariq Mehmood",
      clientPhone: "0300 5551212",
      clientEmail: "tariq.mehmood@example.com",
      city: "Lahore",
      startDate: isoDay(21),
      endDate: isoDay(26),
      budgetPkr: 4500000,
      internalNotes: "Bride's side wants a small, intimate Mehendi. Groom's side is bringing roughly 250 for Barat.",
      createdAt: isoStamp(1),
    },
    {
      id: "e-engagement",
      title: "Hamza & Sara",
      eventType: "engagement",
      status: "confirmed",
      clientName: "Sara Iqbal",
      clientPhone: "0333 4440099",
      clientEmail: null,
      city: "Islamabad",
      startDate: isoDay(9),
      endDate: isoDay(9),
      budgetPkr: 900000,
      internalNotes: null,
      createdAt: isoStamp(5),
    },
    {
      id: "e-milad",
      title: "Khan Family Milad",
      eventType: "milad",
      status: "inquiry",
      clientName: "Mrs. Rubina Khan",
      clientPhone: "0345 7770011",
      clientEmail: null,
      city: "Lahore",
      startDate: isoDay(40),
      endDate: isoDay(40),
      budgetPkr: 350000,
      internalNotes: "First call went well. Waiting on a venue decision before sending a quote.",
      createdAt: isoStamp(9),
    },
    {
      id: "e-corporate",
      title: "Annual Dinner 2026",
      eventType: "corporate",
      status: "completed",
      clientName: "Nadia Aslam",
      clientPhone: null,
      clientEmail: "nadia@example.com",
      city: "Lahore",
      startDate: isoDay(-30),
      endDate: isoDay(-30),
      budgetPkr: 1200000,
      internalNotes: null,
      createdAt: isoStamp(60),
    },
  ];

  /* ----------------------------- Functions ------------------------------- */
  const fn = (
    id: string,
    eventId: string,
    kind: string,
    sortOrder: number,
    rest: Partial<EventFunction> = {},
  ): EventFunction => ({
    id,
    eventId,
    kind,
    customName: null,
    date: null,
    startTime: null,
    endTime: null,
    venueName: null,
    venueAddress: null,
    city: null,
    expectedGuests: null,
    budgetPkr: null,
    notes: null,
    sortOrder,
    ...rest,
  });

  const functions: EventFunction[] = [
    fn("f-mayun", "e-wedding", "mayun", 0, { date: isoDay(21), startTime: "19:00", endTime: "22:30", venueName: "Mehmood Residence", venueAddress: "Block C, Model Town", city: "Lahore", expectedGuests: 60, budgetPkr: 250000 }),
    fn("f-dholki", "e-wedding", "dholki", 1, { date: isoDay(22), startTime: "20:00", endTime: "23:30", venueName: "Mehmood Residence", venueAddress: "Block C, Model Town", city: "Lahore", expectedGuests: 50, budgetPkr: 150000 }),
    fn("f-mehendi", "e-wedding", "mehendi", 2, { date: isoDay(23), startTime: "19:30", endTime: "23:00", venueName: "Gulberg Banquet Hall", venueAddress: "Main Boulevard, Gulberg III", city: "Lahore", expectedGuests: 120, budgetPkr: 650000 }),
    fn("f-nikkah", "e-wedding", "nikkah", 3, { date: isoDay(25), startTime: "15:00", endTime: "16:30", venueName: "Royal Palm Marquee", venueAddress: "Canal Road", city: "Lahore", expectedGuests: 100, budgetPkr: 200000 }),
    fn("f-barat", "e-wedding", "barat", 4, { date: isoDay(25), startTime: "19:30", endTime: "23:30", venueName: "Royal Palm Marquee", venueAddress: "Canal Road", city: "Lahore", expectedGuests: 450, budgetPkr: 1800000 }),
    fn("f-rukhsati", "e-wedding", "rukhsati", 5, { date: isoDay(25), startTime: "23:30", endTime: "00:30", venueName: "Royal Palm Marquee", venueAddress: "Canal Road", city: "Lahore", expectedGuests: 80, budgetPkr: 100000 }),
    fn("f-walima", "e-wedding", "walima", 6, { date: isoDay(26), startTime: "19:30", endTime: "23:00", venueName: "Gulberg Banquet Hall", venueAddress: "Main Boulevard, Gulberg III", city: "Lahore", expectedGuests: 350, budgetPkr: 1100000 }),
    fn("f-engagement", "e-engagement", "engagement", 0, { date: isoDay(9), startTime: "19:00", endTime: "22:00", venueName: "Margalla Garden Lawn", venueAddress: "F-7, Islamabad", city: "Islamabad", expectedGuests: 150, budgetPkr: 900000 }),
    fn("f-milad", "e-milad", "milad", 0, { date: isoDay(40), startTime: "16:00", venueName: null, expectedGuests: 80 }),
    fn("f-dinner", "e-corporate", "other", 0, { customName: "Gala dinner", date: isoDay(-30), startTime: "20:00", venueName: "Royal Palm Marquee", city: "Lahore", expectedGuests: 200, budgetPkr: 1200000 }),
  ];

  /* ------------------------------- Guests -------------------------------- */
  type GuestSeed = {
    name: string;
    household: string;
    side: string;
    partySize: number;
    phone: string | null;
    // function ids this guest is invited to
    to: string[];
    // rsvp by function id (default pending)
    rsvp?: Record<string, "attending" | "declined" | "maybe">;
  };

  const all = ["f-mayun", "f-dholki", "f-mehendi", "f-nikkah", "f-barat", "f-rukhsati", "f-walima"];
  const core = ["f-mehendi", "f-nikkah", "f-barat", "f-walima"];
  const big = ["f-barat", "f-walima"];

  const guestSeeds: GuestSeed[] = [
    { name: "Tariq Mehmood", household: "Mehmood family", side: "bride", partySize: 5, phone: "0300 5551212", to: all, rsvp: Object.fromEntries(all.map((id) => [id, "attending" as const])) },
    { name: "Khalid Raza", household: "Raza family", side: "groom", partySize: 6, phone: "0321 1010101", to: all, rsvp: Object.fromEntries(all.map((id) => [id, "attending" as const])) },
    { name: "Aunt Shabana", household: "Chaudhry family", side: "bride", partySize: 4, phone: "0333 2020202", to: all, rsvp: { "f-mayun": "attending", "f-dholki": "attending", "f-mehendi": "attending", "f-nikkah": "maybe", "f-barat": "attending", "f-rukhsati": "attending", "f-walima": "attending" } },
    { name: "Uncle Imran", household: "Raza family", side: "groom", partySize: 3, phone: "0345 3030303", to: core, rsvp: { "f-mehendi": "attending", "f-nikkah": "attending", "f-barat": "attending", "f-walima": "maybe" } },
    { name: "Dr. Sana Malik", household: "Malik family", side: "bride", partySize: 2, phone: "0312 4040404", to: core, rsvp: { "f-mehendi": "attending", "f-nikkah": "declined", "f-barat": "declined", "f-walima": "attending" } },
    { name: "Bilal Hussain", household: "Hussain family", side: "groom", partySize: 4, phone: "0301 5050505", to: big, rsvp: { "f-barat": "attending", "f-walima": "attending" } },
    { name: "Mr. & Mrs. Anwar", household: "Anwar family", side: "shared", partySize: 2, phone: "0322 6060606", to: big },
    { name: "Zainab Farooq", household: "Farooq family", side: "bride", partySize: 3, phone: null, to: ["f-mehendi", "f-barat", "f-walima"], rsvp: { "f-mehendi": "attending", "f-barat": "maybe" } },
    { name: "Hassan Ali", household: "Ali family", side: "groom", partySize: 1, phone: "0334 7070707", to: big, rsvp: { "f-barat": "declined", "f-walima": "declined" } },
    { name: "Mrs. Naseem Akhtar", household: "Akhtar family", side: "bride", partySize: 5, phone: "0315 8080808", to: all },
    // Engagement
    { name: "Iqbal Ahmed", household: "Ahmed family", side: "bride", partySize: 6, phone: null, to: ["f-engagement"], rsvp: { "f-engagement": "attending" } },
    { name: "Farah Siddique", household: "Siddique family", side: "groom", partySize: 4, phone: null, to: ["f-engagement"], rsvp: { "f-engagement": "attending" } },
    { name: "Omar Sheikh", household: "Sheikh family", side: "groom", partySize: 2, phone: null, to: ["f-engagement"] },
  ];

  const functionEvent = (id: string) => functions.find((item) => item.id === id)!.eventId;
  const guests: Guest[] = [];
  const invites: GuestInvite[] = [];

  guestSeeds.forEach((seed, index) => {
    const guestId = `g-${index + 1}`;
    guests.push({
      id: guestId,
      eventId: functionEvent(seed.to[0]),
      name: seed.name,
      phone: seed.phone,
      side: seed.side,
      household: seed.household,
      partySize: seed.partySize,
      notes: null,
    });
    seed.to.forEach((functionId) => {
      const status = seed.rsvp?.[functionId] ?? "pending";
      invites.push({
        id: `i-${guestId}-${functionId}`,
        guestId,
        functionId,
        rsvpStatus: status,
        attendingCount:
          status === "attending" ? seed.partySize : status === "declined" ? 0 : null,
        notes: null,
      });
    });
  });

  /* ---------------------------- Vendor bookings -------------------------- */
  const booking = (
    id: string,
    eventId: string,
    vendorId: string | null,
    displayName: string,
    category: string,
    rest: Partial<EventVendor>,
  ): EventVendor => ({
    id,
    eventId,
    vendorId,
    functionId: null,
    category,
    displayName,
    quotedPkr: null,
    paidPkr: null,
    status: "inquiry",
    notes: null,
    visibleToClient: true,
    ...rest,
  });

  const bookings: EventVendor[] = [
    booking("b-1", "e-wedding", null, "Royal Palm Marquee", "venue", { functionId: "f-barat", quotedPkr: 900000, paidPkr: 300000, status: "confirmed" }),
    booking("b-2", "e-wedding", "v-zaika", "Zaika Caterers", "caterer", { functionId: "f-walima", quotedPkr: 1400000, paidPkr: 400000, status: "booked" }),
    booking("b-3", "e-wedding", "v-roshan", "Roshan Decor & Lights", "decorator", { functionId: "f-mehendi", quotedPkr: 350000, paidPkr: 100000, status: "booked" }),
    booking("b-4", "e-wedding", "v-lens", "Lens & Lace Photography", "photographer", { quotedPkr: 250000, paidPkr: 100000, status: "confirmed" }),
    booking("b-5", "e-wedding", "v-sadia", "Henna by Sadia", "mehendi_artist", { functionId: "f-mehendi", quotedPkr: 40000, status: "quoted" }),
    booking("b-6", "e-wedding", "v-noor", "Noor Makeup Studio", "makeup", { functionId: "f-barat", quotedPkr: 80000, status: "quoted" }),
    booking("b-7", "e-wedding", "v-bilal", "Beats by Bilal", "dj", { functionId: "f-mayun", quotedPkr: 60000, status: "booked" }),
    booking("b-8", "e-wedding", "v-rangrez", "Rangrez Invitations", "invitations", { quotedPkr: 45000, paidPkr: 45000, status: "completed" }),
    booking("b-9", "e-wedding", "v-safar", "Safar Transport", "transport", { functionId: "f-barat", quotedPkr: 120000, status: "inquiry", visibleToClient: false, notes: "Still comparing with another quote." }),
    booking("b-10", "e-engagement", "v-roshan", "Roshan Decor & Lights", "decorator", { quotedPkr: 220000, paidPkr: 100000, status: "confirmed" }),
    booking("b-11", "e-engagement", "v-gulab", "Gulab Florists", "florist", { quotedPkr: 60000, status: "booked" }),
    booking("b-12", "e-engagement", "v-lens", "Lens & Lace Photography", "photographer", { quotedPkr: 90000, status: "quoted" }),
  ];

  /* -------------------------------- Tasks -------------------------------- */
  const task = (
    id: string,
    eventId: string,
    title: string,
    rest: Partial<Task>,
  ): Task => ({
    id,
    eventId,
    functionId: null,
    title,
    description: null,
    dueDate: null,
    status: "todo",
    owner: "planner",
    visibleToClient: false,
    ...rest,
  });

  const tasks: Task[] = [
    task("t-1", "e-wedding", "Share final guest list for Barat", { functionId: "f-barat", owner: "client", dueDate: isoDay(10), status: "in_progress", visibleToClient: true }),
    task("t-2", "e-wedding", "Approve Walima menu after tasting", { functionId: "f-walima", owner: "client", dueDate: isoDay(7), status: "todo", visibleToClient: true }),
    task("t-3", "e-wedding", "Choose colour palette for Mehendi decor", { functionId: "f-mehendi", owner: "client", dueDate: isoDay(5), status: "done", visibleToClient: true }),
    task("t-4", "e-wedding", "Confirm Barat entry plan with DJ", { functionId: "f-barat", owner: "planner", dueDate: isoDay(14), status: "todo" }),
    task("t-5", "e-wedding", "Collect second instalment from client", { owner: "planner", dueDate: isoDay(6), status: "blocked", description: "Waiting for the bride's father to return from travel." }),
    task("t-6", "e-wedding", "Send menu tasting slots", { functionId: "f-walima", owner: "vendor", dueDate: isoDay(3), status: "done" }),
    task("t-7", "e-wedding", "Book sound check at Royal Palm Marquee", { functionId: "f-barat", owner: "planner", dueDate: isoDay(18), status: "todo" }),
    task("t-8", "e-engagement", "Confirm ring ceremony stage layout", { owner: "planner", dueDate: isoDay(4), status: "in_progress" }),
    task("t-9", "e-engagement", "Send family seating preferences", { owner: "client", dueDate: isoDay(3), status: "todo", visibleToClient: true }),
    task("t-10", "e-milad", "Send venue shortlist to Mrs. Khan", { owner: "planner", dueDate: isoDay(2), status: "todo" }),
  ];

  /* ------------------------------ Notes & docs --------------------------- */
  const documents: EventDocument[] = [
    { id: "d-1", eventId: "e-wedding", functionId: "f-walima", kind: "note", title: "Walima menu ideas", body: "Mutton qorma, chicken biryani, seekh kebab station, kheer and gulab jamun.\nOne live naan counter near the entrance.", visibleToClient: true },
    { id: "d-2", eventId: "e-wedding", functionId: "f-barat", kind: "document", title: "Barat day run sheet", body: "7:30 PM  Guests seated\n8:15 PM  Barat arrival and entry\n9:00 PM  Dinner service\n10:30 PM Photo session with families\n11:30 PM Rukhsati", visibleToClient: true },
    { id: "d-3", eventId: "e-wedding", functionId: null, kind: "note", title: "Family preferences", body: "Bride's mother prefers no loud music before Isha.\nGroom's side requests a separate family room near the stage.", visibleToClient: false },
    { id: "d-4", eventId: "e-wedding", functionId: "f-mehendi", kind: "note", title: "Mehendi seating plan notes", body: "Round tables of 8, with the stage on the left. Keep the dancing floor clear for the dholki group.", visibleToClient: false },
    { id: "d-5", eventId: "e-engagement", functionId: null, kind: "note", title: "Ring ceremony order", body: "Recitation, ring exchange, family photos, then dinner.", visibleToClient: true },
  ];

  /* ------------------------------- Portals ------------------------------- */
  const portal = (
    id: string,
    eventId: string,
    token: string,
    title: string,
    rest: Partial<Portal> = {},
  ): Portal => ({
    id,
    eventId,
    token,
    isEnabled: true,
    pin: null,
    welcomeMessage: `Assalamualaikum — here is everything for ${title}.`,
    showTimeline: true,
    showGuests: false,
    showVendors: true,
    showTasks: true,
    showDocuments: true,
    showBudget: false,
    ...rest,
  });

  const portals: Portal[] = [
    portal("p-1", "e-wedding", "ahmed-and-fatima", "Ahmed & Fatima"),
    portal("p-2", "e-engagement", "hamza-and-sara", "Hamza & Sara"),
    portal("p-3", "e-milad", "khan-family-milad", "Khan Family Milad"),
    portal("p-4", "e-corporate", "annual-dinner-2026", "Annual Dinner 2026"),
  ];

  return {
    organization: {
      id: "org-demo",
      name: "Noor Events Studio",
      phone: "0300 1234567",
      whatsapp: "0300 1234567",
      email: "hello@example.com",
      city: "Lahore",
      brandColor: "#0B4D3A",
      tagline: "Every function, beautifully planned.",
    },
    events,
    functions,
    guests,
    invites,
    vendors,
    bookings,
    tasks,
    documents,
    portals,
  };
}
