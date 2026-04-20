import { createContext, useState} from "react";
import type { ReactNode } from "react";
import type { Game } from "../types";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CartItem {
  game: Game;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (game: Game) => void;
  removeItem: (gameId: number) => void;
  updateQty: (gameId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (game: Game) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.game.id === game.id);
      if (existing) {
        return prev.map((i) =>
          i.game.id === game.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { game, qty: 1 }];
    });
  };

  const removeItem = (gameId: number) => {
    setItems((prev) => prev.filter((i) => i.game.id !== gameId));
  };

  const updateQty = (gameId: number, qty: number) => {
    if (qty <= 0) {
      removeItem(gameId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.game.id === gameId ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.game.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };