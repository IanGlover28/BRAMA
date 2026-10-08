"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import CopyLinkButton from "@/components/copy-link-button";
import { tutorials } from "./data";

function videoId(url: string) {
  return url.split("/").pop() ?? "";
}

function thumbnail(url: string) {
  return `https://img.youtube.com/vi/${videoId(url)}/hqdefault.jpg`;
}

export default function LearnPage() {
  const categories = Array.from(new Set(tutorials.map((t) => t.category)));
  const [active, setActive] = useState("");

  const filtered = active ? tutorials.filter((t) => t.category === active) : tutorials;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-700 to-pink-900 text-white pt-[200px] md:pt-[150px] pb-28">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-16 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
            <Sparkles size={15} className="text-pink-200" />
            Beauty education, made simple
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Learn with <span className="text-pink-200 lowercase italic">BRAMA</span>
          </h1>
          <p className="text-lg md:text-xl text-pink-50 max-w-2xl mx-auto leading-relaxed">
            Skincare routines, everyday makeup and product know-how — short video lessons to help
            you glow with confidence.
          </p>
        </div>
      </section>

      {/* Filter pills */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActive("")}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              active === ""
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/25 font-semibold"
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
            }`}
          >
            All Tutorials
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(active === cat ? "" : cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                active === cat
                  ? "bg-pink-600 text-white shadow-md shadow-pink-600/25 font-semibold"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No tutorials in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((tutorial) => (
              <div
                key={tutorial.slug}
                className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <Link
                  href={`/learn/${tutorial.slug}`}
                  className="relative block aspect-video bg-gradient-to-br from-pink-100 to-pink-200 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail(tutorial.video)}
                    alt={tutorial.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center justify-center h-14 w-14 rounded-full bg-white/90 text-pink-600 shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={22} className="ml-1" />
                    </span>
                  </span>
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {tutorial.category}
                  </span>
                </Link>

                <CopyLinkButton
                  path={`/learn/${tutorial.slug}`}
                  label="Share"
                  className="absolute top-3 right-3 z-10"
                />

                <div className="p-6">
                  <Link href={`/learn/${tutorial.slug}`}>
                    <h2 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-pink-700 transition-colors">
                      {tutorial.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-500 leading-relaxed">{tutorial.summary}</p>
                  <Link
                    href={`/learn/${tutorial.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-700"
                  >
                    Watch tutorial
                    <Play size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}