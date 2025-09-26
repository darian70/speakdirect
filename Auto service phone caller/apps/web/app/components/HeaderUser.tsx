"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui";

export function HeaderUser() {
  const sessionResult = useSession();
  const session = sessionResult?.data as any;
  const email = session?.user?.email || "";
  const initials = (session?.user?.name || email || "?")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700">
        {initials}
      </div>
      <span className="text-slate-700">{email}</span>
      <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
        Sign out
      </Button>
    </div>
  );
}
