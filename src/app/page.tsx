"use client";

import { useState, useEffect } from "react";
import AgeGate from "@/components/AgeGate";
import Navbar from "@/components/navbar";
import LocationPicker from "@/components/LocationPicker";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Features from "@/components/Features";
import CTA from "@/components/CTA";


export default function ExorticaLanding() {
 const [ageVerified, setAgeVerified] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const verified = localStorage.getItem("exortica_age_verified");
    if (verified === "true") {
      setAgeVerified(true);
    }
    setLoading(false);
  }, []);

  const handleVerified = () => {
    localStorage.setItem("exortica_age_verified", "true");
    setAgeVerified(true);
  };

  if (loading) return null; // Avoids flicker during initial check

  if (!ageVerified) return <AgeGate onVerified={handleVerified} />;

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
