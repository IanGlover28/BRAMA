"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, ShoppingBag } from "lucide-react";

const features = [
  {
    icon: <ShoppingBag className="w-10 h-10 text-pink-600" />,
    title: "Premium Quality",
    description:
      "All our Products and accessories are curated for your safety and satisfaction.",
  },
  {
    icon: <Truck className="w-10 h-10 text-pink-600" />,
    title: "Fast and Secure Delivery",
    description:
      "Get your order delivered discreetly and quickly to your doorstep.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-pink-600" />,
    title: "Secure Checkout",
    description: "Your privacy and payments are always protected.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 ">
          Why Choose .Brama?
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition"
            >
              {feature.icon}
              <h3 className="text-xl text-pink-400 font-semibold mt-4 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
