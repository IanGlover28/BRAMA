// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing products (optional)
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      // 💋 LIP CARE CATEGORY
      {
        name: "Nivea Lip Balm Original Care",
        description: "Moisturizing lip balm that protects and softens lips.",
        price: 25.0,
        image: "/products/nivea-lip-balm.jpg",
        category: "lipcare",
        stock: 60,
      },
      {
        name: "Vaseline Lip Therapy Cocoa Butter",
        description: "Nourishing lip balm with cocoa butter for smooth lips.",
        price: 28.0,
        image: "/products/vaseline-lip-therapy.jpg",
        category: "lipcare",
        stock: 55,
      },
      {
        name: "Maybelline Baby Lips Moisturizing Lip Balm",
        description: "Hydrating lip balm with a light tint for everyday use.",
        price: 35.0,
        image: "/products/maybelline-baby-lips.jpg",
        category: "lipcare",
        stock: 45,
      },
      {
        name: "Burt’s Bees Beeswax Lip Balm",
        description: "Natural lip balm with beeswax and peppermint oil.",
        price: 40.0,
        image: "/products/burts-bees.jpg",
        category: "lipcare",
        stock: 30,
      },
      {
        name: "The Body Shop Lip Butter – Shea",
        description: "Rich lip butter that deeply nourishes dry lips.",
        price: 42.0,
        image: "/products/bodyshop-lip-butter.jpg",
        category: "lipcare",
        stock: 25,
      },
      {
        name: "Carmex Classic Lip Balm Tube",
        description: "Medicated lip balm that relieves and protects dry lips.",
        price: 32.0,
        image: "/products/carmex-lip-balm.jpg",
        category: "lipcare",
        stock: 40,
      },
      {
        name: "EOS Lip Balm – Strawberry Sorbet",
        description: "Organic lip balm with natural oils and shea butter.",
        price: 38.0,
        image: "/products/eos-lip-balm.jpg",
        category: "lipcare",
        stock: 35,
      },

      // 🌿 SKINCARE CATEGORY
      {
        name: "Nivea Perfect & Radiant Even Tone Lotion",
        description: "Deeply nourishing lotion for radiant and even-toned skin.",
        price: 45.0,
        image: "/products/nivea-even-tone.jpg",
        category: "skincare",
        stock: 40,
      },
      {
        name: "Vaseline Cocoa Glow Lotion",
        description: "Infused with cocoa butter to leave skin soft and glowing.",
        price: 38.0,
        image: "/products/vaseline-cocoa.jpg",
        category: "skincare",
        stock: 50,
      },
      {
        name: "Cerave Hydrating Facial Cleanser",
        description: "Gentle cleanser with ceramides and hyaluronic acid.",
        price: 82.0,
        image: "/products/cerave-cleanser.jpg",
        category: "skincare",
        stock: 30,
      },
      {
        name: "The Ordinary Niacinamide 10% + Zinc 1%",
        description: "Reduces blemishes, controls oil, and improves skin texture.",
        price: 70.0,
        image: "/products/ordinary-niacinamide.jpg",
        category: "skincare",
        stock: 20,
      },
      {
        name: "Dr. Rashel Vitamin C Face Serum",
        description: "Brightening serum for glowing and smooth skin.",
        price: 55.0,
        image: "/products/dr-rashel-vitamin-c.jpg",
        category: "skincare",
        stock: 35,
      },
      {
        name: "Nivea Perfect & Radiant Face Wash",
        description: "Gently cleanses for brighter, healthy-looking skin.",
        price: 48.0,
        image: "/products/nivea-face-wash.jpg",
        category: "skincare",
        stock: 25,
      },
      {
        name: "Beauty Formulas Charcoal Clay Mask",
        description: "Purifies and detoxifies the skin for a clearer complexion.",
        price: 35.0,
        image: "/products/charcoal-mask.jpg",
        category: "skincare",
        stock: 28,
      },

      // 💄 MAKEUP CATEGORY
      {
        name: "Maybelline Fit Me Foundation (Matte + Poreless)",
        description: "Lightweight foundation for smooth, natural matte finish.",
        price: 90.0,
        image: "/products/maybelline-fit-me.jpg",
        category: "makeup",
        stock: 32,
      },
      {
        name: "Fenty Beauty Gloss Bomb Universal Lip Luminizer",
        description: "High-shine, conditioning lip gloss by Rihanna.",
        price: 160.0,
        image: "/products/fenty-gloss-bomb.jpg",
        category: "makeup",
        stock: 15,
      },
      {
        name: "L.A. Girl Pro Conceal HD",
        description: "Creamy concealer for perfect coverage and highlighting.",
        price: 50.0,
        image: "/products/la-girl-conceal.jpg",
        category: "makeup",
        stock: 40,
      },
      {
        name: "Zaron Eyebrow Definer Kit",
        description: "Complete brow kit with powder and wax for shaping.",
        price: 65.0,
        image: "/products/zaron-brow-kit.jpg",
        category: "makeup",
        stock: 18,
      },
      {
        name: "Maybelline SuperStay Matte Ink Lipstick",
        description: "Long-lasting, transfer-proof matte lipstick.",
        price: 85.0,
        image: "/products/maybelline-lipstick.jpg",
        category: "makeup",
        stock: 20,
      },
      {
        name: "Milani Baked Blush - Luminoso",
        description: "Radiant blush for a warm, luminous glow.",
        price: 75.0,
        image: "/products/milani-blush.jpg",
        category: "makeup",
        stock: 22,
      },
      {
        name: "Huda Beauty Nude Eyeshadow Palette",
        description: "Luxurious palette with rich, blendable shades.",
        price: 250.0,
        image: "/products/huda-nude-palette.jpg",
        category: "makeup",
        stock: 10,
      },

      // 💆🏾‍♀️ HAIRCARE CATEGORY
      {
        name: "Shea Moisture Coconut & Hibiscus Curl Enhancing Smoothie",
        description: "Moisturizes and defines natural curls with shea butter.",
        price: 95.0,
        image: "/products/shea-moisture-curl-smoothie.jpg",
        category: "haircare",
        stock: 20,
      },
      {
        name: "Dark and Lovely Leave-In Conditioner",
        description: "Nourishing leave-in formula for soft, manageable hair.",
        price: 45.0,
        image: "/products/dark-lovely-conditioner.jpg",
        category: "haircare",
        stock: 35,
      },
      {
        name: "Eco Styler Olive Oil Gel",
        description: "Strong hold gel for sleek and defined hairstyles.",
        price: 40.0,
        image: "/products/eco-styler.jpg",
        category: "haircare",
        stock: 40,
      },
      {
        name: "ORS Olive Oil Hair Relaxer",
        description: "Strengthens and straightens with olive oil nourishment.",
        price: 55.0,
        image: "/products/ors-relaxer.jpg",
        category: "haircare",
        stock: 30,
      },
      {
        name: "Mielle Rosemary Mint Scalp & Hair Oil",
        description: "Stimulates growth and strengthens hair strands.",
        price: 85.0,
        image: "/products/mielle-rosemary.jpg",
        category: "haircare",
        stock: 15,
      },
      {
        name: "Cantu Shea Butter Leave-In Repair Cream",
        description: "Repairs breakage and deeply conditions dry hair.",
        price: 70.0,
        image: "/products/cantu-leave-in.jpg",
        category: "haircare",
        stock: 25,
      },
      {
        name: "Tresemme Moisture Rich Shampoo",
        description: "Hydrating shampoo for dry, damaged hair.",
        price: 60.0,
        image: "/products/tresemme-shampoo.jpg",
        category: "haircare",
        stock: 20,
      },

      // 🌸 FRAGRANCES CATEGORY
      {
        name: "Yves Saint Laurent Black Opium Eau de Parfum",
        description: "Warm, sensual scent with vanilla and coffee notes.",
        price: 550.0,
        image: "/products/black-opium.jpg",
        category: "fragrances",
        stock: 8,
      },
      {
        name: "Zara Femme Eau de Toilette",
        description: "Affordable fragrance with soft vanilla and floral tones.",
        price: 120.0,
        image: "/products/zara-femme.jpg",
        category: "fragrances",
        stock: 25,
      },
      {
        name: "Carolina Herrera Good Girl Perfume",
        description: "Iconic stiletto-shaped bottle with seductive aroma.",
        price: 480.0,
        image: "/products/good-girl.jpg",
        category: "fragrances",
        stock: 10,
      },
      {
        name: "Body Fantasies Vanilla Fantasy Body Spray",
        description: "Light, everyday body spray with a sweet vanilla scent.",
        price: 55.0,
        image: "/products/body-fantasies.jpg",
        category: "fragrances",
        stock: 40,
      },
      {
        name: "Bath & Body Works Japanese Cherry Blossom Mist",
        description: "Classic floral fragrance loved by many Ghanaian women.",
        price: 110.0,
        image: "/products/cherry-blossom.jpg",
        category: "fragrances",
        stock: 22,
      },
      {
        name: "Dior Sauvage (for women edition)",
        description: "Elegant and bold fragrance with amber and citrus notes.",
        price: 620.0,
        image: "/products/dior-sauvage.jpg",
        category: "fragrances",
        stock: 5,
      },
      {
        name: "Victoria’s Secret Pure Seduction Mist",
        description: "Flirty and sweet fragrance for everyday wear.",
        price: 95.0,
        image: "/products/pure-seduction.jpg",
        category: "fragrances",
        stock: 28,
      },

      // 🧴 BODY CARE CATEGORY
      {
        name: "Dove Nourishing Body Wash",
        description: "Deeply moisturizing body wash with a smooth finish.",
        price: 55.0,
        image: "/products/dove-body-wash.jpg",
        category: "bodycare",
        stock: 35,
      },
      {
        name: "Palmer’s Cocoa Butter Lotion",
        description: "Smooths marks and tones skin with rich cocoa butter.",
        price: 60.0,
        image: "/products/palmers-lotion.jpg",
        category: "bodycare",
        stock: 25,
      },
      {
        name: "Nivea Deodorant Roll-On",
        description: "Long-lasting protection with a fresh floral scent.",
        price: 35.0,
        image: "/products/nivea-deodorant.jpg",
        category: "bodycare",
        stock: 50,
      },
      {
        name: "Dr. Teal’s Epsom Salt Soaking Solution",
        description: "Relieves stress and softens skin with essential oils.",
        price: 85.0,
        image: "/products/dr-teals.jpg",
        category: "bodycare",
        stock: 15,
      },
      {
        name: "Shea Butter Body Cream",
        description: "Rich body butter for smooth and glowing skin.",
        price: 40.0,
        image: "/products/shea-body-butter.jpg",
        category: "bodycare",
        stock: 28,
      },
      {
        name: "Neutrogena Body Oil Light Sesame Formula",
        description: "Lightweight, fast-absorbing body oil.",
        price: 95.0,
        image: "/products/neutrogena-body-oil.jpg",
        category: "bodycare",
        stock: 18,
      },
      {
        name: "E45 Dermatological Cream",
        description: "Soothes dry, sensitive, and itchy skin.",
        price: 70.0,
        image: "/products/e45-cream.jpg",
        category: "bodycare",
        stock: 22,
      },
    ],
  });

  console.log("✅ Database seeded successfully with Brama's top cosmetics in Ghana!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
