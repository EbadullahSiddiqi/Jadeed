import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { EVENT_FUNCTION_TEMPLATES } from "@/lib/constants";
import { emptyToNull, toInt } from "@/lib/format";
import { createSeed } from "@/lib/seed";

/* -------------------------------------------------------------------------- */
/*  Types — one-to-one with the tables in the production Drizzle schema       */
/* -------------------------------------------------------------------------- */

export type Organization = {
  id: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  brandColor: string;
  tagline: string | null;
};

export type DemoEvent = {
  id: string;
  title: string;
  eventType: string;
  status: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  city: string | null;
  startDate: string | null;
  endDate: string | null;
  budgetPkr: number | null;
  internalNotes: string | null;
  createdAt: string;
};

export type EventFunction = {
  id: string;
  eventId: string;
  kind: string;
  customName: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  city: string | null;
  expectedGuests: number | null;
  budgetPkr: number | null;
  notes: string | null;
  sortOrder: number;
};

export type Guest = {
  id: string;
  eventId: string;
  name: string;
  phone: string | null;
  side: string;
  household: string | null;
  partySize: number;
  notes: string | null;
};

export type GuestInvite = {
  id: string;
  guestId: string;
  functionId: string;
  rsvpStatus: string;
  attendingCount: number | null;
  notes: string | null;
};

export type Vendor = {
  id: string;
  name: string;
  category: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  instagram: string | null;
  notes: string | null;
};

export type EventVendor = {
  id: string;
  eventId: string;
  vendorId: string | null;
  functionId: string | null;
  category: string;
  displayName: string;
  quotedPkr: number | null;
  paidPkr: number | null;
  status: string;
  notes: string | null;
  visibleToClient: boolean;
};

export type Task = {
  id: string;
  eventId: string;
  functionId: string | null;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
  owner: string;
  visibleToClient: boolean;
};

export type EventDocument = {
  id: string;
  eventId: string;
  functionId: string | null;
  kind: string;
  title: string;
  body: string;
  visibleToClient: boolean;
};

export type Portal = {
  id: string;
  eventId: string;
  token: string;
  isEnabled: boolean;
  pin: string | null;
  welcomeMessage: string | null;
  showTimeline: boolean;
  showGuests: boolean;
  showVendors: boolean;
  showTasks: boolean;
  showDocuments: boolean;
  showBudget: boolean;
};

export type DemoState = {
  organization: Organization;
  events: DemoEvent[];
  functions: EventFunction[];
  guests: Guest[];
  invites: GuestInvite[];
  vendors: Vendor[];
  bookings: EventVendor[];
  tasks: Task[];
  documents: EventDocument[];
  portals: Portal[];
};

/* -------------------------------------------------------------------------- */
/*  Persistence + subscription (localStorage, no backend)                     */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "jadeed-demo:v1";

let current: DemoState | null = null;
const listeners = new Set<() => void>();

function persist(state: DemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked (private mode / quota): the demo keeps working in memory.
  }
}

function load(): DemoState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DemoState;
  } catch {
    // Corrupt or unavailable storage: fall through and re-seed.
  }
  const seeded = createSeed();
  persist(seeded);
  return seeded;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): DemoState | null {
  if (current === null && typeof window !== "undefined") current = load();
  return current;
}

function getServerSnapshot(): DemoState | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    current = event.newValue ? (JSON.parse(event.newValue) as DemoState) : null;
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(mutate: (state: DemoState) => DemoState) {
  const base = getSnapshot();
  if (!base) return;
  current = mutate(base);
  persist(current);
  emit();
}

/** `null` until the browser has loaded the demo data from localStorage. */
export function useDemoState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function resetDemo() {
  current = createSeed();
  persist(current);
  emit();
}

/* -------------------------------------------------------------------------- */
/*  Selectors — mirror the joins in lib/queries.ts                            */
/* -------------------------------------------------------------------------- */

