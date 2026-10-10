// lib/product-matcher.ts
//
// Simple, transparent rule-based matching. Swap for embeddings/vector search
// later if your catalog grows past a few thousand SKUs, but start here —
// it's debuggable and good enough for most stores.

import type { Product, SkinProfile } from "./types";

export function matchProducts(profile: SkinProfile, catalog: Product[], limit = 4): Product[] {
  const scored = catalog
    .filter((p) => !violatesSensitivity(p, profile))
    .map((p) => ({ product: p, score: scoreProduct(p, profile) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.product);
}

function scoreProduct(product: Product, profile: SkinProfile): number {
  let score = 0;

  if (product.skinTypes.includes(profile.skinType)) score += 3;

  const concernMatches = product.concerns.filter((c) => profile.concerns.includes(c)).length;
  score += concernMatches * 2;

  return score;
}

function violatesSensitivity(product: Product, profile: SkinProfile): boolean {
  const sensitivitiesLower = profile.sensitivities.map((s) => s.toLowerCase());
  return product.contraindications.some((c) =>
    sensitivitiesLower.some((s) => s.includes(c.toLowerCase()) || c.toLowerCase().includes(s))
  );
}