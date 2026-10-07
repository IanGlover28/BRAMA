import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/status-badge";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  PAID: "Paid",
  APPROVED: "Approved - being prepared",
  DELIVERED: "Delivered",
  PENDING: "Pending",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export default async function OrdersPage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) redirect("/sign-in");

  const prismaUser = email
    ? await prisma.user.findUnique({ where: { email } })
    : null;
  if (!prismaUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
          <p className="text-gray-500">You have no orders yet.</p>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: prismaUser.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = Array.isArray(order.items)
                ? (order.items as unknown as OrderItem[])
                : [];
              return (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-semibold">{order.id}</div>
                    <div className="text-xs text-gray-400">Ref: {order.reference ?? "—"}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-bold text-lg">₵{order.total.toFixed(2)}</div>
                    <div className="text-xs mt-1">
                      <StatusBadge
                        status={order.status}
                        label={ORDER_STATUS_LABELS[order.status] ?? order.status}
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                {items.length > 0 && (
                  <div className="mt-3 text-sm text-gray-700">
                    <div className="font-medium mb-1">Items</div>
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                      {items.map((item, idx) => (
                        <li key={`${item.id}-${idx}`} className="flex justify-between px-3 py-2">
                          <span>
                            {item.name} <span className="text-gray-400">×{item.quantity}</span>
                          </span>
                          <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Delivery details */}
                {(order.shippingAddress || order.note) && (
                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    {order.shippingAddress && (
                      <p>
                        <span className="font-medium">Ship to: </span>
                        {order.shippingAddress}
                      </p>
                    )}
                    {order.note && (
                      <p>
                        <span className="font-medium">Note: </span>
                        {order.note}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-400">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                  {order.paidAt && <> · Paid: {new Date(order.paidAt).toLocaleString()}</>}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
