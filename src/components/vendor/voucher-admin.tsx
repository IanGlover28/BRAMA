"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Plus, Power } from "lucide-react";
import { friendlyError, parseResponse } from "@/lib/http";

interface VendorVoucher {
  id: string;
  code: string;
  label: string;
  description: string | null;
  discountPct: number;
  active: boolean;
  expiresAt: string | Date | null;
  createdAt: string | Date;
}

const EMPTY_FORM = {
  code: "",
  label: "",
  description: "",
  discountPct: "10",
  expiresAt: "",
};

export default function VoucherAdmin({ initialVouchers }: { initialVouchers: VendorVoucher[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          label: form.label,
          description: form.description.trim() || null,
          discountPct: Number(form.discountPct),
          expiresAt: form.expiresAt || null,
        }),
      });
      await parseResponse(res, "Failed to create voucher.");

      toast.success("Voucher created.");
      setShowForm(false);
      setForm(EMPTY_FORM);
      router.refresh();
    } catch (err) {
      toast.error(friendlyError(err, "Something went wrong. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(voucher: VendorVoucher) {
    setTogglingId(voucher.id);
    try {
      const res = await fetch(`/api/vendor/vouchers/${voucher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !voucher.active }),
      });
      await parseResponse(res, "Failed to update voucher.");

      toast.success(voucher.active ? "Voucher deactivated." : "Voucher activated.");
      router.refresh();
    } catch (err) {
      toast.error(friendlyError(err, "Something went wrong. Please try again."));
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition"
        >
          <Plus size={16} />
          {showForm ? "Close" : "New Voucher"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface rounded-xl shadow-sm border p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-ink-700 space-y-1 block">
              Code
              <input
                required
                placeholder="e.g. glow20"
                maxLength={50}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full border border-ink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </label>
            <label className="text-sm font-medium text-ink-700 space-y-1 block">
              Discount (%)
              <input
                required
                type="number"
                min="1"
                max="100"
                step="1"
                value={form.discountPct}
                onChange={(e) => setForm({ ...form, discountPct: e.target.value })}
                className="w-full border border-ink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </label>
            <label className="text-sm font-medium text-ink-700 space-y-1 block">
              Label
              <input
                required
                placeholder="e.g. Summer glow sale"
                maxLength={100}
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full border border-ink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </label>
            <label className="text-sm font-medium text-ink-700 space-y-1 block">
              Expires (optional)
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full border border-ink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </label>
            <label className="text-sm font-medium text-ink-700 space-y-1 block sm:col-span-2">
              Description (optional)
              <input
                maxLength={300}
                placeholder="e.g. Get 20% off your next order."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-ink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition disabled:bg-brand-400"
            >
              {saving ? "Creating..." : "Create Voucher"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface rounded-xl shadow-sm border overflow-hidden">
        <h2 className="font-bold text-ink-900 p-5 pb-3">Vouchers</h2>
        {initialVouchers.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-ink-500">No vouchers yet.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {initialVouchers.map((voucher) => (
              <li key={voucher.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-ink-900 uppercase tracking-wide">
                      {voucher.code}
                    </span>
                    <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {voucher.discountPct}% off
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        voucher.active
                          ? "bg-green-100 text-green-700"
                          : "bg-ink-100 text-ink-500"
                      }`}
                    >
                      {voucher.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-ink-700 mt-0.5">{voucher.label}</p>
                  {voucher.description && (
                    <p className="text-xs text-ink-500">{voucher.description}</p>
                  )}
                  <p className="text-xs text-ink-400 mt-0.5">
                    Created {new Date(voucher.createdAt).toLocaleDateString()}
                    {voucher.expiresAt &&
                      ` · Expires ${new Date(voucher.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(voucher)}
                  disabled={togglingId === voucher.id}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition border disabled:opacity-50 ${
                    voucher.active
                      ? "border-red-200 text-red-600 hover:bg-red-50"
                      : "border-green-200 text-green-700 hover:bg-green-50"
                  }`}
                  aria-label={`${voucher.active ? "Deactivate" : "Activate"} ${voucher.code}`}
                >
                  <Power size={14} />
                  {voucher.active ? "Deactivate" : "Activate"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}