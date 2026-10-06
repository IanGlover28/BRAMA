'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore, CartItem } from '@/hooks/use-cart-store';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    addToCart(product);
    setTimeout(() => {
      setLoading(false);
      toast.success(`${product.name} added to Cart!`);
    }, 500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full sm:w-auto bg-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-pink-700 transition duration-300 flex items-center justify-center gap-2 disabled:bg-pink-400"
    >
      {loading ? (
        'Adding...'
      ) : (
        <>
          <ShoppingCart size={20} />
          Add to Cart
        </>
      )}
    </button>
  );
}