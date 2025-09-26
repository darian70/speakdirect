import React, { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Phone,
  Mail,
  MessageSquare,
  Headset,
  Calendar,
  Database,
  Shield,
  Zap,
  Building2,
  ShoppingCart,
  Hotel,
  Stethoscope,
  GraduationCap,
  Truck,
  Wrench,
  Home as HomeIcon,
  CreditCard,
  LayoutTemplate,
  GitBranch,
  Workflow,
  Mic,
} from "lucide-react";

/**
 * OmniAgents – Single-file React site (JSX)
 * TailwindCSS styling • Hash routing • API stubs + offline queue + double opt-in
 * Admin page • Gmail SMTP • Branded HTML emails
 */

const siteConfig = {
  name: "SpeakDirect",
  tagline: "AI agents, voice reps, and automations for teams of any size.",
  brandColor: "from-cyan-500 via-sky-500 to-emerald-500",
  accentRing: "ring-cyan-400/40",
  email: "SpeakDirectSales@gmail.com",
  phone: "+1 (555) 555-0137",
};

const navItems = [
  { key: "home", label: "Home" },
  { key: "agents", label: "Agents" },
  { key: "solutions", label: "Solutions" },
  { key: "pricing", label: "Pricing" },
  { key: "about", label: "About" },
  { key: "resources", label: "Resources" },
  { key: "contact", label: "Contact" },
  // Hidden routes: confirm, admin
];

const channels = [
  "Voice",
  "Phone IVR",
  "SMS",
  "Email",
  "Chat/Web",
  "WhatsApp",
  "Slack",
  "Teams",
  "API",
];

const verticals = [
  { label: "E‑commerce", icon: ShoppingCart },
  { label: "Real Estate", icon: HomeIcon },
  { label: "Hospitality", icon: Hotel },
  { label: "Healthcare", icon: Stethoscope },
  { label: "Education", icon: GraduationCap },
  { label: "Logistics", icon: Truck },
  { label: "Field Services", icon: Wrench },
  { label: "SaaS / B2B", icon: Building2 },
];

const agentsSeed = [
  { name: "Sales Agent", desc: "Conversational seller across web, SMS, and voice with CRM sync and payment links.", channels: ["Voice", "SMS", "Chat/Web", "Email"], caps: ["Lead qual", "Product Q&A", "Order links", "CRM"], vertical: "E‑commerce", icon: Bot },
  { name: "Support Agent", desc: "24/7 tier‑1 support with RAG over your docs, ticket deflection, and handoff.", channels: ["Chat/Web", "Email", "Slack"], caps: ["RAG", "Ticket triage", "Macros", "Escalation"], vertical: "SaaS / B2B", icon: Headset },
  { name: "Booking Agent", desc: "Calendar scheduling over voice and chat with reschedule and reminders.", channels: ["Voice", "SMS", "Chat/Web"], caps: ["Calendar", "Reminders", "Payments"], vertical: "Hospitality", icon: Calendar },
  { name: "Phone IVR", desc: "Natural IVR with call routing, verification, and intent capture.", channels: ["Phone IVR", "Voice"], caps: ["DTMF", "Intent", "Routing"], vertical: "SaaS / B2B", icon: Phone },
  { name: "Lead Enrichment", desc: "Prospect research, enrichment, and first‑touch outreach from signals.", channels: ["Email", "Slack"], caps: ["Scrape", "Enrich", "Sequence"], vertical: "SaaS / B2B", icon: Database },
  { name: "Returns Agent", desc: "Automates returns, exchanges, and status checks across channels.", channels: ["Chat/Web", "Email", "SMS"], caps: ["RMA", "Labels", "Refunds"], vertical: "E‑commerce", icon: ShoppingCart },
  { name: "Concierge", desc: "Property guest messaging, check‑in, FAQ, and upsells.", channels: ["SMS", "WhatsApp", "Chat/Web"], caps: ["FAQ", "Upsell", "Local tips"], vertical: "Hospitality", icon: Hotel },
  { name: "Ops Copilot", desc: "Internal automations over Slack: approvals, inventory, and daily reports.", channels: ["Slack", "Teams"], caps: ["Approvals", "Inventory", "Reports"], vertical: "Field Services", icon: Workflow },
  { name: "Docs QA", desc: "RAG knowledge bot with sources, citations, and feedback loop.", channels: ["Chat/Web", "Slack", "Teams"], caps: ["RAG", "Citations", "Feedback"], vertical: "SaaS / B2B", icon: Database },
  { name: "Collections Agent", desc: "Friendly payment collections and plan setup over SMS and phone.", channels: ["SMS", "Voice"], caps: ["Pay links", "Plans", "Follow‑ups"], vertical: "SaaS / B2B", icon: CreditCard },
  { name: "Patient Intake", desc: "Appointment intake, form capture, and reminders with audit trail.", channels: ["SMS", "Email", "Chat/Web"], caps: ["Forms", "HIPAA guard", "Reminders"], vertical: "Healthcare", icon: Stethoscope },
  { name: "Support Voice", desc: "Real‑time phone support with knowledge search and summary to ticket.", channels: ["Voice", "Phone IVR"], caps: ["Search", "Summaries", "Ticket"], vertical: "SaaS / B2B", icon: Mic },
];

function classNames() {
  return Array.from(arguments).filter(Boolean).join(" ");
}

/**
 * =====================
 * Background visuals
 * =====================
 */
