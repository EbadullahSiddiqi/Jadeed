import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const eventTypeEnum = pgEnum("event_type", [
  "wedding",
  "engagement",
  "milad",
  "aqeeqah",
  "mehfil",
  "birthday",
  "corporate",
  "other",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "inquiry",
  "planning",
  "confirmed",
  "completed",
  "archived",
]);

export const functionKindEnum = pgEnum("function_kind", [
  "mayun",
  "dholki",
  "mehendi",
  "nikkah",
  "barat",
  "rukhsati",
  "walima",
  "reception",
  "engagement",
  "milad",
  "aqeeqah",
  "other",
]);

export const guestSideEnum = pgEnum("guest_side", [
  "bride",
  "groom",
  "shared",
  "other",
]);

export const rsvpStatusEnum = pgEnum("rsvp_status", [
  "pending",
  "attending",
  "declined",
  "maybe",
]);

export const vendorCategoryEnum = pgEnum("vendor_category", [
  "venue",
  "caterer",
  "decorator",
  "photographer",
  "videographer",
  "makeup",
  "dj",
  "qawwal",
  "transport",
  "florist",
  "invitations",
  "tent_lighting",
  "mehendi_artist",
  "other",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "inquiry",
  "quoted",
  "booked",
  "confirmed",
  "completed",
  "cancelled",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
  "blocked",
]);

export const taskOwnerEnum = pgEnum("task_owner", [
  "planner",
  "client",
  "vendor",
]);

export const documentKindEnum = pgEnum("document_kind", ["note", "document"]);

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  city: text("city"),
  brandColor: text("brand_color").default("#0B4D3A"),
  tagline: text("tagline"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    eventType: eventTypeEnum("event_type").notNull().default("wedding"),
    status: eventStatusEnum("status").notNull().default("planning"),
    clientName: text("client_name").notNull(),
    clientPhone: text("client_phone"),
    clientEmail: text("client_email"),
    city: text("city"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    budgetPkr: integer("budget_pkr"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("events_org_idx").on(table.organizationId),
    index("events_status_idx").on(table.status),
  ],
);

export const eventFunctions = pgTable(
  "event_functions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    kind: functionKindEnum("kind").notNull(),
    customName: text("custom_name"),
    date: date("date"),
    startTime: text("start_time"),
    endTime: text("end_time"),
    venueName: text("venue_name"),
    venueAddress: text("venue_address"),
    city: text("city"),
    expectedGuests: integer("expected_guests"),
    budgetPkr: integer("budget_pkr"),
    notes: text("notes"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("functions_event_idx").on(table.eventId)],
);

export const guests = pgTable(
  "guests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone"),
    side: guestSideEnum("side").notNull().default("shared"),
    household: text("household"),
    partySize: integer("party_size").notNull().default(1),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("guests_event_idx").on(table.eventId)],
);

export const guestInvites = pgTable(
  "guest_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
    functionId: uuid("function_id")
      .notNull()
      .references(() => eventFunctions.id, { onDelete: "cascade" }),
    rsvpStatus: rsvpStatusEnum("rsvp_status").notNull().default("pending"),
    attendingCount: integer("attending_count"),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("guest_invite_unique").on(table.guestId, table.functionId),
    index("invites_function_idx").on(table.functionId),
  ],
);

export const vendors = pgTable(
  "vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: vendorCategoryEnum("category").notNull().default("other"),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    email: text("email"),
    city: text("city"),
    instagram: text("instagram"),
    notes: text("notes"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("vendors_org_idx").on(table.organizationId),
    index("vendors_category_idx").on(table.category),
  ],
);

export const eventVendors = pgTable(
  "event_vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, {
      onDelete: "set null",
    }),
    functionId: uuid("function_id").references(() => eventFunctions.id, {
      onDelete: "set null",
    }),
    category: vendorCategoryEnum("category").notNull().default("other"),
    displayName: text("display_name").notNull(),
    quotedPkr: integer("quoted_pkr"),
    paidPkr: integer("paid_pkr"),
    status: bookingStatusEnum("status").notNull().default("inquiry"),
    notes: text("notes"),
    visibleToClient: boolean("visible_to_client").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("event_vendors_event_idx").on(table.eventId)],
);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    functionId: uuid("function_id").references(() => eventFunctions.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    dueDate: date("due_date"),
    status: taskStatusEnum("status").notNull().default("todo"),
    owner: taskOwnerEnum("owner").notNull().default("planner"),
    visibleToClient: boolean("visible_to_client").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("tasks_event_idx").on(table.eventId)],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    functionId: uuid("function_id").references(() => eventFunctions.id, {
      onDelete: "set null",
    }),
    kind: documentKindEnum("kind").notNull().default("note"),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    visibleToClient: boolean("visible_to_client").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("documents_event_idx").on(table.eventId)],
);

export const portalSettings = pgTable(
  "portal_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" })
      .unique(),
    token: text("token").notNull().unique(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    pinHash: text("pin_hash"),
    welcomeMessage: text("welcome_message"),
    showTimeline: boolean("show_timeline").notNull().default(true),
    showGuests: boolean("show_guests").notNull().default(false),
    showVendors: boolean("show_vendors").notNull().default(true),
    showTasks: boolean("show_tasks").notNull().default(true),
    showDocuments: boolean("show_documents").notNull().default(true),
    showBudget: boolean("show_budget").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("portal_token_idx").on(table.token)],
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  events: many(events),
  vendors: many(vendors),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
  functions: many(eventFunctions),
  guests: many(guests),
  eventVendors: many(eventVendors),
  tasks: many(tasks),
  documents: many(documents),
  portal: one(portalSettings, {
    fields: [events.id],
    references: [portalSettings.eventId],
  }),
}));

export const eventFunctionsRelations = relations(
  eventFunctions,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventFunctions.eventId],
      references: [events.id],
    }),
    invites: many(guestInvites),
    eventVendors: many(eventVendors),
    tasks: many(tasks),
    documents: many(documents),
  }),
);

export const guestsRelations = relations(guests, ({ one, many }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id],
  }),
  invites: many(guestInvites),
}));

export const guestInvitesRelations = relations(guestInvites, ({ one }) => ({
  guest: one(guests, {
    fields: [guestInvites.guestId],
    references: [guests.id],
  }),
  function: one(eventFunctions, {
    fields: [guestInvites.functionId],
    references: [eventFunctions.id],
  }),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [vendors.organizationId],
    references: [organizations.id],
  }),
  bookings: many(eventVendors),
}));

export const eventVendorsRelations = relations(eventVendors, ({ one }) => ({
  event: one(events, {
    fields: [eventVendors.eventId],
    references: [events.id],
  }),
  vendor: one(vendors, {
    fields: [eventVendors.vendorId],
    references: [vendors.id],
  }),
  function: one(eventFunctions, {
    fields: [eventVendors.functionId],
    references: [eventFunctions.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  event: one(events, {
    fields: [tasks.eventId],
    references: [events.id],
  }),
  function: one(eventFunctions, {
    fields: [tasks.functionId],
    references: [eventFunctions.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  event: one(events, {
    fields: [documents.eventId],
    references: [events.id],
  }),
  function: one(eventFunctions, {
    fields: [documents.functionId],
    references: [eventFunctions.id],
  }),
}));

export const portalSettingsRelations = relations(portalSettings, ({ one }) => ({
  event: one(events, {
    fields: [portalSettings.eventId],
    references: [events.id],
  }),
}));
