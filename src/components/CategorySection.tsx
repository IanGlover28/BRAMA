"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "LipCare",
    slug: "lipcare",
    image: "/categories/lipcare.jpg",
    description: "Discover our premium selection of lip care products.",
  },
  {
    title: "Skincare & Wellness",
    slug: "skincare",
    image: "/categories/skin.jpg",
    description: "Explore our high-end skincare and wellness products.",
  },
  {
    title: "Makeup & Accessories",
    slug: "makeup",
    image: "/categories/makeup.jpg",
    description: "Everything you need to elevate your makeup game.",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-pink-400">
       .BRAMA
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {categories.map((cat, index) => (
<Link
            key={cat.title}
            href={`/products?category=${cat.slug}`}
            className="block bg-gray-50 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                width={400}
                height={300}
                className="w-full h-56 object-contain"
              />
              <div className="p-6">
                <h3 className="text-2xl text-pink-400 font-serif font-bold mb-2">{cat.title}</h3>
                <p className="text-gray-600">{cat.description}</p>
              </div>
            </motion.div>
          </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
