import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!user || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, rating, title, body: reviewBody, name } = body;

    if (typeof productId !== "string" || !productId) {
      return NextResponse.json({ error: "Product is required." }, { status: 400 });
    }
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }
    if (title !== null && title !== undefined && (typeof title !== "string" || title.trim().length > 200)) {
      return NextResponse.json({ error: "Title must be text (max 200 chars)." }, { status: 400 });
    }
    if (reviewBody !== null && reviewBody !== undefined && (typeof reviewBody !== "string" || reviewBody.trim().length > 2000)) {
      return NextResponse.json({ error: "Review must be text (max 2000 chars)." }, { status: 400 });
    }
    if (name !== null && name !== undefined && (typeof name !== "string" || name.trim().length > 100)) {
      return NextResponse.json({ error: "Name must be text (max 100 chars)." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Customers can only review products from an order that has been delivered.
    const prismaUser = await prisma.user.findUnique({ where: { email } });
    const deliveredOrders = prismaUser
      ? await prisma.order.findMany({
          where: { userId: prismaUser.id, status: "DELIVERED" },
          select: { items: true },
        })
      : [];
    const purchasedAndDelivered = deliveredOrders.some((order) =>
      Array.isArray(order.items)
        ? (order.items as { id: string }[]).some((item) => item.id === productId)
        : false
    );
    if (!purchasedAndDelivered) {
      return NextResponse.json(
        { error: "You can only review products from a delivered order." },
        { status: 403 }
      );
    }

    const existing = await prisma.review.findUnique({
      where: { productId_email: { productId, email } },
    });
    if (existing) {
      return NextResponse.json({ error: "You've already reviewed this product." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        email,
        name:
          typeof name === "string" && name.trim()
            ? name.trim()
            : user.fullName ?? user.firstName ?? email.split("@")[0],
        rating: parsedRating,
        title: typeof title === "string" ? title.trim() || null : null,
        body: typeof reviewBody === "string" ? reviewBody.trim() || null : null,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}