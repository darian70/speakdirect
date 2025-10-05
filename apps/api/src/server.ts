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

 

// Parse JSON and URL-encoded bodies for all non-Stripe routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
    // Use the central Prisma client from the monorepo package @omniagents/db
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { prisma } = require("@omniagents/db");
    _prisma = prisma;
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
// Optional: a WebSocket endpoint to stream audio via Twilio Media Streams (wss://.../stream)
const VOICE_BRIDGE_WSS_URL = process.env.VOICE_BRIDGE_WSS_URL || "";

const haveTwilio = !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_CALLER_ID);
const twilioClient = haveTwilio ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

function validateTwilioRequest(req: Request): boolean {
  try {
    if (!TWILIO_AUTH_TOKEN) {
      console.log("[twilio-validate] No TWILIO_AUTH_TOKEN - skipping validation");
      return true;
    }
    const signature = String(req.header("x-twilio-signature") || "");
    const path = req.originalUrl || "/";
    // Build the full URL - MUST use the actual request host that Twilio sent to
    const protocol = req.get('x-forwarded-proto') || (req as any).protocol || "https";
    const host = req.get('host') || "localhost";
    const url = `${protocol}://${host}${path}`;
    
    console.log("[twilio-validate] Validating request:");
    console.log("  - URL:", url);
    console.log("  - Signature:", signature.substring(0, 20) + "...");
    console.log("  - Has auth token:", !!TWILIO_AUTH_TOKEN);
    console.log("  - Auth token (first 8 chars):", TWILIO_AUTH_TOKEN.substring(0, 8));
    console.log("  - Request body keys:", Object.keys((req as any).body || {}));
    console.log("  - Protocol:", req.get('x-forwarded-proto') || (req as any).protocol);
    console.log("  - Host:", req.get('host'));
    
    // For urlencoded, req.body is a plain object; for JSON, Twilio won't use JSON for these webhooks
    // Use the library's helper directly to avoid typing issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { validateRequest } = require('twilio/lib/webhooks/webhooks');
    const isValid = validateRequest(TWILIO_AUTH_TOKEN, signature, url, (req as any).body || {});
    console.log("[twilio-validate] Result:", isValid);
    
    if (!isValid) {
      console.error("[twilio-validate] FAILED - Check:");
      console.error("  1. TWILIO_AUTH_TOKEN matches Twilio Console exactly");
      console.error("  2. Webhook URL in Twilio matches:", url);
      console.error("  3. No proxy/CDN modifying requests");
    }
    
    return isValid;
  } catch (error) {
    console.error("[twilio-validate] Error:", error);
    return false;
  }
}

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

// In-memory telephony stores (used when DATABASE_URL is not set)
type CallRecord = {
  id: string;
  tenantId: string;
  agentId?: string | null;
  provider?: string | null;
  providerCallId?: string | null;
  direction: "inbound" | "outbound";
  from: string;
  to: string;
  status: string;
  startedAt: string;
  endedAt?: string | null;
  durationSec?: number | null;
  recordingUrl?: string | null;
  costCents?: number | null;
  meta?: any;
  phoneNumberId?: string | null;
};
type CallEventRecord = { id: string; callId: string; type: string; ts: string; payload?: any };
type TranscriptRecord = { id: string; callId: string; channel: string; text: string; ts: string };

const callsMem: CallRecord[] = [];
const callEventsMem: CallEventRecord[] = [];
const transcriptsMem: TranscriptRecord[] = [];

