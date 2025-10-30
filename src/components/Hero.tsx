"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-6">
      
      {/* 1. Background Image Container (Absolute) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        // Replace '/path-to-your-image.jpg' with the actual path to your image
        style={{ backgroundImage: "url('/hero-bg.jpg')" }} 
      >
        {/* 2. Pink Opacity Overlay (Absolute, covers the image) */}
        {/* bg-pink-500/50 gives a pink color with 50% opacity */}
        <div className="absolute inset-0"></div>
      </div>

      {/* 3. Content (Relative, to ensure it sits above the absolute image/overlay) */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-white" // Changed text color to white for contrast
        >.
          <span className="text-pink-400 font-serif">BRAMA</span> COSMETICS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg text-white mt-5 mb-8 max-w-2xl" // Changed text color for contrast
        >
          Discover the essence of natural beauty with BRAMA Cosmetics
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/products")}
          className="bg-pink-400 text-white px-8 py-4 rounded-full font-semibold hover:bg-pink-700 transition" // Changed button colors for contrast
        >
          Shop Now
        </motion.button>
      </div>
    </section>
  );
}