"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import React from "react";
import { ShopProvider, useShop } from "../contexts/ShopContext";
import { ShopSwitcher } from "../components/ShopSwitcher";
import { HeaderUser } from "../components/HeaderUser";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { hasFeature } from "../lib/entitlements";

function NavLinks({ isActive }: { isActive: (href: string) => boolean }) {
  const { shops, selectedShopId } = useShop();
  const plan = shops?.find((s) => s.id === selectedShopId)?.plan;
  const LinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(href) ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <>
      <LinkItem href="/app/calls">📞 Calls</LinkItem>
      {hasFeature(plan, "technician_ui") && <LinkItem href="/app/service">🔧 Service</LinkItem>}
      <LinkItem href="/app/customers">👤 Customers</LinkItem>
      {hasFeature(plan, "appointments") && <LinkItem href="/app/appointments">🗓️ Appointments</LinkItem>}
      <LinkItem href="/app/settings">⚙️ Settings</LinkItem>
      <LinkItem href="/app/admin">🛡️ Admin</LinkItem>
      <LinkItem href="/app/admin/usage">📊 Usage</LinkItem>
      <LinkItem href="/app/admin/users">👥 Admin Users</LinkItem>
      {!hasFeature(plan, "technician_ui") && (
        <div className="px-3 pt-2 text-xs text-slate-500">
          Looking for full Service dashboard? <Link href="/app/settings/onboarding" className="text-slate-900 underline">Upgrade plan</Link>
        </div>
      )}
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href);
  return (
    <SessionProvider>
      <ShopProvider>
        <div className="min-h-screen bg-slate-50 flex">
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="text-lg font-semibold text-slate-900 tracking-tight">Workspace</div>
              <div className="mt-4">
                <ShopSwitcher />
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <NavLinks isActive={isActive} />
            </nav>
          </aside>
          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Tenant Dashboard</div>
                <HeaderUser />
              </div>
            </header>
            <div className="flex-1 p-6 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </ShopProvider>
    </SessionProvider>
  );
}
