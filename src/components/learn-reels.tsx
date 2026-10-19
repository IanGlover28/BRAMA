"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  Plus,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { thumbnail, videoId, type Reel, type ReelProduct } from "@/app/learn/data";
import { useCartStore } from "@/hooks/use-cart-store";

const YT_ORIGIN = "https://www.youtube.com";

function embedUrl(tutorial: Reel) {
  const params = new URLSearchParams({
    autoplay: "1",
    // Browsers only allow muted autoplay; the sound button unmutes via the iframe API.
    mute: "1",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "1",
    origin: window.location.origin,
  });
  return `${YT_ORIGIN}/embed/${videoId(tutorial.video)}?${params}`;
}

function sendPlayerCommand(iframe: HTMLIFrameElement | null, func: "mute" | "unMute") {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    YT_ORIGIN,
  );
}

async function shareTutorial(tutorial: Reel) {
  const url = `${window.location.origin}/learn?v=${tutorial.slug}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: tutorial.title,
        text: tutorial.summary,
        url,
      });
      return;
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  } catch {
    toast.error("Couldn't copy the link");
  }
}

/**
 * Full-screen vertical feed of Learn videos, one per screen.
 * Only the reel in view mounts its YouTube player; the rest show thumbnails.
 */
export default function LearnReels({
  reels: allReels,
  initialSlug,
}: {
  reels: Reel[];
  initialSlug?: string;
}) {
  const categories = Array.from(new Set(allReels.map((t) => t.category)));
  const [category, setCategory] = useState("");
  const reels = category ? allReels.filter((t) => t.category === category) : allReels;

  const [active, setActive] = useState(() =>
    Math.max(
      0,
      allReels.findIndex((t) => t.slug === initialSlug),
    ),
  );
  const [soundOn, setSoundOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  // The site navbar floats over the feed and is taller on phones.
  const [navBottom, setNavBottom] = useState(96);

  const feedRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // embedUrl reads window, so players only render after mount.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    const measure = () => setNavBottom(nav.getBoundingClientRect().bottom);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // Open on the shared reel.
  useEffect(() => {
    if (!initialSlug) return;
    const index = allReels.findIndex((t) => t.slug === initialSlug);
    slideRefs.current[index]?.scrollIntoView({
      behavior: "instant" as ScrollBehavior,
    });
  }, [allReels, initialSlug]);

  // The reel that fills most of the screen is the active one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: feedRef.current, threshold: 0.6 },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reels]);

  // Keep the address bar on the current reel so it can be copied and shared.
  const activeReel = reels[active];
  useEffect(() => {
    if (!activeReel) return;
    window.history.replaceState(null, "", `/learn?v=${activeReel.slug}`);
  }, [activeReel]);

  const scrollToReel = useCallback((index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToReel(Math.min(active + 1, reels.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToReel(Math.max(active - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, reels.length, scrollToReel]);

  const chooseCategory = (next: string) => {
    setCategory(next);
    setActive(0);
    feedRef.current?.scrollTo({ top: 0 });
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sendPlayerCommand(playerRef.current, next ? "unMute" : "mute");
  };

  // A new player starts muted; unmute it once it's ready if sound is on.
  const onPlayerLoad = () => {
    if (!soundOn) return;
    [300, 1200].forEach((ms) =>
      setTimeout(() => sendPlayerCommand(playerRef.current, "unMute"), ms),
    );
  };

  return (
    <div className="theme-fixed fixed inset-0 z-40 bg-black text-white">
      {/* Category pills, below the floating navbar */}
      <div
        className="absolute inset-x-0 z-20 px-4 pointer-events-none"
        style={{ top: navBottom + 12 }}
      >
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto whitespace-nowrap pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["", ...categories].map((cat) => (
            <button
              key={cat || "all"}
              onClick={() => chooseCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                category === cat
                  ? "bg-white text-black"
                  : "bg-black/40 text-white border border-white/25 hover:bg-black/60"
              }`}
            >
              {cat || "All"}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={feedRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((tutorial, index) => {
          const isActive = index === active;
          return (
            <section
              key={tutorial.slug}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              data-index={index}
              aria-label={tutorial.title}
              className="relative h-[100dvh] snap-start snap-always flex items-center justify-center overflow-hidden"
            >
              {/* Blurred thumbnail fills the space around the landscape video */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail(tutorial.video)}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-50"
              />

              <div
                className={
                  tutorial.vertical
                    ? "absolute left-1/2 -translate-x-1/2 bottom-0 max-w-full aspect-[9/16] bg-black shadow-2xl md:rounded-t-2xl overflow-hidden"
                    : "relative w-full max-w-3xl md:max-w-[min(48rem,calc((100dvh-22rem)*16/9))] aspect-video bg-black shadow-2xl md:rounded-2xl overflow-hidden"
                }
                // Shorts fill the height below the navbar and category pills.
                style={tutorial.vertical ? { top: navBottom + 56 } : undefined}
              >
                {isActive && mounted ? (
                  <iframe
                    ref={playerRef}
                    src={embedUrl(tutorial)}
                    title={tutorial.title}
                    onLoad={onPlayerLoad}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <button
                    onClick={() => scrollToReel(index)}
                    aria-label={`Play ${tutorial.title}`}
                    className="group w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnail(tutorial.video)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex items-center justify-center h-16 w-16 rounded-full bg-white/90 text-brand-600 shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={26} className="ml-1" />
                      </span>
                    </span>
                  </button>
                )}
              </div>

              {/* Caption */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4">
                <div className="max-w-3xl mx-auto pr-16 md:pr-0">
                  <span className="inline-flex bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {tutorial.category}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-extrabold leading-snug mb-1.5">
                    {tutorial.title}
                  </h2>
                  {tutorial.summary && (
                    <p className="text-sm text-white/80 leading-relaxed mb-3 line-clamp-1 sm:line-clamp-2">
                      {tutorial.summary}
                    </p>
                  )}
                  {tutorial.products && tutorial.products.length > 0 && (
                    <ShopStrip products={tutorial.products} />
                  )}
                  {tutorial.guide && (
                    <Link
                      href={`/learn/${tutorial.slug}`}
                      className="pointer-events-auto inline-flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-50 transition"
                    >
                      <BookOpen size={15} />
                      Read the guide
                    </Link>
                  )}
                </div>
              </div>

              {/* Action rail */}
              <div className="absolute right-3 md:right-6 bottom-36 md:bottom-1/2 md:translate-y-1/2 z-20 flex flex-col items-center gap-4">
                <RailButton label={soundOn ? "Mute" : "Sound on"} onClick={toggleSound}>
                  {soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
                </RailButton>
                <RailButton label="Share" onClick={() => shareTutorial(tutorial)}>
                  <Share2 size={22} />
                </RailButton>
                <div className="hidden md:flex flex-col gap-4">
                  <RailButton
                    label="Previous"
                    onClick={() => scrollToReel(index - 1)}
                    disabled={index === 0}
                  >
                    <ChevronUp size={22} />
                  </RailButton>
                  <RailButton
                    label="Next"
                    onClick={() => scrollToReel(index + 1)}
                    disabled={index === reels.length - 1}
                  >
                    <ChevronDown size={22} />
                  </RailButton>
                </div>
              </div>

              {/* Swipe hint on the first reel */}
              {index === 0 && reels.length > 1 && (
                <ChevronDown
                  size={28}
                  aria-hidden
                  className="md:hidden absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-white/60 animate-bounce"
                />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** "Shop this" row: the products a reel advertises, addable to the bag in place. */
function ShopStrip({ products }: { products: ReelProduct[] }) {
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <div className="pointer-events-auto mb-3">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70 mb-2">
        <ShoppingBag size={13} /> Shop this
      </p>
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 w-60 flex items-center gap-2.5 bg-white/95 text-black rounded-2xl p-2 pr-2.5 shadow-lg"
          >
            <Link
              href={`/products/${product.id}`}
              className="flex items-center gap-2.5 min-w-0 flex-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.png";
                }}
                className="h-11 w-11 shrink-0 rounded-xl object-cover bg-ink-100"
              />
              <span className="min-w-0">
                <span className="block text-xs font-semibold leading-tight line-clamp-2">
                  {product.name}
                </span>
                <span className="block text-sm font-extrabold text-brand-600">
                  ₵{product.price.toFixed(2)}
                </span>
              </span>
            </Link>
            <button
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  brand: product.brand,
                  category: product.category,
                });
                toast.success(`${product.name} added to your bag`, {
                  duration: 1800,
                });
              }}
              aria-label={`Add ${product.name} to bag`}
              className="shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition active:scale-95"
            >
              <Plus size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RailButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex flex-col items-center gap-1 text-white disabled:opacity-30"
    >
      <span className="flex items-center justify-center h-12 w-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition">
        {children}
      </span>
      <span className="text-[11px] font-semibold drop-shadow">{label}</span>
    </button>
  );
}
