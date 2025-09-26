import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { z } from "zod";
import * as crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";
import Stripe from "stripe";

const app = express();
// CORS allowlist: set ALLOWED_ORIGINS as comma-separated list in production, e.g.
// ALLOWED_ORIGINS=https://app.speakdirect.xyz,https://admin.speakdirect.xyz,https://speakdirect.xyz,https://www.speakdirect.xyz
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow same-origin or curl
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
  })
);

app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// --- Webhooks ---
// Stripe requires the raw request body for signature verification.
// We'll add a stub here; verification will be implemented when Stripe is integrated.
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), (req: Request, res: Response) => {
  try {
    const sig = req.header("stripe-signature") || "";
    const raw = (req as any).body as Buffer;
    console.log("[Stripe Webhook] signature length:", sig.length, "raw bytes:", Buffer.isBuffer(raw) ? raw.length : 0);
    // TODO: verify signature and parse event using Stripe SDK when added
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(400).json({ ok: false, error: "webhook_error", message: e?.message || "bad_request" });
  }
});

 

// Parse JSON for all non-Stripe routes
app.use(express.json());

const isProd = process.env.NODE_ENV === 'production';
function isAuthorized(req: Request): boolean {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (!isProd) return true;
  return token === ADMIN_TOKEN;
}

// Ensure Tenant exists for the provided X-Tenant-Id (Org mapping)
app.post("/tenants/sync", async (req: Request, res: Response) => {
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: "unauthorized" });
  const tenantId = String(req.header("x-tenant-id") || "").trim();
  const name = (req.body && typeof req.body.name === 'string' && req.body.name.trim()) || undefined;
  if (!tenantId) return res.status(400).json({ ok: false, error: "missing_tenant_id" });
  try {
    if (!process.env.DATABASE_URL) return res.status(200).json({ ok: true, tenant: { id: tenantId, name: name || tenantId, ephemeral: true } });
    const prisma = getPrisma();
    const tenant = await prisma.tenant.upsert({
      where: { id: tenantId },
      create: { id: tenantId, name: name || tenantId, slug: tenantId },
      update: { name: name || tenantId },
    });
    return res.json({ ok: true, tenant });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "tenant_sync_failed", message: e?.message });
  }
});

// --- Stripe config & portal session ---
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_TEST_CUSTOMER_ID = process.env.STRIPE_TEST_CUSTOMER_ID || "";
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" } as any) : null;

app.post("/billing/portal", async (req: Request, res: Response) => {
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: "unauthorized" });
  if (!stripe) return res.status(501).json({ ok: false, error: "stripe_not_configured" });
  const { customerId, returnUrl } = (req.body as any) || {};
  const customer = customerId || STRIPE_TEST_CUSTOMER_ID;
  if (!customer) return res.status(400).json({ ok: false, error: "missing_customer" });
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: typeof returnUrl === 'string' && returnUrl ? returnUrl : FRONTEND_PUBLIC_URL,
    });
    return res.json({ ok: true, url: session.url });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "stripe_portal_error", message: e?.message });
  }
});

const AgentCreateSchema = z.object({
  name: z.string().min(2).max(80),
  tenantId: z.string().optional(),
  channel: z.enum(["chat", "voice"]).default("chat"),
  config: z.record(z.any()).optional(),
});

const AgentUpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED"]).optional(),
  config: z.record(z.any()).optional(),
});

app.get("/agents/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ ok: false, error: "missing_id" });
  const tenantId = String(req.header("x-tenant-id") || "default");
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const agent = await prisma.agent.findFirst({ where: { id, tenantId } });
      if (!agent) return res.status(404).json({ ok: false, error: "not_found" });
      return res.json({ ok: true, agent });
    }
    const agent = agentsMem.find(a => a.id === id && a.tenantId === tenantId);
    if (!agent) return res.status(404).json({ ok: false, error: "not_found" });
    return res.json({ ok: true, agent });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "agent_get_failed", message: e?.message });
  }
});