function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora gradients */}
      <div className="absolute -top-40 left-1/2 h-[60rem] w-[100rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-700/40 via-sky-600/30 to-emerald-600/30 blur-3xl" />
      <div className="absolute top-1/3 -left-40 h-[30rem] w-[60rem] rounded-full bg-gradient-to-tr from-fuchsia-600/20 to-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[40rem] w-[60rem] rounded-full bg-gradient-to-tr from-amber-400/15 to-indigo-500/15 blur-3xl" />
      {/* Subtle grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_0%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}

function Container({ children, className = "" }) {
  return <div className={classNames("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

function Section({ title, subtitle, children }) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        {title && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/90">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "rounded-full border px-3 py-1 text-xs transition",
        active ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={classNames(
        "rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_1px_0_rgba(255,255,255,0.05)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 rounded-xl border border-white/10 bg-white/5 p-2">
        <Icon className="h-5 w-5 text-white/80" />
      </div>
      <div>
        <div className="text-sm font-medium text-white/90">{title}</div>
        <div className="text-xs text-white/60">{desc}</div>
      </div>
    </div>
  );
}

function Navbar({ route, setRoute, openDemo, health }) {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500"></div>
          <span className="text-sm font-semibold text-white/90">{siteConfig.name}</span>
          <span className={classNames("ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]", health === "ok" ? "bg-emerald-500/20 text-emerald-200" : "bg-yellow-500/20 text-yellow-200")}>{health === "ok" ? "API ok" : "API offline"}</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          {navItems.map((n) => (
            <button
              key={n.key}
              onClick={() => setRoute(n.key)}
              className={classNames("text-xs", route === n.key ? "text-white" : "text-white/60 hover:text-white")}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={openDemo} className="hidden rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-black md:block">
            Book a demo
          </button>
          <button onClick={() => setRoute("contact")} className="rounded-xl border border-white/15 px-3 py-1.5 text-xs text-white/80 md:hidden">
            Contact
          </button>
        </div>
      </Container>
    </div>
  );
}

function Hero({ setRoute, openDemo }) {
  return (
    <div className="relative overflow-hidden border-b border-white/10">
      <Container className="relative py-16 sm:py-24">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>Voice • Chat • SMS • Email • IVR • API</Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white/95">{siteConfig.tagline}</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            Launch production agents in days. Keep brand voice, data privacy, and control. Scale from pilot to enterprise.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={openDemo} className="rounded-xl bg-white px-4 py-2 text-xs font-medium text-black">
              Book a demo
            </button>
            <button onClick={() => setRoute("agents")} className="rounded-xl border border-white/15 px-4 py-2 text-xs text-white/80">
              Browse agents
            </button>
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Feature icon={Shield} title="Security first" desc="SSO, audit logs, role permissions, PII guardrails." />
          </Card>
          <Card>
            <Feature icon={GitBranch} title="Bring your stack" desc="CRM, helpdesk, phone, CDP, data warehouse." />
          </Card>
          <Card>
            <Feature icon={Zap} title="Fast to value" desc="Templates, SDKs, and no‑code controls for ops." />
          </Card>
          <Card>
            <Feature icon={Database} title="Grounded answers" desc="Secure RAG over docs, KBs, and APIs." />
          </Card>
        </div>
      </Container>
    </div>
  );
}

// ---------- API layer (frontend client + offline queue + confirm + admin) ----------
const API = {
  baseUrl: typeof window !== "undefined"
    ? (window.__SPEAKDIRECT_API_BASE__ || window.__OMNI_API_BASE__ || "/api")
    : "/api",
  async health() {
    try {
      const r = await fetch(`${this.baseUrl}/health`);
      if (!r.ok) throw new Error("bad status");
      return "ok";
    } catch (e) {
      return "down";
    }
  },
  _readQueue() {
    try {
      return JSON.parse(localStorage.getItem("omni_queue") || "[]");
    } catch (e) {
      return [];
    }
  },
  _writeQueue(items) {
    localStorage.setItem("omni_queue", JSON.stringify(items || []));
  },
  async flushQueue() {
    const q = this._readQueue();
    if (!q.length) return 0;
    let sent = 0;
    for (const item of [...q]) {
      try {
        await this.post(item.path, item.payload);
        sent++;
        q.shift();
      } catch (e) {
        break; // stop on first failure
      }
    }
    this._writeQueue(q);
    return sent;
  },
  async post(path, payload) {
    const r = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`POST ${path} failed`);
    return r.json().catch(() => ({}));
  },
  async get(path, opts = {}) {
    const r = await fetch(`${this.baseUrl}${path}`, opts);
    if (!r.ok) throw new Error(`GET ${path} failed`);
    return r.json().catch(() => ({}));
  },
  async submitLead(payload) {
    const clean = validateLead(payload);
    const consent = getConsent();
    const attrib = getAttribution();
    const enriched = { ...clean, x_consent: consent, ...(attrib ? { x_attribution: attrib } : {}) };
    try {
      const res = await this.post(`/leads`, enriched);
      try { trackEvent("lead_submitted", { source: clean.source, topic: clean.topic || "", route: (window.location.hash || "").replace("#", "") || "home" }); } catch (_) {}
      return { ok: true, res };
    } catch (e) {
      const q = this._readQueue();
      q.push({ path: "/leads", payload: enriched, ts: Date.now() });
      this._writeQueue(q);
      return { ok: false, queued: true };
    }
  },
  async confirm(token) {
    return this.get(`/confirm?token=${encodeURIComponent(token)}`);
  },
  async adminList(status, token) {
    return this.get(`/admin/leads?status=${encodeURIComponent(status||'pending')}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

function validateLead(p) {
  const out = {
    name: (p.name || "").trim(),
    email: (p.email || "").trim(),
    company: (p.company || "").trim(),
    topic: (p.topic || "").trim(),
    message: (p.message || "").trim(),
    source: p.source || "contact",
  };
  if (!out.name) throw new Error("name required");
  if (!isValidEmail(out.email)) throw new Error("email invalid");
  return out;
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || ""));
}

// Pure helper for tests and filtering
function filterAgents(q, channel, vert) {
  const ql = (q || "").toLowerCase();
  return agentsSeed.filter((a) => {
    const matchQ = !ql || [a.name, a.desc, a.vertical, a.caps.join(" ")].join(" ").toLowerCase().includes(ql);
    const matchC = !channel || a.channels.includes(channel);
    const matchV = !vert || a.vertical === vert;
    return matchQ && matchC && matchV;
  });
}
// =====================
// Consent, Attribution, Analytics, Meta helpers
// =====================

const CONSENT_KEY = "omni_consent";
const ATTRIB_KEY = "omni_attrib";

function getConsent() {
  try {
    const x = JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}") || {};
    return { status: x.status || "unknown", ts: x.ts || null, source: x.source || "" };
  } catch (_) {
    return { status: "unknown", ts: null };
  }
}

function setConsent(status, source) {
  const rec = { status, ts: Date.now(), ...(source ? { source } : {}) };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
  return { status: rec.status, ts: rec.ts };
}

function getAttribution() {
  try {
    return JSON.parse(localStorage.getItem(ATTRIB_KEY) || "null");
  } catch (_) {
    return null;
  }
}

function captureAttributionOnce() {
  try {
    if (localStorage.getItem(ATTRIB_KEY)) return;
    const url = new URL(window.location.href);
    const p = url.searchParams;
    const utm = ["source", "medium", "campaign", "term", "content"].reduce((acc, k) => {
      const v = p.get(`utm_${k}`);
      if (v) acc[`utm_${k}`] = v;
      return acc;
    }, {});
    const ref = document.referrer || "";
    const landing = window.location.pathname + window.location.search + window.location.hash;
    const ts = Date.now();
    const rec = { ts, referrer: ref, landing, ...utm };
    localStorage.setItem(ATTRIB_KEY, JSON.stringify(rec));
  } catch (_) {}
}

function loadPosthog() {
  try {
    if (window.posthog && window.posthog.__loaded) return;
  } catch (_) {}
  const key = (window.__PH_API_KEY || "").trim();
  if (!key) return; // not configured
  const host = (window.__PH_HOST || "https://us.i.posthog.com").trim();
  if (!document.getElementById("posthog-js")) {
    const s = document.createElement("script");
    s.id = "posthog-js";
    s.async = true;
    s.src = "https://cdn.jsdelivr.net/npm/@posthog/posthog-js";
    s.onload = () => {
      try {
        window.posthog?.init(key, { api_host: host, capture_pageview: false, capture_pageleave: false });
        window.posthog.__loaded = true;
      } catch (_) {}
    };
    document.head.appendChild(s);
  } else if (window.posthog && !window.posthog.__loaded) {
    try {
      window.posthog.init(key, { api_host: host, capture_pageview: false, capture_pageleave: false });
      window.posthog.__loaded = true;
    } catch (_) {}
  }
}

function trackEvent(name, props) {
  try {
    if (getConsent().status !== "accepted") return;
    if (window.posthog && typeof window.posthog.capture === "function") {
      const route = (window.location.hash || "").replace("#", "") || "home";
      window.posthog.capture(name, { route, ...(props || {}) });
    }
  } catch (_) {}
}

const ROUTE_META = {
  home: { title: "SpeakDirect — AI agents for voice, chat, SMS", desc: "AI agents, voice reps, and automations for teams of any size.", image: null },
  agents: { title: "Agents — SpeakDirect", desc: "Agent catalog across voice, chat, SMS, and email.", image: null },
  solutions: { title: "Solutions — SpeakDirect", desc: "Industry solutions with playbooks and KPIs.", image: null },
  pricing: { title: "Pricing — SpeakDirect", desc: "Simple tiers with usage add-ons.", image: null },
  about: { title: "About — SpeakDirect", desc: "Security, RAG, and voice capabilities you can trust.", image: null },
  resources: { title: "Resources — SpeakDirect", desc: "Docs and policies.", image: null },
  contact: { title: "Contact — SpeakDirect", desc: "Tell us your goals and constraints.", image: null },
  confirm: { title: "Confirm — SpeakDirect", desc: "Confirm your email.", image: null },
  admin: { title: "Admin — SpeakDirect", desc: "Leads Dashboard.", image: null },
  terms: { title: "Terms — SpeakDirect", desc: "Terms of Service.", image: null },
  privacy: { title: "Privacy — SpeakDirect", desc: "Privacy Policy.", image: null },
  aup: { title: "Acceptable Use — SpeakDirect", desc: "Acceptable Use Policy.", image: null },
  dpa: { title: "DPA — SpeakDirect", desc: "Data Processing Addendum.", image: null },
  status: { title: "Status — SpeakDirect", desc: "Current uptime and incidents.", image: null },
  notfound: { title: "Not Found — SpeakDirect", desc: "The page you requested was not found.", image: null },
};

// Known route keys to validate hash routing
const KNOWN_ROUTES = new Set(Object.keys(ROUTE_META));

function ensureMetaTag(selector, attrs) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
}

function updateMetaTags(route) {
  try {
    const meta = ROUTE_META[route] || ROUTE_META.home;
    const title = meta.title;
    const desc = meta.desc;
    const img = window.__OG_IMAGE || meta.image || "";
    const url = window.location.origin + "/" + (route === "home" ? "" : `#${route}`);
    document.title = title;
    const d = ensureMetaTag('meta[name="description"]', { name: "description" });
    d.setAttribute("content", desc);
    const ogt = ensureMetaTag('meta[property="og:title"]', { property: "og:title" });
    ogt.setAttribute("content", title);
    const ogd = ensureMetaTag('meta[property="og:description"]', { property: "og:description" });
    ogd.setAttribute("content", desc);
    const ogi = ensureMetaTag('meta[property="og:image"]', { property: "og:image" });
    if (img) ogi.setAttribute("content", img);
    const ogu = ensureMetaTag('meta[property="og:url"]', { property: "og:url" });
    ogu.setAttribute("content", url);
    const ogtpe = ensureMetaTag('meta[property="og:type"]', { property: "og:type" });
    ogtpe.setAttribute("content", "website");
    const twc = ensureMetaTag('meta[name="twitter:card"]', { name: "twitter:card" });
    twc.setAttribute("content", "summary_large_image");
    const twt = ensureMetaTag('meta[name="twitter:title"]', { name: "twitter:title" });
    twt.setAttribute("content", title);
    const twd = ensureMetaTag('meta[name="twitter:description"]', { name: "twitter:description" });
    twd.setAttribute("content", desc);
    const twi = ensureMetaTag('meta[name="twitter:image"]', { name: "twitter:image" });
    if (img) twi.setAttribute("content", img);
  } catch (_) {}
}

function parseRoute() {
  return (window.location.hash || "").replace("#", "") || "home";
}

function AgentsPage({ openDemo }) {
  const [q, setQ] = useState("");
  const [channel, setChannel] = useState(null);
  const [vert, setVert] = useState(null);

  const filtered = useMemo(() => filterAgents(q, channel, vert), [q, channel, vert]);

  return (
    <>
      <Section title="Agent catalog" subtitle="Search, filter, and pick a starting point. We tailor to your workflow.">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search agents"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 md:max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Pill active={!channel} onClick={() => setChannel(null)}>All channels</Pill>
            {channels.map((c) => (
              <Pill key={c} active={channel === c} onClick={() => setChannel(c)}>{c}</Pill>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill active={!vert} onClick={() => setVert(null)}>All industries</Pill>
          {verticals.map((v) => (
            <Pill key={v.label} active={vert === v.label} onClick={() => setVert(v.label)}>{v.label}</Pill>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Card key={a.name}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <a.icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">{a.name}</div>
                    <div className="text-xs text-white/60">{a.vertical}</div>
                  </div>
                </div>
                <button onClick={openDemo} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10">Try</button>
              </div>
              <p className="mt-3 text-xs text-white/70">{a.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.channels.map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.caps.map((c) => (
                  <span key={c} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/70">{c}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Custom builds" subtitle="Unique workflow or phone tree? We scope, prototype, and deliver.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <Feature icon={LayoutTemplate} title="Templates first" desc="Start from a proven template and tune policies." />
          </Card>
          <Card>
            <Feature icon={Workflow} title="Workflow orchestration" desc="Compose tools, data, and human steps." />
          </Card>
          <Card>
            <Feature icon={Shield} title="Compliance" desc="SSO, data residency options, and access controls." />
          </Card>
        </div>
        <div className="mt-6">
          <button onClick={openDemo} className="rounded-xl bg-white px-4 py-2 text-xs font-medium text-black">Request scoping call</button>
        </div>
      </Section>
    </>
  );
}

function SolutionsPage({ openDemo }) {
  return (
    <>
      <Section title="Industry solutions" subtitle="Out‑of‑the‑box value with room for customization.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {verticals.map((v) => (
            <Card key={v.label}>
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2"><v.icon className="h-5 w-5 text-white/80" /></div>
                <div className="text-sm font-medium text-white/90">{v.label}</div>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-xs text-white/70">
                <li>Top 3 agents pre‑tuned</li>
                <li>Playbooks and KPIs</li>
                <li>Integrations map</li>
              </ul>
              <div className="mt-4">
                <button onClick={openDemo} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80">See plan</button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Integrations" subtitle="Works with your phone, CRM, helpdesk, calendar, payments, data.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone, label: "Telephony" },
            { icon: Mail, label: "Email & Inbox" },
            { icon: MessageSquare, label: "Chat & Social" },
            { icon: Database, label: "Data & RAG" },
          ].map((i) => (
            <Card key={i.label}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2"><i.icon className="h-5 w-5 text-white/80" /></div>
                <div className="text-sm font-medium text-white/90">{i.label}</div>
              </div>
              <p className="mt-2 text-xs text-white/70">Twilio/Plivo, Gmail/Outlook, Slack/Teams, Stripe, Calendars, CRMs, Helpdesks, Warehouses.</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Proof of value" subtitle="Clear wins in weeks.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="text-3xl font-semibold text-white/90">40–65%</div>
            <div className="text-xs text-white/60">Ticket deflection after a docs‑QA bot launch</div>
          </Card>
          <Card>
            <div className="text-3xl font-semibold text-white/90">2–4x</div>
            <div className="text-xs text-white/60">Lead response speed with SMS voice callback</div>
          </Card>
          <Card>
            <div className="text-3xl font-semibold text-white/90">&lt; 2 weeks</div>
            <div className="text-xs text-white/60">Typical pilot to first win</div>
          </Card>
        </div>
      </Section>
    </>
  );
}

function PricingPage({ openDemo }) {
  const tiers = [
    { name: "Starter", price: "$499/mo", tagline: "One agent, one channel", features: ["1 agent", "Up to 2k messages or 500 mins", "Email support", "Basic analytics"] },
    { name: "Growth", price: "$1,499/mo", tagline: "Multi‑channel", features: ["Up to 3 agents", "10k messages or 2k mins", "CRM/helpdesk integrations"] },
    { name: "Pro", price: "$3,999/mo", tagline: "Scaled ops", features: ["Up to 8 agents", "25k messages or 5k mins", "SSO + audit logs", "Custom policies"] },
    { name: "Enterprise", price: "Custom", tagline: "Advanced controls", features: ["Unlimited agents", "Data residency", "On‑prem options", "Dedicated manager"] },
  ];

  return (
    <Section title="Pricing" subtitle="Simple tiers. Usage overages billed at cost + platform fee.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((t) => (
          <Card key={t.name} className="flex flex-col">
            <div className="text-sm font-semibold text-white/90">{t.name}</div>
            <div className="mt-2 text-2xl font-semibold text-white/95">{t.price}</div>
            <div className="text-xs text-white/60">{t.tagline}</div>
            <ul className="mt-4 space-y-2 text-xs text-white/70">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />{f}</li>
              ))}
            </ul>
            <div className="mt-5">
              <button onClick={openDemo} className="w-full rounded-xl bg-white px-3 py-2 text-xs font-medium text-black">Start</button>
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-white/50">Telephony, LLM, and vector costs pass‑through or bring‑your‑own.</p>
    </Section>
  );
}

function AboutPage() {
  const steps = [
    { icon: LayoutTemplate, title: "Scope", desc: "Map goals, channels, and success metrics." },
    { icon: Workflow, title: "Prototype", desc: "Template + your data and policies." },
    { icon: Phone, title: "Pilot", desc: "Limited traffic, guardrails, feedback loop." },
    { icon: Zap, title: "Scale", desc: "Rollout with training and alerts." },
  ];
  return (
    <>
      <Section title="About" subtitle="We build reliable AI that respects users and operators.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm text-white/70">
              SpeakDirect offers production systems for voice and chat. The team ships with a playbook focused on safety, brand voice, and measurable wins. We partner with ops and support leaders to remove toil and speed response.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Feature icon={Shield} title="Security" desc="SSO, RBAC, PII controls, audit logs." />
              <Feature icon={Database} title="Data" desc="RAG over KBs, wikis, and APIs with source links." />
              <Feature icon={GitBranch} title="Dev" desc="SDKs, webhooks, staged configs, and tests." />
              <Feature icon={Phone} title="Voice" desc="Low‑latency calls with high ASR accuracy." />
            </div>
          </Card>
          <Card>
            <div className="text-sm font-medium text-white/80">Delivery process</div>
            <ol className="mt-3 space-y-3 text-sm text-white/70">
              {steps.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2"><s.icon className="h-5 w-5 text-white/80" /></div>
                  <div>
                    <div className="font-medium text-white/85">{s.title}</div>
                    <div className="text-xs text-white/60">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </Section>

      <Section title="Trusted foundations" subtitle="Built on proven providers.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Twilio", "Plivo", "Vonage", "OpenAI", "Anthropic", "Cohere", "Google", "AWS"].map((n) => (
            <Card key={n} className="flex items-center justify-center py-8">
              <span className="text-sm text-white/70">{n}</span>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

function ResourcesPage({ setRoute }) {
  const items = [
    { title: "Implementation Guide", desc: "Steps from scoping to scale.", tag: "PDF soon", action: () => setRoute("contact") },
    { title: "Security Overview", desc: "Controls, data flow, and vendor list.", tag: "Overview", action: () => setRoute("contact") },
    { title: "API & Webhooks", desc: "Events, payloads, examples.", tag: "Docs", action: () => setRoute("contact") },
  ];
  return (
    <Section title="Resources" subtitle="Docs and policies. Ask for anything missing.">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((i) => (
          <Card key={i.title} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white/90">{i.title}</div>
              <div className="text-xs text-white/60">{i.desc}</div>
            </div>
            <div className="flex items-center gap-3">
              <Badge>{i.tag}</Badge>
              <button onClick={i.action} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80">Request</button>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: "", message: "" });
  const [status, setStatus] = useState("idle");
  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await API.submitLead({ ...form, source: "contact" });
      setStatus(res.ok ? "confirm" : res.queued ? "queued" : "error");
      if (res.ok) setForm({ name: "", email: "", company: "", topic: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <Section title="Contact" subtitle="Tell us your goals and constraints. We respond within one business day.">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={form.name} onChange={onChange("name")} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Name" />
              <input value={form.email} onChange={onChange("email")} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Email" />
            </div>
            <input value={form.company} onChange={onChange("company")} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Company" />
            <select value={form.topic} onChange={onChange("topic")} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
              <option className="bg-black" value="">What are you exploring?</option>
              <option className="bg-black" value="Voice support">Voice support</option>
              <option className="bg-black" value="Sales outreach">Sales outreach</option>
              <option className="bg-black" value="Booking and scheduling">Booking and scheduling</option>
              <option className="bg-black" value="Docs QA / RAG">Docs QA / RAG</option>
              <option className="bg-black" value="Custom">Custom</option>
            </select>
            <textarea value={form.message} onChange={onChange("message")} rows={5} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Describe your use case" />
            <div className="flex flex-wrap items-center gap-2">
              <button disabled={status === "submitting"} className="rounded-xl bg-white px-4 py-2 text-xs font-medium text-black">{status === "submitting" ? "Sending…" : "Send"}</button>
              <a href={`mailto:${siteConfig.email}`} className="text-xs text-white/70 underline">Email {siteConfig.email}</a>
              {status === "confirm" && <span className="text-xs text-emerald-300">Check your email to confirm</span>}
              {status === "queued" && <span className="text-xs text-yellow-300">Saved offline</span>}
              {status === "error" && <span className="text-xs text-red-300">Error</span>}
            </div>
          </form>
        </Card>
        <Card>
          <div className="text-sm font-medium text-white/80">Details</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><span className="text-white/60">Email:</span> {siteConfig.email}</li>
            <li><span className="text-white/60">Phone:</span> {siteConfig.phone}</li>
            <li><span className="text-white/60">HQ:</span> Remote‑first • US</li>
          </ul>
          <div className="mt-6 text-xs text-white/50">We never share contact data. Messages route to the core team inbox with SSO access only.</div>
        </Card>
      </div>
    </Section>
  );
}

function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("omni_admin_token") || "");
  const [status, setStatus] = useState("pending");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await API.adminList(status, token);
      setRows(res.items || []);
      localStorage.setItem("omni_admin_token", token);
    } catch (e) {
      setError("Auth failed or API down");
      setRows([]);
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <Section title="Admin" subtitle="View pending and confirmed leads.">
      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input value={token} onChange={(e)=>setToken(e.target.value)} placeholder="Admin token" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 sm:max-w-xs" />
            <div className="flex items-center gap-2">
              <Pill active={status==='pending'} onClick={()=>setStatus('pending')}>Pending</Pill>
              <Pill active={status==='confirmed'} onClick={()=>setStatus('confirmed')}>Confirmed</Pill>
            </div>
            <button onClick={load} className="rounded-xl bg-white px-4 py-2 text-xs font-medium text-black">Refresh</button>
          </div>
          {error && <div className="text-xs text-red-300">{error}</div>}
          <div className="overflow-auto">
            <table className="min-w-full text-left text-xs text-white/80">
              <thead className="text-white/60">
                <tr>
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Company</th>
                  <th className="py-2 pr-4">Topic</th>
                  <th className="py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r)=> (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="py-2 pr-4">{new Date(r.ts).toLocaleString()}</td>
                    <td className="py-2 pr-4">{r.name}</td>
                    <td className="py-2 pr-4">{r.email}</td>
                    <td className="py-2 pr-4">{r.company||""}</td>
                    <td className="py-2 pr-4">{r.topic||""}</td>
                    <td className="py-2">{r.source||""}</td>
                  </tr>
                ))}
                {rows.length===0 && (
                  <tr><td colSpan={6} className="py-6 text-center text-white/50">No items</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </Section>
  );
}

function Footer({ setRoute }) {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500" />
            <div>
              <div className="text-sm font-semibold text-white/90">{siteConfig.name}</div>
              <div className="text-xs text-white/50">AI agents and automations</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/70">
            {navItems.map((n) => (
              <button key={n.key} onClick={() => setRoute(n.key)} className="hover:text-white">{n.label}</button>
            ))}
            <span className="hidden sm:inline-block text-white/20">|</span>
            <button onClick={() => setRoute("privacy")} className="hover:text-white">Privacy</button>
            <button onClick={() => setRoute("terms")} className="hover:text-white">Terms</button>
            <button onClick={() => setRoute("aup")} className="hover:text-white">AUP</button>
            <button onClick={() => setRoute("dpa")} className="hover:text-white">DPA</button>
            {/* Status: external link if window.__STATUS_URL is set; otherwise route to internal status page */}
            <a
              href={typeof window !== "undefined" && window.__STATUS_URL ? window.__STATUS_URL : "#status"}
              target={typeof window !== "undefined" && window.__STATUS_URL ? "_blank" : undefined}
              rel={typeof window !== "undefined" && window.__STATUS_URL ? "noreferrer" : undefined}
              onClick={(e) => {
                if (!(typeof window !== "undefined" && window.__STATUS_URL)) {
                  e.preventDefault();
                  setRoute("status");
                }
              }}
              className="hover:text-white"
            >
              Status
            </a>
          </div>
          <div className="text-xs text-white/50">© {new Date().getFullYear()} {siteConfig.name}</div>
        </div>
      </Container>
    </footer>
  );
}

