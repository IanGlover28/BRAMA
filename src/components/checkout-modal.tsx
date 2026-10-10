'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationContext } from '@/context/location-context';
import { X, Lock, Truck, Tag, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { calcSubtotal, calcTotal, DELIVERY_FEE } from '@/lib/pricing';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const cartItems = useCartStore((s) => s.items);
  const { location, setLocation } = useLocationContext();
  const [promo, setPromo] = useState('');
  const [voucherRates, setVoucherRates] = useState<Record<string, number>>({});
  const [delivery, setDelivery] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = DELIVERY_FEE;
  const subtotal = calcSubtotal(cartItems);
  const discountRate = voucherRates[promo.trim().toLowerCase()] ?? 0;
  const discount = discountRate * subtotal;
  const finalTotal = calcTotal(subtotal, discountRate);

  // ✅ Auto-fill delivery field from location context
  useEffect(() => {
    if (location) setDelivery(location);
  }, [location]);

  // ✅ Load active vouchers so the promo preview matches the server.
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/vouchers')
      .then((res) => (res.ok ? res.json() : []))
      .then((list) =>
        setVoucherRates(
          Object.fromEntries(
            (list as { code: string; discountPct: number }[]).map((v) => [
              v.code.toLowerCase(),
              v.discountPct / 100,
            ])
          )
        )
      )
      .catch(() => {});
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!delivery.trim()) {
      toast.error('Please enter your delivery destination.');
      return;
    }

    // Update global location
    setLocation(delivery);

    setLoading(true);
    try {
      const body = {
        items: cartItems.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        amount: finalTotal,
        promo: promo || undefined,
        delivery,
        note: description,
      };

      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout initialization failed');

      window.location.href = data.authorization_url;
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10 rounded-t-3xl">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-50 text-pink-600">
                  <Lock size={18} />
                </span>
                Confirm Your Order
              </h2>
              <button
                onClick={onClose}
                aria-label="Close checkout"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 text-white shadow-md hover:bg-pink-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 pt-5 space-y-5">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-900">
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white text-pink-600 shadow-sm">
                    <ShoppingCart size={14} />
                  </span>
                  Order Summary
                </h3>
                <div className="space-y-1.5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.name} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-900">
                        ₵{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <hr className="my-3 border-gray-200" />
                <div className="space-y-1.5 text-sm">
                  <p className="flex justify-between text-gray-600">
                    <span>Subtotal</span> <span>₵{subtotal.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span> <span>₵{deliveryFee.toFixed(2)}</span>
                  </p>
                  {discount > 0 && (
                    <p className="flex justify-between text-pink-600 font-medium">
                      <span>Promo Discount</span> <span>-₵{discount.toFixed(2)}</span>
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-pink-600">
                    ₵{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Tag size={15} className="text-pink-600" /> Promo Code
                </label>
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter promo code"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                />
                {discount > 0 && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    Promo applied — you save ₵{discount.toFixed(2)}!
                  </p>
                )}
              </div>

              {/* Delivery Info */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Truck size={15} className="text-pink-600" /> Delivery Destination
                </label>
                <input
                  type="text"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  placeholder="Confirm or edit your location"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                />
                {!location && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    ⚠ No saved location found. Please set one in Location Picker.
                  </p>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Order Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add delivery notes or preferences..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  rows={3}
                />
              </div>

              <button
                onClick={onClose}
                className="block mx-auto text-sm font-semibold text-pink-600 underline underline-offset-4 hover:text-pink-700"
              >
                Modify Cart
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-pink-600 text-white py-3.5 rounded-full font-bold text-base hover:bg-pink-700 transition disabled:bg-pink-400 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25"
              >
                {loading ? 'Processing...' : (<><Lock size={18} /> Confirm Order</>)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
