// app/(shop)/orders/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import  { Order } from "@prisma/client";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/signup");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/signup");

  // ✅ Tell TS this is an array of Order
  const orders: Order[] = await prisma.order.findMany({
    where: { userId: user.id },
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
            {orders.map((order: Order) => ( // ✅ Typed parameter
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-semibold">{order.id}</div>
                    <div className="text-xs text-gray-400">Ref: {order.reference ?? "—"}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-bold text-lg">GHS {order.total.toFixed(2)}</div>
                    <div className="text-xs mt-1">
                      {order.status === "PAID" && <span className="text-green-600 font-semibold">Paid</span>}
                      {order.status === "PENDING" && <span className="text-yellow-600 font-semibold">Pending</span>}
                      {order.status === "FAILED" && <span className="text-red-600 font-semibold">Failed</span>}
                      {order.status === "CANCELLED" && <span className="text-gray-600 font-semibold">Cancelled</span>}
                    </div>
                  </div>
                </div>

                {/* Expandable: show items */}
                <div className="mt-3 text-sm text-gray-700">
                  <div className="font-medium mb-1">Items</div>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(order.items ?? [], null, 2)}
                  </pre>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                  {order.paidAt && <> · Paid: {new Date(order.paidAt).toLocaleString()}</>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
