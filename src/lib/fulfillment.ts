import { prisma } from "@/lib/prisma";
import {
  sendOrderConfirmationEmail,
  sendNewOrderVendorEmail,
  type EmailOrder,
  type EmailOrderItem,
} from "@/lib/email";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface FulfilledOrder {
  id: string;
  total: number;
  items: EmailOrderItem[];
  reference: string | null;
  shippingAddress: string | null;
  note: string | null;
  user: { name: string | null; email: string } | null;
}

/**
 * Atomically flips an order from PENDING to PAID (with paidAt) and decrements
 * product stock exactly once. Safe to call from both the verify endpoint and
 * the webhook - whichever runs first fulfills the order, the second
 * call is a no-op.
 */
export async function fulfillOrder(reference: string) {
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { reference, status: "PENDING" },
      data: { status: "PAID", paidAt: new Date() },
    });

    if (updated.count === 0) {
      return { fulfilled: false as const };
    }

    const order = await tx.order.findUnique({
      where: { reference: reference! },
      select: {
        id: true,
        total: true,
        items: true,
        reference: true,
        shippingAddress: true,
        note: true,
        user: { select: { name: true, email: true } },
      },
    });

    const items = (order?.items as unknown as OrderItem[] | null) ?? [];
    for (const item of items) {
      await tx.product.updateMany({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return { fulfilled: true as const, order };
  });

  // Notify customer + vendor once, after the transaction commits. Fails
  // silently - order fulfillment must not depend on mail delivery.
  if (result.fulfilled && result.order) {
    const o = result.order as unknown as FulfilledOrder;
    const emailOrder: EmailOrder = {
      reference: o.reference,
      total: o.total,
      items: (o.items ?? []) as EmailOrderItem[],
      shippingAddress: o.shippingAddress,
      note: o.note,
      customerName: o.user?.name ?? null,
      customerEmail: o.user?.email ?? "",
    };
    void Promise.allSettled([
      emailOrder.customerEmail
        ? sendOrderConfirmationEmail(emailOrder.customerEmail, emailOrder.customerName, emailOrder)
        : Promise.resolve(),
      sendNewOrderVendorEmail(emailOrder),
    ]);
  }

  return result;
}