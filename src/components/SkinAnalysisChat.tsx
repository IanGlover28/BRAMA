"use client";

// components/SkinAnalysisChat.tsx
// Floating skin-advisor widget: a pink gradient bubble button that expands
// into the chat panel. Drop <SkinAnalysisChat /> anywhere in the layout —
// it's self-positioned (fixed bottom-right) so it floats over the page.

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage, Product } from "@/lib/types";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm your BRAMA skin advisor ✨ Upload a photo or tell me about your skin, and I'll match you with products.",
};

export default function SkinAnalysisChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<{ base64: string; mediaType: string } | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function handleToggle() {
    setIsOpen((prev) => !prev);
    setHasOpenedOnce(true);
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so selecting the same file again still fires onChange.
    e.target.value = "";

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAttachmentError("Please choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setAttachmentError("Image is too large - please pick one under 5MB.");
      return;
    }

    setAttachmentError(null);
    const base64 = await fileToBase64(file);
    setPendingImage({ base64, mediaType: file.type });
  }

  async function sendMessage() {
    if (!input.trim() && !pendingImage) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input || "Here's a photo of my skin.",
      imageBase64: pendingImage?.base64,
      imageMediaType: pendingImage?.mediaType as ChatMessage["imageMediaType"],
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setPendingImage(null);
    setAttachmentError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/skin-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        const reply =
          data?.code === "AUTH_REQUIRED"
            ? "You'll need to be logged in to use the skin advisor. Please sign in and try again!"
            : data?.error
              ? `Sorry - ${data.error}`
              : "Sorry, something went wrong on my end. Please try again in a moment.";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.assistantReply || "Sorry, I couldn't come up with a reply. Please try again." },
      ]);
      setProducts(data.recommendedProducts ?? []);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className="mb-4 flex h-[540px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 px-5 py-4">
              <div>
                <p className="text-sm font-semibold tracking-wide text-white">BRAMA Skin Advisor</p>
                <p className="text-xs text-pink-100">Personalized picks, just for your skin</p>
              </div>
              <button
                onClick={handleToggle}
                aria-label="Close skin advisor"
                className="rounded-full bg-white/20 p-1.5 text-white transition hover:bg-white/30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-pink-50/40 px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-pink-400 to-pink-500 px-3.5 py-2.5 text-white"
                      : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-neutral-700 shadow-sm"
                  }
                >
                  {m.imageBase64 && (
                    <img
                      src={`data:${m.imageMediaType};base64,${m.imageBase64}`}
                      alt="uploaded skin photo"
                      className="mb-2 max-h-32 rounded-lg"
                    />
                  )}
                  <p className="text-sm leading-relaxed">{m.content}</p>
                </div>
              ))}

              {loading && (
                <div className="mr-auto flex max-w-[60%] items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-pink-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}

              {products.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {products.map((p) => (
                    <div key={p.id} className="rounded-xl border border-pink-100 bg-white p-2.5 shadow-sm">
                      <p className="truncate text-xs font-medium text-neutral-800">{p.name}</p>
                      <p className="text-xs text-pink-500">₵{p.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-pink-100 bg-white px-3 py-3">
              {attachmentError && (
                <p className="mb-2 px-1 text-xs text-red-500">{attachmentError}</p>
              )}
              {pendingImage && (
                <p className="mb-2 px-1 text-xs text-pink-500">📎 Photo attached — ready to send</p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach a photo"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-lg transition hover:bg-pink-100"
                >
                  📷
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about your skin..."
                  className="flex-1 rounded-full border border-pink-100 bg-pink-50/60 px-4 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-pink-300"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-white transition disabled:opacity-50"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble button */}
      <div className="mt-3 flex items-end justify-end gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="teaser"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={handleToggle}
              className="max-w-[210px] rounded-2xl rounded-br-sm border border-pink-100 bg-white/95 px-4 py-2.5 text-left shadow-lg shadow-pink-200/40 backdrop-blur-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-pink-500">BRAMA AI</p>
              <p className="text-sm font-medium leading-snug text-neutral-800">
                Hi babes, talk to me about your skin, hair &amp; more
              </p>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleToggle}
          aria-label={isOpen ? "Close skin advisor chat" : "Open skin advisor chat"}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 text-white shadow-lg shadow-pink-300/50"
        >
          {!hasOpenedOnce && (
            <motion.span
              className="absolute inset-0 rounded-full bg-pink-400"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </motion.svg>
            ) : (
              <motion.span
                key="sparkle"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-2xl"
              >
                ✨
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}