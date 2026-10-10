// lib/types.ts

export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type SkinConcern =
  | "acne"
  | "hyperpigmentation"
  | "fine_lines_aging"
  | "dullness"
  | "large_pores"
  | "redness_irritation"
  | "dehydration"
  | "uneven_texture"
  | "dark_circles";

// Structured output we force Claude to return via tool use.
// Keep this in sync with the tool schema in anthropic-client.ts.
export interface SkinProfile {
  skinType: SkinType;
  concerns: SkinConcern[];
  sensitivities: string[]; // free text, e.g. "reports reacting to fragrance"
  confidence: "high" | "medium" | "low";
  needsMoreInfo: boolean;
  clarifyingQuestion?: string;
  reasoning: string; // short internal note, not necessarily shown to user verbatim
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  keyIngredients: string[];
  contraindications: string[]; // e.g. "pregnancy", "retinol-sensitive"
  description: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  imageBase64?: string; // only present on user turns that include an upload
  imageMediaType?: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
}

export interface SkinAnalysisResponse {
  profile: SkinProfile;
  recommendedProducts: Product[];
  assistantReply: string;
}