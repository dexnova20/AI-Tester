"use client";
import AppShell from "@/components/AppShell";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";

const SCANS = [
  { target: "https://example.com", type: "WEB SCAN", status: "pass", score: 94, vulns: 2, issues: 1, ts: "10:24" },
  { target: "github.com/user/repo", type: "REPO SCAN", status: "warn", score: 61, vulns: 5, issues: 3, ts: "09:11" },
  { target: "https://api.service.io", type: "WEB SCAN", status: "fail", score: 31, vulns: 11, issues: 6, ts: "Yesterday" },
];
const STATUS: Record<string, { label: string; bg: string; text: string; bar: string }> = {
  pass: { label: "PASS",     bg: "#dcfce7", text: "#16a34a", bar: "#16a34a" },
  warn: { label: "WARNING",  bg: "#fef9c3", text: "#ca8a04", bar: "#ca8a04" },
  fail: { label: "CRITICAL", bg: "#fee2e2", text: "#dc2626", bar: "#dc2626" },
};

export default function ReportsPage() {
  return (
    <AuthGuard>
    <AppShell title="Scan Reports" subtitle="Full history of all completed scans">
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Scans", val: "3",   color: "#2563eb" },
            { label: "Avg Score",   val: "62%",  color: "#ca8a04" },
            { label: "Total Vulns", val: "18",   color: "#dc2626" },
          ].map(s => (
            <div key={s.label} className="bg-[#0d0d0d] rounded-[24px] p-6">
              <div className="section-label text-[#f5f0eb]/30 mb-2">{s.label}</div>
              <div className="font-bebas text-[44px] leading-none" style={{color:s.color}}>{s.val}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[28px] border border-black/6 overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="font-bebas text-[16px] tracking-[0.08em] text-[#0d0d0d]">All Reports</h2>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#e8e2da] text-[#0d0d0d]/50">{SCANS.length} Reports</span>
          </div>
          <div className="divide-y divide-black/4">
            {SCANS.map((f, i) => {
              const cfg = STATUS[f.status];
              return (
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#fafaf8] transition-colors cursor-pointer">
                  <div className="w-1 h-10 rounded-full flex-shrink-0" style={{background:cfg.bar}} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-mono text-[#0d0d0d]/50 truncate mb-1">{f.target}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{background:cfg.bg,color:cfg.text}}>{cfg.label}</span>
                      <span className="text-[9px] text-[#0d0d0d]/30 tracking-widest uppercase font-bold">{f.type}</span>
                      <span className="text-[9px] text-[#0d0d0d]/25">{f.ts}</span>
                    </div>
                  </div>
                  <div className="flex gap-5 text-center">
                    <div>
                      <div className="font-bebas text-[20px] leading-none" style={{color:f.vulns>0?"#dc2626":"#16a34a"}}>{f.vulns}</div>
                      <div className="text-[9px] text-[#0d0d0d]/30 tracking-widest uppercase">Vulns</div>
                    </div>
                    <div>
                      <div className="font-bebas text-[20px] leading-none" style={{color:f.issues>0?"#ca8a04":"#16a34a"}}>{f.issues}</div>
                      <div className="text-[9px] text-[#0d0d0d]/30 tracking-widest uppercase">Issues</div>
                    </div>
                    <div>
                      <div className="font-bebas text-[20px] leading-none" style={{color:f.score>=75?"#16a34a":f.score>=45?"#ca8a04":"#dc2626"}}>{f.score}</div>
                      <div className="text-[9px] text-[#0d0d0d]/30 tracking-widest uppercase">Score</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
    </AuthGuard>
  );
}
