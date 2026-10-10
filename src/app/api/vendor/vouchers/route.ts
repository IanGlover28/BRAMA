import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVendorSession } from "@/lib/vendor";

export async function POST(req: Request) {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { code, label, description, discountPct, expiresAt } = body;

    if (typeof code !== "string" || !code.trim() || code.trim().length > 50) {
      return NextResponse.json({ error: "A code is required (max 50 chars)." }, { status: 400 });
    }
    if (typeof label !== "string" || !label.trim() || label.trim().length > 100) {
      return NextResponse.json({ error: "A label is required (max 100 chars)." }, { status: 400 });
    }
    if (description !== undefined && description !== null && description !== "" && (typeof description !== "string" || description.length > 300)) {
      return NextResponse.json({ error: "Description must be text (max 300 chars)." }, { status: 400 });
    }
    const parsedPct = Number(discountPct);
    if (!Number.isInteger(parsedPct) || parsedPct < 1 || parsedPct > 100) {
      return NextResponse.json({ error: "Discount must be a whole number between 1 and 100." }, { status: 400 });
    }
    let parsedExpiry: Date | null = null;
    if (expiresAt !== undefined && expiresAt !== null && expiresAt !== "") {
      parsedExpiry = new Date(expiresAt as string);
      if (Number.isNaN(parsedExpiry.getTime())) {
        return NextResponse.json({ error: "Invalid expiry date." }, { status: 400 });
      }
    }

    const voucher = await prisma.voucher.create({
      data: {
        code: code.trim().toLowerCase(),
        label: label.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        discountPct: parsedPct,
        expiresAt: parsedExpiry,
        active: true,
      },
    }).catch((err) => {
      if (err?.code === "P2002") {
        return undefined as never;
      }
      throw err;
    });

    if (!voucher) {
      return NextResponse.json({ error: "That voucher code already exists." }, { status: 409 });
    }

    return NextResponse.json({ voucher }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create voucher." }, { status: 500 });
  }
}