function TermsPage() {
  return (
    <Section title="Terms of Service" subtitle="The rules for using our services.">
      <Card className="text-sm text-white/80">
        <p>These Terms of Service govern your use of OmniAgents products and services. By using our services, you agree to these terms.</p>
        <p className="mt-3">Contact us if you have any questions.</p>
      </Card>
    </Section>
  );
}

function PrivacyPage() {
  return (
    <Section title="Privacy Policy" subtitle="How we collect, use, and protect data.">
      <Card className="text-sm text-white/80">
        <p>We use privacy-friendly analytics and minimize personal data. See full policy for details on collection, processors, retention, and rights.</p>
        <p className="mt-3">For full text, see our policy or contact us.</p>
      </Card>
    </Section>
  );
}

function AUPPage() {
  return (
    <Section title="Acceptable Use Policy" subtitle="Guidelines for fair and lawful use.">
      <Card className="text-sm text-white/80">
        <p>Don’t use our services to harm others, abuse resources, or break the law. Security testing requires authorization.</p>
      </Card>
    </Section>
  );
}

function DPAPage() {
  return (
    <Section title="Data Processing Addendum" subtitle="Our commitments as a processor.">
      <Card className="text-sm text-white/80">
        <p>Where applicable, we offer a DPA to define roles, security measures, and subprocessors in compliance with data protection laws.</p>
      </Card>
    </Section>
  );
}


