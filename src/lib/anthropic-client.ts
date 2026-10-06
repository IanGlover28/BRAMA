// lib/anthropic-client.ts
//
// Wraps the Anthropic API for two calls:
//  1. extractSkinProfile  - vision + text in, structured SkinProfile out (forced via tool use)
//  2. composeReply        - takes the profile + matched products, writes the natural-language reply
//
// npm install @anthropic-ai/sdk

import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage, SkinProfile, Product } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-5"; // swap to a smaller/cheaper model once you've validated quality

const SKIN_PROFILE_TOOL = {
  name: "record_skin_profile",
  description:
    "Record a structured assessment of the user's skin based on their photo(s) and what they've said in conversation.",
  input_schema: {
    type: "object" as const,
    properties: {
      skinType: {
        type: "string",
        enum: ["oily", "dry", "combination", "normal", "sensitive"],
      },
      concerns: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "acne",
            "hyperpigmentation",
            "fine_lines_aging",
            "dullness",
            "large_pores",
            "redness_irritation",
            "dehydration",
            "uneven_texture",
            "dark_circles",
          ],
        },
      },
      sensitivities: {
        type: "array",
        items: { type: "string" },
        description: "Any allergies, known reactions, or ingredients to avoid, as reported by the user.",
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
        description: "How confident you are in this read, given image quality and info provided.",
      },
      needsMoreInfo: {
        type: "boolean",
        description: "True if you should ask a clarifying question before recommending products.",
      },
      clarifyingQuestion: {
        type: "string",
        description: "Only set if needsMoreInfo is true.",
      },
      reasoning: {
        type: "string",
        description: "One or two sentences on what led to this assessment.",
      },
    },
    required: ["skinType", "concerns", "sensitivities", "confidence", "needsMoreInfo", "reasoning"],
  },
};

const SYSTEM_PROMPT = `You are a cosmetics skincare advisor for an ecommerce store. You are NOT a dermatologist and must never present your output as a medical diagnosis.

Your job: given a photo of someone's face/skin and whatever they tell you (skin type, concerns, allergies), assess their skin at a cosmetic level (oiliness, visible texture, redness, etc.) and call the record_skin_profile tool with your structured findings.

Rules:
- Base the assessment on what's actually visible plus what the user has told you. Don't invent details.
- If the photo is too dark, blurry, or unclear to assess confidently, set confidence to "low" and needsMoreInfo to true with a specific clarifyingQuestion (e.g. asking for a photo in natural daylight).
- If the user mentions any condition that sounds medical (cystic acne, eczema, psoriasis, rosacea diagnosis, etc.), still fill out the profile but note in reasoning that they should consult a dermatologist — do not attempt to treat or diagnose it yourself.
- Never comment on the person's attractiveness or make unrelated observations about their appearance.
- Always call the tool. Do not respond with plain text on this turn.`;

interface ExtractInput {
  messages: ChatMessage[];
}

function toAnthropicMessages(messages: ChatMessage[]) {
  return messages.map((m) => {
    if (m.role === "user" && m.imageBase64) {
      return {
        role: "user" as const,
        content: [
          {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: m.imageMediaType ?? "image/jpeg",
              data: m.imageBase64,
            },
          },
          { type: "text" as const, text: m.content },
        ],
      };
    }
    return { role: m.role, content: m.content };
  });
}

export async function extractSkinProfile({ messages }: ExtractInput): Promise<SkinProfile> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [SKIN_PROFILE_TOOL],
    tool_choice: { type: "tool", name: "record_skin_profile" },
    messages: toAnthropicMessages(messages),
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a structured skin profile");
  }

  return toolUse.input as SkinProfile;
}

export async function composeReply(
  profile: SkinProfile,
  recommendedProducts: Product[],
  conversationSoFar: ChatMessage[]
): Promise<string> {
  if (profile.needsMoreInfo) {
    // Short-circuit: just relay the clarifying question, no need for another API call.
    return profile.clarifyingQuestion ?? "Could you share a bit more detail so I can give you an accurate recommendation?";
  }

  const productSummaries = recommendedProducts
    .map((p) => `- ${p.name} ($${p.price}): targets ${p.concerns.join(", ")}. Key ingredients: ${p.keyIngredients.join(", ")}.`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    system:
      "You are a friendly, concise skincare advisor for an ecommerce store. Explain recommendations warmly and specifically, referencing the person's actual skin profile. Keep it under 150 words. Include a brief reminder that this is cosmetic guidance, not medical advice, only if relevant concerns were flagged.",
    messages: [
      ...toAnthropicMessages(conversationSoFar),
      {
        role: "user",
        content: `Here is the skin profile you assessed: ${JSON.stringify(profile)}.\n\nHere are the matched products from our catalog:\n${productSummaries}\n\nWrite the reply to the customer now.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}