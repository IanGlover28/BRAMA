import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Orders that represent real revenue (payment captured).
const EARNING_STATUSES = ["PAID", "APPROVED", "DELIVERED"];

export default async function VendorDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [earnings, monthEarnings, pendingCount, productCount, lowStock, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        _count: true,
        where: { status: { in: EARNING_STATUSES } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: EARNING_STATUSES }, createdAt: { gte: startOfMonth } },
      }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, stock: true },
        orderBy: { stock: "asc" },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  const stats = [
    {
      label: "Total Earnings",
      value: `₵${(earnings._sum.total ?? 0).toFixed(2)}`,
      sub: `${earnings._count} paid order${earnings._count === 1 ? "" : "s"}`,
    },
    {
      label: "This Month",
      value: `₵${(monthEarnings._sum.total ?? 0).toFixed(2)}`,
      sub: "Earnings since the 1st",
    },
    {
      label: "Awaiting Fulfillment",
      value: String(pendingCount),
      sub: "Paid orders to approve",
    },
    { label: "Products", value: String(productCount), sub: "In catalog" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-extrabold text-pink-600 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-sm text-pink-600 hover:underline">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-3 flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.user?.name ?? order.user?.email ?? "Customer"} — ₵
                      {order.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleString()} · Ref {order.reference ?? "—"}
                    </p>
                  </div>
                  <StatusPill status={order.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Low Stock</h2>
            <Link href="/vendor/products" className="text-sm text-pink-600 hover:underline">
              Restock →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-500">All products are well stocked.</p>
          ) : (
            <ul className="space-y-2">
              {lowStock.map((product) => (
                <li key={product.id} className="flex justify-between items-center text-sm">
                  <span className="truncate text-gray-700">{product.name}</span>
                  <span
                    className={`ml-2 font-semibold ${
                      product.stock === 0 ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    APPROVED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-gray-200 text-gray-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
