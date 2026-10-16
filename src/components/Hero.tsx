"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="theme-fixed relative flex flex-col items-center justify-center min-h-[90vh] text-center px-6">
      
      {/* 1. Background Image Container (Absolute) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        // Replace '/path-to-your-image.jpg' with the actual path to your image
        style={{ backgroundImage: "url('/hero-bg.jpg')" }} 
      >
        {/* 2. Pink Opacity Overlay (Absolute, covers the image) */}
        {/* bg-brand-500/50 gives a pink color with 50% opacity */}
        <div className="absolute inset-0"></div>
      </div>

      {/* 3. Content (Relative, to ensure it sits above the absolute image/overlay) */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="font-serif text-6xl md:text-8xl font-medium text-brand-800 leading-none">
            BRAMA
          </span>
          <span className="mt-3 font-sans text-sm md:text-base font-medium uppercase tracking-brand text-brand-700">
            Cosmetics
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg text-ink-800 mt-5 mb-8 max-w-2xl"
        >
          Discover the essence <span className="font-serif italic text-brand-700">of natural beauty </span> with BRAMA Cosmetics
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/products")}
          className="bg-brand-600 text-white px-8 py-4 rounded-full font-semibold uppercase tracking-widest text-sm hover:bg-brand-700 transition"
        >
          Shop Now
        </motion.button>
      </div>
    </section>
  );
}