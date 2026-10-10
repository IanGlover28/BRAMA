"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/types/product";

export interface WishlistPayload {
  items: { id: string; product: Product }[];
  ids: string[];
}

export function useWishlistIds() {
  return useQuery({
    queryKey: ["wishlist", "ids"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/wishlist");
        if (!res.ok) return { ids: [] as string[] };
        const data = (await res.json()) as WishlistPayload;
        return { ids: data.ids ?? [] };
      } catch {
        return { ids: [] as string[] };
      }
    },
    staleTime: 30_000,
    retry: false,
  });
}

export function useWishlistItems() {
  return useQuery<WishlistPayload>({
    queryKey: ["wishlist", "items"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to load wishlist");
      return res.json();
    },
  });
}

export function useWishlistToggle() {
  const queryClient = useQueryClient();

  return async ({ productId, liked }: { productId: string; liked: boolean }) => {
    const res = await fetch(`/api/wishlist/${productId}`, {
      method: liked ? "DELETE" : "POST",
    });
    if (!res.ok) {
      return { ok: false as const, unauthorized: res.status === 401 };
    }

    queryClient.setQueryData<{ ids: string[] }>(["wishlist", "ids"], (prev) => {
      const ids = prev?.ids ?? [];
      return {
        ids: liked
          ? ids.filter((id) => id !== productId)
          : Array.from(new Set([...ids, productId])),
      };
    });
    queryClient.invalidateQueries({ queryKey: ["wishlist", "items"] });
    return { ok: true as const, unauthorized: false };
  };
}