import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVendorSession } from "@/lib/vendor";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    if (body.active !== undefined && typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Invalid active value." }, { status: 400 });
    }

    const existing = await prisma.voucher.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Voucher not found." }, { status: 404 });
    }

    const voucher = await prisma.voucher.update({
      where: { id },
      data: { active: body.active ?? !existing.active },
    });
    return NextResponse.json({ voucher });
  } catch {
    return NextResponse.json({ error: "Failed to update voucher." }, { status: 500 });
  }
}