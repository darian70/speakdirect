"use client";

export const dynamic = 'force-dynamic';

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { listShops, listShopsAdmin, createShop } from "../../lib/api";
import { PageHeader, Card, CardHeader, CardBody, Table, THead, TRow, TH, TD, Button, Input, Select, Spinner, EmptyState } from "../../components/ui";

const plans = [
  { value: "basic_answer", label: "Basic Answer" },
  { value: "assistant_calendar", label: "Assistant + Calendar" },
  { value: "assistant_outbound", label: "Assistant + Outbound" },
  { value: "service_shop", label: "Service Shop (Full)" },
];

export default function AdminPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;

  const { data: myShops } = useSWR(token ? ["shops", token] : null, ([, tok]) => listShops(tok as string));
  const { data: adminShops, mutate: refreshAdmin } = useSWR(token ? ["shopsAdmin", token] : null, ([, tok]) => listShopsAdmin(tok as string), { shouldRetryOnError: false });

  const [name, setName] = useState("");
  const [plan, setPlan] = useState("service_shop");
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !name) return;
    setSaving(true);
    try {
      await createShop(name, plan, token);
      setName("");
      await refreshAdmin();
      alert("Shop created. Assign users via database or forthcoming Users page.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Admin" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="My Shops" />
          <CardBody className="p-0">
            {!myShops ? (
              <div className="flex items-center justify-center py-10"><Spinner /></div>
            ) : !myShops.length ? (
              <EmptyState title="No shops yet" />
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
                  {myShops?.map((s: any) => (
                    <TRow key={s.id}>
                      <TD>{s.id}</TD>
                      <TD>{s.name}</TD>
                      <TD>{s.plan}</TD>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="All Shops (Admin)" />
          <CardBody>
            <form className="space-y-3" onSubmit={handleCreate}>
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Auto" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Plan</label>
                <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
                  {plans.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </Select>
              </div>
              <div>
                <Button type="submit" disabled={saving}>Create Shop</Button>
              </div>
              <div className="text-xs text-slate-500">Only works if your email matches ADMIN_EMAIL. Otherwise this form will error.</div>
            </form>

            <div className="mt-6">
              {!adminShops ? (
                <div className="flex items-center justify-center py-6"><Spinner /></div>
              ) : (Array.isArray(adminShops) && adminShops.length > 0) ? (
                <Table>
                  <THead>
                    <TRow>
                      <TH>ID</TH>
                      <TH>Name</TH>
                      <TH>Plan</TH>
                    </TRow>
                  </THead>
                  <tbody>
                    {adminShops?.map((s: any) => (
                      <TRow key={s.id}>
                        <TD>{s.id}</TD>
                        <TD>{s.name}</TD>
                        <TD>{s.plan}</TD>
                      </TRow>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <EmptyState title="Not authorized or no shops" />
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
