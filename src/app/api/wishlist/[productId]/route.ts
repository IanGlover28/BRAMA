import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ productId: string }> };

async function getUserAndEmail() {
  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!clerkUser || !email) return { user: null, email: null };
  const user = await prisma.user.findUnique({ where: { email } });
  return { user, email };
}

export async function POST(_req: Request, { params }: Params) {
  const { productId } = await params;
  const { user, email } = await getUserAndEmail();
  if (!user || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  try {
    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: {},
      create: { userId: user.id, productId },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add to wishlist.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { productId } = await params;
  const { user, email } = await getUserAndEmail();
  if (!user || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: user.id, productId },
    });
    return NextResponse.json({ removed: true, productId });
  } catch {
    return NextResponse.json({ error: "Failed to remove from wishlist." }, { status: 500 });
  }
}