"use client";

import { CreditCard, ShieldCheck, Lock } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import BackToAccount from "@/components/back-to-account";

export default function PaymentSettingsPage() {
  const { user } = useCurrentUser();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Payment Settings</h1>
        <p className="text-gray-500 mb-8">Manage how you pay on BRAMA.</p>

        <div className="space-y-6">
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-pink-50 text-pink-600">
                <CreditCard size={18} />
              </span>
              Saved Payment Methods
            </h2>
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-500 text-sm mb-1">No saved cards yet.</p>
              <p className="text-xs text-gray-400">
                We don&apos;t store your card details — payments are handled securely by Paystack at checkout.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-pink-50 text-pink-600">
                <ShieldCheck size={18} />
              </span>
              Security
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-start gap-3">
                <Lock size={16} className="text-pink-600 shrink-0 mt-0.5" />
                All transactions are encrypted end-to-end with SSL.
              </p>
              <p className="flex items-start gap-3">
                <Lock size={16} className="text-pink-600 shrink-0 mt-0.5" />
                Payments are processed by Paystack — we never see or store your card number.
              </p>
              {user?.email && (
                <p className="pt-3 border-t border-gray-100 text-xs text-gray-400">
                  Billing account: {user.email}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}