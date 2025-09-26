"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useShop } from "../../contexts/ShopContext";
import { listJobs, createJob, listCustomers, createCustomer, listJobUpdates, listJobCalls, createJobUpdate, Call, getMyJobs, getQueueJobs, assignJob, updateJobStatus } from "../../lib/api";
import { PageHeader, Button, Select, Input, Textarea, Card, CardHeader, CardBody, Table, THead, TRow, TH, TD, Spinner, EmptyState, Badge } from "../../components/ui";
import { hasFeature } from "../../lib/entitlements";

export default function ServiceAppPage() {
  const sessionRes = useSession();
  const session = (sessionRes?.data as any) || null;
  const token = session?.accessToken as string | undefined;
  const { selectedShopId } = useShop();
  const { shops } = useShop();
  const plan = useMemo(() => shops?.find((s: any) => s.id === selectedShopId)?.plan, [shops, selectedShopId]);
  const isTech = hasFeature(plan, "technician_ui");

  const [jobId, setJobId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);

  const { data: jobs, mutate: refreshJobs } = useSWR(
    token && selectedShopId ? ["jobs", selectedShopId, token] : null,
    ([, s, tok]) => listJobs(s as number, tok as string)
  );

  const { data: customers, mutate: refreshCustomers } = useSWR(
    token && selectedShopId ? ["customers", selectedShopId, token] : null,
    ([, s, tok]) => listCustomers(s as number, tok as string)
  );

  const { data: updates, mutate: refreshUpdates } = useSWR(
    token && jobId ? ["jobUpdates", jobId, token] : null,
    ([, j, tok]) => listJobUpdates(j as number, tok as string)
  );

  const { data: calls, mutate: refreshCalls } = useSWR(
    token && jobId ? ["jobCalls", jobId, token] : null,
    ([, j, tok]) => listJobCalls(j as number, tok as string)
  );

  // Technician dashboard data
  const { data: myJobs, mutate: refreshMyJobs } = useSWR(
    token && selectedShopId && isTech ? ["myJobs", selectedShopId, token] : null,
    ([, s, tok]) => getMyJobs(s as number, tok as string)
  );
  const { data: queueJobs, mutate: refreshQueueJobs } = useSWR(
    token && selectedShopId && isTech ? ["queueJobs", selectedShopId, token] : null,
    ([, s, tok]) => getQueueJobs(s as number, tok as string)
  );

  useEffect(() => {
    if (jobs && jobs.length > 0 && jobId == null) {
      setJobId(jobs[0].id);
    }
  }, [jobs]);

  // Technician actions
  async function handleAssignToMe(id: number) {
    if (!token) return;
    await assignJob(id, undefined, token);
    await Promise.all([refreshMyJobs(), refreshQueueJobs()]);
  }

  async function handleStatusChange(id: number, status: string) {
    if (!token) return;
    await updateJobStatus(id, status, token);
    await refreshMyJobs();
    if (jobId === id) {
      await refreshUpdates();
      await refreshCalls();
    }
  }

  async function handleCreateJob() {
    if (!selectedShopId) return;
    if (!customerId) {
      alert("Select or create a customer first.");
      return;
    }
    const job = await createJob({ shop_id: selectedShopId, customer_id: customerId, status: "open" }, token);
    await refreshJobs();
    setJobId(job.id);
    await refreshUpdates();
    await refreshCalls();
  }

  async function handleCreateUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!jobId) return;
    const form = e.currentTarget as any;
    const status = (form.status.value || "").trim() || null;
    const summary = (form.summary.value || "").trim() || null;
    const costVal = (form.cost.value || "").trim();
    const cost = costVal ? Number(costVal) : null;
    const needs_approval = !!form.needs_approval.checked;
    const notes = (form.notes.value || "").trim() || null;
    await createJobUpdate(jobId, { status: status || undefined, summary: summary || undefined, cost: cost ?? undefined, needs_approval, notes: notes || undefined }, token);
    alert("Update created and call queued.");
    form.reset();
    await refreshUpdates();
    await refreshCalls();
  }

  async function handleNewCustomer() {
    if (!selectedShopId) return;
    const name = prompt("Customer name") || "";
    if (!name) return;
    const phone = prompt("Phone (E.164, e.g., +15551234567)") || "";
    if (!phone) return;
    const lang = prompt("Preferred language (optional)") || undefined;
    const c = await createCustomer(selectedShopId, name, phone, lang, token);
    await refreshCustomers();
    if (c?.id) setCustomerId(c.id);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isTech ? "Technician • Service" : "Service"}
        actions={<Button onClick={handleCreateJob} disabled={!selectedShopId}>New Job</Button>}
      />

      {isTech && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="My Jobs" subtitle="Jobs assigned to you" />
            <CardBody className="p-0">
              {!myJobs ? (
                <div className="flex items-center justify-center py-8"><Spinner /></div>
              ) : myJobs.length === 0 ? (
                <EmptyState title="No assigned jobs" />
              ) : (
                <Table>
                  <THead>
                    <TRow>
                      <TH>Job</TH>
                      <TH>Customer</TH>
                      <TH>Status</TH>
                      <TH>Actions</TH>
                    </TRow>
                  </THead>
                  <tbody>
                    {myJobs.map((j: any) => (
                      <TRow key={j.id}>
                        <TD>#{j.id} <span className="text-xs text-slate-500">{new Date(j.created_at).toLocaleString()}</span></TD>
                        <TD>{j.customer.name} <span className="text-xs text-slate-500">{j.customer.phone}</span></TD>
                        <TD>{j.status}</TD>
                        <TD className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setJobId(j.id)}>View</Button>
                          <Select className="inline-block w-auto text-sm" defaultValue={j.status} onChange={(e) => handleStatusChange(j.id, e.target.value)}>
                            <option value="open">Open</option>
                            <option value="diagnosed">Diagnosed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="waiting_parts">Waiting Parts</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                          </Select>
                        </TD>
                      </TRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Queue" subtitle="Unassigned jobs in this shop" />
            <CardBody className="p-0">
              {!queueJobs ? (
                <div className="flex items-center justify-center py-8"><Spinner /></div>
              ) : queueJobs.length === 0 ? (
                <EmptyState title="No jobs in queue" />
              ) : (
                <Table>
                  <THead>
                    <TRow>
                      <TH>Job</TH>
                      <TH>Customer</TH>
                      <TH>Status</TH>
                      <TH>Actions</TH>
                    </TRow>
                  </THead>
                  <tbody>
                    {queueJobs.map((j: any) => (
                      <TRow key={j.id}>
                        <TD>#{j.id} <span className="text-xs text-slate-500">{new Date(j.created_at).toLocaleString()}</span></TD>
                        <TD>{j.customer.name} <span className="text-xs text-slate-500">{j.customer.phone}</span></TD>
                        <TD>{j.status}</TD>
                        <TD className="space-x-2">
                          <Button size="sm" onClick={() => handleAssignToMe(j.id)}>Assign to me</Button>
                          <Button size="sm" variant="outline" onClick={() => setJobId(j.id)}>View</Button>
                        </TD>
                      </TRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Context" />
          <CardBody className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600">Customer</label>
                <Button size="sm" variant="outline" onClick={handleNewCustomer} disabled={!selectedShopId}>New</Button>
              </div>
              <Select className="mt-1" value={customerId ?? undefined} onChange={e => setCustomerId(Number(e.target.value))}>
                <option value="">Select a customer</option>
                {customers?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Job</label>
              <Select className="mt-1" value={jobId ?? undefined} onChange={e => setJobId(Number(e.target.value))}>
                {jobs?.map((j: any) => (
                  <option key={j.id} value={j.id}>#{j.id} - {j.status}</option>
                ))}
              </Select>
            </div>

            {!customers && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size={16} /> Loading customers...</div>}
            {!jobs && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size={16} /> Loading jobs...</div>}
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader title="New Update" />
          <CardBody>
            <form className="space-y-3" onSubmit={handleCreateUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600">Status</label>
                  <Input name="status" placeholder="e.g., Diagnosed, Waiting on parts" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Cost</label>
                  <Input name="cost" type="number" step="0.01" placeholder="e.g., 420.00" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Summary</label>
                <Textarea name="summary" placeholder="What was found/fixed or pending" rows={3} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Notes (internal)</label>
                <Textarea name="notes" placeholder="Internal notes for staff" rows={2} />
              </div>
              <div className="flex items-center gap-2">
                <input id="needs_approval" name="needs_approval" type="checkbox" />
                <label htmlFor="needs_approval" className="text-sm text-slate-700">Requires approval during call</label>
              </div>
              <div>
                <Button type="submit" disabled={!jobId}>Create Update & Call</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Job Updates" />
          <CardBody className="p-0">
            {!updates ? (
              <div className="flex items-center justify-center py-10"><Spinner /></div>
            ) : !updates.length ? (
              <EmptyState title="No updates yet" />
            ) : (
              <Table>
                <THead>
                  <TRow>
                    <TH>Time</TH>
                    <TH>Status</TH>
                    <TH>Summary</TH>
                    <TH>Cost</TH>
                    <TH>Approval</TH>
                  </TRow>
                </THead>
                <tbody>
                  {updates?.map((u: any) => (
                    <TRow key={u.id}>
                      <TD className="whitespace-nowrap">{new Date(u.created_at).toLocaleString()}</TD>
                      <TD>{u.status || ""}</TD>
                      <TD>{u.summary || ""}</TD>
                      <TD>{u.cost != null ? `$${u.cost.toFixed ? u.cost.toFixed(2) : Number(u.cost).toFixed(2)}` : ""}</TD>
                      <TD>
                        {u.needs_approval ? (
                          u.approved === true ? <Badge color="green">Approved</Badge> : u.approved === false ? <Badge color="red">Declined</Badge> : <Badge color="amber">Pending</Badge>
                        ) : <span className="text-slate-400">—</span>}
                      </TD>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Call Logs" />
          <CardBody className="p-0">
            {!calls ? (
              <div className="flex items-center justify-center py-10"><Spinner /></div>
            ) : !calls.length ? (
              <EmptyState title="No calls yet" />
            ) : (
              <Table>
                <THead>
                  <TRow>
                    <TH>Time</TH>
                    <TH>Type</TH>
                    <TH>Status</TH>
                    <TH>Approval</TH>
                    <TH>Recording</TH>
                  </TRow>
                </THead>
                <tbody>
                  {calls?.map((c: Call) => (
                    <TRow key={c.id}>
                      <TD className="whitespace-nowrap">{new Date(c.created_at).toLocaleString()}</TD>
                      <TD><Badge>{c.call_type}</Badge></TD>
                      <TD>{c.status}</TD>
                      <TD>{c.approval_result || ""}</TD>
                      <TD>{c.recording_url ? <audio controls src={`${c.recording_url}.mp3`}></audio> : <span className="text-slate-400">—</span>}</TD>
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
