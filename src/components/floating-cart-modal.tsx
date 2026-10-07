'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ShoppingCart, Lock, Trash2 } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart-store';
import CheckoutModal from './checkout-modal';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCartModal() {
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const cartItems = useCartStore((s) => s.items);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const modalRef = useRef<HTMLDivElement>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (checkoutOpen) return;
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        toggleCart();
      }
    }

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, toggleCart, checkoutOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-[9999]"
        >
          <motion.div
            ref={modalRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="bg-white/75 backdrop-blur-xl border-l border-white/30 w-full sm:w-[420px] h-full shadow-2xl flex flex-col relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-white/40">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <ShoppingCart size={20} className="text-pink-600" />
                Your Cart ({cartItems.length})
              </h2>
              <button
                onClick={toggleCart}
                aria-label="Close cart"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-600 text-white shadow-md hover:bg-pink-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-24 text-center px-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-pink-50 text-pink-600 mb-4">
                    <ShoppingCart size={28} />
                  </div>
                  <p className="text-gray-700 font-semibold">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mt-1">Add some glow to your cart.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 bg-white/70 rounded-xl p-4 shadow-sm border border-white/40"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-sm text-pink-600 font-bold mt-0.5">
                        ₵{item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/40 p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-extrabold text-pink-600">
                    ₵{cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full bg-pink-600 text-white py-3.5 rounded-full hover:bg-pink-700 transition flex items-center justify-center gap-2 font-bold shadow-lg shadow-pink-600/25"
                >
                  <Lock size={18} /> Checkout
                </button>

                {/* Checkout Modal */}
                <CheckoutModal
                  isOpen={checkoutOpen}
                  onClose={() => setCheckoutOpen(false)}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}