export function selectEvent(state: DemoState, eventId: string) {
  const event = state.events.find((item) => item.id === eventId);
  if (!event) return null;
  const functions = state.functions.filter((fn) => fn.eventId === eventId);
  const functionById = (id: string | null) =>
    functions.find((fn) => fn.id === id) ?? null;

  return {
    ...event,
    functions,
    guests: state.guests
      .filter((guest) => guest.eventId === eventId)
      .map((guest) => ({
        ...guest,
        invites: state.invites.filter((invite) => invite.guestId === guest.id),
      })),
    eventVendors: state.bookings
      .filter((booking) => booking.eventId === eventId)
      .map((booking) => ({
        ...booking,
        vendor: state.vendors.find((item) => item.id === booking.vendorId) ?? null,
        function: functionById(booking.functionId),
      })),
    tasks: state.tasks
      .filter((task) => task.eventId === eventId)
      .map((task) => ({ ...task, function: functionById(task.functionId) })),
    documents: state.documents
      .filter((doc) => doc.eventId === eventId)
      .map((doc) => ({ ...doc, function: functionById(doc.functionId) })),
    portal: state.portals.find((portal) => portal.eventId === eventId) ?? null,
    organization: state.organization,
  };
}

/** Event for the `[id]` segment of the current URL (null while loading / missing). */
export function useOwnedEvent() {
  const { id } = useParams<{ id: string }>();
  const state = useDemoState();
  return { id, state, event: state ? selectEvent(state, id) : null };
}

/* -------------------------------------------------------------------------- */
/*  Actions — mirror lib/actions/*.ts, now writing to localStorage            */
/* -------------------------------------------------------------------------- */

function uid() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function createPortalToken() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function createEvent(formData: FormData) {
  const title = text(formData, "title");
  const clientName = text(formData, "clientName");
  if (!title || !clientName) return null;

  const eventType = String(formData.get("eventType") ?? "wedding");
  const eventId = uid();
  const selected = formData.getAll("functions").map(String);
  const template =
    EVENT_FUNCTION_TEMPLATES[eventType] ?? EVENT_FUNCTION_TEMPLATES.other;
  const kinds = selected.length
    ? template.filter((item) => selected.includes(item.kind))
    : template;

  update((state) => ({
    ...state,
    events: [
      {
        id: eventId,
        title,
        clientName,
        eventType,
        status: "planning",
        clientPhone: emptyToNull(formData.get("clientPhone")),
        clientEmail: emptyToNull(formData.get("clientEmail")),
        city: emptyToNull(formData.get("city")),
        startDate: emptyToNull(formData.get("startDate")),
        endDate: emptyToNull(formData.get("endDate")),
        budgetPkr: toInt(formData.get("budgetPkr")),
        internalNotes: null,
        createdAt: new Date().toISOString(),
      },
      ...state.events,
    ],
    functions: [
      ...state.functions,
      ...kinds.map((item) => ({
        id: uid(),
        eventId,
        kind: item.kind,
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
        sortOrder: item.sortOrder,
      })),
    ],
    portals: [
      ...state.portals,
      {
        id: uid(),
        eventId,
        token: createPortalToken(),
        isEnabled: true,
        pin: null,
        welcomeMessage: `Assalamualaikum — here is everything for ${title}.`,
        showTimeline: true,
        showGuests: false,
        showVendors: true,
        showTasks: true,
        showDocuments: true,
        showBudget: false,
      },
    ],
  }));

  return eventId;
}

export function updateEvent(eventId: string, formData: FormData) {
  update((state) => ({
    ...state,
    events: state.events.map((event) =>
      event.id === eventId
        ? {
            ...event,
            title: text(formData, "title"),
            clientName: text(formData, "clientName"),
            status: String(formData.get("status") ?? "planning"),
            clientPhone: emptyToNull(formData.get("clientPhone")),
            clientEmail: emptyToNull(formData.get("clientEmail")),
            city: emptyToNull(formData.get("city")),
            startDate: emptyToNull(formData.get("startDate")),
            endDate: emptyToNull(formData.get("endDate")),
            budgetPkr: toInt(formData.get("budgetPkr")),
            internalNotes: emptyToNull(formData.get("internalNotes")),
          }
        : event,
    ),
  }));
}

