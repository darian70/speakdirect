"use client";

export const dynamic = 'force-dynamic';

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useShop } from "../../contexts/ShopContext";
import { listCustomers, createCustomer } from "../../lib/api";
import { PageHeader, Card, CardHeader, CardBody, Table, THead, TRow, TH, TD, Button, Input, Select, Spinner, EmptyState } from "../../components/ui";

export default function CustomersPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { shops, selectedShopId } = useShop();
  const shop = useMemo(() => shops?.find((s) => s.id === selectedShopId) || null, [shops, selectedShopId]);

  const { data: customers, mutate: refreshCustomers } = useSWR(
    token && selectedShopId ? ["customers", selectedShopId, token] : null,
    ([, s, tok]) => listCustomers(s as number, tok as string)
  );

  const [form, setForm] = useState({ name: "", phone: "", preferred_language: "" });
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShopId || !token) return;
    if (!form.name || !form.phone) return;
    setSaving(true);
    try {
      await createCustomer(selectedShopId, form.name, form.phone, form.preferred_language || undefined, token);
      setForm({ name: "", phone: "", preferred_language: "" });
      await refreshCustomers();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="New Customer" />
          <CardBody>
            <form className="space-y-3" onSubmit={handleCreate}>
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., John Smith" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Phone (E.164)</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+15551234567" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Preferred language</label>
                <Input value={form.preferred_language} onChange={(e) => setForm({ ...form, preferred_language: e.target.value })} placeholder="en" />
              </div>
              <div>
                <Button type="submit" disabled={!selectedShopId || saving}>Create Customer</Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader title="Customer List" />
          <CardBody className="p-0">
            {!customers ? (
              <div className="flex items-center justify-center py-10"><Spinner /></div>
            ) : !customers.length ? (
              <EmptyState title="No customers yet" />
            ) : (
              <Table>
                <THead>
                  <TRow>
                    <TH>Name</TH>
                    <TH>Phone</TH>
                    <TH>Language</TH>
                  </TRow>
                </THead>
                <tbody>
                  {customers?.map((c) => (
                    <TRow key={(c as any).id}>
                      <TD>{(c as any).name}</TD>
                      <TD>{(c as any).phone}</TD>
                      <TD>{(c as any).preferred_language || ""}</TD>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
