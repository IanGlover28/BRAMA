import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import { shareImage, videoId, type Tutorial } from "./data";

/**
 * Link-preview metadata for one tutorial. Page-level openGraph/twitter replace
 * the root layout's, so this sets everything a preview needs: the video's
 * thumbnail is the share image.
 */
export function tutorialMetadata(tutorial: Tutorial, url: string): Metadata {
  const image = { url: shareImage(tutorial.video), width: 1280, height: 720, alt: tutorial.title };

  return {
    title: { absolute: `${tutorial.title} | ${SITE_NAME}` },
    description: tutorial.summary,
    alternates: { canonical: `/learn/${tutorial.slug}` },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: "en_GH",
      title: tutorial.title,
      description: tutorial.summary,
      url,
      images: [image],
      videos: [
        {
          url: `https://www.youtube.com/watch?v=${videoId(tutorial.video)}`,
          secureUrl: tutorial.video,
          type: "text/html",
          width: 1280,
          height: 720,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tutorial.title,
      description: tutorial.summary,
      images: [image.url],
    },
  };
}
