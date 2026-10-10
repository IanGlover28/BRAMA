import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { fulfillOrder } from "@/lib/fulfillment";

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
      select: { id: true },
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

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        status: "PAID",
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
