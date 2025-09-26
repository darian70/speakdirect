"use client";
import React, { useState, useEffect } from "react";

export function CookieBanner() {
  const [status, setStatus] = useState<string>("unknown");
  useEffect(() => {
    try {
      const v = localStorage.getItem("omni_consent");
      setStatus(v ? JSON.parse(v)?.status ?? "unknown" : "unknown");
    } catch {}
  }, []);

  if (status === "accepted" || status === "declined") return null;

  return (
    <div style={{position:"fixed",bottom:16,left:16,right:16,background:"#111",color:"#fff",padding:12,borderRadius:8,zIndex:50}}>
      <span style={{opacity:.8, fontSize:12}}>We use privacy-friendly analytics. Loads only after you accept.</span>
      <div style={{float:"right"}}>
        <button onClick={() => { localStorage.setItem("omni_consent", JSON.stringify({status:"declined", ts: Date.now()})); setStatus("declined"); try { window.dispatchEvent(new CustomEvent("omni:consent", { detail: { status: "declined" }})); } catch {} }} style={{marginRight:8}}>Decline</button>
        <button onClick={() => { localStorage.setItem("omni_consent", JSON.stringify({status:"accepted", ts: Date.now()})); setStatus("accepted"); try { window.dispatchEvent(new CustomEvent("omni:consent", { detail: { status: "accepted" }})); } catch {} }}>
          Accept
        </button>
      </div>
    </div>
  );
}

