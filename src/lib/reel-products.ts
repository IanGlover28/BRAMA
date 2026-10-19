import type { Reel, ReelProduct } from "@/app/learn/data";

/**
 * Picks the products advertised under each Learn reel, in order of preference:
 *   1. products linked in the video's description (bramacosmetics.com/products/<id>)
 *   2. products whose name or brand shares specific words with the video
 *      (serum, cleanser, niacinamide, lip balm...), boosted by matching category
 *   3. in-stock products from the category the video is about, else skincare
 */

const MAX_PRODUCTS = 3;

/** Topic words in a video mapped to the store's product categories. */
const TOPICS: { words: string[]; categories: string[] }[] = [
  {
    words: [
      "skin",
      "skincare",
      "face",
      "facial",
      "glow",
      "acne",
      "spot",
      "pigmentation",
      "hyperpigmentation",
      "serum",
      "cleanser",
      "toner",
      "moisturiser",
      "moisturizer",
      "sunscreen",
      "spf",
      "niacinamide",
      "vitamin",
      "routine",
      "pore",
      "redness",
      "sensitive",
    ],
    categories: ["skincare", "face-serums", "face-toners", "face-wash", "face-cream"],
  },
  { words: ["lip", "lips", "balm", "chapped"], categories: ["lipcare"] },
  {
    words: [
      "makeup",
      "foundation",
      "concealer",
      "blush",
      "brow",
      "brows",
      "eyebrow",
      "lipstick",
      "gloss",
      "glam",
      "mascara",
      "contour",
      "shade",
    ],
    categories: ["makeup"],
  },
  {
    words: ["hair", "curl", "curls", "curly", "scalp", "braid", "braids", "edges", "relaxer"],
    categories: ["haircare"],
  },
  {
    words: ["fragrance", "perfume", "scent", "smell"],
    categories: ["fragrances"],
  },
  {
    words: ["body", "lotion", "scrub", "exfoliate", "shea", "cocoa", "bath", "shower", "dry"],
    categories: [
      "bodycare",
      "body-lotion",
      "sugar-body-scrub",
      "salt-body-scrubs",
      "body-and-bath-works",
    ],
  },
];

const FALLBACK_CATEGORIES = TOPICS[0].categories;

/** Too common in product names to mean anything on their own. */
const GENERIC = new Set([
  "the",
  "and",
  "for",
  "with",
  "your",
  "care",
  "beauty",
  "original",
  "perfect",
  "radiant",
  "cream",
  "body",
  "face",
  "skin",
  "hair",
  "best",
  "how",
  "to",
  "my",
  "routine",
  "tutorial",
]);

function words(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3)
    .map((w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w));
}

export function productImageSrc(image: string | null | undefined) {
  if (!image) return "/placeholder.png";
  return image.startsWith("http") || image.startsWith("/") ? image : `/${image}`;
}

export function attachProducts(reels: Reel[], products: ReelProduct[]): Reel[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const productWords = new Map(
    products.map((p) => [
      p.id,
      new Set(words(`${p.name} ${p.brand ?? ""}`).filter((w) => !GENERIC.has(w))),
    ]),
  );
  // Stock is the best popularity signal available.
  const byStock = [...products].sort((a, b) => b.stock - a.stock);

  return reels.map((reel) => {
    const linked = (reel.productIds ?? [])
      .map((id) => byId.get(id))
      .filter(Boolean) as ReelProduct[];
    if (linked.length) return { ...reel, products: linked.slice(0, MAX_PRODUCTS) };

    const reelWords = new Set(words(`${reel.title} ${reel.summary} ${reel.category}`));
    const topicCategories = new Set(
      TOPICS.filter((t) => t.words.some((w) => reelWords.has(w))).flatMap((t) => t.categories),
    );

    const scored = byStock
      .map((p) => {
        let score = 0;
        for (const w of productWords.get(p.id)!) if (reelWords.has(w)) score += 3;
        if (score > 0 && topicCategories.has(p.category)) score += 1;
        return { p, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    const picked = scored.map((s) => s.p);
    const fill = topicCategories.size ? topicCategories : new Set(FALLBACK_CATEGORIES);
    for (const p of byStock) {
      if (picked.length >= MAX_PRODUCTS) break;
      if (fill.has(p.category) && !picked.includes(p)) picked.push(p);
    }

    return { ...reel, products: picked.slice(0, MAX_PRODUCTS) };
  });
}
