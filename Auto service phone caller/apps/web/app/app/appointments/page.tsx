"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useShop } from "../../contexts/ShopContext";
import { listCustomers, listAppointments, createAppointment, triggerAppointmentReminder } from "../../lib/api";
import { PageHeader, Card, CardHeader, CardBody, Table, THead, TRow, TH, TD, Button, Input, Select, Spinner, EmptyState } from "../../components/ui";

export default function AppointmentsPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { shops, selectedShopId } = useShop();

  const { data: customers } = useSWR(
    token && selectedShopId ? ["customers", selectedShopId, token] : null,
    ([, s, tok]) => listCustomers(s as number, tok as string)
  );

  const { data: appts, mutate: refreshAppts } = useSWR(
    token && selectedShopId ? ["appointments", selectedShopId, token] : null,
    ([, s, tok]) => listAppointments(s as number, tok as string)
  );

  const [form, setForm] = useState<{ customer_id: string; starts_at: string; ends_at: string; location: string; notes: string }>(
    { customer_id: "", starts_at: "", ends_at: "", location: "", notes: "" }
  );
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShopId || !token) return;
    if (!form.customer_id || !form.starts_at) return;
    setSaving(true);
    try {
      await createAppointment({
        shop_id: selectedShopId,
        customer_id: Number(form.customer_id),
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : undefined,
        location: form.location || undefined,
        notes: form.notes || undefined,
      }, token);
      setForm({ customer_id: "", starts_at: "", ends_at: "", location: "", notes: "" });
      await refreshAppts();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemind(id: number) {
    if (!token) return;
    await triggerAppointmentReminder(id, token);
    alert("Reminder enqueued");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="New Appointment" />
          <CardBody>
            <form className="space-y-3" onSubmit={handleCreate}>
              <div>
                <label className="text-sm text-slate-600">Customer</label>
                <Select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
                  <option value="">Select...</option>
                  {customers?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-600">Starts At</label>
                <Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Ends At</label>
                <Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Location</label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="123 Main St" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Notes</label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Oil change, tire rotation" />
              </div>
              <div>
                <Button type="submit" disabled={!selectedShopId || saving}>Create Appointment</Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader title="Upcoming Appointments" />
          <CardBody className="p-0">
            {!appts ? (
              <div className="flex items-center justify-center py-10"><Spinner /></div>
            ) : !appts.length ? (
              <EmptyState title="No appointments yet" />
            ) : (
              <Table>
                <THead>
                  <TRow>
                    <TH>When</TH>
                    <TH>Customer</TH>
                    <TH>Status</TH>
                    <TH>Location</TH>
                    <TH>Actions</TH>
                  </TRow>
                </THead>
                <tbody>
                  {appts?.map((a: any) => (
                    <TRow key={a.id}>
                      <TD className="whitespace-nowrap">{new Date(a.starts_at).toLocaleString()}</TD>
                      <TD>{a.customer_id}</TD>
                      <TD>{a.status}</TD>
                      <TD>{a.location || ""}</TD>
                      <TD>
                        <Button size="sm" variant="outline" onClick={() => handleRemind(a.id)}>Remind</Button>
                      </TD>
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
