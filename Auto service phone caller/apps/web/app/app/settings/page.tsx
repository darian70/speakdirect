"use client";

export const dynamic = 'force-dynamic';

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useShop } from "../../contexts/ShopContext";
import { listPhoneNumbers, createPhoneNumber, listAgents, createAgent, updateShopPlan, updateShopSettings } from "../../lib/api";
import { PageHeader, Card, CardHeader, CardBody, Select, Input, Button, Table, THead, TRow, TH, TD, Spinner, EmptyState } from "../../components/ui";
import Link from "next/link";

const plans = [
  { value: "basic_answer", label: "Basic Answer" },
  { value: "assistant_calendar", label: "Assistant + Calendar" },
  { value: "assistant_outbound", label: "Assistant + Outbound" },
  { value: "service_shop", label: "Service Shop (Full)" },
];

export default function SettingsAppPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { shops, selectedShopId } = useShop();

  const shop = useMemo(() => shops?.find((s) => s.id === selectedShopId) || null, [shops, selectedShopId]);

  const { data: phoneNumbers, mutate: refreshNumbers } = useSWR(
    token && selectedShopId ? ["phoneNumbers", selectedShopId, token] : null,
    ([, s, tok]) => listPhoneNumbers(s as number, tok as string)
  );

  const { data: agents, mutate: refreshAgents } = useSWR(
    token && selectedShopId ? ["agents", selectedShopId, token] : null,
    ([, s, tok]) => listAgents(s as number, tok as string)
  );

  const [saving, setSaving] = useState(false);

  async function handlePlanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!selectedShopId || !token) return;
    setSaving(true);
    try {
      await updateShopPlan(selectedShopId, e.target.value, token);
    } finally {
      setSaving(false);
    }
  }

  async function handleSettingsSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedShopId || !token) return;
    const form = e.currentTarget as any;
    const record_calls = !!form.record_calls.checked;
    const default_timezone = (form.default_timezone.value || "").trim() || undefined;
    setSaving(true);
    try {
      await updateShopSettings(selectedShopId, { record_calls, default_timezone }, token);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNumber() {
    if (!selectedShopId || !token) return;
    const number = prompt("E.164 number (e.g., +15551234567)") || "";
    if (!number) return;
    const provider = prompt("Provider (e.g., twilio)") || undefined;
    const friendly_name = prompt("Friendly name") || undefined;
    await createPhoneNumber({ shop_id: selectedShopId, number, provider, friendly_name }, token);
    await refreshNumbers();
  }

  async function handleAddAgent() {
    if (!selectedShopId || !token) return;
    const name = prompt("Agent name") || "";
    if (!name) return;
    const type = "phone";
    const voice_id = prompt("Voice ID (optional)") || undefined;
    const promptText = prompt("Prompt (optional)") || undefined;
    await createAgent({ shop_id: selectedShopId, name, type, voice_id, prompt: promptText }, token);
    await refreshAgents();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        actions={<Link href="/app/settings/onboarding"><Button variant="outline">Run Onboarding</Button></Link>}
      />

      <Card>
        <CardHeader title="Plan" />
        <CardBody>
          <div className="flex items-center gap-3">
            <Select value={shop?.plan || ""} onChange={handlePlanChange} disabled={!shop || saving}>
              {plans.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
            {saving && <span className="text-slate-500 text-sm">Saving...</span>}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Defaults" />
        <CardBody>
          <form onSubmit={handleSettingsSave} className="space-y-3">
            <div className="flex items-center gap-2">
              <input id="record_calls" name="record_calls" type="checkbox" defaultChecked={true} />
              <label htmlFor="record_calls">Record calls</label>
            </div>
            <div>
              <label className="block text-sm">Timezone</label>
              <Input name="default_timezone" placeholder="America/Los_Angeles" defaultValue="America/Los_Angeles" />
            </div>
            <Button type="submit" variant="outline" disabled={saving}>Save</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Phone Numbers" actions={<Button onClick={handleAddNumber}>Add Number</Button>} />
        <CardBody className="p-0">
          {!phoneNumbers ? (
            <div className="flex items-center justify-center py-10"><Spinner /></div>
          ) : !phoneNumbers.length ? (
            <EmptyState title="No numbers yet" action={<Button onClick={handleAddNumber}>Add Number</Button>} />
          ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>Number</TH>
                  <TH>Provider</TH>
                  <TH>Name</TH>
                </TRow>
              </THead>
              <tbody>
                {phoneNumbers?.map((n: any) => (
                  <TRow key={n.id}>
                    <TD>{n.number}</TD>
                    <TD>{n.provider || ""}</TD>
                    <TD>{n.friendly_name || ""}</TD>
                  </TRow>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Agents" actions={<Button onClick={handleAddAgent}>Add Agent</Button>} />
        <CardBody className="p-0">
          {!agents ? (
            <div className="flex items-center justify-center py-10"><Spinner /></div>
          ) : !agents.length ? (
            <EmptyState title="No agents yet" action={<Button onClick={handleAddAgent}>Add Agent</Button>} />
          ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>Name</TH>
                  <TH>Type</TH>
                  <TH>Voice</TH>
                </TRow>
              </THead>
              <tbody>
                {agents?.map((a: any) => (
                  <TRow key={a.id}>
                    <TD>{a.name}</TD>
                    <TD>{a.type}</TD>
                    <TD>{a.voice_id || ""}</TD>
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
