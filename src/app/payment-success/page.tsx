'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/hooks/use-cart-store";
import { trackPurchase } from "@/lib/analytics";
import { readJson } from "@/lib/http";
import { CONTACT_EMAIL } from "@/lib/site";

type Outcome =
  | { kind: "verifying" }
  | { kind: "paid"; guest: boolean; receiptEmail: string | null; reference: string }
  | { kind: "pending" | "abandoned" | "failed" | "error"; message: string };

interface VerifyResponse {
  success?: boolean;
  status?: string;
  message?: string;
  error?: string;
  guest?: boolean;
  receiptEmail?: string | null;
  order?: {
    reference: string;
    total: number;
    shipping: number;
    items: Parameters<typeof trackPurchase>[0]["items"];
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [outcome, setOutcome] = useState<Outcome>({ kind: "verifying" });

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setOutcome({
        kind: "error",
        message: "This link is missing its payment reference. If you were charged, please contact us.",
      });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
          credentials: "include",
        });
        const data = await readJson<VerifyResponse>(res);
        if (cancelled) return;

        if (data.success) {
          if (data.order) {
            trackPurchase({
              transactionId: data.order.reference,
              value: data.order.total,
              shipping: data.order.shipping,
              items: data.order.items,
            });
          }
          clearCart();
          setOutcome({
            kind: "paid",
            guest: Boolean(data.guest),
            receiptEmail: data.receiptEmail ?? null,
            reference,
          });
          return;
        }

        const message =
          data.message ||
          data.error ||
          "We couldn't confirm your payment right now. If you were charged, your order is safe - please refresh in a minute.";
        const kind =
          data.status === "pending" || data.status === "abandoned" || data.status === "failed"
            ? data.status
            : "error";
        setOutcome({ kind, message });
      } catch {
        if (cancelled) return;
        setOutcome({
          kind: "error",
          message: "We can't reach BRAMA right now. Check your connection and refresh this page.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

  if (outcome.kind === "verifying") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700 mb-4"></div>
        <p className="text-gray-700">Confirming your payment...</p>
      </div>
    );
  }

  if (outcome.kind === "paid") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-pink-700 mb-4">Thank you - your order is confirmed</h1>
        <p className="text-gray-700 mb-2">
          {outcome.receiptEmail
            ? <>We&apos;ve sent your receipt to <strong>{outcome.receiptEmail}</strong>.</>
            : <>We&apos;ve emailed your receipt.</>}
        </p>
        <p className="text-sm text-gray-500 mb-6">Order reference: {outcome.reference}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {outcome.guest ? (
            <Link href="/sign-up" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
              Create an account to track orders
            </Link>
          ) : (
            <Link href="/orders" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
              View Orders
            </Link>
          )}
          <Link href="/products" className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const heading = {
    pending: "Payment processing",
    abandoned: "Payment not completed",
    failed: "Payment declined",
    error: "We couldn't confirm your payment",
  }[outcome.kind];

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <h1
        className={`text-3xl font-bold mb-4 ${
          outcome.kind === "failed" ? "text-red-700" : "text-gray-900"
        }`}
      >
        {heading}
      </h1>
      <p className="text-gray-700 mb-4 max-w-md">{outcome.message}</p>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {outcome.kind === "pending" || outcome.kind === "error" ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Check again
          </button>
        ) : (
          <Link href="/cart" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
            Back to cart
          </Link>
        )}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Contact us
        </a>
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
