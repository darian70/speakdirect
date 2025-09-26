"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const crypto = __importStar(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
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
const twilioClient = haveTwilio ? (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;
// Nodemailer transporter (optional)
const haveSMTP = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
const transporter = haveSMTP
    ? nodemailer_1.default.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
    : null;
const leads = [];
// --- Helpers ---
function base64url(input) {
    return Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}
function signToken(id, email) {
    const data = `${id}.${email}`;
    const hmac = crypto.createHmac("sha256", HMAC_SECRET).update(data).digest();
    return base64url(`${id}.${base64url(hmac)}`);
}
function verifyToken(token) {
    try {
        const raw = Buffer.from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
        const [id, sig] = raw.split(".");
        if (!id || !sig)
            return { ok: false };
        const lead = leads.find((l) => l.id === id);
        if (!lead)
            return { ok: false };
        const expected = signToken(id, lead.email);
        if (expected !== token)
            return { ok: false };
        return { ok: true, id };
    }
    catch {
        return { ok: false };
    }
}
const ConsentSchema = zod_1.z.object({ status: zod_1.z.string(), ts: zod_1.z.number().optional() }).partial();
app.post("/leads", (req, res) => {
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
    if (!name || !emailOk)
        return res.status(400).json({ ok: false, error: "invalid_lead" });
    const id = crypto.randomBytes(6).toString("base64url");
    const lead = { id, name, email, company, topic, message, source, status: "pending", ts: Date.now(), x_consent: consent, x_attribution: attribution };
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
            .catch((err) => {
            const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
            console.error("Email send failed:", msg);
        });
    }
    else {
        console.log("SMTP not configured. Skipping email for", email);
    }
    return res.json({ ok: true, id, confirmLink });
});
// --- Click-to-Call: initiate a bridged call between technician and client ---
const PhoneE164 = zod_1.z.string().regex(/^\+\d{7,15}$/);
const CallInitSchema = zod_1.z.object({
    clientNumber: PhoneE164,
    technicianNumber: PhoneE164.optional(),
    record: zod_1.z.boolean().optional().default(true),
    statusCallbackUrl: zod_1.z.string().url().optional(),
});
app.post("/calls/initiate", async (req, res) => {
    // Simple bearer token check to avoid abuse
    const auth = String(req.headers.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token !== ADMIN_TOKEN)
        return res.status(401).json({ ok: false, error: "unauthorized" });
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
    if (!tech)
        return res.status(400).json({ ok: false, error: "missing_technician_number" });
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
            statusCallbackMethod: statusCallbackUrl ? "POST" : undefined,
        });
        return res.json({ ok: true, sid: call.sid });
    }
    catch (err) {
        const msg = err?.message || String(err);
        console.error("Twilio call create failed:", msg);
        return res.status(500).json({ ok: false, error: "call_failed", message: msg });
    }
});
// TwiML endpoint: returns instructions to dial the client when technician answers
app.get("/twiml/bridge", (req, res) => {
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
app.post("/calls/status", (req, res) => {
    console.log("[Twilio Status]", req.body);
    res.json({ ok: true });
});
// Confirm a lead via token
app.get("/confirm", (req, res) => {
    const token = String(req.query.token || "");
    if (!token)
        return res.status(400).json({ ok: false, error: "missing_token" });
    const v = verifyToken(token);
    if (!v.ok)
        return res.status(400).json({ ok: false, error: "invalid_token" });
    const lead = leads.find((l) => l.id === v.id);
    if (!lead)
        return res.status(404).json({ ok: false, error: "not_found" });
    lead.status = "confirmed";
    return res.json({ ok: true, confirmed: true, lead: { id: lead.id, email: lead.email, name: lead.name, status: lead.status } });
});
// Admin: list leads by status (requires bearer token)
app.get("/admin/leads", (req, res) => {
    const auth = String(req.headers.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token !== ADMIN_TOKEN)
        return res.status(401).json({ ok: false, error: "unauthorized" });
    const status = String(req.query.status || "pending").toLowerCase();
    const valid = ["pending", "confirmed"];
    const filterStatus = valid.includes(status) ? status : "pending";
    const data = leads.filter((l) => l.status === filterStatus).map((l) => ({ id: l.id, name: l.name, email: l.email, company: l.company, topic: l.topic, source: l.source, status: l.status, ts: l.ts }));
    return res.json({ ok: true, leads: data });
});
const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`API listening on ${port}`));
