import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { calcSubtotal, calcTotal } from "@/lib/pricing";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

interface IncomingItem {
  id?: unknown;
  quantity?: unknown;
}

export async function POST(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Paystack secret not configured" }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, amount, promo, delivery, note } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Normalize quantities; product IDs are the only cart data we trust.
    const requested = new Map<string, number>();
    for (const item of items as IncomingItem[]) {
      const id = typeof item?.id === "string" ? item.id : null;
      const qty = Number(item?.quantity);
      if (!id || !Number.isInteger(qty) || qty < 1 || qty > 99) {
        return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
      }
      requested.set(id, (requested.get(id) ?? 0) + qty);
    }

    const products = await prisma.product.findMany({
      where: { id: { in: Array.from(requested.keys()) } },
    });

    if (products.length !== requested.size) {
      return NextResponse.json(
        { error: "Some products in your cart are no longer available" },
        { status: 400 }
      );
    }

    for (const product of products) {
      if (product.stock < requested.get(product.id)!) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Prices come from the DB only - never trust client-sent prices.
    const pricedItems = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: requested.get(p.id)!,
    }));

    const subtotal = calcSubtotal(pricedItems);
    const total = calcTotal(subtotal, typeof promo === "string" ? promo : undefined);

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (Math.abs(amount - total) > 0.01) {
      return NextResponse.json(
        { error: "Amount mismatch - please refresh your cart and try again" },
        { status: 400 }
      );
    }

    // A shipping address is required to fulfill the order.
    const shippingAddress = typeof delivery === "string" ? delivery.trim() : "";
    const orderNote = typeof note === "string" ? note.trim().slice(0, 1000) : "";
    if (!shippingAddress || shippingAddress.length > 500) {
      return NextResponse.json(
        { error: "A valid delivery address is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(total * 100),
        currency: "GHS",
        metadata: { items: pricedItems, shippingAddress, note: orderNote },
        callback_url: `${BASE_URL}/payment-success`,
      }),
    });

    const data = await initRes.json();
    if (!initRes.ok) {
      return NextResponse.json(
        { error: data.message || "Paystack initialization failed" },
        { status: 500 }
      );
    }

    const reference = data.data.reference;

    await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: "PENDING",
        reference,
        items: pricedItems,
        shippingAddress,
        note: orderNote,
      },
    });

    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
