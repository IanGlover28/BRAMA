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

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 200) {
        return NextResponse.json({ error: "Invalid name." }, { status: 400 });
      }
      data.name = body.name.trim();
    }
    if (body.description !== undefined) {
      if (typeof body.description !== "string" || !body.description.trim()) {
        return NextResponse.json({ error: "Invalid description." }, { status: 400 });
      }
      data.description = body.description.trim();
    }
    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price <= 0 || price > 100000) {
        return NextResponse.json({ error: "Invalid price." }, { status: 400 });
      }
      data.price = parseFloat(price.toFixed(2));
    }
    if (body.image !== undefined) {
      if (typeof body.image !== "string" || !body.image.trim()) {
        return NextResponse.json({ error: "Invalid image." }, { status: 400 });
      }
      data.image = body.image.trim();
    }
    if (body.category !== undefined) {
      if (typeof body.category !== "string" || !body.category.trim()) {
        return NextResponse.json({ error: "Invalid category." }, { status: 400 });
      }
      data.category = body.category.trim().toLowerCase();
    }
    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      if (!Number.isInteger(stock) || stock < 0 || stock > 100000) {
        return NextResponse.json({ error: "Invalid stock." }, { status: 400 });
      }
      data.stock = stock;
    }
    if (body.brand !== undefined) {
      if (body.brand !== null && (typeof body.brand !== "string" || body.brand.trim().length > 100)) {
        return NextResponse.json({ error: "Invalid brand." }, { status: 400 });
      }
      data.brand = body.brand === null ? null : body.brand.trim();
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
