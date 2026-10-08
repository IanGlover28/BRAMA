"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocationContext } from "@/context/location-context";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { MapPin, LocateFixed, X, Check } from "lucide-react";

export default function LocationPicker() {
const { location, setLocation } = useLocationContext();
const pathname = usePathname();
const isHome = pathname === "/";
  const [showModal, setShowModal] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const saved = localStorage.getItem("user_location");
    if (saved) {
      setLocation(saved);
      setLoading(false);
    } else if (isHome) {
      setShowModal(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setLocation, isHome]);

const handleSaveLocation = (loc: string) => {
  if (!loc.trim()) {
    toast.error("Please enter a valid location.");
    return;
  }

  setLocation(loc);
  setShowModal(false);
  toast.success("Location saved successfully!");
};

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await res.json();
            if (data.display_name) {
              handleSaveLocation(data.display_name);
            } else {
              toast.error("Couldn't detect address. Try typing manually.");
            }
          } catch {
            toast.error("Error fetching location. Please type it manually.");
          }
        },
        () => toast.error("Location permission denied.")
      );
    } else {
      toast.error("Geolocation not supported on this device.");
    }
  };

  if (loading) return null;

  return (
    <>
      {/* Location banner — only on the landing page, floating beneath the navbar */}
      {isHome && location && (
        <div className="fixed left-1/2 -translate-x-1/2 top-[158px] md:top-[152px] z-40 px-4 w-full flex justify-center pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-full pl-3 pr-1.5 py-1.5 max-w-full">
            <MapPin size={14} className="text-pink-600 shrink-0" />
            <span className="text-sm text-gray-700 truncate">{location}</span>
            <button
              onClick={() => setShowModal(true)}
              className="shrink-0 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-pink-700 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Animated Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-2xl p-6 sm:p-7 w-full max-w-sm sm:max-w-md relative"
            >
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close location picker"
                className="absolute top-4 right-4 flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-500 hover:bg-pink-600 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-50 text-pink-600 mb-4">
                <MapPin size={22} />
              </span>

              <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                Set Your Location
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                We use this to show you accurate delivery options and fees.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={detectLocation}
                  className="flex items-center justify-center gap-2 bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition shadow-md shadow-pink-600/25"
                >
                  <LocateFixed size={16} />
                  Detect My Location
                </button>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wider">
                  <span className="h-px flex-1 bg-gray-200" />
                  or type it in
                  <span className="h-px flex-1 bg-gray-200" />
                </div>

                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter your city or region"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                />

                <button
                  onClick={() => handleSaveLocation(manualInput)}
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                >
                  <Check size={16} />
                  Save Location
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}