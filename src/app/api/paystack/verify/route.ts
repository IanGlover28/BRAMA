import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { fulfillOrder, type OrderItem } from "@/lib/fulfillment";
import { DELIVERY_FEE } from "@/lib/pricing";
import { GUEST_REF_COOKIE } from "@/lib/guest-checkout";

export async function GET(req: Request) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("[checkout] PAYSTACK_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "We couldn't confirm your payment right now. If you were charged, your order is safe - please contact us." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "This link is missing its payment reference. Please check your orders or contact us." },
        { status: 400 }
      );
    }

    // Only the order's owner may see it: signed-in shoppers by email, guests by
    // the reference cookie set when they started checkout in this browser.
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
    const guestRef = (await cookies()).get(GUEST_REF_COOKIE)?.value;
    const isGuest = !email;
    if (isGuest && guestRef !== reference) {
      return NextResponse.json(
        { error: "Please sign in with the account you used to place this order." },
        { status: 401 }
      );
    }

    const owned = await prisma.order.findFirst({
      where: isGuest ? { reference } : { reference, user: { email } },
      select: { id: true, total: true, items: true, user: { select: { email: true } } },
    });
    if (!owned) {
      return NextResponse.json(
        { error: "We couldn't find this order. If you were charged, please contact us with your payment reference." },
        { status: 404 }
      );
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

    const data = await verifyRes.json().catch(() => null);

    if (!verifyRes.ok || !data?.data) {
      console.error("[checkout] Paystack verify failed", verifyRes.status, data?.message);
      return NextResponse.json(
        { error: "We couldn't confirm your payment with Paystack yet. Please refresh this page in a minute." },
        { status: 502 }
      );
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
        guest: isGuest,
        receiptEmail: owned.user?.email ?? null,
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
      return NextResponse.json(
        {
          success: false,
          status: "failed",
          message:
            data.data.gateway_response && data.data.gateway_response !== "Declined"
              ? `Your payment didn't go through: ${data.data.gateway_response}. You haven't been charged - please try again.`
              : "Your payment was declined. You haven't been charged - please try again or use another payment method.",
        },
        { status: 402 }
      );
    }

    if (data.data.status === "abandoned") {
      return NextResponse.json(
        {
          success: false,
          status: "abandoned",
          message: "It looks like the payment wasn't completed. Your cart is still saved - you can check out again.",
        },
        { status: 402 }
      );
    }

    // ongoing / pending / processing - Paystack may still complete it, and the
    // webhook will fulfil the order when it does.
    return NextResponse.json(
      {
        success: false,
        status: "pending",
        message: "Your payment is still being processed. We'll email you as soon as it's confirmed.",
      },
      { status: 202 }
    );
  } catch (err) {
    console.error("[checkout] verify error", err);
    return NextResponse.json(
      { error: "We couldn't confirm your payment right now. If you were charged, your order is safe - please refresh in a minute." },
      { status: 500 }
    );
  }
}
