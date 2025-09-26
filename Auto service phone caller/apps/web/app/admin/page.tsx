"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { listShopsAdmin, updateShopPlan } from "../lib/api";
import { PageHeader, Card, CardHeader, CardBody, Input, Button, Table, THead, TRow, TH, TD, Select, Spinner, EmptyState } from "../components/ui";

export default function AdminPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const email = session?.user?.email || "";
  const adminEmail = process.env.NEXT_PUBLIC_SHOW_ADMIN ? (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "") : "";

  const allowed = adminEmail && email?.toLowerCase() === adminEmail.toLowerCase();

  const { data: shops, mutate: refreshShops } = useSWR(
    token && allowed ? ["shops-admin", token] : null,
    ([, tok]) => listShopsAdmin(tok as string)
  );

  const [creating, setCreating] = useState(false);

  async function handleProvision(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allowed) return;
    const form = e.currentTarget as any;
    const shop_name = (form.shop_name.value || "").trim();
    const name = (form.name.value || "").trim();
    const owner_email = (form.owner_email.value || "").trim();
    const password = (form.password.value || "").trim();
    if (!shop_name || !owner_email || !password) return;
    setCreating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_name, name, email: owner_email, password }),
      });
      if (!res.ok) throw new Error("Signup failed");
      await refreshShops();
      form.reset();
      alert("Tenant and owner created.");
    } catch (e) {
      alert("Failed to create tenant");
    } finally {
      setCreating(false);
    }
  }

  async function handlePlanChange(shopId: number, plan: string) {
    if (!token) return;
    await updateShopPlan(shopId, plan, token);
    await refreshShops();
  }

  if (!allowed) {
    return <div className="text-sm text-red-700">Access denied. Admin only.</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Admin Console" />

      <Card>
        <CardHeader title="Provision New Tenant" />
        <CardBody>
          <form onSubmit={handleProvision} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Shop Name</label>
              <Input name="shop_name" required />
            </div>
            <div>
              <label className="block text-sm">Owner Name</label>
              <Input name="name" />
            </div>
            <div>
              <label className="block text-sm">Owner Email</label>
              <Input type="email" name="owner_email" required />
            </div>
            <div>
              <label className="block text-sm">Owner Password</label>
              <Input type="password" name="password" required />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Tenant"}</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="All Tenants" />
        <CardBody className="p-0">
          {!shops ? (
            <div className="flex items-center justify-center py-10"><Spinner /></div>
          ) : !shops.length ? (
            <EmptyState title="No tenants yet" />
          ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>ID</TH>
                  <TH>Name</TH>
                  <TH>Plan</TH>
                </TRow>
              </THead>
              <tbody>
                {shops?.map((s: any) => (
                  <TRow key={s.id}>
                    <TD>{s.id}</TD>
                    <TD>{s.name}</TD>
                    <TD>
                      <Select value={s.plan} onChange={(e) => handlePlanChange(s.id, (e.target as HTMLSelectElement).value)}>
                        <option value="basic_answer">Basic Answer</option>
                        <option value="assistant_calendar">Assistant + Calendar</option>
                        <option value="assistant_outbound">Assistant + Outbound</option>
                        <option value="service_shop">Service Shop (Full)</option>
                      </Select>
                    </TD>
                  </TRow>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
