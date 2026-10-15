import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { fulfillOrder, type OrderItem } from "@/lib/fulfillment";
import { DELIVERY_FEE } from "@/lib/pricing";

export async function GET(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Paystack secret not configured" }, { status: 500 });
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 });
    }

    // Ensure the caller owns this order before revealing anything about it.
    const owned = await prisma.order.findFirst({
      where: { reference, user: { email } },
      select: { id: true, total: true, items: true },
    });
    if (!owned) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await verifyRes.json();

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    if (data.data.status === "success") {
      await fulfillOrder(reference);

      // Order details for the client's GA4 purchase event. Brand and
      // category aren't stored on the order, so look them up.
      const items = Array.isArray(owned.items) ? (owned.items as unknown as OrderItem[]) : [];
      const products = await prisma.product.findMany({
        where: { id: { in: items.map((i) => i.id) } },
        select: { id: true, brand: true, category: true },
      });
      const meta = new Map(products.map((p) => [p.id, p]));

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        status: "PAID",
        order: {
          reference,
          total: owned.total,
          shipping: DELIVERY_FEE,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            brand: meta.get(i.id)?.brand ?? null,
            category: meta.get(i.id)?.category ?? null,
          })),
        },
      });
    }

    // Only an explicit failure closes the order. Transient statuses
    // (ongoing, abandoned, etc.) stay PENDING - the webhook may still
    // complete them asynchronously.
    if (data.data.status === "failed") {
      await prisma.order.updateMany({
        where: { reference, status: "PENDING" },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Payment was not successful",
        status: data.data.status,
      },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
