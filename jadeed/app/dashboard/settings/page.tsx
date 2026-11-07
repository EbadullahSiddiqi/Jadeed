import { updateSettings } from "@/lib/actions/settings";
import { requireOrganization } from "@/lib/auth";

export default async function SettingsPage() {
  const org = await requireOrganization();
  return (
    <form action={updateSettings} className="max-w-xl space-y-3 rounded-2xl bg-white p-6">
      <h1 className="display text-4xl text-[#07382b]">Settings</h1>
      <p className="text-sm text-[#6b635a]">
        This branding appears on the client portal. Sign-up is disabled in the
        product; add planners from your Clerk dashboard as invited users.
      </p>
      <input name="name" defaultValue={org.name} className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
      <input name="tagline" defaultValue={org.tagline ?? ""} placeholder="Tagline" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
      <input name="phone" defaultValue={org.phone ?? ""} placeholder="Phone" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
      <input name="whatsapp" defaultValue={org.whatsapp ?? ""} placeholder="WhatsApp" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
      <input name="email" defaultValue={org.email ?? ""} placeholder="Email" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
      <input name="city" defaultValue={org.city ?? ""} placeholder="City" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
      <label className="grid gap-1 text-sm">
        Brand colour
        <input name="brandColor" type="color" defaultValue={org.brandColor ?? "#0B4D3A"} className="h-10 w-20" />
      </label>
      <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Save settings</button>
    </form>
  );
}
