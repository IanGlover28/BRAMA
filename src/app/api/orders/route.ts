import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { user: { email } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "We couldn't load your orders right now. Please refresh the page." }, { status: 500 });
  }
}