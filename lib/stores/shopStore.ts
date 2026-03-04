import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DressStub } from "@/lib/types/dress";

/* ─── Slice: Active Filters ──────────────────────────────────────────────── */

export interface FilterState {
  sizes: string[];
  colors: string[];
  stores: string[];
  // Actions
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  toggleStore: (store: string) => void;
  clearFilters: () => void;
}

/* ─── Slice: Fitting Room (Shadow Cart) ──────────────────────────────────── */

export interface FittingRoomState {
  items: DressStub[];
  sessionToken: string | null;
  // Actions
  addItem: (dress: DressStub) => void;
  removeItem: (dressId: string) => void;
  clearRoom: () => void;
  setSessionToken: (token: string) => void;
  isInRoom: (dressId: string) => boolean;
}

/* ─── Slice: Wishlist (Optimistic, auth-gated) ───────────────────────────── */

export interface WishlistState {
  dressIds: string[];
  // Actions
  addToWishlist: (dressId: string) => void;
  removeFromWishlist: (dressId: string) => void;
  toggleWishlist: (dressId: string) => void;
  isWishlisted: (dressId: string) => boolean;
}

/* ─── Combined Store ─────────────────────────────────────────────────────── */

export type ShopStore = FilterState & FittingRoomState & WishlistState;

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      /* ── Filters ── */
      sizes: [],
      colors: [],
      stores: [],

      toggleSize: (size) => set((s) => ({ sizes: toggle(s.sizes, size) })),
      toggleColor: (color) => set((s) => ({ colors: toggle(s.colors, color) })),
      toggleStore: (store) => set((s) => ({ stores: toggle(s.stores, store) })),
      clearFilters: () => set({ sizes: [], colors: [], stores: [] }),

      /* ── Fitting Room ── */
      items: [],
      sessionToken: null,

      addItem: (dress) =>
        set((s) => {
          if (s.items.some((i) => i.id === dress.id)) return s;
          return { items: [...s.items, dress] };
        }),

      removeItem: (dressId) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== dressId) })),

      clearRoom: () => set({ items: [] }),

      setSessionToken: (token) => set({ sessionToken: token }),

      isInRoom: (dressId) => get().items.some((i) => i.id === dressId),

      /* ── Wishlist ── */
      dressIds: [],

      addToWishlist: (dressId) =>
        set((s) => {
          if (s.dressIds.includes(dressId)) return s;
          return { dressIds: [...s.dressIds, dressId] };
        }),

      removeFromWishlist: (dressId) =>
        set((s) => ({ dressIds: s.dressIds.filter((id) => id !== dressId) })),

      toggleWishlist: (dressId) => {
        const { dressIds } = get();
        if (dressIds.includes(dressId)) {
          set((s) => ({ dressIds: s.dressIds.filter((id) => id !== dressId) }));
        } else {
          set((s) => ({ dressIds: [...s.dressIds, dressId] }));
        }
      },

      isWishlisted: (dressId) => get().dressIds.includes(dressId),
    }),
    {
      name: "top10prom-shop",
      storage: createJSONStorage(() => localStorage),
      // Only persist fitting room items, session token, and wishlist — not filters
      partialize: (state) => ({
        items: state.items,
        sessionToken: state.sessionToken,
        dressIds: state.dressIds,
      }),
    }
  )
);
