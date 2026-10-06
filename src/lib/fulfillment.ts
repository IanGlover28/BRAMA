import { prisma } from "@/lib/prisma";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Atomically flips an order from PENDING to PAID (with paidAt) and decrements
 * product stock exactly once. Safe to call from both the verify endpoint and
 * the Paystack webhook - whichever runs first fulfills the order, the second
 * call is a no-op.
 */
export async function fulfillOrder(reference: string) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { reference, status: "PENDING" },
      data: { status: "PAID", paidAt: new Date() },
    });

    if (updated.count === 0) {
      return { fulfilled: false as const };
    }

    const order = await tx.order.findUnique({
      where: { reference: reference! },
      select: { id: true, total: true, items: true },
    });

    const items = (order?.items as OrderItem[] | null) ?? [];
    for (const item of items) {
      await tx.product.updateMany({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return { fulfilled: true as const, order };
  });
}
