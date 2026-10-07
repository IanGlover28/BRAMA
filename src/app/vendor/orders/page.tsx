import { prisma } from "@/lib/prisma";
import OrderManager from "@/components/vendor/order-manager";

export default async function VendorOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { user: { select: { name: true, email: true } } },
  });

  const productIds = [
    ...new Set(
      orders.flatMap((order) =>
        Array.isArray(order.items)
          ? (order.items as { id?: string }[])
              .map((item) => item.id)
              .filter((id): id is string => typeof id === "string" && !!id)
          : []
      )
    ),
  ];

  const reviews = productIds.length
    ? await prisma.review.findMany({
        where: { productId: { in: productIds } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const reviewsByProduct = reviews.reduce<Record<string, typeof reviews>>((map, review) => {
    (map[review.productId] ??= []).push(review);
    return map;
  }, {});

  return <OrderManager initialOrders={orders} reviewsByProduct={reviewsByProduct} />;
}