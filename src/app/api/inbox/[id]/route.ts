import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, { params }: Params) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!user || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.message.findFirst({ where: { id, email } });
    if (!existing) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    const message = await prisma.message.update({
      where: { id },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}