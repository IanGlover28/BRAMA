'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationContext } from '@/context/location-context';
import { X, Lock, Truck, Tag, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/cart-context';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cartItems, cartTotal } = useCart();
  const { location, setLocation } = useLocationContext();
  const [promo, setPromo] = useState('');
  const [delivery, setDelivery] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 10; // Flat rate
  const discount = promo.toLowerCase() === 'highhub10' ? 0.1 * cartTotal : 0;
  const finalTotal = cartTotal + deliveryFee - discount;

  // ✅ Auto-fill delivery field from location context
  useEffect(() => {
    if (location) setDelivery(location);
  }, [location]);

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
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        amount: finalTotal,
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="text-green-600" /> Confirm Your Order
            </h2>

            {/* Order Summary */}
            <div className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ShoppingCart size={18} /> Order Summary
              </h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-1">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="my-2" />
              <p className="flex justify-between text-sm">
                <span>Subtotal</span> <span>₵{cartTotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span>Delivery Fee</span> <span>₵{deliveryFee.toFixed(2)}</span>
              </p>
              {discount > 0 && (
                <p className="flex justify-between text-sm text-green-600">
                  <span>Promo Discount</span> <span>-₵{discount.toFixed(2)}</span>
                </p>
              )}
              <p className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span> <span>₵{finalTotal.toFixed(2)}</span>
              </p>
            </div>

            {/* Promo Code */}
            <div className="mb-4">
              <label className=" text-sm font-medium mb-1 flex items-center gap-1">
                <Tag size={16} /> Promo Code
              </label>
              <input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Enter promo code"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              />
            </div>

            {/* Delivery Info */}
            <div className="mb-4">
              <label className=" text-sm font-medium mb-1 flex items-center gap-1">
                <Truck size={16} /> Delivery Destination
              </label>
              <input
                type="text"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                placeholder="Confirm or edit your location"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              />
              {!location && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠ No saved location found. Please set one in Location Picker.
                </p>
              )}
            </div>

            {/* Order Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Order Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add delivery notes or preferences..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
                rows={3}
              />
            </div>

            {/* Modify Cart */}
            <button
              onClick={onClose}
              className="text-green-600 text-sm underline mb-4"
            >
              Modify Cart
            </button>

            {/* Confirm Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-green-400 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : (<><Lock size={18}/> Confirm Order</>)}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
