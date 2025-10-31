"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import LocationPicker from "@/components/LocationPicker";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

export default function BramaLanding() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = sessionStorage.getItem("brama_intro_seen");
    
    if (hasSeenIntro) {
      setShowIntro(false);
    } else {
      // Show intro for 3 seconds
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("brama_intro_seen", "true");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 0.2 
              }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image 
                  src="/brama-logo.png" 
                  alt="BRAMA" 
                  width={300} 
                  height={100}
                  priority
                  className="drop-shadow-2xl"
                />
              </motion.div>
              
              {/* Sparkle effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 text-4xl"
              >
                ✨
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -bottom-4 -left-4 text-4xl"
              >
                💄
              </motion.div>
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-20 text-white text-lg font-light tracking-widest"
            >
              Loading your beauty experience...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar />
            <LocationPicker />
            <Hero />
            <CategorySection />
            <FeaturedProducts />
            <Features />
            <CTA />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}