import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  try {
    if (!PAYSTACK_SECRET) {
      console.error("Paystack secret not set");
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const rawBody = await req.text();

    const signature = req.headers.get("x-paystack-signature") || "";
    const computed = crypto.createHmac("sha512", PAYSTACK_SECRET).update(rawBody).digest("hex");

    if (computed !== signature) {
      console.warn("Paystack signature mismatch");
      return NextResponse.json({ ok: false }, { status: 401 });
    }


    const payload = JSON.parse(rawBody);
    const data = payload.data;

    
    if (!data || !data.reference) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const reference = data.reference;

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const verifyJson = await verifyRes.json();

    if (!verifyRes.ok || verifyJson.status !== true || verifyJson.data.status !== "success") {
      console.warn("Paystack verification failed", verifyJson);

      await prisma.order.updateMany({
        where: { reference },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ ok: false }, { status: 400 });
    }

  
    const tx = verifyJson.data;
    const amountReceived = tx.amount / 100;

  await prisma.order.updateMany({
      where: { reference },
      data: {
        status: "PAID",
        paidAt: new Date(),
        total: amountReceived,
      },
    });

   

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
