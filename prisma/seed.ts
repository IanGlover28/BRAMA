// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing products (optional)
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      // FLOWER CATEGORY (7 products)
      {
        name: "Blue Dream Premium",
        description: "Classic sativa-dominant hybrid with sweet berry aroma",
        price: 45.99,
        image: "/products/blue-dream.jpg",
        category: "flower",
        stock: 12,
      },
      {
        name: "OG Kush",
        description: "Legendary indica strain with earthy pine notes",
        price: 52.99,
        image: "/products/og-kush.jpg",
        category: "flower",
        stock: 8,
      },
      {
        name: "Sour Diesel",
        description: "Energizing sativa with diesel and citrus flavors",
        price: 48.99,
        image: "/products/sour-diesel.jpg",
        category: "flower",
        stock: 15,
      },
      {
        name: "Purple Haze",
        description: "Iconic strain with sweet berry and earthy tones",
        price: 55.99,
        image: "/products/purple-haze.jpg",
        category: "flower",
        stock: 6,
      },
      {
        name: "Girl Scout Cookies",
        description: "Sweet and earthy hybrid with dessert-like flavor",
        price: 58.99,
        image: "/products/gsc.jpg",
        category: "flower",
        stock: 10,
      },
      {
        name: "Granddaddy Purple",
        description: "Indica strain with grape and berry sweetness",
        price: 49.99,
        image: "/products/gdp.jpg",
        category: "flower",
        stock: 14,
      },
      {
        name: "Jack Herer",
        description: "Balanced hybrid with spicy pine aroma",
        price: 51.99,
        image: "/products/jack-herer.jpg",
        category: "flower",
        stock: 11,
      },

      // EDIBLES CATEGORY (7 products)
      {
        name: "Dark Chocolate Bar 100mg",
        description: "Premium Belgian chocolate infused with pure extract",
        price: 24.99,
        image: "/products/chocolate-bar.jpg",
        category: "edibles",
        stock: 25,
      },
      {
        name: "Gummy Bears Assorted 200mg",
        description: "Fruit-flavored gummies with precise dosing",
        price: 29.99,
        image: "/products/gummies.jpg",
        category: "edibles",
        stock: 30,
      },
      {
        name: "Fudge Brownies 50mg",
        description: "Decadent chocolate brownies, individually wrapped",
        price: 19.99,
        image: "/products/brownies.jpg",
        category: "edibles",
        stock: 18,
      },
      {
        name: "Honey Toffee 150mg",
        description: "Smooth toffee with natural honey infusion",
        price: 22.99,
        image: "/products/toffee.jpg",
        category: "edibles",
        stock: 22,
      },
      {
        name: "Chocolate Chip Cookies 100mg",
        description: "Soft-baked cookies with real chocolate chips",
        price: 26.99,
        image: "/products/cookies.jpg",
        category: "edibles",
        stock: 20,
      },
      {
        name: "Mango Gummies 250mg",
        description: "Tropical mango flavor with vitamin C",
        price: 32.99,
        image: "/products/mango-gummies.jpg",
        category: "edibles",
        stock: 28,
      },
      {
        name: "Caramel Bites 75mg",
        description: "Rich caramel candy with sea salt",
        price: 18.99,
        image: "/products/caramel.jpg",
        category: "edibles",
        stock: 15,
      },

      // VAPES CATEGORY (7 products)
      {
        name: "Hybrid Disposable Vape",
        description: "Pre-filled disposable with hybrid strain blend",
        price: 35.99,
        image: "/products/disposable-vape.jpg",
        category: "vapes",
        stock: 40,
      },
      {
        name: "510 Thread Cartridge - Indica",
        description: "Premium indica oil in universal 510 cartridge",
        price: 42.99,
        image: "/products/510-cart.jpg",
        category: "vapes",
        stock: 35,
      },
      {
        name: "Shisha Flavored Pod",
        description: "Exotic shisha flavors in convenient pod system",
        price: 28.99,
        image: "/products/shisha-pod.jpg",
        category: "vapes",
        stock: 50,
      },
      {
        name: "Laughing Gas Cartridge",
        description: "Uplifting sativa blend for daytime use",
        price: 39.99,
        image: "/products/laughing-gas.jpg",
        category: "vapes",
        stock: 28,
      },
      {
        name: "Closed Loop Pod - Hybrid",
        description: "Proprietary pod system with pure extract",
        price: 45.99,
        image: "/products/closed-pod.jpg",
        category: "vapes",
        stock: 32,
      },
      {
        name: "Live Resin Cartridge",
        description: "Full-spectrum live resin in glass cartridge",
        price: 52.99,
        image: "/products/live-resin.jpg",
        category: "vapes",
        stock: 24,
      },
      {
        name: "CBD Disposable Pen",
        description: "Pure CBD oil with natural terpenes",
        price: 29.99,
        image: "/products/cbd-pen.jpg",
        category: "vapes",
        stock: 45,
      },

      // CONCENTRATES CATEGORY (7 products)
      {
        name: "Premium Shatter 1g",
        description: "Glass-like concentrate with 85% potency",
        price: 38.99,
        image: "/products/shatter.jpg",
        category: "concentrates",
        stock: 16,
      },
      {
        name: "Live Rosin 1g",
        description: "Solventless extraction with full terpene profile",
        price: 65.99,
        image: "/products/rosin.jpg",
        category: "concentrates",
        stock: 8,
      },
      {
        name: "Bubble Hash 2g",
        description: "Ice water extracted hash with high purity",
        price: 55.99,
        image: "/products/hash.jpg",
        category: "concentrates",
        stock: 12,
      },
      {
        name: "Crumble Wax 1g",
        description: "Honeycomb textured wax for easy handling",
        price: 42.99,
        image: "/products/crumble.jpg",
        category: "concentrates",
        stock: 14,
      },
      {
        name: "Diamond Sauce 1g",
        description: "THCA crystals in high-terpene sauce",
        price: 72.99,
        image: "/products/diamonds.jpg",
        category: "concentrates",
        stock: 6,
      },
      {
        name: "Budder 1g",
        description: "Creamy concentrate with rich flavor",
        price: 45.99,
        image: "/products/budder.jpg",
        category: "concentrates",
        stock: 10,
      },
      {
        name: "Distillate Syringe 1g",
        description: "Pure THC distillate for versatile use",
        price: 48.99,
        image: "/products/distillate.jpg",
        category: "concentrates",
        stock: 18,
      },

      // BEVERAGES CATEGORY (7 products)
      {
        name: "Bissap Hibiscus Drink 100mg",
        description: "Traditional West African hibiscus tea infusion",
        price: 12.99,
        image: "/products/bissap.jpg",
        category: "beverages",
        stock: 35,
      },
      {
        name: "Tropical Cocktail Mix 150mg",
        description: "Pre-mixed cocktail with exotic fruits",
        price: 18.99,
        image: "/products/cocktail.jpg",
        category: "beverages",
        stock: 28,
      },
      {
        name: "Amen Energy Drink 200mg",
        description: "Energizing blend with natural caffeine",
        price: 15.99,
        image: "/products/amen.jpg",
        category: "beverages",
        stock: 42,
      },
      {
        name: "Vim Wellness Shot 50mg",
        description: "Concentrated wellness shot with vitamins",
        price: 9.99,
        image: "/products/vim.jpg",
        category: "beverages",
        stock: 50,
      },
      {
        name: "Pineapple Juice 100mg",
        description: "Fresh pineapple juice with tropical flavor",
        price: 13.99,
        image: "/products/pineapple.jpg",
        category: "beverages",
        stock: 38,
      },
      {
        name: "Vanilla MilkShake 125mg",
        description: "Creamy vanilla shake with premium ingredients",
        price: 16.99,
        image: "/products/milkshake.jpg",
        category: "beverages",
        stock: 30,
      },
      {
        name: "Jojo Berry Blend 75mg",
        description: "Mixed berry smoothie with antioxidants",
        price: 14.99,
        image: "/products/jojo.jpg",
        category: "beverages",
        stock: 32,
      },

      // ACCESSORIES CATEGORY (7 products)
      {
        name: "Premium Dab Pen",
        description: "Temperature-controlled concentrate vaporizer",
        price: 89.99,
        image: "/products/dab-pen.jpg",
        category: "accessories",
        stock: 15,
      },
      {
        name: "Glass Bong 12 inch",
        description: "Borosilicate glass water pipe with ice catcher",
        price: 125.99,
        image: "/products/bong.jpg",
        category: "accessories",
        stock: 8,
      },
      {
        name: "Titanium Grinder",
        description: "4-piece grinder with kief catcher",
        price: 34.99,
        image: "/products/grinder.jpg",
        category: "accessories",
        stock: 45,
      },
      {
        name: "Rolling Papers Pack",
        description: "Premium hemp papers with filters - 50 pack",
        price: 8.99,
        image: "/products/papers.jpg",
        category: "accessories",
        stock: 100,
      },
      {
        name: "Portable Vaporizer",
        description: "Dry herb vaporizer with digital display",
        price: 159.99,
        image: "/products/vaporizer.jpg",
        category: "accessories",
        stock: 12,
      },
      {
        name: "Silicone Dab Mat",
        description: "Non-stick mat for concentrate handling",
        price: 19.99,
        image: "/products/dab-mat.jpg",
        category: "accessories",
        stock: 35,
      },
      {
        name: "Storage Container Set",
        description: "Airtight UV-protected jars - 3 pack",
        price: 24.99,
        image: "/products/containers.jpg",
        category: "accessories",
        stock: 28,
      },
    ],
  });

  console.log("✅ Database seeded successfully with 49 products across 6 categories!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });