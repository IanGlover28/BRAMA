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

    const existing = await prisma.order.findUnique({ where: { id } });
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
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
