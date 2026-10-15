import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { tutorials } from "./learn/data";

// Built per request so new products show up without a redeploy (and the build never needs the DB).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/learn`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const tutorialPages: MetadataRoute.Sitemap = tutorials.map((t) => ({
    url: `${SITE_URL}/learn/${t.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    productPages = products.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("sitemap: failed to load products", error);
  }

  return [...staticPages, ...productPages, ...tutorialPages];
}
