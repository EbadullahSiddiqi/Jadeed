export const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "engagement", label: "Engagement" },
  { value: "milad", label: "Milad" },
  { value: "aqeeqah", label: "Aqeeqah" },
  { value: "mehfil", label: "Mehfil" },
  { value: "birthday", label: "Birthday" },
  { value: "corporate", label: "Corporate" },
  { value: "other", label: "Other" },
] as const;

export const EVENT_STATUSES = [
  { value: "inquiry", label: "Inquiry" },
  { value: "planning", label: "Planning" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
] as const;

export const FUNCTION_KINDS = [
  { value: "mayun", label: "Mayun" },
  { value: "dholki", label: "Dholki" },
  { value: "mehendi", label: "Mehendi" },
  { value: "nikkah", label: "Nikkah" },
  { value: "barat", label: "Barat" },
  { value: "rukhsati", label: "Rukhsati" },
  { value: "walima", label: "Walima" },
  { value: "reception", label: "Reception" },
  { value: "engagement", label: "Engagement" },
  { value: "milad", label: "Milad" },
  { value: "aqeeqah", label: "Aqeeqah" },
  { value: "other", label: "Other" },
] as const;

export const EVENT_FUNCTION_TEMPLATES: Record<
  string,
  { kind: (typeof FUNCTION_KINDS)[number]["value"]; sortOrder: number }[]
> = {
  wedding: [
    { kind: "mayun", sortOrder: 0 },
    { kind: "dholki", sortOrder: 1 },
    { kind: "mehendi", sortOrder: 2 },
    { kind: "nikkah", sortOrder: 3 },
    { kind: "barat", sortOrder: 4 },
    { kind: "rukhsati", sortOrder: 5 },
    { kind: "walima", sortOrder: 6 },
  ],
  engagement: [{ kind: "engagement", sortOrder: 0 }],
  milad: [{ kind: "milad", sortOrder: 0 }],
  aqeeqah: [{ kind: "aqeeqah", sortOrder: 0 }],
  mehfil: [{ kind: "other", sortOrder: 0 }],
  birthday: [{ kind: "other", sortOrder: 0 }],
  corporate: [{ kind: "other", sortOrder: 0 }],
  other: [{ kind: "other", sortOrder: 0 }],
};

export const VENDOR_CATEGORIES = [
  { value: "venue", label: "Venue / Banquet" },
  { value: "caterer", label: "Caterer" },
  { value: "decorator", label: "Decorator" },
  { value: "photographer", label: "Photographer" },
  { value: "videographer", label: "Videographer" },
  { value: "makeup", label: "Makeup artist" },
  { value: "mehendi_artist", label: "Mehendi artist" },
  { value: "dj", label: "DJ / Sound" },
  { value: "qawwal", label: "Qawwal / Live music" },
  { value: "transport", label: "Transport" },
  { value: "florist", label: "Florist" },
  { value: "invitations", label: "Invitations" },
  { value: "tent_lighting", label: "Tent & lighting" },
  { value: "other", label: "Other" },
] as const;

export const BOOKING_STATUSES = [
  { value: "inquiry", label: "Inquiry" },
  { value: "quoted", label: "Quoted" },
  { value: "booked", label: "Booked" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const GUEST_SIDES = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
  { value: "shared", label: "Shared" },
  { value: "other", label: "Other" },
] as const;

export const RSVP_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "attending", label: "Attending" },
  { value: "declined", label: "Declined" },
  { value: "maybe", label: "Maybe" },
] as const;

export const TASK_STATUSES = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
] as const;

export const TASK_OWNERS = [
  { value: "planner", label: "Planner" },
  { value: "client", label: "Client" },
  { value: "vendor", label: "Vendor" },
] as const;

export function labelFor(
  list: readonly { value: string; label: string }[],
  value: string | null | undefined,
) {
  return list.find((item) => item.value === value)?.label ?? value ?? "—";
}

export function functionDisplayName(fn: {
  kind: string;
  customName?: string | null;
}) {
  if (fn.customName?.trim()) return fn.customName;
  return labelFor(FUNCTION_KINDS, fn.kind);
}