export function addFunction(eventId: string, formData: FormData) {
  update((state) => ({
    ...state,
    functions: [
      ...state.functions,
      {
        id: uid(),
        eventId,
        kind: String(formData.get("kind") ?? "other"),
        customName: emptyToNull(formData.get("customName")),
        date: emptyToNull(formData.get("date")),
        startTime: emptyToNull(formData.get("startTime")),
        endTime: null,
        venueName: emptyToNull(formData.get("venueName")),
        venueAddress: emptyToNull(formData.get("venueAddress")),
        city: emptyToNull(formData.get("city")),
        expectedGuests: toInt(formData.get("expectedGuests")),
        budgetPkr: null,
        notes: null,
        sortOrder: toInt(formData.get("sortOrder")) ?? 99,
      },
    ],
  }));
}

export function updateFunction(eventId: string, formData: FormData) {
  const functionId = String(formData.get("functionId"));
  update((state) => ({
    ...state,
    functions: state.functions.map((fn) =>
      fn.id === functionId && fn.eventId === eventId
        ? {
            ...fn,
            date: emptyToNull(formData.get("date")),
            startTime: emptyToNull(formData.get("startTime")),
            endTime: emptyToNull(formData.get("endTime")),
            venueName: emptyToNull(formData.get("venueName")),
            venueAddress: emptyToNull(formData.get("venueAddress")),
            city: emptyToNull(formData.get("city")),
            expectedGuests: toInt(formData.get("expectedGuests")),
            budgetPkr: toInt(formData.get("budgetPkr")),
            customName: emptyToNull(formData.get("customName")),
          }
        : fn,
    ),
  }));
}

export function addGuest(eventId: string, formData: FormData) {
  const name = text(formData, "name");
  if (!name) return;
  const guestId = uid();
  const functionIds = formData.getAll("functionIds").map(String);

  update((state) => ({
    ...state,
    guests: [
      ...state.guests,
      {
        id: guestId,
        eventId,
        name,
        phone: emptyToNull(formData.get("phone")),
        side: String(formData.get("side") ?? "shared"),
        household: emptyToNull(formData.get("household")),
        partySize: toInt(formData.get("partySize")) ?? 1,
        notes: emptyToNull(formData.get("notes")),
      },
    ],
    invites: [
      ...state.invites,
      ...functionIds.map((functionId) => ({
        id: uid(),
        guestId,
        functionId,
        rsvpStatus: "pending",
        attendingCount: null,
        notes: null,
      })),
    ],
  }));
}

export function updateInvite(_eventId: string, formData: FormData) {
  const inviteId = String(formData.get("inviteId"));
  update((state) => ({
    ...state,
    invites: state.invites.map((invite) =>
      invite.id === inviteId
        ? {
            ...invite,
            rsvpStatus: String(formData.get("rsvpStatus") ?? "pending"),
            attendingCount: toInt(formData.get("attendingCount")),
          }
        : invite,
    ),
  }));
}

export function addTask(eventId: string, formData: FormData) {
  const title = text(formData, "title");
  if (!title) return;
  update((state) => ({
    ...state,
    tasks: [
      ...state.tasks,
      {
        id: uid(),
        eventId,
        title,
        description: emptyToNull(formData.get("description")),
        functionId: emptyToNull(formData.get("functionId")),
        dueDate: emptyToNull(formData.get("dueDate")),
        status: "todo",
        owner: String(formData.get("owner") ?? "planner"),
        visibleToClient: checked(formData, "visibleToClient"),
      },
    ],
  }));
}

export function updateTaskStatus(eventId: string, formData: FormData) {
  const taskId = String(formData.get("taskId"));
  update((state) => ({
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId && task.eventId === eventId
        ? { ...task, status: String(formData.get("status") ?? "todo") }
        : task,
    ),
  }));
}

export function addDocument(eventId: string, formData: FormData) {
  const title = text(formData, "title");
  if (!title) return;
  update((state) => ({
    ...state,
    documents: [
      ...state.documents,
      {
        id: uid(),
        eventId,
        title,
        body: String(formData.get("body") ?? ""),
        kind: String(formData.get("kind") ?? "note"),
        functionId: emptyToNull(formData.get("functionId")),
        visibleToClient: checked(formData, "visibleToClient"),
      },
    ],
  }));
}

