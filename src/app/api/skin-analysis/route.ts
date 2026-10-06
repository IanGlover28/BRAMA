// app/api/skin-analysis/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { extractSkinProfile, composeReply } from "@/lib/anthropic-client";
import { matchProducts } from "@/lib/product-matcher";
import { sampleProducts } from "@/data/sample-products";
import type { ChatMessage, SkinAnalysisResponse } from "@/lib/types";

// Simple in-memory per-user rate limit. Fine for a single instance;
// move to Redis/upstash if you scale horizontally.
const RATE_LIMIT = 10;
const WINDOW_MS = 5 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

// Every Anthropic image is capped at 5MB of base64 payload.
const MAX_IMAGE_CHARS = 5 * 1024 * 1024;
const MAX_MESSAGES = 20;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please log in to use the skin advisor.", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const rateKey = session.user.email ?? "anonymous";
    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { error: "You're sending messages too quickly. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as { messages?: unknown };

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }
    if (body.messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: "Conversation too long - please start a new chat." },
        { status: 400 }
      );
    }

    // Validate each message before it reaches the model.
    const messages: ChatMessage[] = [];
    for (const m of body.messages) {
      if (!m || typeof m !== "object") {
        return NextResponse.json({ error: "Invalid messages payload" }, { status: 400 });
      }
      const msg = m as Record<string, unknown>;
      if ((msg.role !== "user" && msg.role !== "assistant") || typeof msg.content !== "string") {
        return NextResponse.json({ error: "Invalid messages payload" }, { status: 400 });
      }
      if (typeof msg.content === "string" && msg.content.length > 4000) {
        return NextResponse.json({ error: "Message too long" }, { status: 400 });
      }
      if (
        msg.role === "user" &&
        typeof msg.imageBase64 === "string" &&
        msg.imageBase64.length > MAX_IMAGE_CHARS
      ) {
        return NextResponse.json(
          { error: "Image too large - please upload one under 5MB." },
          { status: 413 }
        );
      }
      messages.push(m as ChatMessage);
    }

    // 1. Extract structured skin profile (vision + text -> JSON)
    const profile = await extractSkinProfile({ messages });

    // 2. If Claude needs more info, skip matching and just relay the question.
    if (profile.needsMoreInfo) {
      const reply = await composeReply(profile, [], messages);
      const response: SkinAnalysisResponse = {
        profile,
        recommendedProducts: [],
        assistantReply: reply,
      };
      return NextResponse.json(response);
    }

    // 3. Match against catalog. TODO: swap sampleProducts for a real DB query
    //    once products carry skin attributes (skinTypes/concerns columns).
    const recommendedProducts = matchProducts(profile, sampleProducts);

    // 4. Compose the natural-language reply
    const assistantReply = await composeReply(profile, recommendedProducts, messages);

    const response: SkinAnalysisResponse = {
      profile,
      recommendedProducts,
      assistantReply,
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong analyzing your skin." },
      { status: 500 }
    );
  }
}
