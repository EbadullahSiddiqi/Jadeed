import { addDocument } from "@/lib/actions/events";
import { functionDisplayName } from "@/lib/constants";
import { getOwnedEvent } from "@/lib/queries";

export default async function DocsPage({
  params,
}: PageProps<"/dashboard/events/[id]/docs">) {
  const { id } = await params;
  const event = await getOwnedEvent(id);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form action={addDocument.bind(null, event.id)} className="h-fit space-y-3 rounded-2xl bg-white p-5">
        <h2 className="display text-2xl">Add note or document</h2>
        <select name="kind" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
          <option value="note">Note</option>
          <option value="document">Document</option>
        </select>
        <input name="title" required placeholder="Title" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <select name="functionId" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
          <option value="">Whole event</option>
          {event.functions.map((fn) => (
            <option key={fn.id} value={fn.id}>{functionDisplayName(fn)}</option>
          ))}
        </select>
        <textarea name="body" placeholder="Menu ideas, floor plan notes, family preferences..." className="min-h-40 w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="visibleToClient" />
          Share on client portal
        </label>
        <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Save</button>
      </form>
      <div className="space-y-3">
        {event.documents.map((doc) => (
          <article key={doc.id} className="rounded-2xl bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[#c4a35a]">{doc.kind}</p>
            <h3 className="display text-2xl">{doc.title}</h3>
            <p className="text-sm text-[#6b635a]">
              {doc.function ? functionDisplayName(doc.function) : "Event"} · {doc.visibleToClient ? "Shared" : "Internal"}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{doc.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
