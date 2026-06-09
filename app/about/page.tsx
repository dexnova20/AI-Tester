"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";

const up = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const STATS = [
  { val: "2,400+", label: "Teams Protected",       color: "#2563eb" },
  { val: "98%",    label: "Threat Detection Rate", color: "#f5c518" },
  { val: "1.2s",   label: "Average Scan Time",     color: "#7c3aed" },
  { val: "50K+",   label: "Vulnerabilities Found", color: "#dc2626" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0eb]">
      <div className="noise" aria-hidden="true" />

      {/* Nav */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/6">
        <Logo size={28} dark />
        <Link href="/home" className="text-[12px] text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">← Back</Link>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-20">

        {/* Hero */}
        <motion.div {...up()} className="mb-20">
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#2563eb] mb-4">About</div>
          <h1 className="font-bebas text-[clamp(56px,8vw,120px)] leading-[0.9] tracking-[0.04em] mb-6">
            WHAT IS<br /><span className="text-[#2563eb]">DRACULA?</span>
          </h1>
          <p className="text-[17px] text-[#f5f0eb]/50 max-w-2xl leading-relaxed">
            DRACULA is an autonomous AI-powered QA, debugging, and security testing platform.
            It scans your websites, GitHub repositories, backend APIs, and Playwright flows —
            detecting vulnerabilities, runtime errors, and security misconfigurations in real time.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div {...up(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/6 rounded-[28px] overflow-hidden mb-20">
          {STATS.map(s => (
            <div key={s.label} className="bg-[#0d0d0d] flex flex-col items-center py-10 px-6 text-center">
              <span className="font-bebas text-[48px] leading-none" style={{ color: s.color }}>{s.val}</span>
              <span className="text-[10px] text-[#f5f0eb]/35 tracking-widest uppercase font-semibold mt-2">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-5 mb-20">
          <motion.div {...up(0.1)} className="bg-white/[0.03] border border-white/[0.07] rounded-[28px] p-10">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2563eb] mb-4">Mission</div>
            <h2 className="font-bebas text-[36px] tracking-[0.04em] mb-4">SECURITY FOR EVERY TEAM.</h2>
            <p className="text-[14px] text-[#f5f0eb]/45 leading-relaxed">
              We believe every development team — regardless of size — deserves enterprise-grade security tooling.
              DRACULA makes autonomous vulnerability detection accessible, fast, and actionable.
            </p>
          </motion.div>
          <motion.div {...up(0.15)} className="bg-[#2563eb] rounded-[28px] p-10">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Tech Stack</div>
            <h2 className="font-bebas text-[36px] tracking-[0.04em] text-white mb-4">BUILT ON THE BEST.</h2>
            <div className="flex flex-col gap-3">
              {[
                { layer: "Frontend",  tech: "Next.js 15, React 18, Tailwind CSS, TypeScript" },
                { layer: "Engine",    tech: "Playwright, Headless Chromium, Python FastAPI" },
                { layer: "AI",        tech: "GPT-4 vulnerability correlation & remediation" },
              ].map(r => (
                <div key={r.layer} className="border-t border-white/15 pt-3">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">{r.layer}</div>
                  <div className="text-[13px] text-white/80">{r.tech}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div {...up(0.2)} className="text-center">
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-[13px] font-bold tracking-[0.12em] uppercase px-8 py-4 rounded-[14px] hover:bg-[#1d4ed8] transition-colors shadow-[0_4px_24px_rgba(37,99,235,0.3)]">
            Start Scanning →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
