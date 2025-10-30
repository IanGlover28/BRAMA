'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ShoppingCart, Lock, Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import CheckoutModal from './checkout-modal';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCartModal() {
  const { isCartOpen, toggleCart, cartItems, cartTotal, removeFromCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
  }, [isCartOpen, toggleCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex justify-end z-[9999]"
        >
          <motion.div
            ref={modalRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="bg-white w-full sm:w-[420px] h-full shadow-2xl flex flex-col relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <ShoppingCart /> Your Cart ({cartItems.length})
              </h2>
              <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₵{item.price.toFixed(2)} each
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-extrabold text-pink-600">
                    ₵{cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition flex items-center justify-center gap-2"
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
