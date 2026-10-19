import type { Reel } from "./data";

/**
 * Hand-picked YouTube videos for the Learn reels, shown before playlist videos
 * and the written tutorials. To add one: copy the id from the video's URL
 * (youtube.com/watch?v=<id>) and check that the video allows embedding
 * (YouTube's Share menu offers "Embed").
 */
interface CuratedVideo {
  id: string;
  title: string;
  creator: string;
  category: string;
  summary: string;
}

const DARK_SPOTS = "Dark Spots & Hyperpigmentation";
const ACNE = "Acne Care";
const ROUTINES = "Everyday Routines";
const BODY = "Body Care";

const videos: CuratedVideo[] = [
  {
    id: "D0JwB9ubWsg",
    title: "How I Got Rid of My Dark Spots (My Full Routine)",
    creator: "JUST MICHELLE",
    category: DARK_SPOTS,
    summary: "The exact routine that faded dark spots and evened out skin tone.",
  },
  {
    id: "PsauVQJqXfw",
    title: "Simple 5-Step Routine for Glowing Skin",
    creator: "Dr Ifeoma Ejikeme",
    category: ROUTINES,
    summary: "A doctor's five essential steps for healthy, glowing skin.",
  },
  {
    id: "qlRNs4PoGb8",
    title: "How to Get Clear & Smooth Skin",
    creator: "JUST MICHELLE",
    category: DARK_SPOTS,
    summary: "A step-by-step routine to brighten dark marks and discolouration.",
  },
  {
    id: "W2apB4Lx260",
    title: "How I Cleared My Acne, Dark Spots & Hyperpigmentation",
    creator: "Zy Aaliyah",
    category: ACNE,
    summary: "One month of clearing acne and dark spots, with before-and-after proof.",
  },
  {
    id: "A1WG3x-Ebpk",
    title: "5 Skincare Rules for Acne-Prone Dark Skin",
    creator: "Dimma Umeh",
    category: ACNE,
    summary: "The rules behind clear, even skin when you're acne-prone.",
  },
  {
    id: "q9YURB-gtHw",
    title: "Best Treatments & Products for Fading Hyperpigmentation",
    creator: "Dr Ifeoma Ejikeme",
    category: DARK_SPOTS,
    summary: "What actually fades hyperpigmentation on the face and body.",
  },
  {
    id: "Nthab9JKVUs",
    title: "How I Cleared My Hyperpigmentation, Acne & Dark Spots",
    creator: "Crystal Nicole",
    category: DARK_SPOTS,
    summary: "The glass-skin routine that cleared hyperpigmentation and dark spots.",
  },
  {
    id: "sTfyhY7l3mw",
    title: "How to Clear Full-Body Hyperpigmentation & Acne",
    creator: "Crystal Nicole",
    category: BODY,
    summary: "Treating dark marks on the underarms, back and body, not just the face.",
  },
  {
    id: "8KnFD88xQEk",
    title: "The Affordable Routine That Cleared My Acne & Dark Spots",
    creator: "Betty Aspires",
    category: ACNE,
    summary: "A beginner-friendly, budget routine for acne and dark spots.",
  },
  {
    id: "sXVnlzgvUK8",
    title: "Body Routine for Hyperpigmentation",
    creator: "Betty Aspires",
    category: BODY,
    summary: "The body care routine that evened out skin in two weeks.",
  },
  {
    id: "uhb_KI1rFy4",
    title: "How to Layer Your Skincare Products",
    creator: "JUST MICHELLE",
    category: ROUTINES,
    summary: "Which product goes first: cleanser, toner, serum, moisturiser and more.",
  },
  {
    id: "XLA3hd45SII",
    title: "The Easiest Morning Skincare Routine for Beginners",
    creator: "Tee Nosike",
    category: ROUTINES,
    summary: "An affordable morning routine for glowing skin.",
  },
  {
    id: "Gb6jEXMAKwg",
    title: "My Skincare Routine & Skincare Prices in Ghana",
    creator: "Afrakomah's Hub",
    category: ROUTINES,
    summary: "A teen skincare routine, with what each product costs in Ghana.",
  },
  {
    id: "8ZzlVWC-1Xg",
    title: "Skincare Routine for Hyperpigmentation & Dark Spots (CeraVe)",
    creator: "Charniq G",
    category: DARK_SPOTS,
    summary: "A simple CeraVe routine for hyperpigmentation and dark spots.",
  },
  {
    id: "249f7umBw1Y",
    title: "Beginner's Skincare Routine",
    creator: "Oluchi Onuigbo",
    category: ROUTINES,
    summary: "How to start a simple skincare routine from scratch.",
  },
];

export const curatedReels: Reel[] = videos.map(({ id, ...video }) => ({
  ...video,
  slug: id,
  video: `https://www.youtube.com/embed/${id}`,
}));
