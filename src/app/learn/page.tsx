import type { Metadata } from "next";
import LearnReels from "@/components/learn-reels";
import { prisma } from "@/lib/prisma";
import { getYouTubeReels } from "@/lib/youtube";
import { attachProducts, productImageSrc } from "@/lib/reel-products";
import { tutorialReels } from "./data";
import { tutorialMetadata } from "./metadata";

interface LearnPageProps {
  searchParams: Promise<{ v?: string | string[] }>;
}

async function inStockProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        brand: true,
        category: true,
        stock: true,
      },
    });
    return products.map((p) => ({ ...p, image: productImageSrc(p.image) }));
  } catch (err) {
    console.error("[learn] products unavailable", err);
    return [];
  }
}

/**
 * Videos from the configured YouTube playlists first, then the written
 * tutorials, each with the products it advertises.
 */
async function getReels() {
  const [youtube, products] = await Promise.all([getYouTubeReels(), inStockProducts()]);
  const ids = new Set(youtube.map((r) => r.slug));
  const reels = [
    ...youtube,
    ...tutorialReels.filter((t) => !ids.has(t.video.split("/").pop() ?? "")),
  ];
  return attachProducts(reels, products);
}

async function requested(searchParams: LearnPageProps["searchParams"]) {
  const { v } = await searchParams;
  const slug = Array.isArray(v) ? v[0] : v;
  const reels = await getReels();
  return { reels, reel: reels.find((r) => r.slug === slug) };
}

// A shared reel link (/learn?v=<slug>) previews that video; plain /learn
// keeps the layout's metadata.
export async function generateMetadata({ searchParams }: LearnPageProps): Promise<Metadata> {
  const { reel } = await requested(searchParams);
  return reel ? tutorialMetadata(reel, `/learn?v=${reel.slug}`) : {};
}

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const { reels, reel } = await requested(searchParams);
  return <LearnReels reels={reels} initialSlug={reel?.slug} />;
}
