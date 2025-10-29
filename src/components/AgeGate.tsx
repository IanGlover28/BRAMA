"use client";

import { useState } from "react";

export default function AgeGate({ onVerified }: { onVerified: () => void }) {
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userAge = Number(age);
    if (isNaN(userAge) || userAge <= 0) {
      setError("Please enter a valid age.");
      return;
    }

    if (userAge < 18) {
      setError("Sorry, you must be 18 years or older to enter Exortica.");
      return;
    }

    setError("");
    onVerified();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full space-y-5">
        <h1 className="text-2xl font-bold text-green-600">Age Verification</h1>
        <p className="text-gray-700">
          Please enter your age to continue to <strong>Exortica</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Enter your age"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Continue
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
