import { Suspense } from "react";
import ProductsPageClient from "@/components/products-page-client";
import Loader from "@/components/loader";

export const metadata = {
  title: "Products | BRAMA Cosmetics",
  description: "Browse our collection of premium cosmetics and beauty products.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <Loader count={12} />
        </div>
      </div>
    }>
      <ProductsPageClient />
    </Suspense>
  );
}