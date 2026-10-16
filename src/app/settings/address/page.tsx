"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import BackToAccount from "@/components/back-to-account";

export default function AddressBookPage() {
  const [savedLocation, setSavedLocation] = useState<string | null>(null);

  useEffect(() => {
    setSavedLocation(localStorage.getItem("user_location"));
  }, []);

  return (
    <main className="min-h-screen bg-ink-50 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-extrabold text-ink-900 mb-1">Address Book</h1>
        <p className="text-ink-500 mb-8">Your saved delivery destinations.</p>

        <div className="space-y-6">
          <section className="bg-surface rounded-3xl border border-ink-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-ink-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-brand-600">
                <MapPin size={18} />
              </span>
              Saved Locations
            </h2>

            {savedLocation ? (
              <div className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-600 text-white shrink-0">
                  <MapPin size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900">Default Location</p>
                  <p className="text-sm text-ink-500 truncate">{savedLocation}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-ink-300 p-8 text-center">
                <MapPin size={28} className="text-brand-600 mx-auto mb-3" />
                <p className="text-ink-500 text-sm mb-1">No saved locations.</p>
                <p className="text-xs text-ink-400">
                  Set your location from the landing page and it will be saved here.
                </p>
              </div>
            )}
          </section>

          <button className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-700 transition shadow-md shadow-brand-600/25">
            <Plus size={16} /> Add New Address
          </button>
        </div>
      </div>
    </main>
  );
}