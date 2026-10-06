import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { fulfillOrder } from "@/lib/fulfillment";

export async function POST(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const rawBody = await req.text();

    const signature = req.headers.get("x-paystack-signature") || "";
    const computed = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (computed !== signature) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Ignore events we don't act on - must ack with 200 so Paystack
    // doesn't retry them endlessly.
    if (payload?.event !== "charge.success" || !payload.data?.reference) {
      return NextResponse.json({ ok: true });
    }

    const reference = payload.data.reference;

    // Double-check with Paystack so a spoofed-but-signed body can't mark orders paid.
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    const verifyJson = await verifyRes.json();

    if (!verifyRes.ok || verifyJson.status !== true || verifyJson.data.status !== "success") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const amountReceived = verifyJson.data.amount / 100;
    const existing = await prisma.order.findUnique({
      where: { reference },
      select: { total: true },
    });

    if (existing && Math.abs(existing.total - amountReceived) > 0.01) {
      console.warn(
        `[paystack] Amount mismatch for ${reference}: expected ${existing.total}, received ${amountReceived}`
      );
    }

    await fulfillOrder(reference);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
