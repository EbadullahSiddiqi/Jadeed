import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { vendors } from "@/db/schema";
import { createVendor } from "@/lib/actions/vendors";
import { requireOrganization } from "@/lib/auth";
import { VENDOR_CATEGORIES, labelFor } from "@/lib/constants";

export default async function VendorBookPage() {
  const org = await requireOrganization();
  const db = getDb();
  const rows = await db.query.vendors.findMany({
    where: eq(vendors.organizationId, org.id),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form action={createVendor} className="h-fit space-y-3 rounded-2xl bg-white p-5">
        <h1 className="display text-3xl text-[#07382b]">Vendor book</h1>
        <p className="text-sm text-[#6b635a]">
          Save people you reuse across weddings. Assign them to a specific
          function later from each event.
        </p>
        <input name="name" required placeholder="Name" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <select name="category" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2">
          {VENDOR_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <input name="phone" placeholder="Phone" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="whatsapp" placeholder="WhatsApp" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="city" placeholder="City" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <input name="instagram" placeholder="Instagram" className="w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <textarea name="notes" placeholder="Notes" className="min-h-24 w-full rounded-xl border border-[#e4d8c4] px-3 py-2" />
        <button className="rounded-full bg-[#0b4d3a] px-4 py-2 text-sm text-white">Save vendor</button>
      </form>
      <div className="space-y-3">
        {rows.map((vendor) => (
          <article key={vendor.id} className="rounded-2xl bg-white p-4">
            <p className="font-medium">{vendor.name}</p>
            <p className="text-sm text-[#6b635a]">
              {labelFor(VENDOR_CATEGORIES, vendor.category)}
              {vendor.city ? ` · ${vendor.city}` : ""}
              {vendor.phone ? ` · ${vendor.phone}` : ""}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
