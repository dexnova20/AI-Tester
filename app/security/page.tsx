"use client";
import AppShell from "@/components/AppShell";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";

const THREATS = [
  { title: "Missing Content-Security-Policy", severity: "high",   site: "example.com",      desc: "No CSP header detected. XSS attacks are possible." },
  { title: "Cookie Without Secure Flag",       severity: "medium", site: "api.service.io",   desc: "Session cookie exposed over non-HTTPS connections." },
  { title: "Outdated Dependency (lodash)",     severity: "high",   site: "github.com/u/repo", desc: "CVE-2021-23337 — Prototype pollution vulnerability." },
  { title: "API Key Exposed in .env",          severity: "critical", site: "github.com/u/repo", desc: "Plaintext API key committed to repository." },
  { title: "WCAG 2.1 AA Violations",           severity: "low",    site: "example.com",      desc: "7 accessibility issues: missing alt text, contrast." },
];
const SEV: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg:"#fee2e2", text:"#dc2626", border:"#dc2626" },
  high:     { bg:"#fff0e0", text:"#c2410c", border:"#c2410c" },
  medium:   { bg:"#fef9c3", text:"#ca8a04", border:"#ca8a04" },
  low:      { bg:"#dbeafe", text:"#2563eb", border:"#2563eb" },
};

export default function SecurityPage() {
  return (
    <AuthGuard>
    <AppShell title="Security Audit" subtitle="Detected threats & vulnerability intelligence" badge={{ label: "4 Active", color: "red" }}>
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Critical", val: 1, color: "#dc2626", bg: "bg-[#dc2626]" },
            { label: "High",     val: 2, color: "#c2410c", bg: "bg-[#c2410c]" },
            { label: "Medium",   val: 1, color: "#ca8a04", bg: "bg-[#ca8a04]" },
            { label: "Low",      val: 1, color: "#2563eb", bg: "bg-[#2563eb]" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-[24px] p-6`}>
              <div className="section-label text-white/50 mb-2">{s.label}</div>
              <div className="font-bebas text-[48px] leading-none text-white">{s.val}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[28px] border border-black/6 overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6">
            <h2 className="font-bebas text-[16px] tracking-[0.08em] text-[#0d0d0d]">Active Threats</h2>
          </div>
          <div className="divide-y divide-black/4">
            {THREATS.map((t, i) => {
              const cfg = SEV[t.severity];
              return (
                <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                  className="flex items-start gap-4 px-6 py-5 hover:bg-[#fafaf8] transition-colors cursor-pointer">
                  <div className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0 self-stretch" style={{background:cfg.border}} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
                        style={{background:cfg.bg,color:cfg.text,borderColor:cfg.border+"40"}}>
                        {t.severity}
                      </span>
                      <span className="text-[10px] font-mono text-[#0d0d0d]/35">{t.site}</span>
                    </div>
                    <div className="text-[13px] font-semibold text-[#0d0d0d] mb-1">{t.title}</div>
                    <div className="text-[11px] text-[#0d0d0d]/45 leading-relaxed">{t.desc}</div>
                  </div>
                  <button className="flex-shrink-0 text-[10px] font-bold text-[#2563eb] border border-[#2563eb]/25 px-3 py-1.5 rounded-[8px] hover:bg-[#2563eb]/6 transition-colors">
                    Remediate
                  </button>
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