app.get("/agents", async (req: Request, res: Response) => {
  const tenantId = String(req.header("x-tenant-id") || "default");
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const agents = await prisma.agent.findMany({ where: { tenantId } });
      return res.json({ ok: true, agents });
    }
    const agents = agentsMem.filter(a => a.tenantId === tenantId);
    return res.json({ ok: true, agents });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "agent_get_failed", message: e?.message });
  }
});

app.post("/agents", async (req: Request, res: Response) => {
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: "unauthorized" });
  const parsed = AgentCreateSchema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
  const { name, channel, config, tenantId: tId } = parsed.data;
  const tenantId = tId || String(req.header("x-tenant-id") || "default");
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const agent = await prisma.agent.create({ data: { name, status: "DRAFT", config: { channel, ...(config || {}) }, tenantId } });
      return res.json({ ok: true, agent });
    }
    const agent: AgentRecord = {
      id: crypto.randomUUID(),
      tenantId,
      name,
      status: "DRAFT",
      config: { channel, ...(config || {}) },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    agentsMem.push(agent);
    return res.json({ ok: true, agent });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "agent_create_failed", message: e?.message });
  }
});

app.patch("/agents/:id", async (req: Request, res: Response) => {
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: "unauthorized" });
  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ ok: false, error: "missing_id" });
  const parsed = AgentUpdateSchema.safeParse(req.body || {});
  if (!parsed.success) return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
  const { name, status, config } = parsed.data;
  const tenantId = String(req.header("x-tenant-id") || "default");
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const exists = await prisma.agent.findFirst({ where: { id, tenantId } });
      if (!exists) return res.status(404).json({ ok: false, error: "not_found" });
      const agent = await prisma.agent.update({ where: { id }, data: { name: name ?? undefined, status: status ?? undefined, config: config ?? undefined } });
      return res.json({ ok: true, agent });
    }
    const idx = agentsMem.findIndex(a => a.id === id && a.tenantId === tenantId);
    if (idx === -1) return res.status(404).json({ ok: false, error: "not_found" });
    const updated: AgentRecord = {
      ...agentsMem[idx],
      name: name ?? agentsMem[idx].name,
      status: (status as any) ?? agentsMem[idx].status,
      config: config ?? agentsMem[idx].config,
      updatedAt: new Date().toISOString(),
    };
    agentsMem[idx] = updated;
    return res.json({ ok: true, agent: updated });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "agent_update_failed", message: e?.message });
  }
});

app.delete("/agents/:id", async (req: Request, res: Response) => {
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: "unauthorized" });
  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ ok: false, error: "missing_id" });
  const tenantId = String(req.header("x-tenant-id") || "default");
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const del = await prisma.agent.deleteMany({ where: { id, tenantId } });
      if (del.count === 0) return res.status(404).json({ ok: false, error: "not_found" });
      return res.json({ ok: true });
    }
    const before = agentsMem.length;
    for (let i = agentsMem.length - 1; i >= 0; i--) {
      if (agentsMem[i].id === id && agentsMem[i].tenantId === tenantId) agentsMem.splice(i, 1);
    }
    const removed = before !== agentsMem.length;
    if (!removed) return res.status(404).json({ ok: false, error: "not_found" });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "agent_delete_failed", message: e?.message });
  }
});

// (removed duplicate JSON parser and Agents CRUD block)

// --- Middleware ---
function requireAdmin(req: Request, res: Response, next: () => void) {
  const auth = req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (token !== ADMIN_TOKEN) return res.status(401).json({ ok: false, error: "unauthorized" });
  next();
}

function ensureDbConfigured(res: Response): boolean {
  if (!process.env.DATABASE_URL) {
    res.status(503).json({ ok: false, error: "db_not_configured" });
    return false;
  }
  return true;
}

