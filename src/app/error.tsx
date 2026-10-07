"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-pink-600 mb-3">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="bg-pink-600 text-white px-6 py-2.5 rounded-full hover:bg-pink-700 transition text-sm font-semibold"
      >
        Try Again
      </button>
    </div>
  );
}