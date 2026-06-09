"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";

/* ══════════════════════════════════════════════════════
   PHASE 1 — CINEMATIC TEXT INTRO
   Matches the original index.html intro-1…intro-4
══════════════════════════════════════════════════════ */
const INTRO_TEXTS = [
  { id: 1, pre: "", highlight: "Autonomous", post: " AI QA" },
  { id: 2, pre: "", highlight: "Debugging", post: " & Analysis" },
  { id: 3, pre: "Security Testing ", highlight: "Platform", post: "" },
  { id: 4, pre: "Automate everything with", highlight: "", post: "" },
];

function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [active, setActive] = useState(-1);    // which line is visible (-1 = none)
  const [fading, setFading] = useState(false);  // whole overlay fading out

  useEffect(() => {
    const T = (fn: () => void, ms: number) => setTimeout(fn, ms);
    const ids: ReturnType<typeof setTimeout>[] = [];
    let t = 400;

    for (let i = 0; i < INTRO_TEXTS.length; i++) {
      ids.push(T(() => setActive(i), t));        // show line
      t += 1200;
      ids.push(T(() => setActive(-1), t));        // hide line
      t += 550;
    }

    ids.push(T(() => setFading(true), t));        // start fade
    ids.push(T(() => onDone(), t + 800));         // done
    return () => ids.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#060606] flex items-center justify-center overflow-hidden select-none"
      onClick={onDone}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-[#2563eb]/5 blur-[120px]" />
      </div>

      {/* Animated text lines */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <AnimatePresence mode="wait">
          {active >= 0 && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="font-bebas text-[clamp(36px,7vw,90px)] leading-[1] tracking-[0.05em] text-[#f5f0eb]"
            >
              {INTRO_TEXTS[active].pre}
              {INTRO_TEXTS[active].highlight && (
                <span className="text-[#2563eb]">{INTRO_TEXTS[active].highlight}</span>
              )}
              {INTRO_TEXTS[active].post}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-[#f5f0eb]/15 tracking-[0.2em] uppercase font-medium">
        Click anywhere to skip
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   DATA — Platform Capabilities (from index.html)
══════════════════════════════════════════════════════ */
const CAPABILITIES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="1.5"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#2563eb" strokeWidth="1.2"/>
      </svg>
    ),
    title: "Website Scanner",
    desc: "Input any URL, DRACULA launches a headless Chromium browser, crawls up to 3 pages, captures screenshots, detects accessibility/security/UI issues and generates an AI audit report.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="18" cy="5" r="3" stroke="#2563eb" strokeWidth="1.5"/>
        <circle cx="6" cy="12" r="3" stroke="#2563eb" strokeWidth="1.5"/>
        <circle cx="18" cy="19" r="3" stroke="#2563eb" strokeWidth="1.5"/>
        <path d="M9 10.5l6-3M9 13.5l6 3" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: "GitHub Repo Analyzer",
    desc: "Simulates a clone and build environment, diagnoses configuration failures and generates a detailed findings report.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2563eb" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Self-Healing Browser",
    desc: "Automatically installs Playwright Chromium binaries if missing on the host machine to ensure zero downtime during audits.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2563eb" strokeWidth="1.5"/>
        <path d="M7 8l4 4-4 4M13 16h4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Live Scan Console",
    desc: "Real-time terminal log stream, score gauges, screenshot gallery and findings panel update as the scan runs.",
  },
];

const TECH_STACK = [
  { layer: "Frontend", tech: "Next.js 14, React 18, Tailwind CSS v4, TypeScript" },
  { layer: "Backend", tech: "FastAPI, Uvicorn, Playwright (Headless Chromium), Python-Dotenv" },
];

/* ══════════════════════════════════════════════════════
   ANIMATION HELPER
══════════════════════════════════════════════════════ */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/* ══════════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════════ */
export default function LandingPage() {
  /* Cinematic intro — plays once per browser session */
  const [showIntro, setShowIntro] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [introDone, setIntroDone] = useState(false); // hero waits for this

  const onIntroDone = useCallback(() => {
    setShowIntro(false);
    setIntroDone(true);
    sessionStorage.setItem("dracula_intro_done", "1");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const done = sessionStorage.getItem("dracula_intro_done");
    if (!done) {
      setShowIntro(true);
    } else {
      setIntroDone(true); // no intro needed, show hero immediately
    }
    setIntroReady(true);
  }, []);

  if (!introReady) return null; // SSR guard

  return (
    <>
      {/* ═══ CINEMATIC INTRO OVERLAY ═══ */}
      <AnimatePresence>
        {showIntro && <CinematicIntro onDone={onIntroDone} />}
      </AnimatePresence>

      {/* ═══ DRACULA LANDING PAGE ═══ */}
      <div className="relative min-h-screen bg-[#0d0d0d] text-[#f5f0eb] overflow-x-hidden">

        {/* Noise texture */}
        <div className="noise" aria-hidden="true" />

        {/* Subtle background grid */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ═══════════════════════════════════════
            HERO — full viewport, centered
        ═══════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10">

          {/* Radial glow behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#2563eb]/5 blur-[120px] pointer-events-none" />

          {/* Hero content — only animates in after intro is done */}
          {introDone && (
            <>
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10"
              >
                <Logo size={50} dark />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-bebas text-[clamp(60px,12vw,140px)] leading-[0.9] tracking-[0.15em] text-center mb-4"
              >
                DRACULA
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(16px,2.5vw,24px)] text-[#f5f0eb]/45 text-center max-w-[640px] font-normal italic mb-0 leading-relaxed"
              >
                Autonomous AI QA, Debugging &amp; Security Testing Platform
              </motion.h2>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-10 flex flex-col items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#f5f0eb]/50">
                  System Data
                </span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                </svg>
              </motion.div>
            </>
          )}
        </section>

        {/* ═══════════════════════════════════════
            PLATFORM CAPABILITIES
        ═══════════════════════════════════════ */}
        <section id="capabilities" className="relative z-10 px-6 py-20 max-w-[1200px] mx-auto">
          <motion.div
            {...fadeUp()}
            className="flex justify-center mb-12"
          >
            <div className="section-label text-[#f5f0eb]/50 text-[15px]">Platform Capabilities</div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                {...fadeUp(i * 0.08)}
                className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-[6px] p-8 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  {cap.icon}
                  <h3 className="font-bebas text-[20px] tracking-[0.06em] text-[#f5f0eb]">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-[14.5px] leading-[1.7] text-[#f5f0eb]/50">
                  {cap.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ── Core Tech Stack ── */}
          <motion.div
            {...fadeUp()}
            className="flex justify-center mb-10"
          >
            <div className="section-label text-[#f5f0eb]/50 text-[15px]">Core Tech Stack</div>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="mb-20">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <tbody>
                  {TECH_STACK.map((row) => (
                    <tr key={row.layer} className="border-b border-white/[0.06]">
                      <td className="py-5 pr-8 text-[13px] font-bold tracking-[0.12em] uppercase text-[#2563eb] w-[140px] align-top">
                        {row.layer}
                      </td>
                      <td className="py-5 text-[14.5px] text-[#f5f0eb]/50 leading-relaxed">
                        {row.tech}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── Login / Signup Buttons ── */}
          <motion.div
            {...fadeUp(0.15)}
            className="flex justify-center gap-6 flex-wrap pb-24"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-[280px] py-5 rounded-[6px] bg-[#2563eb] text-white text-[14px] font-bold tracking-[0.15em] uppercase hover:bg-[#1d4ed8] transition-colors shadow-[0_4px_24px_rgba(37,99,235,0.25)]"
            >
              Access System (Login)
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center w-[280px] py-5 rounded-[6px] bg-white/[0.05] border border-white/[0.1] text-[#f5f0eb] text-[14px] font-bold tracking-[0.15em] uppercase hover:bg-white/[0.08] transition-colors backdrop-blur-sm"
            >
              Register Agent (Sign Up)
            </Link>
          </motion.div>
        </section>

        {/* ═══ Footer ═══ */}
        <footer className="relative z-10 py-10 px-6 border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size={24} dark />
            <div className="flex items-center gap-6 text-[12px] text-[#f5f0eb]/30 font-medium">
              {["Privacy", "Terms", "Security", "Status"].map(l => (
                <a key={l} href="#" className="hover:text-[#f5f0eb]/60 transition-colors">{l}</a>
              ))}
            </div>
            <p className="text-[12px] text-[#f5f0eb]/20">© 2025 DRACULA AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
