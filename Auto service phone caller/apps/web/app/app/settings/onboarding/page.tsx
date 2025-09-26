"use client";

export const dynamic = 'force-dynamic';

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";
import { useShop } from "../../../contexts/ShopContext";
import {
  updateShopPlan,
  listPhoneNumbers,
  createPhoneNumber,
  listAgents,
  createAgent,
  createCustomer,
  createJob,
  createJobUpdate,
} from "../../../lib/api";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Select,
  Input,
  Button,
  Table,
  THead,
  TRow,
  TH,
  TD,
  Spinner,
  EmptyState,
} from "../../../components/ui";

const plans = [
  { value: "basic_answer", label: "Basic Answer" },
  { value: "assistant_calendar", label: "Assistant + Calendar" },
  { value: "assistant_outbound", label: "Assistant + Outbound" },
  { value: "service_shop", label: "Service Shop (Full)" },
];

export default function OnboardingWizardPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { shops, selectedShopId } = useShop();
  const shop = useMemo(() => shops?.find((s) => s.id === selectedShopId) || null, [shops, selectedShopId]);

  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  const { data: phoneNumbers, mutate: refreshNumbers } = useSWR(
    token && selectedShopId ? ["phoneNumbers", selectedShopId, token] : null,
    ([, s, tok]) => listPhoneNumbers(s as number, tok as string)
  );
  const { data: agents, mutate: refreshAgents } = useSWR(
    token && selectedShopId ? ["agents", selectedShopId, token] : null,
    ([, s, tok]) => listAgents(s as number, tok as string)
  );

  async function handlePlanSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!selectedShopId || !token) return;
    setSaving(true);
    try {
      await updateShopPlan(selectedShopId, e.target.value, token);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNumberInline(number?: string, provider?: string, friendly?: string) {
    if (!selectedShopId || !token) return;
    const num = number ?? (prompt("E.164 number (e.g., +15551234567)") || "");
    if (!num) return;
    const prov = provider ?? (prompt("Provider (e.g., twilio)") || undefined);
    const name = friendly ?? (prompt("Friendly name") || undefined);
    await createPhoneNumber({ shop_id: selectedShopId, number: num, provider: prov, friendly_name: name }, token);
    await refreshNumbers();
  }

  async function handleAddAgentInline(nameArg?: string, voiceId?: string, promptText?: string) {
    if (!selectedShopId || !token) return;
    const name = nameArg ?? (prompt("Agent name") || "");
    if (!name) return;
    const type = "phone";
    const voice_id = voiceId ?? (prompt("Voice ID (optional)") || undefined);
    const agentPrompt = promptText ?? (promptText === undefined ? undefined : promptText);
    await createAgent({ shop_id: selectedShopId, name, type, voice_id, prompt: agentPrompt }, token);
    await refreshAgents();
  }

  async function handleTestCall() {
    if (!selectedShopId || !token) return;
    // Minimal test: create a customer, job, and update that queues a call
    const name = "Test Customer";
    const phone = "+15555550123";
    const cust = await createCustomer(selectedShopId, name, phone, undefined, token);
    const job = await createJob({ shop_id: selectedShopId, customer_id: cust.id, status: "open" }, token);
    await createJobUpdate(job.id, { status: "test", summary: "Test call from onboarding", needs_approval: false }, token);
    alert("Test call queued. Check Calls page for status.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding"
        actions={<Link href="/app/settings"><Button variant="outline">Back to Settings</Button></Link>}
      />

      <Card>
        <CardHeader title="Step 1: Choose Plan" subtitle="Select the plan that fits your workflow." />
        <CardBody>
          {!shop ? (
            <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner /> Loading shop...</div>
          ) : (
            <div className="flex items-center gap-3">
              <Select value={shop?.plan || ""} onChange={handlePlanSelect} disabled={saving}>
                {plans.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </Select>
              {saving && <span className="text-slate-500 text-sm">Saving...</span>}
              <Button variant="outline" onClick={() => setStep(2)}>Continue</Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Step 2: Add a Phone Number" subtitle="Connect a number your assistant will use for calls." />
        <CardBody className="space-y-3">
          <div className="flex items-center gap-2">
            <Button onClick={() => handleAddNumberInline()}>Add Number</Button>
            <Button variant="outline" onClick={() => setStep(3)}>Continue</Button>
          </div>
          {!phoneNumbers ? (
            <div className="flex items-center justify-center py-6"><Spinner /></div>
          ) : !phoneNumbers.length ? (
            <EmptyState title="No numbers yet" />
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
        <CardHeader title="Step 3: Create Your Agent" subtitle="Give your agent a name and voice." />
        <CardBody className="space-y-3">
          <div className="flex items-center gap-2">
            <Button onClick={() => handleAddAgentInline()}>Add Agent</Button>
            <Button variant="outline" onClick={() => setStep(4)}>Continue</Button>
          </div>
          {!agents ? (
            <div className="flex items-center justify-center py-6"><Spinner /></div>
          ) : !agents.length ? (
            <EmptyState title="No agents yet" />
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

      <Card>
        <CardHeader title="Step 4: Run a Test Call" subtitle="Verify your setup by queuing a test call." />
        <CardBody>
          <div className="flex items-center gap-2">
            <Button onClick={handleTestCall}>Queue Test Call</Button>
            <Link href="/app/calls"><Button variant="outline">View Calls</Button></Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
