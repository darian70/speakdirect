const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export type Call = {
  id: number;
  shop_id: number;
  job_id: number | null;
  job_update_id: number | null;
  appointment_id?: number | null;
  call_type: string;
  customer_id: number;
  to_number: string;
  from_number: string;
  twilio_sid?: string | null;
  status: string;
  outcome?: string | null;
  approval_result?: string | null;
  recording_url?: string | null;
  tts_path?: string | null;
  created_at: string;
  started_at?: string | null;
  ended_at?: string | null;
};

export type Job = {
  id: number;
  shop_id: number;
  customer_id: number;
  vehicle_id?: number | null;
  status: string;
  created_at: string;
};

// Appointments
export type Appointment = {
  id: number;
  shop_id: number;
  customer_id: number;
  starts_at: string;
  ends_at?: string | null;
  status: string;
  location?: string | null;
  notes?: string | null;
  calendar_provider?: string | null;
  calendar_event_id?: string | null;
  created_at: string;
};

function authHeaders(token?: string): HeadersInit {
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const headers = authHeaders(token);
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers,
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: any, token?: string): Promise<T> {
  const headers = authHeaders(token) as Record<string, string>;
  headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function listCalls(shopId: number, callType?: string, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  if (callType) q.set("call_type", callType);
  return apiGet<Call[]>(`/calls/?${q.toString()}`, token);
}

export async function listJobs(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<Job[]>(`/jobs/?${q.toString()}`, token);
}

export async function listShops(token?: string) {
  return apiGet<{ id: number; name: string; plan: string }[]>(`/shops/`, token);
}

export async function listShopsAdmin(token?: string) {
  return apiGet<{ id: number; name: string; plan: string }[]>(`/shops/admin`, token);
}

export async function createShop(name: string, plan: string, token?: string) {
  const q = new URLSearchParams({ name, plan });
  return apiPost<{ id: number; name: string; plan: string }>(`/shops/?${q.toString()}`, undefined, token);
}

export async function createCustomer(shop_id: number, name: string, phone: string, preferred_language?: string, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shop_id), name, phone });
  if (preferred_language) q.set("preferred_language", preferred_language);
  return apiPost<{ id: number; name: string; phone: string }>(`/customers/?${q.toString()}`, undefined, token);
}

export async function createJob(payload: { shop_id: number; customer_id: number; vehicle_id?: number | null; status?: string }, token?: string) {
  return apiPost<Job>(`/jobs/`, payload, token);
}

export async function createJobUpdate(jobId: number, payload: { status?: string; summary?: string; cost?: number; needs_approval?: boolean; notes?: string }, token?: string) {
  return apiPost(`/jobs/${jobId}/updates`, payload, token);
}

export async function listCustomers(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<{ id: number; name: string; phone: string; preferred_language?: string }[]>(`/customers/?${q.toString()}`, token);
}

export async function listJobUpdates(jobId: number, token?: string) {
  return apiGet<any[]>(`/jobs/${jobId}/updates`, token);
}

export async function listJobCalls(jobId: number, token?: string) {
  return apiGet<Call[]>(`/jobs/${jobId}/calls`, token);
}

export async function updateShopPlan(shopId: number, plan: string, token?: string) {
  const q = new URLSearchParams({ plan });
  return apiPost<{ id: number; name: string; plan: string }>(`/shops/${shopId}/plan?${q.toString()}`, undefined, token);
}

export async function updateShopSettings(shopId: number, opts: { record_calls?: boolean; default_timezone?: string }, token?: string) {
  const q = new URLSearchParams();
  if (opts.record_calls !== undefined) q.set("record_calls", String(opts.record_calls));
  if (opts.default_timezone) q.set("default_timezone", opts.default_timezone);
  return apiPost<{ id: number; name: string; plan: string; record_calls?: boolean; default_timezone?: string }>(`/shops/${shopId}/settings?${q.toString()}`, undefined, token);
}

// Phone Numbers
export type PhoneNumber = { id: number; shop_id: number; number: string; provider?: string | null; friendly_name?: string | null };
export async function listPhoneNumbers(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<PhoneNumber[]>(`/phone-numbers/?${q.toString()}`, token);
}
export async function createPhoneNumber(payload: { shop_id: number; number: string; provider?: string; friendly_name?: string }, token?: string) {
  return apiPost<PhoneNumber>(`/phone-numbers/`, payload, token);
}

// Agents
export type Agent = { id: number; shop_id: number; name: string; type: string; voice_id?: string | null; prompt?: string | null; language?: string | null; phone_number_id?: number | null };
export async function listAgents(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<Agent[]>(`/agents/?${q.toString()}`, token);
}
export async function createAgent(payload: Partial<Agent> & { shop_id: number; name: string; type: string }, token?: string) {
  return apiPost<Agent>(`/agents/`, payload, token);
}

// Appointments API
export async function listAppointments(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<Appointment[]>(`/appointments/?${q.toString()}`, token);
}

export async function createAppointment(payload: { shop_id: number; customer_id: number; starts_at: string; ends_at?: string | null; status?: string; location?: string; notes?: string; calendar_provider?: string; calendar_event_id?: string }, token?: string) {
  return apiPost<Appointment>(`/appointments/`, payload, token);
}

export async function triggerAppointmentReminder(appointmentId: number, token?: string) {
  return apiPost<{ enqueued: boolean; job_id: string }>(`/appointments/${appointmentId}/remind`, undefined, token);
}

// Users API (admin / shop-level)
export type UserLite = { id: number; email: string; name: string; role: string; created_at?: string | null };
export async function listUsers(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<UserLite[]>(`/users/?${q.toString()}`, token);
}

export async function createUser(shopId: number, payload: { email: string; name: string; role?: string; password?: string }, token?: string) {
  const q = new URLSearchParams({
    shop_id: String(shopId),
    email: payload.email,
    name: payload.name,
  });
  if (payload.role) q.set("role", payload.role);
  if (payload.password) q.set("password", payload.password);
  return apiPost<UserLite>(`/users/?${q.toString()}`, undefined, token);
}

// Usage API
export type UsageSnapshot = {
  shop_id: number;
  plan: string;
  limits: {
    outbound_calls_per_month: number | null;
    minutes_per_month: number | null;
    agents_per_shop: number | null;
    phone_numbers_per_shop: number | null;
  };
  usage: {
    outbound_calls_mtd: number;
    minutes_mtd: number;
  };
  month: { start: string; end: string };
};

export async function getUsage(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<UsageSnapshot>(`/usage/?${q.toString()}`, token);
}

// Technician dashboard API
export type JobSummary = {
  id: number;
  status: string;
  created_at: string;
  customer: { id: number; name: string; phone: string };
};

export async function getMyJobs(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<JobSummary[]>(`/jobs/my?${q.toString()}`, token);
}

export async function getQueueJobs(shopId: number, token?: string) {
  const q = new URLSearchParams({ shop_id: String(shopId) });
  return apiGet<JobSummary[]>(`/jobs/queue?${q.toString()}`, token);
}

export async function assignJob(jobId: number, userId?: number, token?: string) {
  const q = new URLSearchParams();
  if (userId) q.set("user_id", String(userId));
  return apiPost<Job>(`/jobs/${jobId}/assign?${q.toString()}`, undefined, token);
}

export async function updateJobStatus(jobId: number, status: string, token?: string) {
  const q = new URLSearchParams({ status });
  return apiPost<Job>(`/jobs/${jobId}/status?${q.toString()}`, undefined, token);
}
