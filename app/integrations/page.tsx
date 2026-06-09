"use client";
import AppShell from "@/components/AppShell";
import AuthGuard from "@/components/AuthGuard";
import { useState } from "react";
import { motion } from "framer-motion";

const INTEGRATIONS = [
  { name: "GitHub",         desc: "Sync repos, trigger scans on push",        icon: "🐙", connected: true,  color: "#0d0d0d" },
  { name: "Slack",          desc: "Send scan alerts to your workspace",        icon: "💬", connected: true,  color: "#4a154b" },
  { name: "Jira",           desc: "Auto-create tickets from findings",         icon: "🔵", connected: false, color: "#0052cc" },
  { name: "GitHub Actions", desc: "Run DRACULA scans in your CI/CD pipeline",  icon: "⚡", connected: false, color: "#2563eb" },
  { name: "PagerDuty",      desc: "Critical alerts trigger on-call incidents", icon: "🚨", connected: false, color: "#dc2626" },
  { name: "Datadog",        desc: "Export scan metrics to your dashboard",     icon: "📊", connected: false, color: "#7c3aed" },
];

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.name, i.connected]))
  );
  return (
    <AuthGuard>
    <AppShell title="Integrations" subtitle="Connect DRACULA with your existing toolchain">
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {INTEGRATIONS.map((integ, i) => (
            <motion.div key={integ.name} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="bg-white rounded-[24px] border border-black/6 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[14px] flex items-center justify-center text-[20px]"
                    style={{background:integ.color+"15",border:`1px solid ${integ.color}20`}}>
                    {integ.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0d0d0d]">{integ.name}</div>
                    {connected[integ.name] && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="dot dot-green" style={{width:5,height:5}} />
                        <span className="text-[9px] text-[#16a34a] font-bold tracking-widest uppercase">Connected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#0d0d0d]/45 leading-relaxed flex-1">{integ.desc}</p>
              <button
                onClick={() => setConnected(c => ({...c, [integ.name]: !c[integ.name]}))}
                className={`w-full py-2.5 rounded-[12px] text-[11px] font-bold tracking-widest uppercase transition-all ${
                  connected[integ.name]
                    ? "bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]"
                    : "bg-[#0d0d0d] text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {connected[integ.name] ? "Disconnect" : "Connect"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
    </AuthGuard>
  );
}
