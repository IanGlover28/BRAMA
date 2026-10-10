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

const inter = Inter({ subsets: ["latin"] });

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://brama-cosmetics.vercel.app";

const title = "BRAMA COSMETICS - Quality products for every Classy Lady.";
const description =
  "Premium cosmetics platform, featuring a secure and seamless shopping experience.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title,
  description,
  icons: {
    apple: "/brama-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "BRAMA COSMETICS",
    title,
    description,
    url: baseUrl,
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
