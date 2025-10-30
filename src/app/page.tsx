"use client";

import Navbar from "@/components/navbar";
import LocationPicker from "@/components/LocationPicker";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Features from "@/components/Features";
import CTA from "@/components/CTA";


export default function ExorticaLanding() {


  

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <LocationPicker />
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <Features />
      <CTA />
    </div>
  );
}