type PhoneNumberRecord = { id: string; tenantId: string; e164: string; label?: string | null; provider?: string | null; createdAt: string };
const phoneNumbersMem: PhoneNumberRecord[] = [];

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
  meta: z.record(z.any()).optional(),
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

  const { clientNumber, technicianNumber, record, statusCallbackUrl, meta } = parsed.data;
  const tech = technicianNumber || DEFAULT_TECH_NUMBER;
  if (!tech) return res.status(400).json({ ok: false, error: "missing_technician_number" });
  const tenantId = String(req.header("x-tenant-id") || "default");

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

    // Store call record with work order metadata
    try {
      if (process.env.DATABASE_URL) {
        const prisma = getPrisma();
        await prisma.call.create({
          data: {
            tenantId,
            provider: "twilio",
            providerCallId: call.sid,
            direction: "outbound",
            from: TWILIO_CALLER_ID,
            to: clientNumber,
            status: "initiated",
            meta: meta || undefined,
          },
        });
      } else {
        callsMem.push({
          id: crypto.randomUUID(),
          tenantId,
          provider: "twilio",
          providerCallId: call.sid,
          direction: "outbound",
          from: TWILIO_CALLER_ID,
          to: clientNumber,
          status: "initiated",
          startedAt: new Date().toISOString(),
          meta: meta || undefined,
        });
      }
    } catch (e) {
      console.warn("[initiate] failed to create call record:", (e as any)?.message || e);
    }

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

// TwiML endpoint for inbound calls. Twilio sends application/x-www-form-urlencoded.
// Configure your Twilio number Voice webhook to POST to: ${API_PUBLIC_URL}/twilio/voice/inbound
app.post("/twilio/voice/inbound", async (req: Request, res: Response) => {
  try {
    console.log("[inbound] Received call - From:", req.body?.From, "To:", req.body?.To, "CallSid:", req.body?.CallSid);
    
    // Validate Twilio signature in production
    if (isProd && TWILIO_AUTH_TOKEN && !validateTwilioRequest(req)) {
      console.error("[inbound] Invalid Twilio signature - rejecting call");
      return res.status(403).type("text/xml").send(`<?xml version="1.0" encoding="UTF-8"?><Response><Reject reason="rejected"/></Response>`);
    }
    
    // Extract common Twilio params
    const from = String((req.body as any)?.From || "");
    const to = String((req.body as any)?.To || "");
    const callSid = String((req.body as any)?.CallSid || "");

  // Resolve tenant by provisioned phone number (To)
  let tenantId = "default";
  let phoneNumberId: string | undefined = undefined;
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const pn = await prisma.phoneNumber.findUnique({ where: { e164: to } });
      if (pn) { tenantId = pn.tenantId; phoneNumberId = pn.id; }
    } else {
      const pn = phoneNumbersMem.find((p) => p.e164 === to);
      if (pn) { tenantId = pn.tenantId; phoneNumberId = pn.id; }
    }
  } catch (_) {}

  // Create call record (in-progress)
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      await prisma.call.create({
        data: {
          tenantId,
          agentId: null,
          provider: "twilio",
          providerCallId: callSid || undefined,
          direction: "inbound",
          from,
          to,
          status: "in-progress",
          phoneNumberId: phoneNumberId || undefined,
        },
      });
    } else {
      callsMem.push({
        id: crypto.randomUUID(),
        tenantId,
        agentId: null,
        provider: "twilio",
        providerCallId: callSid || undefined,
        direction: "inbound",
        from,
        to,
        status: "in-progress",
        startedAt: new Date().toISOString(),
        phoneNumberId: phoneNumberId || null,
      });
    }
  } catch (e) {
    console.warn("[inbound] failed to create call record:", (e as any)?.message || e);
  }

  // Check if we have ElevenLabs Conversational AI configured
  const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || "";
  
  console.log("[inbound] ELEVENLABS_AGENT_ID:", ELEVENLABS_AGENT_ID ? "configured" : "not set");
  console.log("[inbound] VOICE_BRIDGE_WSS_URL:", VOICE_BRIDGE_WSS_URL ? "configured" : "not set");
  
  if (ELEVENLABS_AGENT_ID) {
    console.log("[inbound] Using ElevenLabs Conversational AI");
    // Use ElevenLabs Conversational AI (GPT-4 powered)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_AGENT_ID}">
      <Parameter name="api_key" value="${process.env.ELEVENLABS_API_KEY || ''}" />
    </Stream>
  </Connect>
</Response>`;
    res.type("text/xml").send(xml);
    return;
  }
  
  // Fallback to simple keyword-based AI if ElevenLabs not configured
  if (!VOICE_BRIDGE_WSS_URL) {
    console.log("[inbound] Using simple keyword-based AI");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Hello! Thank you for calling. I'm your AI assistant. How can I help you today?</Say>
  <Gather input="speech" action="/twilio/voice/gather" timeout="5" speechTimeout="auto">
    <Say voice="Polly.Joanna">Please tell me what you need help with.</Say>
  </Gather>
  <Say voice="Polly.Joanna">I didn't hear anything. Goodbye!</Say>
  <Hangup/>
</Response>`;
    res.type("text/xml").send(xml);
    return;
  }
  
  console.log("[inbound] Using voice bridge (if configured)");
  // Append tenant id as a query param for observability in the bridge
  let streamUrl = VOICE_BRIDGE_WSS_URL;
  try {
    const u = new URL(VOICE_BRIDGE_WSS_URL);
    u.searchParams.set("tenant_id", tenantId);
    streamUrl = u.toString();
  } catch { /* leave as-is if invalid */ }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Start>\n    <Stream url="${streamUrl}" />\n  </Start>\n  <Say>Streaming audio. You are connected.</Say>\n  <Pause length="60"/>\n</Response>`;
  res.type("text/xml").send(xml);
  } catch (error) {
    console.error("[inbound] Error processing call:", error);
    const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Sorry, an error occurred. Please try again later.</Say><Hangup/></Response>`;
    res.type("text/xml").send(xml);
  }
});

