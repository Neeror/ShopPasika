"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product, StockStatus } from "@/data/products";
import { canBuy } from "@/data/products";

type CartLine = {
  product: Product;
  quantity: number;
};

type Store = {
  cart: CartLine[];
  favorites: number[];
  statuses: Record<number, StockStatus>;
  statusOf: (product: Product) => StockStatus;
  setStatus: (id: number, status: StockStatus) => void;
  addToCart: (product: Product) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  toggleFavorite: (id: number) => void;
  clearCart: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function AppState({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StockStatus>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("pasika-cart") ?? "[]"));
      setFavorites(JSON.parse(localStorage.getItem("pasika-favorites") ?? "[]"));
      setStatuses(JSON.parse(localStorage.getItem("pasika-stock") ?? "{}"));
    } catch {
      setCart([]);
      setFavorites([]);
      setStatuses({});
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("pasika-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("pasika-favorites", JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("pasika-stock", JSON.stringify(statuses));
  }, [statuses, hydrated]);

  const value = useMemo<Store>(() => {
    const statusOf = (product: Product): StockStatus => statuses[product.id] ?? product.stock;

    return {
      cart,
      favorites,
      statuses,
      statusOf,
      setStatus: (id, status) => setStatuses((current) => ({ ...current, [id]: status })),
      addToCart: (product) => {
        if (!canBuy(statusOf(product))) return;
        setCart((current) => {
          const existing = current.find((line) => line.product.id === product.id);
          if (existing) {
            return current.map((line) =>
              line.product.id === product.id
                ? { ...line, quantity: Math.min(line.quantity + 1, 99) }
                : line,
            );
          }
          return [...current, { product, quantity: 1 }];
        });
      },
      setQuantity: (id, quantity) =>
        setCart((current) => {
          if (quantity <= 0) return current.filter((line) => line.product.id !== id);
          return current.map((line) =>
            line.product.id === id ? { ...line, quantity: Math.min(quantity, 99) } : line,
          );
        }),
      removeFromCart: (id) => setCart((current) => current.filter((line) => line.product.id !== id)),
      toggleFavorite: (id) =>
        setFavorites((current) =>
          current.includes(id)
            ? current.filter((favoriteId) => favoriteId !== id)
            : [...current, id],
        ),
      clearCart: () => setCart([]),
    };
  }, [cart, favorites, statuses]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside AppState");
  return store;
}
