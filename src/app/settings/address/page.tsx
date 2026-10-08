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
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <BackToAccount className="mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Address Book</h1>
        <p className="text-gray-500 mb-8">Your saved delivery destinations.</p>

        <div className="space-y-6">
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center h-9 w-9 rounded-full bg-pink-50 text-pink-600">
                <MapPin size={18} />
              </span>
              Saved Locations
            </h2>

            {savedLocation ? (
              <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-pink-50/60 p-4">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 text-white shrink-0">
                  <MapPin size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Default Location</p>
                  <p className="text-sm text-gray-500 truncate">{savedLocation}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                <MapPin size={28} className="text-pink-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-1">No saved locations.</p>
                <p className="text-xs text-gray-400">
                  Set your location from the landing page and it will be saved here.
                </p>
              </div>
            )}
          </section>

          <button className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-pink-700 transition shadow-md shadow-pink-600/25">
            <Plus size={16} /> Add New Address
          </button>
        </div>
      </div>
    </main>
  );
}