// data/sample-products.ts
// Replace with a query to your real product DB. This is here so the route
// works out of the box for testing.

import type { Product } from "@/lib/types";

export const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Balancing Gel Cleanser",
    price: 18,
    imageUrl: "/products/gel-cleanser.jpg",
    skinTypes: ["oily", "combination"],
    concerns: ["acne", "large_pores"],
    keyIngredients: ["salicylic acid", "niacinamide"],
    contraindications: [],
    description: "Lightweight gel cleanser that clears pores without stripping skin.",
  },
  {
    id: "p2",
    name: "Ceramide Rich Cream",
    price: 32,
    imageUrl: "/products/ceramide-cream.jpg",
    skinTypes: ["dry", "sensitive", "normal"],
    concerns: ["dehydration", "redness_irritation"],
    keyIngredients: ["ceramides", "squalane"],
    contraindications: ["retinol-sensitive"],
    description: "Barrier-repair moisturizer for dry or reactive skin.",
  },
  {
    id: "p3",
    name: "Vitamin C Brightening Serum",
    price: 42,
    imageUrl: "/products/vitc-serum.jpg",
    skinTypes: ["normal", "combination", "dry"],
    concerns: ["hyperpigmentation", "dullness", "uneven_texture"],
    keyIngredients: ["15% vitamin C", "ferulic acid"],
    contraindications: ["pregnancy"],
    description: "Antioxidant serum that fades dark spots and evens tone over time.",
  },
  {
    id: "p4",
    name: "Retinol Renewal Night Serum",
    price: 38,
    imageUrl: "/products/retinol-serum.jpg",
    skinTypes: ["normal", "combination", "oily"],
    concerns: ["fine_lines_aging", "uneven_texture", "large_pores"],
    keyIngredients: ["encapsulated retinol"],
    contraindications: ["pregnancy", "retinol-sensitive"],
    description: "Gentle time-release retinol for smoother texture and fewer fine lines.",
  },
  {
    id: "p5",
    name: "Fragrance-Free Calming Moisturizer",
    price: 26,
    imageUrl: "/products/calming-moisturizer.jpg",
    skinTypes: ["sensitive", "dry"],
    concerns: ["redness_irritation", "dehydration"],
    keyIngredients: ["centella asiatica", "panthenol"],
    contraindications: [],
    description: "Fragrance-free formula that calms visible redness and reinforces the skin barrier.",
  },
  {
    id: "p6",
    name: "Bright Eyes Depuffing Cream",
    price: 24,
    imageUrl: "/products/eye-cream.jpg",
    skinTypes: ["normal", "dry", "combination", "oily", "sensitive"],
    concerns: ["dark_circles"],
    keyIngredients: ["caffeine", "peptides"],
    contraindications: [],
    description: "Lightweight eye cream targeting puffiness and dark circles.",
  },
];