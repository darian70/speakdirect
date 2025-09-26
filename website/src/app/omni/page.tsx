"use client"

import React, { useEffect } from "react";
// Import the SPA component from the repository root
// Requires experimental.externalDir=true in next.config.js
import OmniApp from "../../../../speakdirect_website.jsx";

function EnvInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const api = process.env.NEXT_PUBLIC_SPEAKDIRECT_API_BASE || process.env.NEXT_PUBLIC_OMNI_API_BASE;
    const phKey = process.env.NEXT_PUBLIC_PH_API_KEY;
    const phHost = process.env.NEXT_PUBLIC_PH_HOST;
    const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;

    if (api) {
      (window as any).__SPEAKDIRECT_API_BASE__ = api;
      (window as any).__OMNI_API_BASE__ = api; // backward compatible
    }
    if (phKey) (window as any).__PH_API_KEY = phKey;
    if (phHost) (window as any).__PH_HOST = phHost;
    if (statusUrl) (window as any).__STATUS_URL = statusUrl;
  }, []);
  return null;
}

export default function OmniPage() {
  return (
    <div className="min-h-screen bg-black">
      <EnvInit />
      <OmniApp />
    </div>
  );
}
