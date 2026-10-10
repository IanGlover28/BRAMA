"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { TicketPercent, Copy, Check } from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  label: string;
  description: string | null;
  discountPct: number;
  expiresAt: string | Date | null;
}

export default function VoucherList({ initialVouchers }: { initialVouchers: Voucher[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function handleCopy(voucher: Voucher) {
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopiedCode(voucher.id);
      toast.success(`${voucher.code.toUpperCase()} copied to clipboard.`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error("Could not copy code.");
    }
  }

  if (initialVouchers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
        <TicketPercent size={32} className="mx-auto mb-3 text-pink-300" />
        <p className="text-sm text-gray-500">No vouchers available right now.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {initialVouchers.map((voucher) => (
        <li key={voucher.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
          <span className="shrink-0 w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
            <TicketPercent size={22} className="text-pink-600" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-pink-600 tracking-wide uppercase">
                {voucher.code}
              </span>
              <span className="shrink-0 bg-pink-50 text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {voucher.discountPct}% off
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">{voucher.label}</p>
            {voucher.description && (
              <p className="text-sm text-gray-600">{voucher.description}</p>
            )}
            {voucher.expiresAt && (
              <p className="text-xs text-gray-400 mt-0.5">
                Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={() => handleCopy(voucher)}
            className="shrink-0 flex items-center gap-1.5 bg-pink-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition"
            aria-label={`Copy ${voucher.code} code`}
          >
            {copiedCode === voucher.id ? <Check size={15} /> : <Copy size={15} />}
            {copiedCode === voucher.id ? "Copied" : "Copy"}
          </button>
        </li>
      ))}
    </ul>
  );
}