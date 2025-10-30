"use client";

import { useState, useEffect } from "react";
import { useLocationContext } from "@/context/location-context";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function LocationPicker() {
const { location, setLocation } = useLocationContext();  
const [showModal, setShowModal] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const saved = localStorage.getItem("user_location");
    if (saved) {
      setLocation(saved);
      setLoading(false);
    } else {
      setShowModal(true);
      setLoading(false);
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* ✅ Display location banner */}
      {location && (
        <div className="bg-pink-50 border border-pink-200 text-pink-700 text-sm px-4 py-2 flex justify-center items-center gap-2 mt-16">
          <span>📍 {location}</span>
          <button
            onClick={() => setShowModal(true)}
            className="text-pink-600 underline text-xs hover:text-pink-800"
          >
            Change
          </button>
        </div>
      )}

      {/* ✅ Animated Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm sm:max-w-md relative"
            >
              <h2 className="text-lg font-semibold mb-3 text-center">
                Set Your Location
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                We use your location to show nearby stores and delivery options.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={detectLocation}
                  className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
                >
                  Detect My Location 🌍
                </button>

                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter your city or region"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <button
                  onClick={() => handleSaveLocation(manualInput)}
                  className="bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Save
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
