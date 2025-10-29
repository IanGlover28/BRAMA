// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import AuthProvider from '@/components/auth-provider';
import ToastProvider from '@/components/toast-provider';
import {LocationProvider} from '@/context/location-context'
import { CartProvider } from '@/context/cart-context';
import FloatingCartModal from '@/components/floating-cart-modal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exortica | Premium Edibles and Smoking Tools',
  description: 'Premium edibles and smoking tools platform, featuring a secure and seamless shopping experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          {/* WRAP THE ENTIRE APP WITH THE CART PROVIDER */}
          <CartProvider>
            <LocationProvider>
            <ToastProvider>
              <Navbar />
              <main className="min-h-[calc(100vh-100px)] pt-[80px]"> 
                {children}
              </main>
              <Footer />
              
              {/* RENDER THE FLOATING CART MODAL GLOBALLY */}
              <FloatingCartModal />
            </ToastProvider>
            </LocationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}