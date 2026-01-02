import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type variant = {
  variantId: string;
  variantName: string;
  storage: string;
}

export type CartItem = {
  userId : string,
  id: string; // Product ID
  title: string;
  image: string;
  price: number;
  variant: variant;
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string , storage: string) => void;
  removeOne: (variantId: string , storage: string) => void;
  clearCart: () => void;
}

export const useCartStore = create(persist<CartState>((set) => ({
  cartItems: [],
  addToCart: (item: CartItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.variant.variantId === item.variant.variantId && cartItem.variant.storage === item.variant.storage
      );
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((cartItem) => {
            if (cartItem.variant.variantId === item.variant.variantId && cartItem.variant.storage === item.variant.storage) {
              return {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              };
            }
            return cartItem;
          }),
        };
      } else {
        return {
          cartItems: [...state.cartItems, item],
        };
      }
    }),
  removeOne: (variantId: string , storage: string) =>
    set((state) => {
      const updateCartItems = state.cartItems.map((item) => {
        if (item.variant.variantId === variantId && item.variant.storage === storage) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      return {
        cartItems: updateCartItems.filter((item) => item.quantity > 0),
      };
    }),
  removeFromCart: (variantId: string , storage: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.variant.variantId !== variantId && item.variant.storage === storage),
    })),
  clearCart: () => set({ cartItems: [] }),
}),
{
    name: 'cart-storage',
}
)
);