function StatusPage() {
  const hasExternal = typeof window !== "undefined" && window.__STATUS_URL;
  return (
    <Section title="Status" subtitle="Current uptime and incidents.">
      <Card className="text-sm text-white/80">
        {hasExternal ? (
          <p>
            View real-time status at {" "}
            <a href={window.__STATUS_URL} target="_blank" rel="noreferrer" className="underline">{window.__STATUS_URL}</a>.
          </p>
        ) : (
          <p>Status page link coming soon. Check release notes or contact support.</p>
        )}
      </Card>
    </Section>
  );
}

function NotFoundPage({ setRoute }) {
  return (
    <Section title="Page not found" subtitle="The page you requested does not exist.">
      <Card className="text-sm text-white/80">
        <div className="flex items-center justify-between">
          <p>Use the navigation above or go back to the homepage.</p>
          <button onClick={() => setRoute('home')} className="rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-black">Go home</button>
        </div>
      </Card>
    </Section>
  );
}

function DemoModal({ open, onClose, setRoute }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/70 p-6 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-white/90">Book a demo</div>
            <div className="text-xs text-white/60">Tell us your goals. We set up a focused session.</div>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] text-white/80">Close</button>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setStatus("submitting");
            const res = await API.submitLead({ name: form.name, email: form.email, message: form.message, topic: "Demo", source: "demo" }).catch(() => ({ ok: false }));
            setStatus(res.ok ? "confirm" : res.queued ? "queued" : "error");
            if (res.ok) setForm({ name: "", email: "", message: "" });
          }}
          className="mt-4 space-y-3"
        >
          <input value={form.name} onChange={onChange("name")} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Name" />
          <input value={form.email} onChange={onChange("email")} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="Work email" />
          <textarea value={form.message} onChange={onChange("message")} rows={4} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="What do you want to automate?" />
          <div className="flex flex-wrap items-center gap-2">
            <button disabled={status === "submitting"} className="rounded-xl bg-white px-4 py-2 text-xs font-medium text-black">{status === "submitting" ? "Sending…" : "Submit"}</button>
            <a href={`mailto:${siteConfig.email}`} className="text-xs text-white/70 underline">Email {siteConfig.email}</a>
            {status === "confirm" && <span className="text-xs text-emerald-300">Check your email to confirm</span>}
            {status === "queued" && <span className="text-xs text-yellow-300">Saved offline</span>}
            {status === "error" && <span className="text-xs text-red-300">Error</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

function CookieBanner({ consent, onChange }) {
  const show = consent !== "accepted" && consent !== "declined";
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50">
      <Container>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur">
          <div className="text-xs text-white/80">
            We use privacy-friendly analytics to improve the site. Only loads after you accept.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const c = setConsent("declined", "cookie_banner");
                onChange?.(c.status);
              }}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
            >
              Decline
            </button>
            <button
              onClick={() => {
                const c = setConsent("accepted", "cookie_banner");
                onChange?.(c.status);
                loadPosthog();
                try { trackEvent("consent_accepted", { source: "cookie_banner" }); } catch (_) {}
              }}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black"
            >
              Accept
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

