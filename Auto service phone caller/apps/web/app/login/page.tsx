"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push("/app/calls");
  }

  async function onDevSkip() {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      const demoEmail = "demo@example.com";
      const demoPassword = "demo12345";
      // Try to create a demo tenant+owner; if it exists, fall through to login
      await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_name: "Demo Shop", name: "Demo User", email: demoEmail, password: demoPassword }),
      }).catch(() => void 0);
      // Sign in with demo credentials via NextAuth
      setLoading(true);
      const res = await signIn("credentials", { redirect: false, email: demoEmail, password: demoPassword });
      setLoading(false);
      if (res?.error) {
        setError("Dev sign-in failed");
        return;
      }
      router.push("/app/calls");
    } catch (err) {
      setLoading(false);
      setError("Dev sign-in failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-600 mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-md font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={onDevSkip}
              className="w-full mt-2 border border-slate-300 bg-white text-slate-800 py-2.5 px-4 rounded-md font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Skip for now (Dev)
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Auto Service Caller Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
