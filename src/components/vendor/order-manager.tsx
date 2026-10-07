"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircle, PackageCheck, XCircle } from "lucide-react";
import StatusBadge from "@/components/status-badge";
import StarRating from "@/components/star-rating";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface VendorReview {
  id: string;
  email: string;
  name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
}

interface VendorOrder {
  id: string;
  reference: string | null;
  total: number;
  status: string;
  items: unknown;
  shippingAddress: string | null;
  note: string | null;
  createdAt: Date | string;
  paidAt: Date | null;
  user: { name: string | null; email: string } | null;
}

const ORDER_STATUSES = ["PAID", "APPROVED", "DELIVERED", "PENDING", "FAILED", "CANCELLED"] as const;

export default function OrderManager({
  initialOrders,
  reviewsByProduct = {},
}: {
  initialOrders: VendorOrder[];
  reviewsByProduct?: Record<string, VendorReview[]>;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered =
    filter === "ALL" ? initialOrders : initialOrders.filter((o) => o.status === filter);

  async function updateStatus(order: VendorOrder, status: string) {
    const labels: Record<string, string> = {
      APPROVED: `Approve order ${order.reference ?? order.id}?`,
      DELIVERED: `Mark order ${order.reference ?? order.id} as delivered?`,
      CANCELLED: `Cancel order ${order.reference ?? order.id}?`,
    };
    if (!window.confirm(labels[status])) return;

    setUpdatingId(order.id);
    try {
      const res = await fetch(`/api/vendor/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order.");

      toast.success(`Order ${status.toLowerCase()}.`);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["ALL", ...ORDER_STATUSES].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === f
                ? "bg-pink-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300"
            }`}
          >
            {f === "ALL" ? "All" : f}
            <span className="ml-1 opacity-70">
              {f === "ALL" ? initialOrders.length : initialOrders.filter((o) => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="bg-white rounded-xl shadow-sm border p-6 text-sm text-gray-500">
          No orders here.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((order) => {
            const items = Array.isArray(order.items)
              ? (order.items as unknown as OrderItem[])
              : [];
            const canFulfill = order.status === "PAID" || order.status === "APPROVED";
            const busy = updatingId === order.id;

            return (
              <li key={order.id} className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex flex-wrap justify-between gap-3 items-start">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {order.user?.name ?? order.user?.email ?? "Customer"}
                      <span className="text-xs font-normal text-gray-400 ml-2">
                        {order.user?.email}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Ref {order.reference ?? "—"} · Placed{" "}
                      {new Date(order.createdAt).toLocaleString()}
                      {order.paidAt &&
                        ` · Paid ${new Date(order.paidAt).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge status={order.status} />
                    <p className="font-extrabold text-lg text-pink-600 mt-1">
                      ₵{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                {items.length > 0 && (
                  <ul className="mt-3 divide-y divide-gray-100 border border-gray-100 rounded-lg">
                    {items.map((item, idx) => (
                      <li key={`${item.id}-${idx}`} className="px-3 py-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {item.name}{" "}
                            <span className="text-gray-400">×{item.quantity}</span>
                          </span>
                          <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {(reviewsByProduct[item.id] ?? []).map((review) => (
                          <div
                            key={review.id}
                            className="mt-1.5 pl-3 border-l-2 border-amber-300 bg-amber-50/60 rounded-r-lg p-2"
                          >
                            <div className="flex items-center gap-2">
                              <StarRating value={review.rating} size={14} />
                              <span className="text-xs font-semibold text-gray-700">
                                {review.name || review.email.split("@")[0] || "Customer"}
                              </span>
                              <span className="text-xs text-gray-400">
                                reviewed {item.name}
                              </span>
                            </div>
                            {(review.title || review.body) && (
                              <p className="text-xs text-gray-600 mt-1">
                                {[review.title, review.body].filter(Boolean).join(" — ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Delivery info */}
                {(order.shippingAddress || order.note) && (
                  <div className="mt-3 text-sm space-y-1">
                    {order.shippingAddress && (
                      <p className="text-gray-700">
                        <span className="font-medium">Ship to: </span>
                        {order.shippingAddress}
                      </p>
                    )}
                    {order.note && (
                      <p className="text-gray-600">
                        <span className="font-medium">Note: </span>
                        {order.note}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {canFulfill && order.status !== "DELIVERED" && (
                    <button
                      onClick={() => updateStatus(order, "APPROVED")}
                      disabled={busy}
                      className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <CheckCircle size={14} />
                      {order.status === "APPROVED" ? "Approved" : "Approve"}
                    </button>
                  )}
                  {(order.status === "APPROVED" || order.status === "PAID") && (
                    <button
                      onClick={() => updateStatus(order, "DELIVERED")}
                      disabled={busy}
                      className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <PackageCheck size={14} /> Mark Delivered
                    </button>
                  )}
                  {!["CANCELLED", "FAILED", "DELIVERED"].includes(order.status) && (
                    <button
                      onClick={() => updateStatus(order, "CANCELLED")}
                      disabled={busy}
                      className="flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
