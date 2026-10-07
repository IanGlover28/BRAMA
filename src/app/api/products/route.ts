import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10)));
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice;
      if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice;
    }

    let orderBy: { price?: "asc" | "desc"; name?: "asc" | "desc"; createdAt?: "asc" | "desc"; stock?: "asc" | "desc" };
    switch (sort) {
      case "price_asc": orderBy = { price: "asc" }; break;
      case "price_desc": orderBy = { price: "desc" }; break;
      case "name_asc": orderBy = { name: "asc" }; break;
      case "name_desc": orderBy = { name: "desc" }; break;
      case "bestsellers":
      case "popular": orderBy = { stock: "desc" }; break;
      default: orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    const response = NextResponse.json({
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });

    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