let _prisma: any = null;
function getPrisma() {
  if (!_prisma) {
    // Lazy require Prisma only when a DATABASE_URL is provided and a DB-backed
    // endpoint is actually invoked. This avoids import-time errors when prisma
    // client has not been generated for local, DB-less development.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require("@prisma/client");
    _prisma = new PrismaClient();
  }
  return _prisma;
}

// --- Admin API: Tenants & Users (basic) ---
app.get("/admin/tenants", requireAdmin, async (_req: Request, res: Response) => {
  if (!ensureDbConfigured(res)) return;
  try {
    const prisma = getPrisma();
    const tenants = await prisma.tenant.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ ok: true, tenants });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: "db_error", message: e?.message });
  }
});

app.post("/admin/tenants", requireAdmin, async (req: Request, res: Response) => {
  if (!ensureDbConfigured(res)) return;
  const { name, slug } = req.body || {};
  if (!name || !slug) return res.status(400).json({ ok: false, error: "invalid_input" });
  try {
    const prisma = getPrisma();
    const tenant = await prisma.tenant.create({ data: { name, slug } });
    res.json({ ok: true, tenant });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: "db_error", message: e?.message });
  }
});

app.get("/admin/users", requireAdmin, async (_req: Request, res: Response) => {
  if (!ensureDbConfigured(res)) return;
  try {
    const prisma = getPrisma();
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ ok: true, users });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: "db_error", message: e?.message });
  }
});

// --- Config ---
const FRONTEND_PUBLIC_URL = process.env.FRONTEND_PUBLIC_URL || "http://localhost:3000";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "change_me";
const HMAC_SECRET = process.env.HMAC_SECRET || "change_me";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "SpeakDirectSales@gmail.com";

// Telephony (Twilio) config
const API_PUBLIC_URL = process.env.API_PUBLIC_URL || ""; // must be publicly reachable by Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_CALLER_ID = process.env.TWILIO_CALLER_ID || ""; // E.164
const DEFAULT_TECH_NUMBER = process.env.DEFAULT_TECH_NUMBER || ""; // E.164

const haveTwilio = !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_CALLER_ID);
const twilioClient = haveTwilio ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

// Nodemailer transporter (optional)
const haveSMTP = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
const transporter = haveSMTP
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

// --- Types & In-memory store ---
type LeadStatus = "pending" | "confirmed";
interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  topic?: string;
  message?: string;
  source?: string;
  status: LeadStatus;
  ts: number;
  x_consent?: { status?: string; ts?: number };
  x_attribution?: unknown;
}

const leads: Lead[] = [];
type AgentRecord = { id: string; tenantId: string; name: string; status: "DRAFT"|"ACTIVE"|"PAUSED"; config: any; createdAt: string; updatedAt: string };
const agentsMem: AgentRecord[] = [];

// --- Helpers ---
function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signToken(id: string, email: string) {
  const data = `${id}.${email}`;
  const hmac = crypto.createHmac("sha256", HMAC_SECRET).update(data).digest();
  return base64url(`${id}.${base64url(hmac)}`);
}

function verifyToken(token: string): { ok: true; id: string } | { ok: false } {
  try {
    const raw = Buffer.from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
    const [id, sig] = raw.split(".");
    if (!id || !sig) return { ok: false };
    const lead = leads.find((l) => l.id === id);
    if (!lead) return { ok: false };
    const expected = signToken(id, lead.email);
    if (expected !== token) return { ok: false };
    return { ok: true, id };
  } catch {
    return { ok: false };
  }
}

const ConsentSchema = z.object({ status: z.string(), ts: z.number().optional() }).partial();

