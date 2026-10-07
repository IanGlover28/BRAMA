"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import StarRating from "./star-rating";

export default function ReviewForm({
  productId,
  userName,
}: {
  productId: string;
  userName: string | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title: title.trim() || null, body: body.trim() || null, name: userName || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review.");

      toast.success("Review submitted. Thank you!");
      setRating(0);
      setTitle("");
      setBody("");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <label className="text-sm font-medium text-gray-700 space-y-1 block">
        Your rating
        <StarRating value={rating} onChange={setRating} size={24} />
      </label>
      <input
        maxLength={200}
        placeholder="Review title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      <textarea
        rows={3}
        maxLength={2000}
        placeholder="Share your experience with this product (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition disabled:bg-pink-400"
      >
        {saving ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}