"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";

const CAPABILITIES = [
  { emoji: "🌐", title: "Website Scanner", color: "#2563eb", desc: "Headless Chromium crawls up to 10 pages, capturing screenshots, detecting WCAG violations, CSP misconfigs, and exposed endpoints." },
  { emoji: "🐙", title: "GitHub Repo Analyzer", color: "#7c3aed", desc: "Scans repositories for CVEs, secret leakage, dependency vulnerabilities, Docker misconfigs, and CI/CD pipeline risks." },
  { emoji: "🎭", title: "Playwright Flow Testing", color: "#06b6d4", desc: "Executes your Playwright test suites autonomously, detects flaky tests, UI regressions, and accessibility failures." },
  { emoji: "⚡", title: "Runtime Error Detection", color: "#dc2626", desc: "Monitors live applications for unhandled exceptions, memory leaks, API failures, and performance degradation in real time." },
  { emoji: "📊", title: "Server Health Monitor", color: "#16a34a", desc: "Tracks CPU, memory, disk I/O, and network latency across your infrastructure. Alerts on anomalies before they become incidents." },
  { emoji: "🤖", title: "AI Vulnerability Intel", color: "#f5c518", desc: "GPT-4 powered analysis correlates findings across scans, prioritises critical risks, and generates remediation playbooks automatically." },
];

const up = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0eb]">
      <div className="noise" aria-hidden="true" />

      {/* Nav */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/6">
        <Logo size={28} dark />
        <Link href="/home" className="text-[12px] text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">← Back</Link>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-20">
        <motion.div {...up()} className="mb-16 text-center">
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#2563eb] mb-4">Platform</div>
          <h1 className="font-bebas text-[clamp(56px,8vw,110px)] leading-[0.9] tracking-[0.04em] mb-5">
            EVERY ATTACK<br />SURFACE COVERED.
          </h1>
          <p className="text-[16px] text-[#f5f0eb]/45 max-w-xl mx-auto leading-relaxed">
            One platform. Autonomous detection across websites, repos, APIs, and infrastructure. Zero manual effort.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((c, i) => (
            <motion.div key={c.title} {...up(i * 0.07)}
              className="bg-white/[0.03] border border-white/[0.07] rounded-[24px] p-8 hover:bg-white/[0.06] transition-colors group cursor-pointer">
              <div className="text-[36px] mb-5">{c.emoji}</div>
              <h3 className="font-bebas text-[22px] tracking-[0.05em] mb-3" style={{ color: c.color }}>{c.title}</h3>
              <p className="text-[13.5px] text-[#f5f0eb]/45 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...up(0.2)} className="mt-16 text-center">
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-[13px] font-bold tracking-[0.12em] uppercase px-8 py-4 rounded-[14px] hover:bg-[#1d4ed8] transition-colors shadow-[0_4px_24px_rgba(37,99,235,0.3)]">
            Open Dashboard →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