function ConfirmPage({ token }) {
  const [state, setState] = useState("pending");
  useEffect(() => {
    if (!token) return setState("missing");
    API.confirm(token)
      .then(() => setState("ok"))
      .catch(() => setState("error"));
  }, [token]);

  return (
    <Section title="Confirm your email" subtitle="One click to finish.">
      <Card className="text-sm text-white/80">
        {state === "pending" && <div>Confirming…</div>}
        {state === "ok" && <div>All set. We sent your details to our team. We will reply by email.</div>}
        {state === "missing" && <div>Token missing. Open the link from your email again.</div>}
        {state === "error" && <div>Link invalid or expired. Request a new confirmation from the contact form.</div>}
      </Card>
    </Section>
  );
}

// Lightweight dev tests (console output)
function runDevTests() {
  const assert = (name, ok) => console.log(ok ? `✅ ${name}` : `❌ ${name}`);
  assert("classNames merges", classNames("a", false, "b") === "a b");
  assert("search finds Sales Agent", filterAgents("sales", null, null).some((a) => a.name === "Sales Agent"));
  assert("channel filter Voice", filterAgents("", "Voice", null).every((a) => a.channels.includes("Voice")));
  assert("vertical filter Hospitality", filterAgents("", null, "Hospitality").every((a) => a.vertical === "Hospitality"));
  assert("email validator ok", isValidEmail("user@example.com") === true && isValidEmail("bad@com") === false);
  try {
    validateLead({ name: "a", email: " bad@example.com  " });
    assert("validateLead trims email", true);
  } catch (_) {
    assert("validateLead trims email", false);
  }
  try {
    validateLead({ name: "a", email: "bad" });
    assert("validateLead rejects bad email", false);
  } catch (_) {
    assert("validateLead rejects bad email", true);
  }
}

