"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = { productId: number; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  loaded: boolean;
  quantityOf: (productId: number) => number;
  add: (productId: number, quantity: number, max: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const KEY = "mercadotech-cart";
const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(v: unknown): v is CartItem {
  const item = v as CartItem;
  return (
    !!item &&
    Number.isSafeInteger(item.productId) &&
    item.productId > 0 &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(parsed)) setItems(parsed.filter(isCartItem));
    } catch {
      // Almacenamiento no disponible o dañado: se empieza con el carrito vacío.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // Sin almacenamiento el carrito dura lo que dure la pestaña.
    }
  }, [items, loaded]);

  const add = useCallback((productId: number, quantity: number, max: number) => {
    setItems((prev) => {
      const current = prev.find((i) => i.productId === productId)?.quantity ?? 0;
      const next = Math.min(current + quantity, max, 99);
      if (next <= current) return prev;
      return current
        ? prev.map((i) => (i.productId === productId ? { ...i, quantity: next } : i))
        : [...prev, { productId, quantity: next }];
    });
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(quantity, 99) } : i)),
    );
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      loaded,
      count: items.reduce((n, i) => n + i.quantity, 0),
      quantityOf: (id) => items.find((i) => i.productId === id)?.quantity ?? 0,
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, loaded, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
