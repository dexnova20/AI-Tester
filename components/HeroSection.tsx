"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const SCAN_TARGETS = [
  "https://yourapp.com",
  "github.com/org/repo",
  "api.yourservice.io",
  "playwright://flows",
];

const BADGES = [
  { label: "SOC 2 Ready",    color: "blue"   },
  { label: "Zero-Day Intel", color: "purple" },
  { label: "AI-Powered",     color: "cyan"   },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function HeroSection() {
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState(0);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-20">

      {/* ── Background Mesh ── */}
      <div className="absolute inset-0 bg-mesh-hero pointer-events-none" />

      {/* ── Floating Orbs ── */}
      <div
        className="orb w-[600px] h-[600px] bg-[#3b82f6] opacity-[0.07]"
        style={{ top: "-10%", left: "-15%", animationDelay: "0s" }}
      />
      <div
        className="orb w-[500px] h-[500px] bg-[#8b5cf6] opacity-[0.06]"
        style={{ top: "20%", right: "-10%", animationDelay: "4s" }}
      />
      <div
        className="orb w-[400px] h-[400px] bg-[#06b6d4] opacity-[0.05]"
        style={{ bottom: "5%", left: "30%", animationDelay: "8s" }}
      />

      {/* ── Grid Lines ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

        {/* Badge row */}
        <motion.div {...fadeUp(0)} className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase border ${
                b.color === "blue"
                  ? "border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6]"
                  : b.color === "purple"
                  ? "border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#8b5cf6]"
                  : "border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4]"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                b.color === "blue" ? "bg-[#3b82f6]" : b.color === "purple" ? "bg-[#8b5cf6]" : "bg-[#06b6d4]"
              } animate-glow-pulse`} />
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-['Bebas_Neue'] text-[clamp(64px,10vw,130px)] leading-[0.92] tracking-[0.04em] text-[#f3f4f6] mb-6"
        >
          <span className="block">AUTONOMOUS</span>
          <span className="block gradient-text-blue text-glow-blue">AI SECURITY</span>
          <span className="block">PLATFORM</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-[17px] text-[#9ca3af] font-light leading-relaxed max-w-2xl mb-10"
        >
          DRACULA scans your websites, GitHub repos, backend APIs, and Playwright flows —
          detecting vulnerabilities, runtime errors, and security misconfigurations in{" "}
          <span className="text-[#f3f4f6] font-medium">real time</span>.
        </motion.p>

        {/* Scan Input */}
        <motion.div {...fadeUp(0.3)} className="w-full max-w-2xl mb-6">
          <div className="relative group">
            {/* Glow border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#3b82f6]/50 via-[#8b5cf6]/30 to-[#06b6d4]/50 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-[2px]" />
            <div className="relative flex items-center glass rounded-2xl border border-white/8 overflow-hidden">
              {/* Prefix icon */}
              <div className="flex-shrink-0 pl-5 pr-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#3b82f6" strokeWidth="1.8" />
                  <path d="M16.5 16.5l4 4" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={SCAN_TARGETS[placeholder % SCAN_TARGETS.length]}
                className="flex-1 bg-transparent py-4 text-[15px] text-[#f3f4f6] placeholder-[#4b5563] outline-none font-mono"
              />
              <button
                className="flex-shrink-0 m-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white relative overflow-hidden group/btn"
                onClick={() => setPlaceholder((p) => p + 1)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] blur-md opacity-50 group-hover/btn:opacity-80 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Execute Scan
                </span>
              </button>
            </div>
          </div>
          <p className="text-[12px] text-[#4b5563] mt-2.5 text-left pl-1">
            Supports URLs, GitHub repos, API endpoints, and Playwright test suites
          </p>
        </motion.div>

        {/* CTA Row */}
        <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-semibold text-white relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4]" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
            <span className="relative flex items-center gap-2">
              Start Free Trial
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-medium text-[#9ca3af] border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200 glass">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
            </svg>
            Watch Demo
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div {...fadeUp(0.5)} className="flex items-center gap-6 mt-12 text-[12px] text-[#4b5563]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["#3b82f6","#8b5cf6","#06b6d4","#ef4444"].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050505]" style={{ background: c, opacity: 0.8 }} />
              ))}
            </div>
            <span>2,400+ security teams</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map((i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span>4.9/5 on G2</span>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#4b5563]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#3b82f6]/50 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
