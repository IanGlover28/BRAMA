'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/cart-context';
import { CartItem } from '@/context/cart-context';


interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>; 
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart(); 
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    
    addToCart(product);

    setTimeout(() => {
      setLoading(false);
     
      toast.success(`${product.name} added to Cart! 🛒`);
    }, 500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full sm:w-auto bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2 disabled:bg-green-400"
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