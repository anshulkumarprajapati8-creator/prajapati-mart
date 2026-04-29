import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, OrderDetails, Order, OrderStatus } from '../types';

interface CartStore {
  items: CartItem[];
  order: Order | null;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setOrder: (order: Order) => void;
  updateOrderStatus: (status: OrderStatus) => void;
  updateOrderPayment: (paymentId: string) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      order: null,

      addItem: (product) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      setOrder: (order) => set({ order }),

      updateOrderStatus: (status) =>
        set((s) => ({ order: s.order ? { ...s.order, status } : null })),

      updateOrderPayment: (paymentId) =>
        set((s) => ({ order: s.order ? { ...s.order, paymentId } : null })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'prajapati-cart' }
  )
);

export const createOrder = (
  items: CartItem[],
  details: OrderDetails,
  total: number
): Order => ({
  id: `PM${Date.now()}`,
  items,
  details,
  total,
  status: 'placed',
  createdAt: new Date().toISOString(),
});
