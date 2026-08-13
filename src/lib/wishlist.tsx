"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Product } from "./products";

interface WishlistContextValue {
  items: string[];
  count: number;
  isWishlisted: (slug: string) => boolean;
  toggle: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "houseofmerola-wishlist";

/* Module-level store, hydrated from localStorage on first client read. */
let slugs: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function getSnapshot(): string[] {
  if (!loaded) {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      slugs = raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      slugs = [];
    }
  }
  return slugs;
}

function getServerSnapshot(): string[] {
  return [];
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist(next: string[]) {
  slugs = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isWishlisted = useCallback(
    (slug: string) => getSnapshot().includes(slug),
    [],
  );

  const toggle = useCallback((product: Product) => {
    const current = getSnapshot();
    persist(
      current.includes(product.slug)
        ? current.filter((s) => s !== product.slug)
        : [...current, product.slug],
    );
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, count: items.length, isWishlisted, toggle }),
    [items, isWishlisted, toggle],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
