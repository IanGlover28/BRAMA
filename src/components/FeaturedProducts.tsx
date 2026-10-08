"use client";

import { useFeaturedProducts } from "@/hooks/use-products";
import ProductCard from "@/components/product-card";
import Loader from "@/components/loader";
import Link from "next/link";

export default function FeaturedProducts() {
  const { data, isLoading, isError } = useFeaturedProducts(8);
  const products = data?.products ?? [];

  if (isLoading) {
    return (
      <section className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Featured Products
          </h2>
          <Loader count={4} />
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) return null;

  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-pink-400">
          Featured Products
        </h2>

        <div className="flex space-x-6 pb-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-72 sm:w-80 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-pink-400 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-900 transition duration-300 shadow-md"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
