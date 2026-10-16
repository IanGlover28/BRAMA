import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { calcSubtotal, calcTotal } from "@/lib/pricing";
import {
  GUEST_REF_COOKIE,
  GUEST_REF_MAX_AGE,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from "@/lib/guest-checkout";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface IncomingItem {
  id?: unknown;
  quantity?: unknown;
}

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("[checkout] PAYSTACK_SECRET_KEY is not set");
      return fail("Payments are temporarily unavailable. Please try again later.", 503);
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return fail("We couldn't read your order. Please refresh the page and try again.");
    }
    const { items, amount, promo, delivery, note, guest, phone } = body as {
      items?: unknown;
      amount?: unknown;
      promo?: unknown;
      delivery?: unknown;
      note?: unknown;
      phone?: unknown;
      guest?: { name?: unknown; email?: unknown };
    };

    // Signed-in shoppers use their Clerk identity; guests give name + email + phone.
    const clerkUser = await currentUser();
    const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase();
    let email: string;
    let name: string | undefined;
    if (clerkEmail) {
      email = clerkEmail;
      name = clerkUser?.fullName ?? undefined;
    } else {
      const guestName = normalizeName(guest?.name);
      const guestEmail = normalizeEmail(guest?.email);
      if (!guestName) return fail("Please enter your full name.");
      if (!guestEmail) return fail("Please enter a valid email address so we can send your receipt.");
      email = guestEmail;
      name = guestName;
    }

    const contactPhone = normalizePhone(phone);
    if (!clerkEmail && !contactPhone) {
      return fail("Please enter a valid phone number so the rider can reach you.");
    }
    if (phone && !contactPhone) {
      return fail("That phone number doesn't look right. Please check it and try again.");
    }

    if (!Array.isArray(items) || items.length === 0) {
      return fail("Your cart is empty. Add a product before checking out.");
    }

    // Normalize quantities; product IDs are the only cart data we trust.
    const requested = new Map<string, number>();
    for (const item of items as IncomingItem[]) {
      const id = typeof item?.id === "string" ? item.id : null;
      const qty = Number(item?.quantity);
      if (!id || !Number.isInteger(qty) || qty < 1 || qty > 99) {
        return fail("Something's wrong with an item in your cart. Please remove it and add it again.");
      }
      requested.set(id, (requested.get(id) ?? 0) + qty);
    }

    const products = await prisma.product.findMany({
      where: { id: { in: Array.from(requested.keys()) } },
    });

    if (products.length !== requested.size) {
      return fail("Some products in your cart are no longer available. Please remove them and try again.");
    }

    for (const product of products) {
      const wanted = requested.get(product.id)!;
      if (product.stock < wanted) {
        return fail(
          product.stock <= 0
            ? `${product.name} just sold out. Please remove it from your cart.`
            : `Only ${product.stock} of ${product.name} left. Please lower the quantity in your cart.`
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

    // Voucher discounts come from the database, never from the client.
    let discountRate = 0;
    if (typeof promo === "string" && promo.trim()) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: promo.trim().toLowerCase() },
      });
      if (
        voucher &&
        voucher.active &&
        (!voucher.expiresAt || voucher.expiresAt > new Date())
      ) {
        discountRate = voucher.discountPct / 100;
      }
    }
    const total = calcTotal(subtotal, discountRate);

    if (typeof amount !== "number" || amount <= 0 || Math.abs(amount - total) > 0.01) {
      return fail("Prices in your cart have changed. Please review your cart and try again.");
    }

    // A shipping address is required to fulfill the order.
    const address = typeof delivery === "string" ? delivery.trim() : "";
    const orderNote = typeof note === "string" ? note.trim().slice(0, 1000) : "";
    if (!address) return fail("Please enter your delivery address.");
    if (address.length > 500) return fail("Your delivery address is too long. Please shorten it.");
    const shippingAddress = contactPhone ? `${address} · Tel: ${contactPhone}` : address;

    // Keep a Prisma user row keyed by email so orders have a stable owner. Guests
    // get one too; if they sign up later with that email, they see these orders.
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name },
    });

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
        metadata: { items: pricedItems, shippingAddress, note: orderNote, guest: !clerkEmail },
        callback_url: `${BASE_URL}/payment-success`,
      }),
    });

    const data = await initRes.json().catch(() => null);
    if (!initRes.ok || !data?.data?.authorization_url) {
      console.error("[checkout] Paystack initialize failed", initRes.status, data?.message);
      return fail("We couldn't connect to Paystack. Please try again in a moment.", 502);
    }

    const reference: string = data.data.reference;

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

    const res = NextResponse.json({ authorization_url: data.data.authorization_url });
    if (!clerkEmail) {
      res.cookies.set(GUEST_REF_COOKIE, reference, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: GUEST_REF_MAX_AGE,
      });
    }
    return res;
  } catch (err) {
    console.error("[checkout] initialize error", err);
    return fail("Something went wrong on our side. Please try again in a moment.", 500);
  }
}
