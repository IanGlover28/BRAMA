"use client";

import Link from "next/link";
import ProductCard from "@/components/product-card";
import ProductGridSkeleton from "@/components/product-skeleton";
import { useWishlistItems } from "@/hooks/use-wishlist";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { data, isLoading, isError } = useWishlistItems();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center justify-center gap-2">
            My Wishlist
          </h1>
          {data && (
            <p className="text-center text-gray-500 text-sm">
              {data.items.length} saved product{data.items.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {isLoading && <ProductGridSkeleton count={8} />}

        {isError && (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-gray-600 mb-4">Could not load your wishlist.</p>
            <Link
              href="/products"
              className="px-5 py-2.5 bg-pink-600 text-white rounded-full text-sm font-semibold hover:bg-pink-700 transition"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && !isError && data && data.items.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-pink-50 text-pink-600 mb-4">
              <Heart size={36} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Tap the heart on any product to save it here for later.
            </p>
            <Link
              href="/products"
              className="px-5 py-2.5 bg-pink-600 text-white rounded-full text-sm font-semibold hover:bg-pink-700 transition"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}