import Link from 'next/link';
import Image from 'next/image';
import {  CreditCard, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Logo & Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-pink-500">BRAMA</span>.
            </h3>
            <p className="text-gray-400 text-sm">Quality products for a better life. Shop secure, shop smart.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-pink-500 mb-2">Shop</h4>
            <Link href="/products?category=flower" className="block text-sm text-gray-300 hover:text-pink-400 transition">LipCare</Link>
            <Link href="/products?category=edibles" className="block text-sm text-gray-300 hover:text-pink-400 transition">SkinCare</Link>
            <Link href="/products?filter=bestsellers" className="block text-sm text-gray-300 hover:text-pink-400 transition">Best Sellers</Link>
          </div>
          
          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-semibold text-pink-500 mb-2">Company</h4>
            <Link href="/about" className="block text-sm text-gray-300 hover:text-pink-400 transition">About Us</Link>
            <Link href="/contact" className="block text-sm text-gray-300 hover:text-pink-400 transition">Contact</Link>
            <Link href="/terms" className="block text-sm text-gray-300 hover:text-pink-400 transition">Terms & Privacy</Link>
          </div>

          {/* Payment Security */}
          <div className="space-y-3">
            <h4 className="font-semibold text-pink-500 mb-2">Secure Payments</h4>
            <div className="flex items-center gap-2 text-sm text-gray-300">
                <Lock size={16} className="text-yellow-400" />
                SSL Secured Checkout
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
                <CreditCard size={16} />
                Powered by Paystack
            </div>
            <div className="flex items-center gap-4 pt-2">
                <Image src="/paystack.png" alt="Paystack Verified" width={60} height={20} />
                <Image src="/visa.png" alt="Visa" width={30} height={20} />
                <Image src="/mastercard.png" alt="Mastercard" width={30} height={20} />
            </div>
          </div>
          
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BRAMA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
