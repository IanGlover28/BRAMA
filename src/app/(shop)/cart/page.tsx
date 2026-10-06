"use client"

import { useCartStore } from "@/hooks/use-cart-store"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const cartItems = useCartStore((s) => s.items)
  const removeFromCart = useCartStore((s) => s.removeFromCart)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const router = useRouter()

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in your cart</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">₵{item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">Remove</button>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4 font-semibold">
            <span>Total:</span>
            <span>₵{cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 text-sm underline w-full mt-2 hover:text-red-700"
          >
            Clear cart
          </button>
          <button
            onClick={() => router.push("/products")}
            className="bg-pink-600 text-white w-full mt-4 py-2 rounded hover:bg-pink-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  )
}
