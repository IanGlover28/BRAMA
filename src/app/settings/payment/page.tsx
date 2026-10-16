"use client";

import { CreditCard, ShieldCheck, Lock } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import BackToAccount from "@/components/back-to-account";

export default function PaymentSettingsPage() {
  const { user } = useCurrentUser();

  return (
    <main className="min-h-screen bg-ink-50 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-extrabold text-ink-900 mb-1">Payment Settings</h1>
        <p className="text-ink-500 mb-8">Manage how you pay on BRAMA.</p>

        <div className="space-y-6">
          <section className="bg-surface rounded-3xl border border-ink-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-ink-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-brand-600">
                <CreditCard size={18} />
              </span>
              Saved Payment Methods
            </h2>
            <div className="rounded-2xl border border-dashed border-ink-300 p-8 text-center">
              <p className="text-ink-500 text-sm mb-1">No saved cards yet.</p>
              <p className="text-xs text-ink-400">
                We don&apos;t store your card details — payments are handled securely by Paystack at checkout.
              </p>
            </div>
          </section>

          <section className="bg-surface rounded-3xl border border-ink-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-ink-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-brand-600">
                <ShieldCheck size={18} />
              </span>
              Security
            </h2>
            <div className="space-y-3 text-sm text-ink-600">
              <p className="flex items-start gap-3">
                <Lock size={16} className="text-brand-600 shrink-0 mt-0.5" />
                All transactions are encrypted end-to-end with SSL.
              </p>
              <p className="flex items-start gap-3">
                <Lock size={16} className="text-brand-600 shrink-0 mt-0.5" />
                Payments are processed by Paystack — we never see or store your card number.
              </p>
              {user?.email && (
                <p className="pt-3 border-t border-ink-100 text-xs text-ink-400">
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