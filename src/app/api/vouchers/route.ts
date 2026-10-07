import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        label: true,
        description: true,
        discountPct: true,
        expiresAt: true,
      },
    });

    const response = NextResponse.json(vouchers);
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 });
  }
}