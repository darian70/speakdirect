"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useShop } from "../../contexts/ShopContext";
import { listCalls, Call } from "../../lib/api";
import { PageHeader, Button, Select, Card, CardHeader, CardBody, Table, THead, TRow, TH, TD, Spinner, EmptyState, Badge } from "../../components/ui";

export default function CallsAppPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { selectedShopId } = useShop();
  const [callType, setCallType] = useState<string>("");

  const { data: calls, isLoading, mutate } = useSWR(
    token && selectedShopId ? ["calls", selectedShopId, callType, token] : null,
    ([, s, t, tok]) => listCalls(s as number, (t as string) || undefined, tok as string)
  );

  useEffect(() => {
    // no-op, just to re-render on shop change
  }, [selectedShopId]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Calls"
        actions={
          <Button onClick={() => mutate()} disabled={!selectedShopId || isLoading} variant="outline">
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Recent Calls"
          actions={
            <div className="flex items-center gap-2">
              <Select value={callType} onChange={(e) => setCallType(e.target.value)}>
                <option value="">All Types</option>
                <option value="job_update">Job Update</option>
                <option value="appt_reminder">Appointment Reminder</option>
                <option value="inbound">Inbound</option>
              </Select>
            </div>
          }
        />
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-10"><Spinner /></div>
          ) : !calls?.length ? (
            <EmptyState title="No calls yet" subtitle="When your agent places or receives calls, they will appear here." />
          ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>Time</TH>
                  <TH>Type</TH>
                  <TH>To</TH>
                  <TH>Status</TH>
                  <TH>Outcome</TH>
                  <TH>Approval</TH>
                  <TH>Recording</TH>
                  <TH>TTS</TH>
                </TRow>
              </THead>
              <tbody>
                {calls?.map((c: Call) => (
                  <TRow key={c.id}>
                    <TD className="whitespace-nowrap">{new Date(c.created_at).toLocaleString()}</TD>
                    <TD><Badge>{c.call_type}</Badge></TD>
                    <TD>{c.to_number}</TD>
                    <TD>{c.status}</TD>
                    <TD>{c.outcome || ""}</TD>
                    <TD>{c.approval_result || ""}</TD>
                    <TD>
                      {c.recording_url ? (
                        <audio controls src={`${c.recording_url}.mp3`}></audio>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TD>
                    <TD>
                      {c.tts_path ? (
                        <audio controls src={c.tts_path}></audio>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
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