export default function App() {
  const [route, setRoute] = useState("home");
  const [demoOpen, setDemoOpen] = useState(false);
  const [apiHealth, setApiHealth] = useState("down");
  const [confirmToken, setConfirmToken] = useState("");
  const [consentStatus, setConsentStatus] = useState(getConsent().status);

  useEffect(() => {
    const init = () => {
      const raw = window.location.hash.replace("#", "");
      if (raw.startsWith("confirm")) {
        const qs = new URLSearchParams(raw.split("?")[1] || "");
        setConfirmToken(qs.get("token") || "");
        setRoute("confirm");
      } else if (raw) {
        setRoute(KNOWN_ROUTES.has(raw) ? raw : "notfound");
        if (!KNOWN_ROUTES.has(raw)) window.location.hash = "notfound";
      }
    };
    init();
    const onHash = () => {
      const raw = window.location.hash.replace("#", "");
      if (raw.startsWith("confirm")) {
        const qs = new URLSearchParams(raw.split("?")[1] || "");
        setConfirmToken(qs.get("token") || "");
        setRoute("confirm");
      } else {
        const next = raw || "home";
        setRoute(KNOWN_ROUTES.has(next) ? next : "notfound");
      }
    };
    window.addEventListener("hashchange", onHash);
    const onOnline = () => {
      API.flushQueue();
      API.health().then(setApiHealth).catch(() => setApiHealth("down"));
    };
    const onOffline = () => setApiHealth("down");
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const poll = setInterval(() => {
      API.health().then(setApiHealth).catch(() => setApiHealth("down"));
    }, 30000);
    if (!window.__OMNI_TESTED__) {
      runDevTests();
      window.__OMNI_TESTED__ = true;
    }
    API.health().then(setApiHealth);
    API.flushQueue();
    captureAttributionOnce();
    if (getConsent().status === "accepted") {
      loadPosthog();
    }
    try { updateMetaTags(parseRoute()); } catch (_) {}
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearInterval(poll);
    };
  }, []);

  const openDemo = () => {
    if (getConsent().status === "accepted") {
      try { trackEvent("demo_open", { route }); } catch (_) {}
    }
    setDemoOpen(true);
  };
  const closeDemo = () => setDemoOpen(false);
  const navigate = (r) => {
    const next = KNOWN_ROUTES.has(r) ? r : "notfound";
    setRoute(next);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    try { updateMetaTags(route); } catch (_) {}
    if (getConsent().status === "accepted") {
      try { trackEvent("page_view", { route }); } catch (_) {}
    }
  }, [route]);

  useEffect(() => {
    if (consentStatus === "accepted") {
      loadPosthog();
      try { trackEvent("page_view", { route }); } catch (_) {}
    }
  }, [consentStatus]);

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteBackground />
      <Navbar route={route} setRoute={navigate} openDemo={openDemo} health={apiHealth} />
      {route === "home" && (
        <>
          <Hero setRoute={navigate} openDemo={openDemo} />
          <AgentsPage openDemo={openDemo} />
          <SolutionsPage openDemo={openDemo} />
        </>
      )}
      {route === "agents" && <AgentsPage openDemo={openDemo} />}
      {route === "solutions" && <SolutionsPage openDemo={openDemo} />}
      {route === "pricing" && <PricingPage openDemo={openDemo} />}
      {route === "about" && <AboutPage />}
      {route === "resources" && <ResourcesPage setRoute={navigate} />}
      {route === "contact" && <ContactPage />}
      {route === "terms" && <TermsPage />}
      {route === "privacy" && <PrivacyPage />}
      {route === "aup" && <AUPPage />}
      {route === "dpa" && <DPAPage />}
      {route === "status" && <StatusPage />}
      {route === "notfound" && <NotFoundPage setRoute={navigate} />}
      {route === "confirm" && <ConfirmPage token={confirmToken} />}
      {route === "admin" && <AdminPage />}
      <CookieBanner consent={consentStatus} onChange={(s) => setConsentStatus(s)} />
      <Footer setRoute={navigate} />
      <DemoModal open={demoOpen} onClose={closeDemo} setRoute={navigate} />
    </div>
  );
}

