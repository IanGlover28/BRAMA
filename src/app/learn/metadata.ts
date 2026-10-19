import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import { shareImage, videoId, type Reel } from "./data";

/**
 * Link-preview metadata for one reel or tutorial. Page-level openGraph/twitter replace
 * the root layout's, so this sets everything a preview needs: the video's
 * thumbnail is the share image.
 */
export function tutorialMetadata(tutorial: Reel, url: string): Metadata {
  const image = tutorial.image
    ? { url: tutorial.image, alt: tutorial.title }
    : {
        url: shareImage(tutorial.video),
        width: 1280,
        height: 720,
        alt: tutorial.title,
      };

  return {
    title: { absolute: `${tutorial.title} | ${SITE_NAME}` },
    description: tutorial.summary,
    alternates: { canonical: tutorial.guide ? `/learn/${tutorial.slug}` : url },
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
          width: tutorial.vertical ? 720 : 1280,
          height: tutorial.vertical ? 1280 : 720,
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
