CREATE TYPE "public"."booking_status" AS ENUM('inquiry', 'quoted', 'booked', 'confirmed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."document_kind" AS ENUM('note', 'document');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('inquiry', 'planning', 'confirmed', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('wedding', 'engagement', 'milad', 'aqeeqah', 'mehfil', 'birthday', 'corporate', 'other');--> statement-breakpoint
CREATE TYPE "public"."function_kind" AS ENUM('mayun', 'dholki', 'mehendi', 'nikkah', 'barat', 'rukhsati', 'walima', 'reception', 'engagement', 'milad', 'aqeeqah', 'other');--> statement-breakpoint
CREATE TYPE "public"."guest_side" AS ENUM('bride', 'groom', 'shared', 'other');--> statement-breakpoint
CREATE TYPE "public"."rsvp_status" AS ENUM('pending', 'attending', 'declined', 'maybe');--> statement-breakpoint
CREATE TYPE "public"."task_owner" AS ENUM('planner', 'client', 'vendor');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('todo', 'in_progress', 'done', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."vendor_category" AS ENUM('venue', 'caterer', 'decorator', 'photographer', 'videographer', 'makeup', 'dj', 'qawwal', 'transport', 'florist', 'invitations', 'tent_lighting', 'mehendi_artist', 'other');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"function_id" uuid,
	"kind" "document_kind" DEFAULT 'note' NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"visible_to_client" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_functions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"kind" "function_kind" NOT NULL,
	"custom_name" text,
	"date" date,
	"start_time" text,
	"end_time" text,
	"venue_name" text,
	"venue_address" text,
	"city" text,
	"expected_guests" integer,
	"budget_pkr" integer,
	"notes" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"vendor_id" uuid,
	"function_id" uuid,
	"category" "vendor_category" DEFAULT 'other' NOT NULL,
	"display_name" text NOT NULL,
	"quoted_pkr" integer,
	"paid_pkr" integer,
	"status" "booking_status" DEFAULT 'inquiry' NOT NULL,
	"notes" text,
	"visible_to_client" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" text NOT NULL,
	"event_type" "event_type" DEFAULT 'wedding' NOT NULL,
	"status" "event_status" DEFAULT 'planning' NOT NULL,
	"client_name" text NOT NULL,
	"client_phone" text,
	"client_email" text,
	"city" text,
	"start_date" date,
	"end_date" date,
	"budget_pkr" integer,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guest_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"function_id" uuid NOT NULL,
	"rsvp_status" "rsvp_status" DEFAULT 'pending' NOT NULL,
	"attending_count" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"side" "guest_side" DEFAULT 'shared' NOT NULL,
	"household" text,
	"party_size" integer DEFAULT 1 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"whatsapp" text,
	"email" text,
	"city" text,
	"brand_color" text DEFAULT '#0B4D3A',
	"tagline" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "portal_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"token" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"pin_hash" text,
	"welcome_message" text,
	"show_timeline" boolean DEFAULT true NOT NULL,
	"show_guests" boolean DEFAULT false NOT NULL,
	"show_vendors" boolean DEFAULT true NOT NULL,
	"show_tasks" boolean DEFAULT true NOT NULL,
	"show_documents" boolean DEFAULT true NOT NULL,
	"show_budget" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portal_settings_event_id_unique" UNIQUE("event_id"),
	CONSTRAINT "portal_settings_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"function_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"due_date" date,
	"status" "task_status" DEFAULT 'todo' NOT NULL,
	"owner" "task_owner" DEFAULT 'planner' NOT NULL,
	"visible_to_client" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" "vendor_category" DEFAULT 'other' NOT NULL,
	"phone" text,
	"whatsapp" text,
	"email" text,
	"city" text,
	"instagram" text,
	"notes" text,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_function_id_event_functions_id_fk" FOREIGN KEY ("function_id") REFERENCES "public"."event_functions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_functions" ADD CONSTRAINT "event_functions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_vendors" ADD CONSTRAINT "event_vendors_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_vendors" ADD CONSTRAINT "event_vendors_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_vendors" ADD CONSTRAINT "event_vendors_function_id_event_functions_id_fk" FOREIGN KEY ("function_id") REFERENCES "public"."event_functions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_invites" ADD CONSTRAINT "guest_invites_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_invites" ADD CONSTRAINT "guest_invites_function_id_event_functions_id_fk" FOREIGN KEY ("function_id") REFERENCES "public"."event_functions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_settings" ADD CONSTRAINT "portal_settings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_function_id_event_functions_id_fk" FOREIGN KEY ("function_id") REFERENCES "public"."event_functions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "documents_event_idx" ON "documents" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "functions_event_idx" ON "event_functions" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_vendors_event_idx" ON "event_vendors" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "events_org_idx" ON "events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "guest_invite_unique" ON "guest_invites" USING btree ("guest_id","function_id");--> statement-breakpoint
CREATE INDEX "invites_function_idx" ON "guest_invites" USING btree ("function_id");--> statement-breakpoint
CREATE INDEX "guests_event_idx" ON "guests" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "portal_token_idx" ON "portal_settings" USING btree ("token");--> statement-breakpoint
CREATE INDEX "tasks_event_idx" ON "tasks" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "vendors_org_idx" ON "vendors" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "vendors_category_idx" ON "vendors" USING btree ("category");