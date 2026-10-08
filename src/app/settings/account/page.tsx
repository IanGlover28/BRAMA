"use client";

import { UserRound, ShieldCheck, KeyRound } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/use-current-user";
import BackToAccount from "@/components/back-to-account";

export default function AccountManagementPage() {
  const { user } = useCurrentUser();
  const { openUserProfile } = useClerk();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Account Management</h1>
        <p className="text-gray-500 mb-8">Manage your personal details and security.</p>

        <div className="space-y-6">
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-pink-50 text-pink-600">
                <UserRound size={18} />
              </span>
              Profile
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{user?.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{user?.email || "—"}</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-pink-50 text-pink-600">
                <KeyRound size={18} />
              </span>
              Actions
            </h2>
            <button
              onClick={() => openUserProfile()}
              className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-700 transition shadow-md shadow-pink-600/25"
            >
              <UserRound size={16} /> Edit Profile & Security
            </button>
            <p className="flex items-start gap-3 text-sm text-gray-500 mt-4">
              <ShieldCheck size={16} className="text-pink-600 shrink-0 mt-0.5" />
              Manage your password, email and sign-in methods securely through our identity provider.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}