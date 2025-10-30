"use client"

import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem } = useCart()
  const router = useRouter()
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p>No items in your cart</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <p>{item.name}</p>
              <p>${item.price}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500">Remove</button>
            </div>
          ))}
          <div className="flex justify-between mt-4 font-semibold">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="bg-pink-600 text-white w-full mt-4 py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}
