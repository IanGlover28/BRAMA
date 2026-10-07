'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X, Sparkles, Package, User } from 'lucide-react'; 
import { UserButton, useClerk, useUser } from '@clerk/nextjs';
import CartToggleButton from './cart-toggle-button'; 
import { CATEGORIES } from '@/lib/categories';
import { useCurrentUser } from '@/hooks/use-current-user'; 

const featured = [
  { name: 'New Arrivals', path: '/products?filter=new' },
  { name: 'Best Sellers', path: '/products?filter=bestsellers' },
  { name: 'Most Popular', path: '/products?filter=popular' },
];

const shopSections = CATEGORIES.map((c) => ({
  title: c.label,
  path: `/products?category=${c.slug}`,
}));

export default function Navbar() {
  const router = useRouter();
  const { isVendor } = useCurrentUser();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-[calc(100%-3rem)] max-w-6xl z-50 bg-pink-400/90 backdrop-blur-md shadow-lg rounded-full border border-white/20">
        <div className="px-4 md:px-6 py-2 flex justify-between items-center">
         <Link href="/">
           <Image src="/brama-logo.png" alt="BRAMA Logo" width={120} height={50} />
         </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center text-white font-extrabold">
            
            {/* Featured Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'featured' ? null : 'featured');
                }}
                className="text-sm font-medium hover:text-pink-600 transition-colors flex items-center gap-1"
              >
                Featured
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'featured' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'featured' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fadeIn">
                  {featured.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path} 
                      onClick={() => setActiveDropdown(null)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50 hover:text-pink-600 transition-colors block"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Shop Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === 'shop' ? null : 'shop');
                }}
                className="text-sm font-medium hover:text-pink-600 transition-colors flex items-center gap-1"
              >
                Shop
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'shop' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-100 p-6 animate-fadeIn">
                  <div className="grid grid-cols-3 gap-8">
                    {shopSections.map((section) => (
                      <div key={section.title}>
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                          {section.title}
                        </h3>
                        <Link
                          href={section.path}
                          onClick={() => setActiveDropdown(null)}
                          className="block w-full text-left text-sm font-semibold text-pink-600 hover:text-pink-700"
                        >
                          Shop All {section.title} →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regular Links */}
            {isVendor && (
              <Link
                href="/vendor"
                className="text-sm font-medium hover:text-pink-600 transition-colors"
              >
                Vendor
              </Link>
            )}
            <Link
              href="/about"
              className="text-sm font-medium hover:text-pink-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/learn"
              className="text-sm font-medium hover:text-pink-600 transition-colors"
            >
              Learn
            </Link>
          </div>

          {/* Desktop My Account Button & Mobile Icons */}
          <div className="flex items-center gap-4">
            <CartToggleButton />
            
            {/* Desktop: Auth Controls */}
            {isSignedIn ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Account"
                    labelIcon={<User size={16} />}
                    href="/account"
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-white hover:text-pink-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-pink-600 text-white px-5 py-2.5 rounded-full hover:bg-pink-700 transition text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile: User Icon (signed out only — Clerk dropdown handles signed-in) */}
            {!isSignedIn && (
              <button
                onClick={() => router.push('/account')}
                aria-label="My Account"
                className="md:hidden text-gray-900 hover:text-pink-600 transition-colors"
              >
                <User size={24} />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white text-pink-600 shadow-sm hover:bg-pink-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto`}
        >
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 text-white shadow-md hover:bg-pink-700 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mt-12 space-y-6">
              {/* Featured Section */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-pink-600" />
                  Featured
                </h3>
                <div className="space-y-2 pl-6">
                  {featured.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Shop Categories */}
              {shopSections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-pink-600" />
                    {section.title}
                  </h3>
                  <div className="space-y-2 pl-6">
                    <Link
                      href={section.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-left text-sm font-semibold text-pink-600 hover:text-pink-700"
                    >
                      Shop All {section.title} →
                    </Link>
                  </div>
                </div>
              ))}

              {/* Other Links */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isVendor && (
                  <Link
                    href="/vendor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-left font-medium text-gray-900 hover:text-pink-600 py-2"
                  >
                    Vendor Portal
                  </Link>
                )}
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left font-medium text-gray-900 hover:text-pink-600 py-2"
                >
                  About
                </Link>
                <Link
                  href="/learn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left font-medium text-gray-900 hover:text-pink-600 py-2"
                >
                  Learn More
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left font-medium text-red-600 hover:text-red-700 py-2"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}