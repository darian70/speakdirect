"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { listShops } from "../lib/api";

type Shop = { id: number; name: string; plan: string };

type ShopContextType = {
  shops: Shop[];
  selectedShopId: number | null;
  setSelectedShopId: (id: number | null) => void;
  loading: boolean;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const defaultShopId = session?.defaultShopId as number | null | undefined;

  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load shops
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await listShops(token);
        if (!mounted) return;
        setShops(data);
        // Determine initial selection
        const stored = typeof window !== "undefined" ? window.localStorage.getItem("selectedShopId") : null;
        const parsed = stored ? Number(stored) : null;
        const firstId = data?.[0]?.id ?? null;
        const newId = parsed || defaultShopId || firstId || null;
        setSelectedShopId(newId);
      } catch (e) {
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (token) load();
    else {
      setShops([]);
      setSelectedShopId(null);
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [token, defaultShopId]);

  // Persist selection
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedShopId != null) {
      window.localStorage.setItem("selectedShopId", String(selectedShopId));
    }
  }, [selectedShopId]);

  const value = useMemo(() => ({ shops, selectedShopId, setSelectedShopId, loading }), [shops, selectedShopId, loading]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
