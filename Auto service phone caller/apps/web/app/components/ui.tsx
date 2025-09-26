"use client";

import React from "react";
import clsx from "clsx";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("rounded-lg border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function CardHeader({ title, actions, subtitle }: { title: string; actions?: React.ReactNode; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
      <div>
        <div className="text-base font-semibold text-slate-900">{title}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </div>
  );
}

export function CardBody({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("p-4", className)}>{children}</div>;
}

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; variant?: "primary" | "secondary" | "outline" | "ghost"; size?: "sm" | "md" | "lg" }) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-200";
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-sm",
  } as const;
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 bg-white",
    ghost: "text-slate-700 hover:bg-slate-100",
  } as const;
  return <button className={clsx(base, sizes[size], variants[variant], className)} {...props} />;
}

export function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return <select className={clsx("block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200", className)} {...props} />;
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return <input className={clsx("block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200", className)} {...props} />;
}

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return <textarea className={clsx("block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200", className)} {...props} />;
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-slate-50 text-left text-xs text-slate-600">{children}</thead>;
}
export function TRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tr className={clsx("border-b border-slate-200", className)}>{children}</tr>;
}
export function TH({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={clsx("px-3 py-2 font-medium", className)}>{children}</th>;
}
export function TD({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("px-3 py-2 text-sm text-slate-800", className)}>{children}</td>;
}

export function Badge({ children, color = "default" }: { children: React.ReactNode; color?: "default" | "green" | "red" | "amber" }) {
  const colors = {
    default: "bg-slate-100 text-slate-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-800",
  } as const;
  return <span className={clsx("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", colors[color])}>{children}</span>;
}

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg className="animate-spin text-slate-400" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <div className="text-sm font-medium text-slate-900">{title}</div>
      {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </div>
  );
}