app.post("/leads", (req: Request, res: Response) => {
  const payload = req.body || {};
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const company = payload.company ? String(payload.company) : undefined;
  const topic = payload.topic ? String(payload.topic) : undefined;
  const message = payload.message ? String(payload.message) : undefined;
  const source = payload.source ? String(payload.source) : undefined;
  const consent = ConsentSchema.safeParse(payload.x_consent).success ? payload.x_consent : undefined;
  const attribution = payload.x_attribution || undefined;

  const emailOk = /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]+$/.test(email);
  if (!name || !emailOk) return res.status(400).json({ ok: false, error: "invalid_lead" });

  const id = crypto.randomBytes(6).toString("base64url");
  const lead: Lead = { id, name, email, company, topic, message, source, status: "pending", ts: Date.now(), x_consent: consent, x_attribution: attribution };
  leads.push(lead);

  // Create confirm token and link (for email double opt-in)
  const token = signToken(id, email);
  const confirmLink = `${FRONTEND_PUBLIC_URL.replace(/\/$/, "")}/confirm?token=${encodeURIComponent(token)}`;

  // Optionally send email with confirmLink using nodemailer if SMTP is configured
  if (transporter) {
    const subject = "Confirm your email — OmniAgents";
    const text = `Hi ${name},\n\nThanks for reaching out to OmniAgents. Please confirm your email by clicking the link below:\n\n${confirmLink}\n\nIf you did not request this, you can ignore this message.`;
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #111;">
        <p>Hi ${name},</p>
        <p>Thanks for reaching out to <strong>OmniAgents</strong>. Please confirm your email by clicking the button below:</p>
        <p><a href="${confirmLink}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;border-radius:8px;text-decoration:none">Confirm email</a></p>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p><a href="${confirmLink}">${confirmLink}</a></p>
        <p style="color:#555">If you did not request this, you can ignore this message.</p>
      </div>`;
    transporter
      .sendMail({ from: SMTP_FROM, to: email, subject, text, html })
      .catch((err: unknown) => {
        const msg = err && typeof err === "object" && "message" in err ? (err as any).message : String(err);
        console.error("Email send failed:", msg);
      });
  } else {
    console.log("SMTP not configured. Skipping email for", email);
  }

  return res.json({ ok: true, id, confirmLink });
});

// --- Click-to-Call: initiate a bridged call between technician and client ---
const PhoneE164 = z.string().regex(/^\+\d{7,15}$/);
const CallInitSchema = z.object({
  clientNumber: PhoneE164,
  technicianNumber: PhoneE164.optional(),
  record: z.boolean().optional().default(true),
  statusCallbackUrl: z.string().url().optional(),
});

app.post("/calls/initiate", async (req: Request, res: Response) => {
  // Simple bearer token check to avoid abuse (bypassed in non-prod by isAuthorized)
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: "unauthorized" });

  if (!haveTwilio || !twilioClient) {
    return res.status(500).json({ ok: false, error: "telephony_not_configured" });
  }
  if (!API_PUBLIC_URL) {
    return res.status(500).json({ ok: false, error: "api_public_url_required" });
  }

  const parsed = CallInitSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
  }

  const { clientNumber, technicianNumber, record, statusCallbackUrl } = parsed.data;
  const tech = technicianNumber || DEFAULT_TECH_NUMBER;
  if (!tech) return res.status(400).json({ ok: false, error: "missing_technician_number" });

  try {
    // We'll call the technician first. When they answer, Twilio will request our TwiML which dials the client.
    const twimlUrl = new URL("/twiml/bridge", API_PUBLIC_URL.replace(/\/$/, ""));
    twimlUrl.searchParams.set("client", clientNumber);
    twimlUrl.searchParams.set("record", record ? "1" : "0");

    const call = await twilioClient.calls.create({
      to: tech,
      from: TWILIO_CALLER_ID,
      url: twimlUrl.toString(),
      statusCallback: statusCallbackUrl || undefined,
      statusCallbackEvent: statusCallbackUrl ? ["initiated", "ringing", "answered", "completed"] : undefined,
      statusCallbackMethod: statusCallbackUrl ? ("POST" as const) : undefined,
    });
    return res.json({ ok: true, sid: call.sid });
  } catch (err) {
    const msg = (err as any)?.message || String(err);
    console.error("Twilio call create failed:", msg);
    return res.status(500).json({ ok: false, error: "call_failed", message: msg });
  }
});

// TwiML endpoint: returns instructions to dial the client when technician answers
app.get("/twiml/bridge", (req: Request, res: Response) => {
  const client = String(req.query.client || "");
  const record = String(req.query.record || "0") === "1";
  if (!/^\+\d{7,15}$/.test(client)) {
    res.status(400).type("text/xml").send(`<?xml version="1.0" encoding="UTF-8"?><Response><Say>Invalid client number</Say></Response>`);
    return;
  }
  const recordAttr = record ? " record=\"record-from-answer\"" : "";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Dial callerId="${TWILIO_CALLER_ID}"${recordAttr}>${client}</Dial>\n</Response>`;
  res.type("text/xml").send(xml);
});

