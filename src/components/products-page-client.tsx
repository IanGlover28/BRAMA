"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/product-card";
import ProductGridSkeleton from "@/components/product-skeleton";
import SearchBar, { SortSelect, CategoryFilter } from "@/components/product-filters";
import Pagination from "@/components/pagination";
import { categorySlugs } from "@/lib/categories";

const PAGE_SIZE = 12;

const SORT_OPTIONS = ["newest", "price_asc", "price_desc", "name_asc", "name_desc"] as const;
type SortOption = (typeof SORT_OPTIONS)[number] | "bestsellers" | "popular";

function sortFromParams(sort: string | null, filter: string | null): SortOption {
  // Navbar convenience links: ?filter=new / ?filter=bestsellers / ?filter=popular
  if (filter === "new") return "newest";
  if (filter === "bestsellers") return "bestsellers";
  if (filter === "popular") return "popular";
  return (SORT_OPTIONS as readonly string[]).includes(sort ?? "")
    ? (sort as SortOption)
    : "newest";
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [sort, setSort] = useState<SortOption>(() =>
    sortFromParams(searchParams.get("sort"), searchParams.get("filter"))
  );
  const [category, setCategory] = useState(() => searchParams.get("category") ?? "");

  // Re-sync when the URL changes (e.g. navigating from the navbar while
  // already on this page).
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setCategory(searchParams.get("category") ?? "");
    setSort(sortFromParams(searchParams.get("sort"), searchParams.get("filter")));
    setPage(1);
  }, [searchParams]);

  const { data, isLoading, isError, error, isFetching } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    sort,
    category: category || undefined,
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 0;

  const categories = categorySlugs;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-12 mb-6 items-start sm:items-center justify-between">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
          <div className="flex gap-3 items-center">
            <SortSelect value={sort} onChange={(v) => { setSort(sortFromParams(v, null)); setPage(1); }} />
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <CategoryFilter
              categories={categories}
              active={category}
              onChange={(c) => { setCategory(c); setPage(1); }}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && <ProductGridSkeleton count={PAGE_SIZE} />}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load products</h2>
            <p className="text-gray-500 mb-4">{(error as Error)?.message || "Something went wrong"}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-500">
              {search || category
                ? "Try adjusting your search or filters."
                : "Check back soon for new arrivals!"}
            </p>
            {(search || category) && (
              <button
                onClick={() => { setSearch(""); setCategory(""); setPage(1); }}
                className="mt-4 px-4 py-2 text-pink-600 underline hover:text-pink-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Success State - Product Grid */}
        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Background refetch indicator */}
            {isFetching && !isLoading && (
              <div className="fixed bottom-4 right-4 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2 z-50">
                <div className="w-3 h-3 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                Updating...
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
