"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("dracula_user") || "null");
      if (u?.name) { setOk(true); return; }
    } catch {}
    router.replace("/login");
  }, [router]);

  if (!ok) return (
    <div className="fixed inset-0 bg-[#0d0d0d] flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
        <span className="font-bebas text-[16px] tracking-[0.2em] text-[#f5f0eb]/40">AUTHENTICATING…</span>
      </div>
    </div>
  );

  return <>{children}</>;
}
