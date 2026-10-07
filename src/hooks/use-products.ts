"use client";

import { useQuery } from "@tanstack/react-query";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc" | "bestsellers" | "popular";
  minPrice?: number;
  maxPrice?: number;
}

function buildProductsUrl(filters: ProductFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  return `/api/products?${params.toString()}`;
}

async function fetchProducts(filters: ProductFilters): Promise<ProductsResponse> {
  const res = await fetch(buildProductsUrl(filters));
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => fetchProducts({ pageSize: limit, sort: "newest" }),
    staleTime: 5 * 60 * 1000,
  });
}
