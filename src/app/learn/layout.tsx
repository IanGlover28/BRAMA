import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

const title = "Beauty Tutorials & Skincare Tips";
const description =
  "Step-by-step skincare routines, makeup tutorials and beauty tips from BRAMA Cosmetics.";
const image = { url: "/og-image.png", width: 1200, height: 630, alt: "BRAMA Cosmetics" };

// openGraph/twitter here replace the root layout's, so the image is repeated.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GH",
    title: `${title} | ${SITE_NAME}`,
    description,
    url: "/learn",
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [image.url],
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