/**
 * =====================
 * Backend starter (reference)
 * =====================
 * Save as server.js in a Node project. Email + double opt-in + admin + branded HTML.
 * Requires Node 18+. Install: npm i express cors nodemailer
 *
 * ENV needed:
 *  PORT=8080
 *  FRONTEND_PUBLIC_URL=https://yourdomain.com
 *  SALES_EMAIL=darian.ghodsi@gmail.com
 *  FROM_EMAIL=OmniAgents <darian.ghodsi@gmail.com>   # keep From on gmail user to avoid DMARC issues
 *  ADMIN_TOKEN=change_admin_token_here
 *  HMAC_SECRET=change_this_long_random_string
 *  # Gmail SMTP (use app password)
 *  GMAIL_USER=darian.ghodsi@gmail.com
 *  GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 *
 * const fs = require('fs');
 * const path = require('path');
 * const express = require('express');
 * const cors = require('cors');
 * const crypto = require('crypto');
 * const nodemailer = require('nodemailer');
 *
 * const app = express();
 * app.use(cors());
 * app.use(express.json());
 *
 * const cfg = {
 *   base: process.env.FRONTEND_PUBLIC_URL || 'http://localhost:5173',
 *   sales: process.env.SALES_EMAIL,
 *   from: process.env.FROM_EMAIL,
 *   secret: process.env.HMAC_SECRET || 'dev-secret',
 *   adminToken: process.env.ADMIN_TOKEN || 'dev-admin',
 * };
 *
 * const STORE = path.join(process.cwd(), 'leads.json');
 * function readStore(){
 *   try { return JSON.parse(fs.readFileSync(STORE,'utf8')); } catch(e){ return { pending: [], confirmed: [] }; }
 * }
 * function writeStore(data){ fs.writeFileSync(STORE, JSON.stringify(data,null,2)); }
 *
 * function sign(payload) {
 *   const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
 *   const sig = crypto.createHmac('sha256', cfg.secret).update(data).digest('base64url');
 *   return `${data}.${sig}`;
 * }
 * function verify(token, maxAgeMs = 1000*60*60*24*7) { // 7 days
 *   const [data, sig] = String(token || '').split('.');
 *   if (!data || !sig) throw new Error('bad token');
 *   const expect = crypto.createHmac('sha256', cfg.secret).update(data).digest('base64url');
 *   if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) throw new Error('sig');
 *   const obj = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
 *   if (Date.now() - (obj.ts||0) > maxAgeMs) throw new Error('expired');
 *   return obj;
 * }
 *
 * function makeTransport() {
 *   if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
 *     return nodemailer.createTransport({
 *       service: 'gmail',
 *       auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
 *     });
 *   }
 *   return {
 *     sendMail: async (opts) => {
 *       console.log('\n[DEV MAIL]\nTo:', opts.to, '\nSubject:', opts.subject, '\nText:', opts.text, '\nHTML:', opts.html);
 *       return { messageId: 'dev' };
 *     }
 *   };
 * }
 * const mailer = makeTransport();
 *
 * const brand = {
 *   bgTop: '#0891b2', // cyan-700
 *   bgBottom: '#10b981', // emerald-500
 * };
 * function emailLayout(title, bodyHtml) {
 *   return `<!doctype html><html><body style="margin:0;background:#0b0b0b;color:#0b1220;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;">
 *   <div style="background:linear-gradient(135deg, ${brand.bgTop}, ${brand.bgBottom});padding:28px 0;text-align:center;">
 *     <div style="max-width:640px;margin:0 auto;color:#fff;font-weight:600;font-size:18px;">OmniAgents</div>
 *   </div>
 *   <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;margin-top:-16px;box-shadow:0 6px 30px rgba(0,0,0,0.25)">
 *     <div style="font-size:18px;font-weight:600;color:#0b1220;">${title}</div>
 *     <div style="margin-top:8px;color:#0b1220;font-size:14px;line-height:1.5">${bodyHtml}</div>
 *     <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">© ${new Date().getFullYear()} OmniAgents</div>
 *   </div>
 *   </body></html>`;
 * }
 *
 * function confirmEmail(name, link){
 *   const body = `<p>Hi ${name},</p>
 *   <p>Confirm your email so we can follow up.</p>
 *   <p style="margin:16px 0"><a href="${link}" style="background:#0ea5e9;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block">Confirm email</a></p>
 *   <p>Or open this link: <br/><span style="word-break:break-all">${link}</span></p>`;
 *   return emailLayout('Confirm your email', body);
 * }
 * function thankYouEmail(){
 *   const body = `<p>Thanks — we received your request.</p><p>Our team will reply shortly.</p>`;
 *   return emailLayout('We received your request', body);
 * }
 * function salesEmail(lead){
 *   const body = `<p>New confirmed lead</p>
 *   <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:12px">Name: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company||''}\nTopic: ${lead.topic||''}\nSource: ${lead.source||''}\nMessage:\n${lead.message||''}</pre>`;
 *   return emailLayout('New confirmed lead', body);
 * }
 *
 * app.get('/api/health', (req,res)=>res.json({ok:true}));
 *
 * app.post('/api/leads', async (req,res) => {
 *   const {name,email,company,topic,message,source} = req.body||{};
 *   if (!name || !/^([^\s@])+@([^\s@]+)\.[^\s@]+$/.test(email)) return res.status(400).json({ok:false});
 *   const id = crypto.randomBytes(6).toString('base64url');
 *   const token = sign({ id, name,email,company,topic,message,source, ts: Date.now() });
 *   const link = `${cfg.base}/#confirm?token=${encodeURIComponent(token)}`;
 *   const html = confirmEmail(name, link);
 *   const text = `Hi ${name}\n\nConfirm your email: ${link}`;
 *   // Store pending
 *   const store = readStore();
 *   store.pending.unshift({ id, name,email,company,topic,message,source, ts: Date.now() });
 *   writeStore(store);
 *   await mailer.sendMail({ from: cfg.from, to: email, subject: 'Confirm your email — OmniAgents', html, text });
 *   res.json({ ok: true, confirmSent: true });
 * });
 *
 * app.get('/api/confirm', async (req,res) => {
 *   try {
 *     const tok = req.query.token;
 *     const lead = verify(tok);
 *     const store = readStore();
 *     // Move from pending to confirmed
 *     const idx = store.pending.findIndex((x)=>x.id===lead.id);
 *     if (idx !== -1) {
 *       const row = store.pending.splice(idx,1)[0];
 *       store.confirmed.unshift(row);
 *       writeStore(store);
 *       // Notify sales and user
 *       await mailer.sendMail({ from: cfg.from, to: cfg.sales, subject: 'New confirmed lead — OmniAgents', html: salesEmail(row) });
 *       await mailer.sendMail({ from: cfg.from, to: row.email, subject: 'Thanks — we received your request', html: thankYouEmail() });
 *     }
 *     res.json({ ok: true });
 *   } catch (e) {
 *     res.status(400).json({ ok:false });
 *   }
 * });
 *
 * // Admin: list leads (pending or confirmed)
 * app.get('/api/admin/leads', (req,res)=>{
 *   const auth = req.headers.authorization||'';
 *   const token = auth.replace('Bearer ','');
 *   if (token !== cfg.adminToken) return res.status(401).json({ ok:false });
 *   const status = (req.query.status||'pending');
 *   const store = readStore();
 *   const items = status==='confirmed' ? store.confirmed : store.pending;
 *   res.json({ ok:true, items });
 * });
 *
 * app.listen(process.env.PORT||8080,()=>console.log('API on',process.env.PORT||8080));
 *
 * // Notes:
 * // - Generate a Gmail app password in Google Account > Security > 2‑Step Verification > App passwords.
 * // - Run behind HTTPS and set FRONTEND_PUBLIC_URL to your domain.
 */
