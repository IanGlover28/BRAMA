'use client';

import { useState } from 'react';
import { useCartStore } from '@/hooks/use-cart-store';
import { Product } from '@/types/product';

export default function ProductPurchaseOptions({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPrice = parseFloat((product.price * quantity).toFixed(2));
  const maxQuantity = product.stock > 0 ? Math.min(product.stock, 99) : 99;
  const outOfStock = product.stock <= 0;

  const handleBuyNow = () => {
    setLoading(true);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    toggleCart();
    setLoading(false);
  };

  return (
    <div className="space-y-4 border-t pt-6">
      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="px-4 py-2 border rounded-lg"
          >
            –
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={outOfStock || quantity >= maxQuantity}
            aria-label="Increase quantity"
            className="px-4 py-2 border rounded-lg disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Total and Buy */}
      <div className="pt-6">
        <p className="text-xl font-bold mb-3">
          Total: <span className="text-pink-600">₵{totalPrice.toFixed(2)}</span>
        </p>

        <button
          onClick={handleBuyNow}
          disabled={loading || outOfStock}
          className="w-full bg-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-pink-700 transition disabled:opacity-70"
        >
          {outOfStock ? 'Out of Stock' : loading ? 'Adding...' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}
