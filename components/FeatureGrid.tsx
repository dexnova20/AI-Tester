"use client";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    title: "Website Scanner",
    desc: "Headless Chromium crawls up to 10 pages, capturing screenshots, detecting WCAG violations, CSP misconfigs, and exposed endpoints.",
    color: "#3b82f6",
    tag: "Live",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M9 10.5l6-3M9 13.5l6 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: "GitHub Repo Analyzer",
    desc: "Scans repositories for CVEs, secret leakage, dependency vulnerabilities, Docker misconfigs, and CI/CD pipeline risks.",
    color: "#8b5cf6",
    tag: "AI",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 8l4 4-4 4M13 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Playwright Flow Testing",
    desc: "Executes your Playwright test suites autonomously, detects flaky tests, UI regressions, and accessibility failures.",
    color: "#06b6d4",
    tag: "Auto",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Runtime Error Detection",
    desc: "Monitors live applications for unhandled exceptions, memory leaks, API failures, and performance degradation in real time.",
    color: "#ef4444",
    tag: "Real-time",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Server Health Monitor",
    desc: "Tracks CPU, memory, disk I/O, and network latency across your infrastructure. Alerts on anomalies before they become incidents.",
    color: "#10b981",
    tag: "24/7",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: "AI Vulnerability Intel",
    desc: "GPT-powered analysis correlates findings across scans, prioritizes critical risks, and generates remediation playbooks automatically.",
    color: "#f59e0b",
    tag: "GPT-4",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="relative py-28 px-4 overflow-hidden">
      {/* Orb */}
      <div className="orb w-[700px] h-[700px] bg-[#8b5cf6] opacity-[0.04] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-glow-pulse" />
            Platform Capabilities
          </span>
          <h2 className="font-['Bebas_Neue'] text-[clamp(40px,6vw,72px)] tracking-[0.04em] text-[#f3f4f6] leading-tight mb-4">
            EVERYTHING YOU NEED TO<br />
            <span className="gradient-text-blue">SECURE YOUR STACK</span>
          </h2>
          <p className="text-[16px] text-[#9ca3af] max-w-xl mx-auto leading-relaxed">
            One platform. Every attack surface. Autonomous detection, zero manual effort.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card-hover glass rounded-[28px] p-7 border border-white/6 relative overflow-hidden group"
            >
              {/* Top gradient line */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)` }}
              />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px]"
                style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${f.color}10, transparent)` }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 relative"
                style={{ background: `${f.color}15`, color: f.color }}
              >
                {f.icon}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `0 0 20px ${f.color}40` }}
                />
              </div>

              {/* Tag */}
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border"
                style={{ color: f.color, borderColor: `${f.color}30`, background: `${f.color}10` }}
              >
                {f.tag}
              </span>

              <h3 className="text-[17px] font-semibold text-[#f3f4f6] mb-3 leading-snug">
                {f.title}
              </h3>
              <p className="text-[13.5px] text-[#9ca3af] leading-relaxed">
                {f.desc}
              </p>

              {/* Arrow */}
              <div className="mt-5 flex items-center gap-1.5 text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: f.color }}>
                Learn more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
