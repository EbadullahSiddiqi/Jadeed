"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createEvent } from "@/lib/store";
import { EVENT_FUNCTION_TEMPLATES, EVENT_TYPES, FUNCTION_KINDS } from "@/lib/constants";

export default function NewEventForm() {
  const router = useRouter();
  const [eventType, setEventType] = useState("wedding");
  const functions = useMemo(
    () => EVENT_FUNCTION_TEMPLATES[eventType] ?? EVENT_FUNCTION_TEMPLATES.other,
    [eventType],
  );

  return (
    <form
      action={(formData) => {
        const id = createEvent(formData);
        if (id) router.push(`/dashboard/events/${id}`);
      }}
      className="max-w-2xl space-y-6 rounded-3xl bg-white p-6"
    >
      <div>
        <h1 className="display text-4xl text-[#07382b]">Create event</h1>
        <p className="mt-2 text-sm text-[#6b635a]">
          A wedding is one event with many functions. Pick the type and we will
          pre-load the usual nights.
        </p>
      </div>
      <Field label="Event title" name="title" placeholder="Ahmed & Fatima" required />
      <Field label="Client name" name="clientName" required />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client phone" name="clientPhone" />
        <Field label="Client email" name="clientEmail" type="email" />
        <label className="grid gap-1 text-sm">
          Event type
          <select
            name="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="rounded-xl border border-[#e4d8c4] px-3 py-2"
          >
            {EVENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="City" name="city" placeholder="Lahore" />
        <Field label="Start date" name="startDate" type="date" />
        <Field label="End date" name="endDate" type="date" />
        <Field label="Budget (PKR)" name="budgetPkr" type="number" />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Functions to include</legend>
        <div className="grid gap-2 md:grid-cols-2">
          {functions.map((item) => {
            const label =
              FUNCTION_KINDS.find((kind) => kind.value === item.kind)?.label ??
              item.kind;
            return (
              <label key={item.kind} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="functions"
                  value={item.kind}
                  defaultChecked
                />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>
      <button className="rounded-full bg-[#0b4d3a] px-5 py-2 text-white">
        Create event
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-xl border border-[#e4d8c4] px-3 py-2"
      />
    </label>
  );
}
