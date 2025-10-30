'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X, Sparkles, Package, User } from 'lucide-react'; 
import CartToggleButton from './cart-toggle-button'; 

const categories = {
  featured: {
    icon: Package,
    items: [
      { name: 'New Arrivals', path: '/products?filter=new' },
      { name: 'Best Sellers', path: '/products?filter=bestsellers' },
      { name: 'Most Popular', path: '/products?filter=popular' },
    ]
  },
 shop: {
  icon: Sparkles, // You can replace this with a cosmetic-related icon if you want (e.g., Sparkles or Droplet)
  sections: [
    {
      title: 'Lip Care',
      items: [
        { name: 'Lip Balm', path: '/products?category=lip-balm' },
        { name: 'Lip Gloss', path: '/products?category=lip-gloss' },
        { name: 'Lip Oil', path: '/products?category=lip-oil' },
        { name: 'Lip Scrub', path: '/products?category=lip-scrub' },
        { name: 'Lip Mask', path: '/products?category=lip-mask' },
      ],
      shopAll: '/products?category=lipcare',
    },
    {
      title: 'Skin Care',
      items: [
        { name: 'Cleansers', path: '/products?category=cleansers' },
        { name: 'Toners', path: '/products?category=toners' },
        { name: 'Moisturizers', path: '/products?category=moisturizers' },
        { name: 'Serums', path: '/products?category=serums' },
        { name: 'Sunscreens', path: '/products?category=sunscreens' },
      ],
      shopAll: '/products?category=skincare',
    },
    {
      title: 'Makeup',
      items: [
        { name: 'Foundation', path: '/products?category=foundation' },
        { name: 'Concealer', path: '/products?category=concealer' },
        { name: 'Powder', path: '/products?category=powder' },
        { name: 'Mascara', path: '/products?category=mascara' },
        { name: 'Blush & Highlighter', path: '/products?category=blush-highlighter' },
      ],
      shopAll: '/products?category=makeup',
    },
    {
      title: 'Hair Care',
      items: [
        { name: 'Shampoo', path: '/products?category=shampoo' },
        { name: 'Conditioner', path: '/products?category=conditioner' },
        { name: 'Hair Oil', path: '/products?category=hair-oil' },
        { name: 'Hair Mask', path: '/products?category=hair-mask' },
        { name: 'Styling Products', path: '/products?category=styling' },
      ],
      shopAll: '/products?category=haircare',
    },
    {
      title: 'Fragrances',
      items: [
        { name: 'Perfumes', path: '/products?category=perfumes' },
        { name: 'Body Mists', path: '/products?category=body-mists' },
        { name: 'Deodorants', path: '/products?category=deodorants' },
      ],
      shopAll: '/products?category=fragrances',
    },
    {
      title: 'Body Care',
      items: [
        { name: 'Body Lotion', path: '/products?category=body-lotion' },
        { name: 'Body Wash', path: '/products?category=body-wash' },
        { name: 'Body Scrub', path: '/products?category=body-scrub' },
        { name: 'Hand Cream', path: '/products?category=hand-cream' },
      ],
      shopAll: '/products?category=bodycare',
    },
  ],
}

};

export default function Navbar() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
 
        if (!res.ok) {
            setUser(null); 
            return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Failed to fetch user', err);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    router.push('/');
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
      <nav className="fixed top-0 w-full z-50 bg-pink-400 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
         <Image onClick={() => router.push('/')} src="/brama-logo.png" alt="BRAMA Logo" width={120} height={50} />
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            
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
                  {categories.featured.items.map((item) => (
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
                    {categories.shop.sections.map((section) => (
                      <div key={section.title}>
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                          {section.title}
                        </h3>
                        <div className="space-y-2">
                          {section.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.path}
                              onClick={() => setActiveDropdown(null)}
                              className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 hover:translate-x-1 transition-all"
                            >
                              {item.name}
                            </Link>
                          ))}
                          <Link
                            href={section.shopAll}
                            onClick={() => setActiveDropdown(null)}
                            className="block w-full text-left text-sm font-semibold text-pink-600 hover:text-pink-700 mt-3 pt-2 border-t border-gray-200"
                          >
                            Shop All {section.title} →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regular Links */}
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
            
            {/* Desktop: My Account Button */}
            <button
              onClick={() => router.push('/account')}
              className="hidden md:block bg-pink-600 text-white px-5 py-2.5 rounded-full hover:bg-pink-700 transition text-sm font-semibold"
            >
              My Account
            </button>

            {/* Mobile: User Icon */}
            <button
              onClick={() => router.push('/account')}
              className="md:hidden text-gray-900 hover:text-pink-600 transition-colors"
            >
              <User size={24} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-900 hover:text-pink-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            <div className="mt-12 space-y-6">
              {/* Featured Section */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-pink-600" />
                  Featured
                </h3>
                <div className="space-y-2 pl-6">
                  {categories.featured.items.map((item) => (
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
              {categories.shop.sections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-pink-600" />
                    {section.title}
                  </h3>
                  <div className="space-y-2 pl-6">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-left text-sm text-gray-600 hover:text-pink-600 py-1"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href={section.shopAll}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-left text-sm font-semibold text-pink-600 hover:text-pink-700 mt-2 pt-2 border-t border-gray-200"
                    >
                      Shop All {section.title} →
                    </Link>
                  </div>
                </div>
              ))}

              {/* Other Links */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
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