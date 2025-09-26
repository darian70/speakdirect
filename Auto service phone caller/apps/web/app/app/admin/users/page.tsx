"use client";

export const dynamic = 'force-dynamic';

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";
import { useShop } from "../../../contexts/ShopContext";
import { listUsers, createUser } from "../../../lib/api";
import { PageHeader, Card, CardHeader, CardBody, Table, THead, TRow, TH, TD, Button, Input, Select, Spinner, EmptyState } from "../../../components/ui";

const ROLES = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "tech", label: "Technician" },
  { value: "viewer", label: "Viewer" },
];

export default function AdminUsersPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { shops, selectedShopId } = useShop();
  const shop = useMemo(() => shops?.find((s) => s.id === selectedShopId) || null, [shops, selectedShopId]);

  const { data: users, error, mutate: refreshUsers } = useSWR(
    token && selectedShopId ? ["users", selectedShopId, token] : null,
    ([, s, tok]) => listUsers(s as number, tok as string)
  );

  const [form, setForm] = useState({ email: "", name: "", role: "tech", password: "" });
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    if (!selectedShopId || !token) return;
    if (!form.email || !form.name) return;
    setSaving(true);
    try {
      await createUser(selectedShopId, {
        email: form.email,
        name: form.name,
        role: form.role,
        password: form.password || undefined,
      }, token);
      setForm({ email: "", name: "", role: "tech", password: "" });
      await refreshUsers();
    } catch (e: any) {
      setErrMsg("Not authorized or invalid input.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin • Users"
        actions={<Link href="/app/admin"><Button variant="outline">Back to Admin</Button></Link>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Create User" subtitle="Owners and Admins can invite users to this shop." />
          <CardBody>
            <form className="space-y-3" onSubmit={handleCreate}>
              <div>
                <label className="text-sm text-slate-600">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Role</label>
                <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-600">Temporary Password (optional)</label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Set or leave blank" />
              </div>
              {errMsg && <div className="text-sm text-red-600">{errMsg}</div>}
              <div>
                <Button type="submit" disabled={!selectedShopId || saving}>Create</Button>
              </div>
              <div className="text-xs text-slate-500">You must be an owner or admin to create users.</div>
            </form>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader title={`Users ${shop ? `• ${shop.name}` : ""}`} />
          <CardBody className="p-0">
            {!users ? (
              <div className="flex items-center justify-center py-10"><Spinner /></div>
            ) : !users.length ? (
              <EmptyState title="No users yet" />
            ) : (
              <Table>
                <THead>
                  <TRow>
                    <TH>Email</TH>
                    <TH>Name</TH>
                    <TH>Role</TH>
                    <TH>Joined</TH>
                  </TRow>
                </THead>
                <tbody>
                  {users?.map((u: any) => (
                    <TRow key={u.id}>
                      <TD>{u.email}</TD>
                      <TD>{u.name}</TD>
                      <TD>{u.role}</TD>
                      <TD>{u.created_at ? new Date(u.created_at).toLocaleString() : ""}</TD>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Plan-based access levels" subtitle="Capabilities vary by plan. Upgrade in Settings → Onboarding." />
        <CardBody>
          <ul className="list-disc pl-6 text-sm text-slate-700 space-y-1">
            <li><b>Basic Answer</b>: inbound answering, call logs.</li>
            <li><b>Assistant + Calendar</b>: + appointments scheduling.</li>
            <li><b>Assistant + Outbound</b>: + outbound reminders.</li>
            <li><b>Service Shop (Full)</b>: + job update calling, full technician dashboard.</li>
          </ul>
          <div className="text-xs text-slate-500 mt-2">
            Usage limits (call minutes, monthly outbound caps) can be applied per plan. Contact admin to adjust.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
