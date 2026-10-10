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

export const metadata: Metadata = {
  title: "BRAMA COSMETICS - Quality products for every Classy Lady.",
  description:
    "Premium cosmetics platform, featuring a secure and seamless shopping experience.",
  icons: {
    icon: "/brama-logo.ico",
    apple: "/brama-logo.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/brama-logo.png" />
      </head>
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
