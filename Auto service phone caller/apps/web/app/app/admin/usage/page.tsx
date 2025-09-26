"use client";

export const dynamic = 'force-dynamic';

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";
import { useShop } from "../../../contexts/ShopContext";
import { getUsage, type UsageSnapshot } from "../../../lib/api";
import { PageHeader, Card, CardHeader, CardBody, Button, Spinner, EmptyState } from "../../../components/ui";

function Bar({ used, limit }: { used: number; limit: number | null }) {
  const pct = limit == null ? 0 : Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
  const label = limit == null ? `${used} used` : `${used} / ${limit}`;
  return (
    <div className="space-y-1">
      <div className="h-2 w-full bg-slate-200 rounded">
        <div className="h-2 bg-slate-900 rounded" style={{ width: `${limit == null ? 100 : pct}%` }} />
      </div>
      <div className="text-xs text-slate-600">{label}</div>
    </div>
  );
}

export default function AdminUsagePage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { shops, selectedShopId } = useShop();
  const shop = useMemo(() => shops?.find((s) => s.id === selectedShopId) || null, [shops, selectedShopId]);

  const { data, error } = useSWR<UsageSnapshot>(
    token && selectedShopId ? ["usage", selectedShopId, token] : null,
    ([, s, tok]) => getUsage(s as number, tok as string)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin • Usage"
        actions={<Link href="/app/settings/onboarding"><Button>Upgrade Plan</Button></Link>}
      />

      {!data ? (
        <div className="flex items-center justify-center py-16"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Outbound Calls (MTD)" subtitle="Calls initiated by reminders or job updates." />
            <CardBody>
              <Bar used={data.usage.outbound_calls_mtd} limit={data.limits.outbound_calls_per_month} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Minutes (MTD)" subtitle="Sum of completed call durations." />
            <CardBody>
              <Bar used={data.usage.minutes_mtd} limit={data.limits.minutes_per_month} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Agents" />
            <CardBody>
              <div className="text-sm text-slate-700">Limit: {data.limits.agents_per_shop ?? "∞"}</div>
              <div className="text-xs text-slate-500 mt-1">Manage agents in Settings → Agents</div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Phone Numbers" />
            <CardBody>
              <div className="text-sm text-slate-700">Limit: {data.limits.phone_numbers_per_shop ?? "∞"}</div>
              <div className="text-xs text-slate-500 mt-1">Manage phone numbers in Settings → Phone Numbers</div>
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader title="Plan" subtitle="Your current plan and capabilities" />
        <CardBody>
          <div className="text-sm text-slate-700">Plan: <b>{shop?.plan}</b></div>
          <div className="text-xs text-slate-500 mt-2">Change plan in Settings → Onboarding.</div>
        </CardBody>
      </Card>
    </div>
  );
}
