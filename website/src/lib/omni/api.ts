// Lightweight client-side API helper for SpeakDirect backend
// Provides functions to create leads, confirm tokens, and list admin leads

export type LeadCreateInput = {
  name: string;
  email: string;
  company?: string;
  topic?: string;
  message?: string;
  source?: string;
  x_consent?: { status?: string; ts?: number };
  x_attribution?: unknown;
};

export type LeadCreateResponse = {
  ok: boolean;
  id?: string;
  confirmLink?: string;
  error?: string;
};

export type ConfirmResponse = {
  ok: boolean;
  confirmed?: boolean;
  error?: string;
  lead?: { id: string; email: string; name: string; status: string };
};

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  topic?: string;
  source?: string;
  status: 'pending' | 'confirmed';
  ts: number;
};

export type AdminLeadsResponse = {
  ok: boolean;
  leads?: AdminLead[];
  error?: string;
};

function getApiBase(): string {
  // Prefer SpeakDirect env, then Omni env, then runtime globals (both), else default
  const env =
    process.env.NEXT_PUBLIC_SPEAKDIRECT_API_BASE ||
    process.env.NEXT_PUBLIC_OMNI_API_BASE;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = typeof window !== 'undefined' ? (window as any) : undefined;
  const runtime = (win?.__SPEAKDIRECT_API_BASE__ as string | undefined) || (win?.__OMNI_API_BASE__ as string | undefined);
  const base = env || runtime || 'http://localhost:8080';
  return base.replace(/\/$/, '');
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { ok: res.ok };
  }
  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : 'request_failed');
  }
  return data as T;
}

export async function createLead(input: LeadCreateInput): Promise<LeadCreateResponse> {
  const base = getApiBase();
  return fetchJson<LeadCreateResponse>(`${base}/leads`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function confirmLead(token: string): Promise<ConfirmResponse> {
  const base = getApiBase();
  const url = new URL(`${base}/confirm`);
  url.searchParams.set('token', token);
  return fetchJson<ConfirmResponse>(url.toString());
}

export async function listLeads(params: { status?: 'pending' | 'confirmed'; token: string }): Promise<AdminLeadsResponse> {
  const base = getApiBase();
  const url = new URL(`${base}/admin/leads`);
  if (params.status) url.searchParams.set('status', params.status);
  return fetchJson<AdminLeadsResponse>(url.toString(), {
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });
}