// Optional: status callback receiver for logging
app.post("/calls/status", (req: Request, res: Response) => {
  console.log("[Twilio Status]", req.body);
  res.json({ ok: true });
});

// Confirm a lead via token
app.get("/confirm", (req: Request, res: Response) => {
  const token = String(req.query.token || "");
  if (!token) return res.status(400).json({ ok: false, error: "missing_token" });
  const v = verifyToken(token);
  if (!v.ok) return res.status(400).json({ ok: false, error: "invalid_token" });
  const lead = leads.find((l) => l.id === v.id);
  if (!lead) return res.status(404).json({ ok: false, error: "not_found" });
  lead.status = "confirmed";
  return res.json({ ok: true, confirmed: true, lead: { id: lead.id, email: lead.email, name: lead.name, status: lead.status } });
});

// Admin: list leads by status (requires bearer token)
app.get("/admin/leads", (req: Request, res: Response) => {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== ADMIN_TOKEN) return res.status(401).json({ ok: false, error: "unauthorized" });
  const status = (String(req.query.status || "pending") as LeadStatus).toLowerCase();
  const valid: LeadStatus[] = ["pending", "confirmed"];
  const filterStatus = (valid as string[]).includes(status) ? (status as LeadStatus) : "pending";
  const data = leads.filter((l) => l.status === filterStatus).map((l) => ({ id: l.id, name: l.name, email: l.email, company: l.company, topic: l.topic, source: l.source, status: l.status, ts: l.ts }));
  return res.json({ ok: true, leads: data });
});

// --- Admin: Usage & Flags ---
// In-memory usage for environments without DB
type UsageEvt = { id: string; tenantId: string; type: string; amount: number; ts: string; meta?: any };
const usageMem: UsageEvt[] = [];

app.get("/admin/usage", requireAdmin, async (_req: Request, res: Response) => {
  if (process.env.DATABASE_URL) {
    try {
      const prisma = getPrisma();
      const events = await prisma.usageEvent.findMany({ orderBy: { ts: "desc" }, take: 200 });
      return res.json({ ok: true, events });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: "db_error", message: e?.message });
    }
  }
  return res.json({ ok: true, events: usageMem });
});

// Simple in-memory ops flags (global). For DB-backed flags, map to Entitlement table or a new table.
const opsFlags: Record<string, boolean> = {
  maintenanceMode: false,
  allowSignups: true,
  telephonyEnabled: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_CALLER_ID),
};

app.get("/admin/flags", requireAdmin, (_req: Request, res: Response) => {
  res.json({ ok: true, flags: opsFlags });
});

app.patch("/admin/flags", requireAdmin, (req: Request, res: Response) => {
  try {
    const body = (req.body || {}) as Record<string, any>;
    let changed = false;
    for (const [k, v] of Object.entries(body)) {
      if (k in opsFlags && typeof v === "boolean") {
        (opsFlags as any)[k] = v;
        changed = true;
      }
    }
    return res.json({ ok: true, flags: opsFlags, changed });
  } catch (e: any) {
    return res.status(400).json({ ok: false, error: "invalid_input", message: e?.message });
  }
});

const port = Number(process.env.PORT) || 8081;
app.listen(port, () => console.log(`API listening on ${port}`));