// Handle speech input from Gather
app.post("/twilio/voice/gather", (req: Request, res: Response) => {
  const speechResult = String((req.body as any)?.SpeechResult || "").toLowerCase();
  
  let response = "";
  let followUp = "Is there anything else I can help you with?";
  
  // Appointment scheduling
  if (speechResult.includes("appointment") || speechResult.includes("schedule") || speechResult.includes("book")) {
    if (speechResult.includes("monday") || speechResult.includes("tuesday") || speechResult.includes("wednesday") || 
        speechResult.includes("thursday") || speechResult.includes("friday") || speechResult.includes("saturday")) {
      response = "Perfect! I've noted your preferred day. What time works best for you? We have morning slots from 8 to noon, and afternoon slots from 1 to 5 PM.";
    } else {
      response = "I'd be happy to help you schedule an appointment. What day works best for you this week?";
    }
  }
  // Pricing questions
  else if (speechResult.includes("price") || speechResult.includes("cost") || speechResult.includes("how much") || speechResult.includes("charge")) {
    if (speechResult.includes("oil") || speechResult.includes("change")) {
      response = "An oil change is $49.99 and takes about 30 minutes. Would you like to schedule one?";
    } else if (speechResult.includes("brake")) {
      response = "Brake service starts at $199.99 depending on your vehicle. We can give you an exact quote when you come in. Would you like to schedule an inspection?";
    } else {
      response = "Our services range from $49.99 for an oil change to $199 and up for brake service. What type of service are you interested in?";
    }
  }
  // Hours/location
  else if (speechResult.includes("hour") || speechResult.includes("open") || speechResult.includes("close") || speechResult.includes("when")) {
    response = "We're open Monday through Friday from 8 AM to 6 PM, and Saturday from 9 AM to 3 PM. We're closed on Sundays.";
  }
  else if (speechResult.includes("location") || speechResult.includes("address") || speechResult.includes("where")) {
    response = "We're located at 123 Main Street. You can find us right next to the shopping center. Would you like directions?";
  }
  // Service questions
  else if (speechResult.includes("service") || speechResult.includes("repair") || speechResult.includes("fix")) {
    response = "We offer oil changes, brake service, tire rotation, engine diagnostics, and general repairs. What do you need help with?";
  }
  // Greeting/help
  else if (speechResult.includes("hello") || speechResult.includes("hi") || speechResult.includes("hey")) {
    response = "Hello! Thanks for calling. How can I help you today?";
  }
  // Confirmation/yes
  else if (speechResult.includes("yes") || speechResult.includes("yeah") || speechResult.includes("sure") || speechResult.includes("okay")) {
    response = "Great! Let me get that scheduled for you. What's your name and phone number?";
    followUp = "I'll have someone call you back to confirm the details.";
  }
  // Negative/no
  else if (speechResult.includes("no") || speechResult.includes("not") || speechResult.includes("cancel")) {
    response = "No problem! Is there anything else I can help you with?";
  }
  // Default
  else {
    response = "I understand you said: " + speechResult + ". Let me connect you with someone who can help. Or, you can ask about our hours, pricing, or schedule an appointment.";
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${response}</Say>
  <Gather input="speech" action="/twilio/voice/gather" timeout="5" speechTimeout="auto">
    <Say voice="Polly.Joanna">${followUp}</Say>
  </Gather>
  <Say voice="Polly.Joanna">Thank you for calling. Have a great day!</Say>
  <Hangup/>
</Response>`;
  
  res.type("text/xml").send(xml);
});

// Optional: status callback receiver for logging
// Twilio Status Callback (set in Twilio Console on the phone number, or via API)
// Twilio posts application/x-www-form-urlencoded with fields like CallStatus, CallSid, Timestamp, RecordingUrl
app.post("/twilio/voice/status", (req: Request, res: Response) => {
  // Validate Twilio signature in production
  if (isProd && TWILIO_AUTH_TOKEN && !validateTwilioRequest(req)) {
    console.error("[status] Invalid Twilio signature");
    return res.status(403).json({ ok: false, error: "invalid_signature" });
  }
  const body = (req.body || {}) as Record<string, any>;
  const status = String(body.CallStatus || body.call_status || "");
  const sid = String(body.CallSid || body.call_sid || "");
  const recordingUrl = body.RecordingUrl ? String(body.RecordingUrl) : undefined;
  const duration = body.CallDuration ? Number(body.CallDuration) : (body.RecordingDuration ? Number(body.RecordingDuration) : undefined);
  const from = String(body.From || "");
  const to = String(body.To || "");

  // Update DB or in-memory
  (async () => {
    try {
      if (process.env.DATABASE_URL) {
        const prisma = getPrisma();
        const existing = await prisma.call.findFirst({ where: { provider: "twilio", providerCallId: sid } });
        if (existing) {
          await prisma.call.update({
            where: { id: existing.id },
            data: {
              status: status || existing.status,
              endedAt: status === "completed" ? new Date() : undefined,
              durationSec: typeof duration === "number" && !Number.isNaN(duration) ? duration : undefined,
              recordingUrl: recordingUrl || undefined,
            },
          });
          await prisma.callEvent.create({ data: { callId: existing.id, type: status || "status", payload: body } });
        } else {
          // Create a minimal record if we missed the inbound hook
          const created = await prisma.call.create({
            data: { tenantId: "default", provider: "twilio", providerCallId: sid, direction: "inbound", from, to, status: status || "completed" },
          });
          await prisma.callEvent.create({ data: { callId: created.id, type: status || "status", payload: body } });
        }
      } else {
        const c = callsMem.find((c) => c.provider === "twilio" && c.providerCallId === sid);
        if (c) {
          c.status = status || c.status;
          if (status === "completed") c.endedAt = new Date().toISOString();
          if (typeof duration === "number" && !Number.isNaN(duration)) c.durationSec = duration;
          if (recordingUrl) c.recordingUrl = recordingUrl;
          callEventsMem.push({ id: crypto.randomUUID(), callId: c.id, type: status || "status", ts: new Date().toISOString(), payload: body });
        }
      }
    } catch (e) {
      console.warn("[status] update failed:", (e as any)?.message || e);
    }
  })();

  res.json({ ok: true });
});

// Simple status receiver kept for compatibility
app.post("/calls/status", (req: Request, res: Response) => {
  console.log("[Status generic]", req.body);
  res.json({ ok: true });
});

// --- Tenant-scoped Calls API ---
app.get("/calls", async (req: Request, res: Response) => {
  const tenantId = String(req.header("x-tenant-id") || "default");
  const limit = Math.min(200, Number(req.query.limit) || 50);
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const calls = await prisma.call.findMany({ where: { tenantId }, orderBy: { startedAt: "desc" }, take: limit });
      return res.json({ ok: true, calls });
    }
    const calls = callsMem.filter((c) => c.tenantId === tenantId).sort((a, b) => (b.startedAt || "").localeCompare(a.startedAt || ""));
    return res.json({ ok: true, calls: calls.slice(0, limit) });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "calls_list_failed", message: e?.message });
  }
});

app.get("/calls/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id || "");
  const tenantId = String(req.header("x-tenant-id") || "default");
  if (!id) return res.status(400).json({ ok: false, error: "missing_id" });
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const call = await prisma.call.findFirst({ where: { id, tenantId } });
      if (!call) return res.status(404).json({ ok: false, error: "not_found" });
      const events = await prisma.callEvent.findMany({ where: { callId: id }, orderBy: { ts: "asc" } });
      const transcript = await prisma.transcript.findMany({ where: { callId: id }, orderBy: { ts: "asc" } });
      return res.json({ ok: true, call, events, transcript });
    }
    const call = callsMem.find((c) => c.id === id && c.tenantId === tenantId);
    if (!call) return res.status(404).json({ ok: false, error: "not_found" });
    const events = callEventsMem.filter((e) => e.callId === id).sort((a, b) => a.ts.localeCompare(b.ts));
    const transcript = transcriptsMem.filter((t) => t.callId === id).sort((a, b) => a.ts.localeCompare(b.ts));
    return res.json({ ok: true, call, events, transcript });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "call_get_failed", message: e?.message });
  }
});

// --- Phone Numbers: tenant-scoped list & admin provisioning ---
app.get("/phone-numbers", async (req: Request, res: Response) => {
  const tenantId = String(req.header("x-tenant-id") || "default");
  try {
    if (process.env.DATABASE_URL) {
      const prisma = getPrisma();
      const numbers = await prisma.phoneNumber.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
      return res.json({ ok: true, numbers });
    }
    const numbers = phoneNumbersMem.filter((n) => n.tenantId === tenantId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return res.json({ ok: true, numbers });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "phone_numbers_list_failed", message: e?.message });
  }
});

app.get("/admin/phone-numbers", requireAdmin, async (_req: Request, res: Response) => {
  if (!ensureDbConfigured(res)) return;
  try {
    const prisma = getPrisma();
    const numbers = await prisma.phoneNumber.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ ok: true, numbers });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "db_error", message: e?.message });
  }
});

app.post("/admin/phone-numbers", requireAdmin, async (req: Request, res: Response) => {
  if (!ensureDbConfigured(res)) return;
  const e164 = String((req.body || {}).e164 || "").trim();
  const headerTenant = String(req.header("x-tenant-id") || "").trim();
  const tenantId = String((req.body || {}).tenantId || headerTenant || "").trim();
  const label = (req.body || {}).label ? String((req.body || {}).label) : null;
  if (!/^\+\d{7,15}$/.test(e164) || !tenantId) return res.status(400).json({ ok: false, error: "invalid_input" });
  try {
    const prisma = getPrisma();
    const number = await prisma.phoneNumber.create({ data: { e164, tenantId, label, provider: "twilio" } });
    return res.json({ ok: true, number });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "db_error", message: e?.message });
  }
});

app.delete("/admin/phone-numbers/:id", requireAdmin, async (req: Request, res: Response) => {
  if (!ensureDbConfigured(res)) return;
  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ ok: false, error: "invalid_input" });
  try {
    const prisma = getPrisma();
    await prisma.phoneNumber.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "db_error", message: e?.message });
  }
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
