'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import {Product} from '@/types/product';

export default function ProductPurchaseOptions({ product }: { product: Product }) {
  const { addToCart, toggleCart } = useCart();

  const [type, setType] = useState<'Bud' | 'Pre-Rolled'>('Bud');
  const [unit, setUnit] = useState<'Gram' | 'Ounce'>('Gram');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const makeVariantId = () => `${product.id}::${type.toLowerCase()}::${unit.toLowerCase()}`;

  const unitMultiplier = unit === 'Ounce' ? 28 : 1;
  const unitPrice = product.price * unitMultiplier;
  const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));

  const handleBuyNow = async () => {
    setLoading(true);

    const item = {
      id: makeVariantId(),
      name: `${product.name} — ${type} (${quantity} x ${unit})`,
      price: totalPrice,
    };

    addToCart(item);    
    toggleCart();     
    setLoading(false);
  };

  return (
    <div className="space-y-4 border-t pt-6">
      {/* Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
        <div className="flex gap-4">
          {['Bud', 'Pre-Rolled'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as 'Bud' | 'Pre-Rolled')}
              className={`px-4 py-2 rounded-full border ${
                type === t ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 hover:border-green-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Unit */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
        <div className="flex gap-4">
          {['Gram', 'Ounce'].map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u as 'Gram' | 'Ounce')}
              className={`px-4 py-2 rounded-full border ${
                unit === u ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 hover:border-green-600'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 border rounded-lg">–</button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 border rounded-lg">+</button>
        </div>
      </div>

      {/* Total and Buy */}
      <div className="pt-6">
        <p className="text-xl font-bold mb-3">
          Total: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
        </p>

        <button
          onClick={handleBuyNow}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition disabled:opacity-70"
        >
          {loading ? 'Adding...' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}
