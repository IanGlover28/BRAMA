"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Trash2, Star } from "lucide-react";

interface MyReview {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string | Date;
  product: { id: string; name: string; image: string };
}

export default function MyReviews({ initialReviews }: { initialReviews: MyReview[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(review: MyReview) {
    if (!window.confirm(`Delete your review of "${review.product.name}"?`)) return;
    setDeletingId(review.id);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete review.");
      toast.success("Review deleted.");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  if (initialReviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
        <Star size={32} className="mx-auto mb-3 text-pink-300" />
        <p className="text-sm text-gray-500 mb-4">
          You haven&apos;t written any reviews yet.
        </p>
        <Link href="/products" className="text-sm font-semibold text-pink-600 hover:underline">
          Browse products to review →
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {initialReviews.map((review) => (
        <li key={review.id} className="bg-white rounded-xl shadow-sm border p-4 flex gap-4">
          <Link
            href={`/products/${review.product.id}`}
            className="relative w-16 h-16 shrink-0 rounded-lg bg-pink-50 overflow-hidden"
          >
            <Image
              src={review.product.image || "/placeholder.png"}
              alt={review.product.name}
              fill
              sizes="64px"
              className="object-contain p-1"
              unoptimized
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/products/${review.product.id}`} className="font-semibold text-gray-900 hover:text-pink-600 transition truncate block">
              {review.product.name}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                />
              ))}
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.title && <p className="mt-1 text-sm font-medium text-gray-800">{review.title}</p>}
            {review.body && <p className="text-sm text-gray-600 mt-0.5">{review.body}</p>}
          </div>
          <button
            onClick={() => handleDelete(review)}
            disabled={deletingId === review.id}
            className="p-2 self-start rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40 shrink-0"
            aria-label={`Delete review of ${review.product.name}`}
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}