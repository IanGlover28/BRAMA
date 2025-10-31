"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="py-20 bg-gradient-to-r from-pink-600 to-pink-800 text-white text-center">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold mb-6"
      >
        Ready to Elevate Your look?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-lg mb-10 max-w-2xl mx-auto"
      >
        Discover the finest products and girly essentials made for the modern
        aesthetism.
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => router.push("/products")}
        className="bg-white text-pink-700 font-semibold px-10 py-4 rounded-full hover:bg-gray-100 transition"
      >
        Explore Products
      </motion.button>
    </section>
  );
}
