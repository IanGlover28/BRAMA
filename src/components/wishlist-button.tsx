"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlistIds, useWishlistToggle } from "@/hooks/use-wishlist";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { data } = useWishlistIds();
  const toggle = useWishlistToggle();
  const liked = data?.ids.includes(productId) ?? false;
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    const res = await toggle({ productId, liked });
    if (!res.ok) {
      toast.error(
        res.unauthorized
          ? "Sign in to save items to your wishlist."
          : "Could not update your wishlist."
      );
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={liked}
      className={`flex items-center justify-center h-9 w-9 rounded-full shadow-md transition-all ${
        liked
          ? "bg-pink-600 text-white hover:bg-pink-700"
          : "bg-white text-gray-400 hover:text-pink-600 hover:bg-pink-50"
      }`}
    >
      <Heart size={17} className={liked ? "fill-current" : ""} />
    </button>
  );
}