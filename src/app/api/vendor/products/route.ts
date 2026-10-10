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
    const { name, description, price, image, category, stock, brand } = body;

    if (typeof name !== "string" || !name.trim() || name.length > 200) {
      return NextResponse.json({ error: "Name is required (max 200 chars)." }, { status: 400 });
    }
    if (typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0 || parsedPrice > 100000) {
      return NextResponse.json({ error: "Price must be a positive number." }, { status: 400 });
    }
    if (typeof image !== "string" || !image.trim()) {
      return NextResponse.json({ error: "Image path or URL is required." }, { status: 400 });
    }
    if (typeof category !== "string" || !category.trim()) {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }
    const parsedStock = Number(stock ?? 0);
    if (!Number.isInteger(parsedStock) || parsedStock < 0 || parsedStock > 100000) {
      return NextResponse.json({ error: "Stock must be a non-negative integer." }, { status: 400 });
    }
    if (brand !== undefined && brand !== null && (typeof brand !== "string" || brand.trim().length > 100)) {
      return NextResponse.json({ error: "Brand must be text (max 100 chars)." }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(parsedPrice.toFixed(2)),
        image: image.trim(),
        category: category.trim().toLowerCase(),
        stock: parsedStock,
        brand: brand !== undefined && brand !== null ? brand.trim() : null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
