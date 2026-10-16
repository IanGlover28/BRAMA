"use client";

import { UserRound, ShieldCheck, KeyRound } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/use-current-user";
import BackToAccount from "@/components/back-to-account";

export default function AccountManagementPage() {
  const { user } = useCurrentUser();
  const { openUserProfile } = useClerk();

  return (
    <main className="min-h-screen bg-ink-50 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-extrabold text-ink-900 mb-1">Account Management</h1>
        <p className="text-ink-500 mb-8">Manage your personal details and security.</p>

        <div className="space-y-6">
          <section className="bg-surface rounded-3xl border border-ink-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-ink-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-brand-600">
                <UserRound size={18} />
              </span>
              Profile
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-ink-100 pb-3">
                <span className="text-ink-500">Name</span>
                <span className="font-medium text-ink-900">{user?.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Email</span>
                <span className="font-medium text-ink-900">{user?.email || "—"}</span>
              </div>
            </div>
          </section>

          <section className="bg-surface rounded-3xl border border-ink-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-ink-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-brand-600">
                <KeyRound size={18} />
              </span>
              Actions
            </h2>
            <button
              onClick={() => openUserProfile()}
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-700 transition shadow-md shadow-brand-600/25"
            >
              <UserRound size={16} /> Edit Profile & Security
            </button>
            <p className="flex items-start gap-3 text-sm text-ink-500 mt-4">
              <ShieldCheck size={16} className="text-brand-600 shrink-0 mt-0.5" />
              Manage your password, email and sign-in methods securely through our identity provider.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}