export function assignVendor(eventId: string, formData: FormData) {
  update((state) => ({
    ...state,
    bookings: [
      ...state.bookings,
      {
        id: uid(),
        eventId,
        vendorId: emptyToNull(formData.get("vendorId")),
        functionId: emptyToNull(formData.get("functionId")),
        category: String(formData.get("category") ?? "other"),
        displayName: text(formData, "displayName"),
        quotedPkr: toInt(formData.get("quotedPkr")),
        paidPkr: toInt(formData.get("paidPkr")),
        status: String(formData.get("status") ?? "inquiry"),
        notes: emptyToNull(formData.get("notes")),
        visibleToClient: checked(formData, "visibleToClient"),
      },
    ],
  }));
}

export function updateBookingStatus(eventId: string, formData: FormData) {
  const bookingId = String(formData.get("bookingId"));
  update((state) => ({
    ...state,
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId && booking.eventId === eventId
        ? {
            ...booking,
            status: String(formData.get("status") ?? "inquiry"),
            paidPkr: toInt(formData.get("paidPkr")),
          }
        : booking,
    ),
  }));
}

export function createVendor(formData: FormData) {
  const name = text(formData, "name");
  if (!name) return;
  update((state) => ({
    ...state,
    vendors: [
      ...state.vendors,
      {
        id: uid(),
        name,
        category: String(formData.get("category") ?? "other"),
        phone: emptyToNull(formData.get("phone")),
        whatsapp: emptyToNull(formData.get("whatsapp")),
        email: emptyToNull(formData.get("email")),
        city: emptyToNull(formData.get("city")),
        instagram: emptyToNull(formData.get("instagram")),
        notes: emptyToNull(formData.get("notes")),
      },
    ],
  }));
}

export function updateSettings(formData: FormData) {
  update((state) => ({
    ...state,
    organization: {
      ...state.organization,
      name: text(formData, "name") || state.organization.name,
      phone: emptyToNull(formData.get("phone")),
      whatsapp: emptyToNull(formData.get("whatsapp")),
      email: emptyToNull(formData.get("email")),
      city: emptyToNull(formData.get("city")),
      tagline: emptyToNull(formData.get("tagline")),
      brandColor: emptyToNull(formData.get("brandColor")) ?? "#0B4D3A",
    },
  }));
}

export function updatePortal(eventId: string, formData: FormData) {
  const pin = text(formData, "pin");
  update((state) => ({
    ...state,
    portals: state.portals.map((portal) =>
      portal.eventId === eventId
        ? {
            ...portal,
            isEnabled: checked(formData, "isEnabled"),
            welcomeMessage: emptyToNull(formData.get("welcomeMessage")),
            showTimeline: checked(formData, "showTimeline"),
            showGuests: checked(formData, "showGuests"),
            showVendors: checked(formData, "showVendors"),
            showTasks: checked(formData, "showTasks"),
            showDocuments: checked(formData, "showDocuments"),
            showBudget: checked(formData, "showBudget"),
            ...(pin ? { pin } : {}),
          }
        : portal,
    ),
  }));
}

export function regeneratePortalToken(eventId: string) {
  update((state) => ({
    ...state,
    portals: state.portals.map((portal) =>
      portal.eventId === eventId
        ? { ...portal, token: createPortalToken() }
        : portal,
    ),
  }));
}

export function clearPortalPin(eventId: string) {
  update((state) => ({
    ...state,
    portals: state.portals.map((portal) =>
      portal.eventId === eventId ? { ...portal, pin: null } : portal,
    ),
  }));
}

/* Client-portal PIN gate (the original uses an httpOnly cookie) ------------ */

const unlockKey = (token: string) => `jadeed-portal-${token}`;

export function isPortalUnlocked(token: string) {
  try {
    return window.sessionStorage.getItem(unlockKey(token)) === "ok";
  } catch {
    return false;
  }
}

export function unlockPortal(token: string, formData: FormData) {
  const portal = getSnapshot()?.portals.find((item) => item.token === token);
  if (!portal?.pin) return true;
  if (String(formData.get("pin") ?? "") !== portal.pin) return false;
  try {
    window.sessionStorage.setItem(unlockKey(token), "ok");
  } catch {
    // ignore — the gate simply asks again on next load
  }
  return true;
}
