import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackAddToCart, trackRemoveFromCart } from "@/lib/analytics";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand?: string | null;
  category?: string | null;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity"> & { image?: string; quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  /** Empties the cart without analytics (e.g. after a purchase). */
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addToCart: (item) => {
        const qty = Math.max(1, Math.min(99, Math.floor(item.quantity ?? 1)));
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image || "",
                brand: item.brand,
                category: item.category,
                quantity: qty,
              },
            ],
          };
        });
        trackAddToCart(item, qty);
      },

      removeFromCart: (id) => {
        const existing = get().items.find((i) => i.id === id);
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        if (existing) trackRemoveFromCart(existing, existing.quantity);
      },

      updateQuantity: (id, quantity) => {
        const existing = get().items.find((i) => i.id === id);
        if (!existing) return;
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
        const delta = quantity - existing.quantity;
        if (delta > 0) trackAddToCart(existing, delta);
        else if (delta < 0) trackRemoveFromCart(existing, -delta);
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      cartTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      cartCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "brama-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
