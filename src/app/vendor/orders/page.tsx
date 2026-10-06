import { prisma } from "@/lib/prisma";
import OrderManager from "@/components/vendor/order-manager";

export default async function VendorOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { user: { select: { name: true, email: true } } },
  });

  return <OrderManager initialOrders={orders} />;
}
