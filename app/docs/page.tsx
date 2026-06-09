"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useState } from "react";

const SECTIONS = [
  {
    title: "Quick Start",
    icon: "⚡",
    items: [
      { label: "Installation", desc: "Get DRACULA running in under 2 minutes." },
      { label: "Your First Scan", desc: "Run a web scan on any public URL." },
      { label: "GitHub Integration", desc: "Connect your repos for automated scanning." },
    ],
  },
  {
    title: "Web Scanner",
    icon: "🌐",
    items: [
      { label: "URL Configuration", desc: "Set target URLs, crawl depth, and scan scope." },
      { label: "Security Headers", desc: "CSP, HSTS, X-Frame-Options detection." },
      { label: "Accessibility Audit", desc: "WCAG 2.1 AA compliance checking." },
    ],
  },
  {
    title: "Repo Analyzer",
    icon: "🐙",
    items: [
      { label: "CVE Detection", desc: "Scan dependencies against the NVD database." },
      { label: "Secret Scanning", desc: "Find exposed API keys, tokens, and credentials." },
      { label: "Docker & CI/CD", desc: "Audit Dockerfiles and GitHub Actions workflows." },
    ],
  },
  {
    title: "API Reference",
    icon: "📡",
    items: [
      { label: "Authentication", desc: "API keys, OAuth tokens, and session management." },
      { label: "Scan Endpoints", desc: "POST /scan, GET /results, DELETE /scan/{id}." },
      { label: "Webhooks", desc: "Receive real-time scan completion events." },
    ],
  },
];

const up = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function DocsPage() {
  const [active, setActive] = useState("Quick Start");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0eb]">
      <div className="noise" aria-hidden="true" />

      {/* Nav */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/6">
        <Logo size={28} dark />
        <Link href="/home" className="text-[12px] text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">← Back</Link>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-16 flex gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-1 w-[200px] flex-shrink-0 sticky top-8 self-start">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#f5f0eb]/25 mb-3">Contents</div>
          {SECTIONS.map(s => (
            <button key={s.title} onClick={() => setActive(s.title)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[12px] font-medium text-left transition-all ${
                active === s.title ? "bg-[#2563eb]/15 text-[#2563eb]" : "text-[#f5f0eb]/40 hover:text-[#f5f0eb] hover:bg-white/5"
              }`}>
              <span>{s.icon}</span>{s.title}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-10">
          <motion.div {...up()}>
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#2563eb] mb-3">Documentation</div>
            <h1 className="font-bebas text-[clamp(48px,6vw,80px)] leading-[0.9] tracking-[0.04em] mb-4">READ THE<br />FULL GUIDE.</h1>
            <p className="text-[15px] text-[#f5f0eb]/40 leading-relaxed max-w-lg">
              Everything you need to integrate DRACULA into your workflow — from first scan to full CI/CD automation.
            </p>
          </motion.div>

          {SECTIONS.map((s, si) => (
            <motion.div key={s.title} {...up(si * 0.06)} id={s.title}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[24px]">{s.icon}</span>
                <h2 className="font-bebas text-[28px] tracking-[0.06em] text-[#f5f0eb]">{s.title}</h2>
              </div>
              <div className="flex flex-col gap-3">
                {s.items.map((item, ii) => (
                  <motion.div key={item.label} {...up(si * 0.06 + ii * 0.04)}
                    className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/[0.07] rounded-[16px] hover:bg-white/[0.06] transition-colors cursor-pointer group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-[13px] font-semibold text-[#f5f0eb] mb-1 group-hover:text-[#2563eb] transition-colors">{item.label}</div>
                      <div className="text-[12px] text-[#f5f0eb]/40 leading-relaxed">{item.desc}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      className="ml-auto text-[#f5f0eb]/20 group-hover:text-[#2563eb] transition-colors flex-shrink-0 mt-1">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
