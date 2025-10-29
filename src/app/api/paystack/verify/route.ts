import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function GET(req: Request) {
  try {
    if (!PAYSTACK_SECRET) {
      return NextResponse.json({ error: "Paystack secret not configured" }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 });
    }


    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const data = await verifyRes.json();

    if (!verifyRes.ok) {
      console.error("Paystack verification failed", data);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }


    if (data.data.status === "success") {
      const order = await prisma.order.updateMany({
        where: {
          reference,
          status: "PENDING",
        },
        data: {
          status: "PAID",
        },
      });

      if (order.count === 0) {
        return NextResponse.json({ error: "Order not found or already processed" }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        message: "Payment verified successfully",
        status: "PAID"
      });
    } else {

      await prisma.order.updateMany({
        where: {
          reference,
        },
        data: {
          status: "FAILED",
        },
      });

      return NextResponse.json({ 
        success: false, 
        message: "Payment was not successful",
        status: data.data.status
      }, { status: 400 });
    }
  } catch (err: unknown) {
    console.error("Payment verification error", err);
    return NextResponse.json({ error: (err as Error).message || "Server error" }, { status: 500 });
  }
}