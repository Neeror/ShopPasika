"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

type CartLine = {
  product: Product;
  quantity: number;
};

type Store = {
  cart: CartLine[];
  favorites: number[];
  customProducts: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  addProduct: (draft: Omit<Product, "id" | "reviewsList">) => number;
  setQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  toggleFavorite: (id: number) => void;
  clearCart: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function AppState({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("pasika-cart") ?? "[]"));
      setFavorites(JSON.parse(localStorage.getItem("pasika-favorites") ?? "[]"));
      setCustomProducts(JSON.parse(localStorage.getItem("pasika-products") ?? "[]"));
    } catch {
      setCart([]);
      setFavorites([]);
      setCustomProducts([]);
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
    if (hydrated) localStorage.setItem("pasika-products", JSON.stringify(customProducts));
  }, [customProducts, hydrated]);

  const value = useMemo<Store>(() => ({
    cart,
    favorites,
    customProducts,
    addToCart: (product, quantity = 1) => setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) => line.product.id === product.id
          ? { ...line, quantity: Math.min(line.quantity + quantity, 99) }
          : line);
      }
      return [...current, { product, quantity: Math.min(Math.max(quantity, 1), 99) }];
    }),
    addProduct: (draft) => {
      const id = Date.now();
      setCustomProducts((current) => [{ ...draft, id, reviewsList: [] }, ...current]);
      return id;
    },
    setQuantity: (id, quantity) => setCart((current) => {
      if (quantity <= 0) return current.filter((line) => line.product.id !== id);
      return current.map((line) => line.product.id === id
        ? { ...line, quantity: Math.min(quantity, 99) }
        : line);
    }),
    removeFromCart: (id) => setCart((current) => current.filter((line) => line.product.id !== id)),
    toggleFavorite: (id) => setFavorites((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]),
    clearCart: () => setCart([]),
  }), [cart, favorites, customProducts]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside AppState");
  return store;
}
