'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/hooks/use-cart-store";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setError("No payment reference found");
      setVerifying(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
        credentials: "include",
      })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          clearCart();
          setVerifying(false);
        } else {
          setError(data.message || data.error || "Payment verification failed");
          setVerifying(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to verify payment");
        setVerifying(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

  if (verifying) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700 mb-4"></div>
        <p className="text-ink-700">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Failed ❌</h1>
        <p className="text-ink-700 mb-4">{error}</p>
        <Link
          href="/products"
          className="mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-brand-700 mb-4">Payment Successful</h1>
      <p className="text-ink-700 mb-2">Thank you for your purchase!</p>
      <p className="text-sm text-ink-500 mb-6">Your order has been confirmed.</p>
      <div className="flex gap-4">
        <Link
          href="/orders"
          className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
        >
          View Orders
        </Link>
        <Link
          href="/products"
          className="px-6 py-2 bg-ink-200 text-ink-700 rounded-lg hover:bg-ink-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
