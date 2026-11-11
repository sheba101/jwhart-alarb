
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: number;
  productName: string;
  productImage: string | null;

  variantId: number | null;
  variantName: string | null;
  variantImage: string | null;

  quantity: number;
}

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variantId: number | null) => void;
  updateQuantity: (
    productId: number,
    variantId: number | null,
    quantity: number
  ) => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === newItem.productId &&
                item.variantId === newItem.variantId
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, newItem],
          };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId
              )
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            item.variantId === variantId
              ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "jawhara-arab-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
