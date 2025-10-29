"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { articles } from "./data";

export default function LearnPage() {
  const categories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <main className="bg-white text-gray-800">
      <section className="py-20 text-center bg-green-50">
        <h1 className="text-4xl font-bold text-green-800">Learn with HighHub</h1>
        <p className="mt-4 text-gray-600">
          Your trusted guide to cannabis education, how-tos, and insights.
        </p>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, idx) => (
          <motion.div
            key={idx}
            className="border p-6 rounded-xl shadow-sm hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-green-800 mb-3">
              {category}
            </h2>

            <ul className="space-y-2">
              {articles
                .filter(a => a.category === category)
                .map(article => (
                  <li key={article.slug}>
                    <Link
                      href={`/learn/${article.slug}`}
                      className="text-green-700 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
