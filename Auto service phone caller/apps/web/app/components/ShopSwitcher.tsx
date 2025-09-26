"use client";

import { useShop } from "../contexts/ShopContext";
import { Select } from "./ui";

export function ShopSwitcher() {
  const { shops, selectedShopId, setSelectedShopId, loading } = useShop();

  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Current Shop</label>
      <Select
        className="w-full"
        value={selectedShopId ?? undefined}
        onChange={(e) => setSelectedShopId(Number(e.target.value))}
        disabled={loading || !shops?.length}
      >
        {!shops?.length ? (
          <option value="">{loading ? "Loading shops..." : "No shops available"}</option>
        ) : (
          shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))
        )}
      </Select>
      {shops?.length > 0 && selectedShopId && (
        <div className="mt-2 text-xs text-slate-500">
          Plan: {shops.find(s => s.id === selectedShopId)?.plan || 'Unknown'}
        </div>
      )}
    </div>
  );
}
