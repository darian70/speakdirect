"use client";
import posthog from "posthog-js";

let initialized = false;

type Consent = { status: "accepted" | "declined" | "unknown"; ts?: number };

export function getConsent(): Consent {
  if (typeof window === "undefined") return { status: "unknown" };
  try {
    const v = localStorage.getItem("omni_consent");
    return v ? JSON.parse(v) : { status: "unknown" };
  } catch {
    return { status: "unknown" };
  }
}

export function setConsent(status: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  localStorage.setItem("omni_consent", JSON.stringify({ status, ts: Date.now() }));
}

export function initAnalytics() {
  if (initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (getConsent().status === "accepted" && key) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: false
    });
    initialized = true;
  }
}

export function track(name: string, props?: Record<string, any>) {
  if (getConsent().status !== "accepted") return;
  try { posthog.capture(name, props); } catch {}
}
