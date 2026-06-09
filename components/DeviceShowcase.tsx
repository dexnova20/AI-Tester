"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── slide data ── */
const SLIDES = [
  {
    id: 0,
    bg: "#2563eb",
    label: "Dashboard",
    tag: "Live Preview",
    content: "dashboard",
  },
  {
    id: 1,
    bg: "#7c3aed",
    label: "AI Analysis",
    tag: "Threat Intel",
    content: "analysis",
  },
  {
    id: 2,
    bg: "#0d0d0d",
    label: "Security Score",
    tag: "Risk Report",
    content: "score",
  },
  {
    id: 3,
    bg: "#f5c518",
    label: "Reviews",
    tag: "Testimonials",
    content: "reviews",
  },
];

const REVIEWS = [
  {
    name: "Sarah Chen",
    role: "CTO @ Vercel-backed startup",
    avatar: "SC",
    color: "#2563eb",
    stars: 5,
    text: "DRACULA caught a critical SQL injection in our staging environment before we shipped. Saved us from a potential disaster.",
  },
  {
    name: "Marcus Webb",
    role: "Lead Engineer @ Fintech",
    avatar: "MW",
    color: "#7c3aed",
    stars: 5,
    text: "The GitHub repo analyzer found 3 exposed API keys we had no idea about. Setup took 2 minutes. Absolutely worth it.",
  },
  {
    name: "Priya Nair",
    role: "Security Lead @ SaaS Co.",
    avatar: "PN",
    color: "#dc2626",
    stars: 5,
    text: "We replaced our entire manual QA process with DRACULA. 10x faster, way more thorough. The AI reports are incredible.",
  },
];

/* ── mini screen contents ── */
function DashboardScreen({ small }: { small?: boolean }) {
  const s = small ? 0.7 : 1;
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col p-3 gap-2 overflow-hidden">
      {/* top bar */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#2563eb] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/80" />
          </div>
          <span className="font-bebas text-white tracking-widest" style={{ fontSize: small ? 9 : 13 }}>DRACULA</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
          <span style={{ fontSize: small ? 7 : 9 }} className="text-white/40 font-medium">Live</span>
        </div>
      </div>
      {/* kpi row */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { v: "247", l: "Scans", c: "#2563eb" },
          { v: "94%", l: "Score", c: "#16a34a" },
          { v: "3",   l: "Active",c: "#7c3aed" },
          { v: "12",  l: "Vulns", c: "#dc2626" },
        ].map(k => (
          <div key={k.l} className="bg-[#161616] rounded-lg p-2">
            <div className="font-bebas leading-none" style={{ fontSize: small ? 14 : 20, color: k.c }}>{k.v}</div>
            <div className="text-white/30 font-semibold tracking-widest uppercase" style={{ fontSize: small ? 6 : 8 }}>{k.l}</div>
          </div>
        ))}
      </div>
      {/* terminal */}
      <div className="bg-[#161616] rounded-lg p-2 flex-1 overflow-hidden">
        <div className="text-white/25 font-semibold tracking-widest uppercase mb-1" style={{ fontSize: small ? 6 : 8 }}>Console</div>
        {[
          { t: "[CHROM] Browser ready ✓",      c: "#16a34a" },
          { t: "[SEC  ] ⚠ Missing CSP",         c: "#ca8a04" },
          { t: "[AI   ] Report generated ✓",    c: "#16a34a" },
        ].map((l, i) => (
          <div key={i} className="font-mono truncate" style={{ fontSize: small ? 6 : 9, color: l.c, lineHeight: 1.7 }}>{l.t}</div>
        ))}
      </div>
    </div>
  );
}

