import { ClerkProvider } from "@clerk/nextjs";
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/site-navbar";
import Footer from "@/components/footer";
import ToastProvider from "@/components/toast-provider";
import QueryProvider from "@/components/query-provider";
import { LocationProvider } from "@/context/location-context";
import FloatingCartModal from "@/components/floating-cart-modal";
import ErrorBoundary from "@/components/error-boundary";
import GoogleAnalytics from "@/components/google-analytics";
import JsonLd from "@/components/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

const title = "BRAMA COSMETICS - Quality products for every Classy Lady.";
const description =
  "Shop premium skincare, makeup and beauty products in Ghana. Secure checkout with Mobile Money and card, delivered to your door.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "cosmetics Ghana",
    "skincare Ghana",
    "makeup Accra",
    "beauty products online",
    "BRAMA Cosmetics",
  ],
  icons: {
    apple: "/brama-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "BRAMA COSMETICS",
    locale: "en_GH",
    title,
    description,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BRAMA Cosmetics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/brama-logo.png`,
            description,
            currenciesAccepted: "GHS",
            areaServed: "GH",
          }}
        />
        <GoogleAnalytics />
        <ClerkProvider>
          <ErrorBoundary>
            <QueryProvider>
              <LocationProvider>
                <ToastProvider>
                  <Navbar />
                  <main className="min-h-[calc(100vh-100px)]">
                    {children}
                  </main>
                  <Footer />
                  <FloatingCartModal />
                </ToastProvider>
              </LocationProvider>
            </QueryProvider>
          </ErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
}
