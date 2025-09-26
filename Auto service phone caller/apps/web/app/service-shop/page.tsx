"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServiceShopRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/app/service');
  }, [router]);
  return null;
}
