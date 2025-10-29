"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-b from-green-50 to-white text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-gray-900 mt-10"
      >
        Discover <span className="text-green-600">Exortica</span> — Where Taste
        Meets Relaxation
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-lg text-gray-600 mt-5 mb-8 max-w-2xl"
      >
        Your one-stop shop for premium edibles, top-quality smoking tools, and
        exotic relaxation products.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/products")}
        className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition"
      >
        Shop Now
      </motion.button>
    </section>
  );
}
