import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVendorSession } from "@/lib/vendor";

// Vendors may move orders through fulfillment. Payment statuses (PAID/FAILED)
// are owned by the Paystack flow and cannot be set manually.
const ALLOWED_STATUSES = ["APPROVED", "DELIVERED", "CANCELLED"] as const;

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const status = body?.status;

    if (typeof status !== "string" || !(ALLOWED_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Only paid orders can be fulfilled; pending/unpaid ones can only be cancelled.
    if (status !== "CANCELLED" && existing.status === "PENDING") {
      return NextResponse.json(
        { error: "Order is not paid yet - it can only be cancelled." },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({ where: { id }, data: { status } });

    // Notify the customer in their inbox when their order progresses.
    const notification: Record<string, { subject: string; body: string }> = {
      APPROVED: {
        subject: `Order ${order.reference ?? order.id} approved`,
        body: "Great news! Your order has been approved and is being prepared. We'll notify you when it's on the way.",
      },
      DELIVERED: {
        subject: `Order ${order.reference ?? order.id} delivered`,
        body: "Your order has been delivered. Thank you for shopping with BRAMA Cosmetics!",
      },
      CANCELLED: {
        subject: `Order ${order.reference ?? order.id} cancelled`,
        body: "Your order was cancelled. If you have any questions, reach out to us - we're happy to help.",
      },
    };
    const note = notification[status];
    if (note && existing.user.email) {
      await prisma.message.create({
        data: {
          email: existing.user.email,
          sender: "system",
          subject: note.subject,
          body: note.body,
        },
      }).catch(() => {});
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
