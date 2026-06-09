"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";

const AGENTS = [
  { emoji: "🕷️", name: "WebCrawler Agent",    color: "#2563eb", status: "Active",  desc: "Autonomously crawls target URLs, renders JavaScript, captures screenshots, and maps the full DOM structure." },
  { emoji: "🔍", name: "SecAudit Agent",       color: "#dc2626", status: "Active",  desc: "Scans HTTP headers, cookies, TLS config, and exposed endpoints for security misconfigurations." },
  { emoji: "🧬", name: "CVE Scanner Agent",    color: "#7c3aed", status: "Active",  desc: "Cross-references all detected dependencies against the NVD and GitHub Advisory databases in real time." },
  { emoji: "🔑", name: "SecretHunter Agent",   color: "#f5c518", status: "Active",  desc: "Uses pattern matching and entropy analysis to detect exposed API keys, tokens, and credentials in codebases." },
  { emoji: "♿", name: "A11y Agent",            color: "#16a34a", status: "Active",  desc: "Runs WCAG 2.1 AA compliance checks across all crawled pages, flagging contrast, ARIA, and keyboard issues." },
  { emoji: "🤖", name: "GPT-4 Analyst Agent",  color: "#06b6d4", status: "Active",  desc: "Correlates all findings from other agents, prioritises risks by severity, and generates remediation playbooks." },
];

const up = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function AIAgentsPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0eb]">
      <div className="noise" aria-hidden="true" />

      {/* Nav */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/6">
        <Logo size={28} dark />
        <Link href="/home" className="text-[12px] text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">← Back</Link>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-20">
        <motion.div {...up()} className="mb-16">
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#7c3aed] mb-4">AI Agents</div>
          <h1 className="font-bebas text-[clamp(56px,8vw,110px)] leading-[0.9] tracking-[0.04em] mb-5">
            AUTONOMOUS<br /><span className="text-[#7c3aed]">SCAN AGENTS.</span>
          </h1>
          <p className="text-[16px] text-[#f5f0eb]/45 max-w-2xl leading-relaxed">
            DRACULA deploys a fleet of specialised AI agents that work in parallel — each focused on a specific attack surface.
            They coordinate, share findings, and produce a unified threat report.
          </p>
        </motion.div>

        {/* Agent pipeline visual */}
        <motion.div {...up(0.1)} className="bg-white/[0.03] border border-white/[0.07] rounded-[28px] p-6 mb-12 overflow-x-auto">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#f5f0eb]/25 mb-4">Agent Pipeline</div>
          <div className="flex items-center gap-2 min-w-max">
            {["Target Input", "WebCrawler", "SecAudit", "CVE Scanner", "SecretHunter", "A11y", "GPT-4 Analyst", "Report"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-[8px] text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${
                  i === 0 || i === arr.length - 1
                    ? "bg-[#2563eb]/20 text-[#2563eb] border border-[#2563eb]/30"
                    : "bg-white/6 text-[#f5f0eb]/60 border border-white/8"
                }`}>{step}</div>
                {i < arr.length - 1 && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5f0eb" strokeWidth="2" strokeLinecap="round" className="opacity-20 flex-shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent, i) => (
            <motion.div key={agent.name} {...up(i * 0.07)}
              className="bg-white/[0.03] border border-white/[0.07] rounded-[24px] p-7 hover:bg-white/[0.06] transition-colors group">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[32px]">{agent.emoji}</span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-[#16a34a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                  {agent.status}
                </span>
              </div>
              <h3 className="font-bebas text-[20px] tracking-[0.05em] mb-3" style={{ color: agent.color }}>{agent.name}</h3>
              <p className="text-[13px] text-[#f5f0eb]/45 leading-relaxed">{agent.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...up(0.3)} className="mt-16 text-center">
          <Link href="/new-scan"
            className="inline-flex items-center gap-2 bg-[#7c3aed] text-white text-[13px] font-bold tracking-[0.12em] uppercase px-8 py-4 rounded-[14px] hover:bg-[#6d28d9] transition-colors shadow-[0_4px_24px_rgba(124,58,237,0.35)]">
            Deploy Agents →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
