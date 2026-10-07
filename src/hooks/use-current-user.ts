"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export interface CurrentUser {
  name?: string;
  email?: string;
  image?: string;
}

export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);

  const clerkUserId = clerkUser?.id ?? null;

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;
    setLoading(true);

    if (!clerkUserId) {
      setUser(null);
      setIsVendor(false);
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = res.ok ? await res.json() : null;
        if (!cancelled) {
          setUser(data?.user ?? null);
          setIsVendor(data?.isVendor ?? false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setIsVendor(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, clerkUserId]);

  return { user, isVendor, loading };
}