function AnalysisScreen({ small }: { small?: boolean }) {
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col p-3 gap-2 overflow-hidden">
      <div className="text-white/40 font-semibold tracking-widest uppercase mb-1" style={{ fontSize: small ? 6 : 9 }}>AI Threat Analysis</div>
      {/* threat bars */}
      {[
        { label: "SQL Injection",    pct: 82, color: "#dc2626" },
        { label: "XSS Vectors",      pct: 61, color: "#f5c518" },
        { label: "Auth Bypass",      pct: 34, color: "#7c3aed" },
        { label: "Data Exposure",    pct: 55, color: "#2563eb" },
        { label: "CSP Violations",   pct: 90, color: "#dc2626" },
      ].map(t => (
        <div key={t.label} className="flex flex-col gap-0.5">
          <div className="flex justify-between">
            <span className="text-white/50 font-medium" style={{ fontSize: small ? 6 : 9 }}>{t.label}</span>
            <span className="font-bold" style={{ fontSize: small ? 6 : 9, color: t.color }}>{t.pct}%</span>
          </div>
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${t.pct}%` }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: t.color }}
            />
          </div>
        </div>
      ))}
      <div className="mt-auto bg-[#dc2626]/15 rounded-lg p-2 border border-[#dc2626]/20">
        <div className="font-bold" style={{ fontSize: small ? 6 : 9, color: "#dc2626" }}>⚠ 3 Critical Issues Found</div>
        <div className="text-white/30 mt-0.5" style={{ fontSize: small ? 5 : 8 }}>Immediate action required</div>
      </div>
    </div>
  );
}

function ScoreScreen({ small }: { small?: boolean }) {
  const circ = 2 * Math.PI * 28;
  return (
    <div className="w-full h-full bg-[#0d0d0d] flex flex-col items-center justify-center p-3 gap-3 overflow-hidden">
      <div className="text-white/30 font-semibold tracking-widest uppercase" style={{ fontSize: small ? 6 : 9 }}>Security Score</div>
      {/* gauge */}
      <div className="relative flex items-center justify-center">
        <svg width={small ? 70 : 100} height={small ? 70 : 100} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <motion.circle
            cx="40" cy="40" r="28" fill="none"
            stroke="#16a34a" strokeWidth="5"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (circ * 0.87) }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ filter: "drop-shadow(0 0 6px #16a34a)" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-bebas text-[#16a34a] leading-none" style={{ fontSize: small ? 18 : 26 }}>87</span>
          <span className="text-white/30 font-bold tracking-widest uppercase" style={{ fontSize: small ? 5 : 7 }}>/ 100</span>
        </div>
      </div>
      <div className="text-[#16a34a] font-bold tracking-widest uppercase" style={{ fontSize: small ? 7 : 10 }}>Excellent</div>
      <div className="w-full grid grid-cols-3 gap-1">
        {[
          { l: "Passed", v: "47", c: "#16a34a" },
          { l: "Warned", v: "8",  c: "#ca8a04" },
          { l: "Failed", v: "3",  c: "#dc2626" },
        ].map(s => (
          <div key={s.l} className="bg-[#161616] rounded-lg p-1.5 text-center">
            <div className="font-bebas leading-none" style={{ fontSize: small ? 12 : 18, color: s.c }}>{s.v}</div>
            <div className="text-white/25 font-semibold tracking-widest uppercase" style={{ fontSize: small ? 5 : 7 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsScreen({ small }: { small?: boolean }) {
  const [idx, setIdx] = useState(0);
  const rev = REVIEWS[idx % REVIEWS.length];
  useEffect(() => {
    const t = setInterval(() => setIdx(i => i + 1), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="w-full h-full bg-[#fafaf8] flex flex-col p-3 gap-2 overflow-hidden">
      <div className="text-ink/30 font-semibold tracking-widest uppercase" style={{ fontSize: small ? 6 : 9 }}>Customer Reviews</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-2 flex-1"
        >
          {/* stars */}
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <svg key={s} width={small ? 8 : 11} height={small ? 8 : 11} viewBox="0 0 24 24" fill="#f5c518">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          {/* quote */}
          <p className="text-ink/70 leading-relaxed flex-1" style={{ fontSize: small ? 7 : 10 }}>
            "{rev.text}"
          </p>
          {/* author */}
          <div className="flex items-center gap-2">
            <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ width: small ? 18 : 26, height: small ? 18 : 26, background: rev.color, fontSize: small ? 6 : 9 }}>
              {rev.avatar}
            </div>
            <div>
              <div className="font-bold text-ink" style={{ fontSize: small ? 6 : 9 }}>{rev.name}</div>
              <div className="text-ink/40" style={{ fontSize: small ? 5 : 8 }}>{rev.role}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* dots */}
      <div className="flex gap-1 justify-center">
        {REVIEWS.map((_, i) => (
          <div key={i} className="rounded-full transition-all" style={{
            width: i === idx % REVIEWS.length ? 14 : 5,
            height: 5,
            background: i === idx % REVIEWS.length ? "#0d0d0d" : "#d1d5db",
          }} />
        ))}
      </div>
    </div>
  );
}

function ScreenContent({ content, small }: { content: string; small?: boolean }) {
  if (content === "dashboard") return <DashboardScreen small={small} />;
  if (content === "analysis")  return <AnalysisScreen  small={small} />;
  if (content === "score")     return <ScoreScreen     small={small} />;
  if (content === "reviews")   return <ReviewsScreen   small={small} />;
  return null;
}

/* ── Phone frame ── */
function PhoneFrame({ content, bg }: { content: string; bg: string }) {
  return (
    <div className="relative flex items-center justify-center animate-float">
      {/* shadow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[140px] h-[20px] bg-black/20 rounded-full blur-xl" />
      {/* phone body */}
      <div className="relative w-[200px] h-[400px] rounded-[36px] overflow-hidden"
        style={{ background: "#1a1a1a", boxShadow: "0 32px 80px rgba(0,0,0,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}>
        {/* side buttons */}
        <div className="absolute -left-[3px] top-[90px] w-[3px] h-[32px] bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute -left-[3px] top-[132px] w-[3px] h-[32px] bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute -right-[3px] top-[110px] w-[3px] h-[48px] bg-[#2a2a2a] rounded-r-sm" />
        {/* screen */}
        <div className="absolute inset-[6px] rounded-[30px] overflow-hidden bg-[#0d0d0d]">
          {/* notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-[#1a1a1a] rounded-b-[14px] z-10 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
          </div>
          {/* content */}
          <div className="absolute inset-0 pt-[22px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={content}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <ScreenContent content={content} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Desktop frame ── */
function DesktopFrame({ content, bg }: { content: string; bg: string }) {
  return (
    <div className="relative flex flex-col items-center animate-float">
      {/* monitor */}
      <div className="relative w-[340px]"
        style={{ filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.35))" }}>
        {/* body */}
        <div className="rounded-[14px] overflow-hidden border border-white/10"
          style={{ background: "#1a1a1a" }}>
          {/* top bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6" style={{ background: "#141414" }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f5c518]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]/70" />
            </div>
            <div className="flex-1 mx-3 bg-white/6 rounded-md px-3 py-1 text-[9px] text-white/25 font-mono">
              app.dracula.ai
            </div>
          </div>
          {/* screen */}
          <div className="h-[220px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={content}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <ScreenContent content={content} small />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* stand */}
        <div className="flex flex-col items-center">
          <div className="w-[40px] h-[18px]" style={{ background: "#1a1a1a" }} />
          <div className="w-[90px] h-[8px] rounded-b-lg" style={{ background: "#141414" }} />
        </div>
      </div>
      {/* shadow */}
      <div className="w-[200px] h-[12px] bg-black/20 rounded-full blur-xl mt-1" />
    </div>
  );
}

/* ── MAIN EXPORT ── */
export default function DeviceShowcase({ scannedUrl }: { scannedUrl?: string }) {
  const [device, setDevice] = useState<"phone" | "desktop">("phone");
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = SLIDES[slideIdx];

  /* auto-advance */
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setSlideIdx(i => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlideIdx(i => (i + 1) % SLIDES.length);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[32px] flex flex-col justify-between relative overflow-hidden min-h-[580px] p-8"
      style={{ background: slide.bg, transition: "background 0.6s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* ── header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="section-label mb-2" style={{ color: slide.bg === "#f5c518" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.45)" }}>
            {slide.tag}
          </div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={slide.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="font-bebas text-[clamp(36px,4vw,56px)] leading-[0.9] tracking-[0.03em]"
              style={{ color: slide.bg === "#f5c518" ? "#0d0d0d" : "#fff" }}
            >
              {slide.label}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* device toggle */}
        <div className="flex items-center p-1 rounded-[14px]"
          style={{ background: slide.bg === "#f5c518" ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.12)" }}>
          {(["phone","desktop"] as const).map(d => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className="px-3 py-1.5 rounded-[10px] text-[11px] font-bold tracking-widest uppercase transition-all"
              style={{
                background: device === d
                  ? slide.bg === "#f5c518" ? "#0d0d0d" : "rgba(255,255,255,0.95)"
                  : "transparent",
                color: device === d
                  ? slide.bg === "#f5c518" ? "#f5f0eb" : "#0d0d0d"
                  : slide.bg === "#f5c518" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.5)",
              }}
            >
              {d === "phone" ? "📱" : "🖥"} {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── device mockup ── */}
      <div className="flex items-center justify-center flex-1 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {device === "phone"
              ? <PhoneFrame content={slide.content} bg={slide.bg} />
              : <DesktopFrame content={slide.content} bg={slide.bg} />
            }
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── slide dots ── */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSlideIdx(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === slideIdx ? 20 : 6,
              height: 6,
              background: slide.bg === "#f5c518"
                ? i === slideIdx ? "#0d0d0d" : "rgba(0,0,0,0.2)"
                : i === slideIdx ? "#fff" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      {/* ── nav controls ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[12px] font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
          style={{
            background: slide.bg === "#f5c518" ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.12)",
            color: slide.bg === "#f5c518" ? "#0d0d0d" : "#fff",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Prev
        </button>

        <button
          onClick={next}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[12px] font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
          style={{
            background: slide.bg === "#f5c518" ? "#0d0d0d" : "rgba(255,255,255,0.95)",
            color: slide.bg === "#f5c518" ? "#f5f0eb" : "#0d0d0d",
          }}
        >
          Next
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <button
          onClick={() => setDevice(d => d === "phone" ? "desktop" : "phone")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-[12px] font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
          style={{
            background: slide.bg === "#f5c518" ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.12)",
            color: slide.bg === "#f5c518" ? "#0d0d0d" : "#fff",
          }}
        >
          {device === "phone" ? "🖥" : "📱"}
        </button>
      </div>
    </motion.div>
  );
}
