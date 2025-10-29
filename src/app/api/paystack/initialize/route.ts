import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    if (!PAYSTACK_SECRET) {
      return NextResponse.json({ error: "Paystack secret not configured" }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, amount } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

 
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(amount * 100), 
        currency: "GHS",
        metadata: { items },
        callback_url: `${BASE_URL}/payment-success`,
      }),
    });

    const data = await initRes.json();
    if (!initRes.ok) {
      console.error("Paystack init failed", data);
      return NextResponse.json({ error: data.message || "Paystack init failed" }, { status: 500 });
    }

    const reference = data.data.reference;

  
    await prisma.order.create({
      data: {
        userId: user.id,
        total: amount,
        status: "PENDING",
        reference,
        items,
      },
    });

    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (err: unknown) {
    console.error("Paystack initialize error", err);
    return NextResponse.json({ error: (err as Error).message || "Server error" }, { status: 500 });
  }
}
