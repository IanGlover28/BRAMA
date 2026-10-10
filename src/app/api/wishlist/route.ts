import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

function userIdFrom(user: { primaryEmailAddress?: { emailAddress: string } | null } | null) {
  return user?.primaryEmailAddress?.emailAddress ?? null;
}

export async function GET() {
  const clerkUser = await currentUser();
  const email = userIdFrom(clerkUser);
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ items: [], ids: [] });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return NextResponse.json({
    items: items.map((item) => ({ id: item.id, product: item.product })),
    ids: items.map((item) => item.productId),
  });
}