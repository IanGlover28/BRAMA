"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProductCard from "@/components/product-card"; // ✅ import your production-ready ProductCard
import { Product } from "@/types/product";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    axios
      .get("/api/products?limit=8")
      .then((res) => {
        if (isMounted) {
          setProducts(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to load products. Please try again later.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Featured Products
          </h2>
          <div className="flex space-x-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 sm:w-96 h-96 bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-red-700 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Featured Products
        </h2>

        {/* ✅ Scrollable horizontal carousel */}
        <div className="flex space-x-6 pb-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-72 sm:w-80 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* ✅ View All button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-900 transition duration-300 shadow-md"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
