'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart-store';

export default function CartToggleButton() {
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = useCartStore((s) => s.cartCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white text-pink-600 shadow-sm hover:bg-pink-50 transition duration-150"
      aria-label="Toggle Shopping Cart"
    >
      <ShoppingCart size={20} />
      {mounted && itemCount > 0 && (
        // Display item count badge
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold leading-none text-white bg-pink-600 border-2 border-white rounded-full">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}