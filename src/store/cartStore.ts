import { create } from 'zustand';
import type { CartItem, Book } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

function loadCart(): CartItem[] {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),

  addItem: (book: Book) => {
    set((state) => {
      const existing = state.items.find(item => item.book.id === book.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map(item =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...state.items, { book, quantity: 1 }];
      }
      saveCart(newItems);
      return { items: newItems };
    });
  },

  removeItem: (bookId: number) => {
    set((state) => {
      const newItems = state.items.filter(item => item.book.id !== bookId);
      saveCart(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (bookId: number, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.book.id !== bookId);
        saveCart(newItems);
        return { items: newItems };
      }
      const newItems = state.items.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  },
}));
