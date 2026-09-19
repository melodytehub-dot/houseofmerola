"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { type Product } from "./products";

export interface CartItem {
  key: string; // composite key: slug + variant, so variants are separate lines
  slug: string;
  name: string;
  price: number; // final price (includes any variant deltas)
  image: string;
  qty: number;
  variant?: string; // human-readable selection, e.g. "UV-printed ceramic · 15 × 15 cm"
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    product: Product,
    qty?: number,
    variant?: { label: string; price: number },
  ) => void;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "houseofmerola-cart";

interface CartSnapshot {
  items: CartItem[];
}

const EMPTY_SNAPSHOT: CartSnapshot = { items: [] };

/* Module-level store, hydrated from localStorage on first client read. */
let snapshot: CartSnapshot = EMPTY_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): CartSnapshot {
  try {
    const rawItems = window.localStorage.getItem(STORAGE_KEY);
    const stored: CartItem[] = rawItems ? JSON.parse(rawItems) : [];
    // Normalise pre-variant carts so the dedupe key always exists.
    const items: CartItem[] = stored.map((item) => ({
      ...item,
      key: item.key ?? item.slug,
    }));
    return { items };
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function getSnapshot(): CartSnapshot {
  if (!loaded) {
    loaded = true;
    snapshot = readStorage();
  }
  return snapshot;
}

function getServerSnapshot(): CartSnapshot {
  return EMPTY_SNAPSHOT;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) {
      snapshot = readStorage();
      listeners.forEach((l) => l());
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function persist(next: CartSnapshot) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.items));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const open = useSyncExternalStore(subscribeOpen, getOpenSnapshot, getOpenSnapshot);

  const addItem = useCallback(
    (
      product: Product,
      qty = 1,
      variant?: { label: string; price: number },
    ) => {
      const current = getSnapshot();
      const key = variant ? `${product.slug}::${variant.label}` : product.slug;
      const existing = current.items.find((item) => item.key === key);
      let items: CartItem[];
      if (existing) {
        items = current.items.map((item) =>
          item.key === key
            ? { ...item, qty: Math.min(99, item.qty + qty) }
            : item,
        );
      } else {
        items = [
          ...current.items,
          {
            key,
            slug: product.slug,
            name: product.name,
            price: variant ? variant.price : product.price,
            image: product.image,
            qty,
            variant: variant?.label,
          },
        ];
      }
      persist({ ...current, items });
    },
    [],
  );

  const removeItem = useCallback((key: string) => {
    const current = getSnapshot();
    persist({
      ...current,
      items: current.items.filter((item) => item.key !== key),
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    const current = getSnapshot();
    persist({
      ...current,
      items:
        qty <= 0
          ? current.items.filter((item) => item.key !== key)
          : current.items.map((item) =>
              item.key === key ? { ...item, qty: Math.min(99, qty) } : item,
            ),
    });
  }, []);

  const clearCart = useCallback(() => {
    persist({ ...getSnapshot(), items: [] });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = store.items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = store.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const total = subtotal;
    return {
      items: store.items,
      count,
      subtotal,
      total,
      isOpen: open,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQty,
      clearCart,
    };
  }, [
    store,
    open,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* Drawer open state, kept local to the provider. */
let isOpen = false;
const openListeners = new Set<() => void>();

function getOpenSnapshot() {
  return isOpen;
}

function subscribeOpen(listener: () => void): () => void {
  openListeners.add(listener);
  return () => openListeners.delete(listener);
}

function setIsOpen(next: boolean) {
  isOpen = next;
  openListeners.forEach((l) => l());
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
