"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { XCircle, Mail } from "lucide-react";
import BackToAccount from "@/components/back-to-account";

export default function CloseAccountPage() {
  const [confirming, setConfirming] = useState(false);

  const handleRequestClose = () => {
    setConfirming(false);
    toast.success("Request received — our team will email you to confirm.");
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Close Account</h1>
        <p className="text-gray-500 mb-8">We&apos;re sad to see you go.</p>

        <section className="bg-white rounded-3xl border border-red-100 shadow-sm p-6 sm:p-8">
          <span className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-600 mb-4">
            <XCircle size={24} />
          </span>
          <h2 className="font-bold text-lg text-gray-900 mb-2">What happens when you close your account?</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-6">
            <li>You&apos;ll no longer be able to access your orders, wishlist or reviews.</li>
            <li>Outstanding order histories are kept for legal and tax purposes.</li>
            <li>Closing is permanent — this cannot be undone.</li>
          </ul>

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-red-700 transition shadow-md shadow-red-600/25"
            >
              <XCircle size={16} /> Request to Close Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This action is permanent. If you&apos;re sure, we&apos;ll send you a confirmation email to verify
                your request.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRequestClose}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-red-700 transition"
                >
                  Yes, close my account
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 bg-pink-50 rounded-3xl border border-pink-100 p-6 text-sm text-gray-600 flex items-start gap-3">
          <Mail size={18} className="text-pink-600 shrink-0 mt-0.5" />
          Need help instead? Contact our support team at{" "}
          <a href="mailto:no-reply@brama.com" className="text-pink-600 font-semibold hover:underline">
            no-reply@brama.com
          </a>
        </section>
      </div>
    </main>
  );
}