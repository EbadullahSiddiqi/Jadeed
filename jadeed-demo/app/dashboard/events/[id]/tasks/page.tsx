"use client";

import { TASK_OWNERS, TASK_STATUSES, functionDisplayName, labelFor } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { addTask, updateTaskStatus, useOwnedEvent } from "@/lib/store";

export default function TasksPage() {
  const { event } = useOwnedEvent();
  if (!event) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form action={addTask.bind(null, event.id)} className="h-fit space-y-3 rounded-2xl bg-white p-5">
        <h2 className="display text-2xl">New task</h2>
        <input name="title" required placeholder="Confirm Walima menu tasting" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <textarea name="description" placeholder="Details" className="min-h-24 w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <select name="functionId" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
          <option value="">Whole event</option>
          {event.functions.map((fn) => (
            <option key={fn.id} value={fn.id}>{functionDisplayName(fn)}</option>
          ))}
        </select>
        <input name="dueDate" type="date" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <select name="owner" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
          {TASK_OWNERS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="visibleToClient" />
          Show on client portal
        </label>
        <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Add task</button>
      </form>
      <div className="space-y-3">
        {event.tasks.map((task) => (
          <form key={task.id} action={updateTaskStatus.bind(null, event.id)} className="rounded-2xl bg-white p-4">
            <input type="hidden" name="taskId" value={task.id} />
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-[#6b635a]">
              {task.function ? functionDisplayName(task.function) : "Event"} · {labelFor(TASK_OWNERS, task.owner)} · due {formatDate(task.dueDate)}
            </p>
            <div className="mt-2 flex gap-2">
              <select key={task.status} name="status" defaultValue={task.status} className="rounded-lg border border-[#e4d8c4] px-2 py-1 text-sm">
                {TASK_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <button className="text-sm text-[#0b4d3a]">Update</button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
