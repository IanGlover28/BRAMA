import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account, checkout and vendor pages are private or per-user - keep them out of search.
      disallow: [
        "/api/",
        "/account",
        "/cart",
        "/inbox",
        "/orders",
        "/payment-success",
        "/reviews",
        "/settings",
        "/sign-in",
        "/sign-up",
        "/vendor",
        "/vouchers",
        "/wishlist",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
