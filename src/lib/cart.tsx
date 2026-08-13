"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DISCOUNT_CODES, type Product } from "./products";

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  discountCode: string | null;
  discountPercent: number;
  discountAmount: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "houseofmerola-cart";
const DISCOUNT_KEY = "houseofmerola-discount";

interface CartSnapshot {
  items: CartItem[];
  discountCode: string | null;
}

const EMPTY_SNAPSHOT: CartSnapshot = { items: [], discountCode: null };

/* Module-level store, hydrated from localStorage on first client read. */
let snapshot: CartSnapshot = EMPTY_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): CartSnapshot {
  try {
    const rawItems = window.localStorage.getItem(STORAGE_KEY);
    const items: CartItem[] = rawItems ? JSON.parse(rawItems) : [];
    return {
      items,
      discountCode: window.localStorage.getItem(DISCOUNT_KEY),
    };
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
    if (e.key === null || e.key === STORAGE_KEY || e.key === DISCOUNT_KEY) {
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
    if (next.discountCode) {
      window.localStorage.setItem(DISCOUNT_KEY, next.discountCode);
    } else {
      window.localStorage.removeItem(DISCOUNT_KEY);
    }
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const open = useSyncExternalStore(subscribeOpen, getOpenSnapshot, getOpenSnapshot);

  const addItem = useCallback((product: Product, qty = 1) => {
    const current = getSnapshot();
    const existing = current.items.find((item) => item.slug === product.slug);
    let items: CartItem[];
    if (existing) {
      items = current.items.map((item) =>
        item.slug === product.slug
          ? { ...item, qty: Math.min(99, item.qty + qty) }
          : item,
      );
    } else {
      items = [
        ...current.items,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          qty,
        },
      ];
    }
    persist({ ...current, items });
  }, []);

  const removeItem = useCallback((slug: string) => {
    const current = getSnapshot();
    persist({
      ...current,
      items: current.items.filter((item) => item.slug !== slug),
    });
  }, []);

  const updateQty = useCallback((slug: string, qty: number) => {
    const current = getSnapshot();
    persist({
      ...current,
      items:
        qty <= 0
          ? current.items.filter((item) => item.slug !== slug)
          : current.items.map((item) =>
              item.slug === slug ? { ...item, qty: Math.min(99, qty) } : item,
            ),
    });
  }, []);

  const clearCart = useCallback(() => {
    persist({ ...getSnapshot(), items: [] });
  }, []);

  const applyDiscount = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const percent = DISCOUNT_CODES[normalized];
    if (!percent) return false;
    persist({ ...getSnapshot(), discountCode: normalized });
    return true;
  }, []);

  const removeDiscount = useCallback(() => {
    persist({ ...getSnapshot(), discountCode: null });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = store.items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = store.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const discountPercent = store.discountCode
      ? DISCOUNT_CODES[store.discountCode] ?? 0
      : 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;
    return {
      items: store.items,
      count,
      subtotal,
      discountCode: store.discountCode,
      discountPercent,
      discountAmount,
      total,
      isOpen: open,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQty,
      clearCart,
      applyDiscount,
      removeDiscount,
    };
  }, [
    store,
    open,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    applyDiscount,
    removeDiscount,
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
