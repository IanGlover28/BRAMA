import type { Metadata } from "next";
import LearnReels from "@/components/learn-reels";
import { tutorials } from "./data";
import { tutorialMetadata } from "./metadata";

interface LearnPageProps {
  searchParams: Promise<{ v?: string | string[] }>;
}

async function requestedTutorial(searchParams: LearnPageProps["searchParams"]) {
  const { v } = await searchParams;
  const slug = Array.isArray(v) ? v[0] : v;
  return tutorials.find((t) => t.slug === slug);
}

// A shared reel link (/learn?v=<slug>) previews that video; plain /learn
// keeps the layout's metadata.
export async function generateMetadata({ searchParams }: LearnPageProps): Promise<Metadata> {
  const tutorial = await requestedTutorial(searchParams);
  return tutorial ? tutorialMetadata(tutorial, `/learn?v=${tutorial.slug}`) : {};
}

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const tutorial = await requestedTutorial(searchParams);
  return <LearnReels initialSlug={tutorial?.slug} />;
}
