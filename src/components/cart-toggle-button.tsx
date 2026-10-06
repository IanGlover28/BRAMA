// components/cart-toggle-button.tsx
'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart-store'; 

export default function CartToggleButton() {
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = useCartStore((s) => s.cartCount());

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-150"
      aria-label="Toggle Shopping Cart"
    >
      <ShoppingCart size={24} className="text-gray-700" />
      {itemCount > 0 && (
        // Display item count badge
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}