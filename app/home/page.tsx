"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import DeviceShowcase from "@/components/DeviceShowcase";
import AuthGuard from "@/components/AuthGuard";
import { AnimatePresence } from "framer-motion";

/* ── tiny helpers ── */
const up = (d = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay: d, ease: [0.16, 1, 0.3, 1] },
});

function r(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

/* ── scan terminal ── */
type Line = { id: number; text: string; cls: string };
let lid = 0;
const WEB: Array<[string, (t: string) => string]> = [
  ["t-blue",   (t) => `[INIT]  Resolving → ${t}`],
  ["t-muted",  ()  => `[DNS ]  A record → 104.21.${r(1,254)}.${r(1,254)}`],
  ["t-blue",   ()  => `[TLS ]  Handshake OK · TLS 1.3`],
  ["t-blue",   ()  => `[CHROM] Launching Chromium 131…`],
  ["t-green",  ()  => `[CHROM] Browser ready ✓`],
  ["t-muted",  ()  => `[DOM ]  ${r(40,180)} nodes · ${r(2,12)} iframes`],
  ["t-yellow", ()  => `[SEC ]  ⚠  Missing CSP header`],
  ["t-yellow", ()  => `[SEC ]  ⚠  Cookie without Secure flag`],
  ["t-blue",   ()  => `[AI  ]  Sending to GPT-4…`],
  ["t-green",  ()  => `[AI  ]  Report generated ✓`],
];
const GIT: Array<[string, (t: string) => string]> = [
  ["t-blue",   (t) => `[INIT]  Cloning → github.com/${t}`],
  ["t-muted",  ()  => `[GIT ]  ${r(200,1800)} objects fetched`],
  ["t-green",  ()  => `[GIT ]  Clone complete ✓`],
  ["t-muted",  ()  => `[DEP ]  ${r(30,300)} packages · ${r(0,15)} CVEs`],
  ["t-yellow", ()  => `[SEC ]  ⚠  ${r(1,4)} high-severity advisories`],
  ["t-yellow", ()  => `[SEC ]  ⚠  API key pattern in .env`],
  ["t-blue",   ()  => `[AI  ]  Sending to GPT-4…`],
  ["t-green",  ()  => `[AI  ]  Report generated ✓`],
];

/* ── bottom cards data ── */
const CARDS = [
  { bg: "#2563eb", fg: "#fff",     label: "About",     sub: "What is DRACULA?",       emoji: "⚡", href: "/about"      },
  { bg: "#f5c518", fg: "#0d0d0d",  label: "Docs",      sub: "Read the full guide",    emoji: "📖", href: "/docs"       },
  { bg: "#dc2626", fg: "#fff",     label: "Help",      sub: "Support & community",    emoji: "🛟", href: "/help"       },
  { bg: "#7c3aed", fg: "#fff",     label: "AI Agents", sub: "Autonomous scan agents", emoji: "🤖", href: "/ai-agents"  },
];

/* ── features ── */
const FEATURES = [
  { icon: "🌐", title: "Website Scanner",    desc: "Headless Chromium crawls, screenshots, WCAG & CSP checks." },
  { icon: "🐙", title: "GitHub Analyzer",    desc: "CVEs, secret leakage, dependency audit, Docker review." },
  { icon: "🎭", title: "Playwright Flows",   desc: "Autonomous test execution, flaky detection, UI regression." },
  { icon: "⚡", title: "Runtime Monitor",    desc: "Live error tracking, memory leaks, API failure alerts." },
  { icon: "🛡️", title: "Security Intel",    desc: "GPT-4 correlation, risk prioritisation, remediation plans." },
  { icon: "📊", title: "Server Health",      desc: "CPU, memory, disk I/O, latency — 24/7 infrastructure watch." },
];

/* ══════════════════════════════════
   SESSION TIMER
══════════════════════════════════ */
function useSessionTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let start = parseInt(sessionStorage.getItem("dracula_session_start") || "0");
    if (!start) {
      start = Date.now();
      sessionStorage.setItem("dracula_session_start", String(start));
    }
    setElapsed(Math.floor((Date.now() - start) / 1000));
    const t = setInterval(() =>
      setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const ACCOUNT_PHOTOS: Record<string, string> = {
  "narendra.modi@gmail.com":  "https://i1-e.pinimg.com/736x/94/91/b5/9491b525931aa28f9a2d4322f23987dc.jpg",
  "giorgia.meloni@gmail.com": "https://i1-e.pinimg.com/1200x/a5/fd/f9/a5fdf9b61fedfcc07fa16f8aecc240ee.jpg",
};

/* ══════════════════════════════════
   NAV USER WIDGET
══════════════════════════════════ */
function NavUser() {
  const router  = useRouter();
  const timer   = useSessionTimer();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("dracula_user") || "null");
      if (u?.name) setUser(u);
    } catch {}
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* If somehow not logged in, redirect to login */
  if (!user) return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="text-[13px] font-medium text-ink/50 hover:text-ink px-3 py-2 transition-colors">Sign In</Link>
      <Link href="/signup" className="btn-solid btn-dark text-[13px] py-2.5 px-5 rounded-[12px]">Get Access</Link>
    </div>
  );

  const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  function signOut() {
    localStorage.removeItem("dracula_user");
    sessionStorage.removeItem("dracula_session_start");
    setUser(null);
    setOpen(false);
    router.push("/");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-[14px] bg-[#0d0d0d] border border-white/10 hover:border-[#2563eb]/60 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
      >
        {ACCOUNT_PHOTOS[user.email] ? (
          <img src={ACCOUNT_PHOTOS[user.email]} alt={user.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-2 ring-[#2563eb]/30" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ring-2 ring-[#2563eb]/30">
            {initials}
          </div>
        )}
        <span className="text-[12px] font-semibold text-[#f5f0eb] max-w-[96px] truncate">{user.name}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f5f0eb" strokeWidth="2.5" strokeLinecap="round"
          className={`opacity-35 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
            className="absolute top-[calc(100%+10px)] right-0 w-[230px] bg-[#0d0d0d] border border-white/10 rounded-[18px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)] z-[200]"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-[#2563eb]/50 to-transparent" />

            {/* Session Timer */}
            <div className="px-5 py-5 border-b border-white/6">
              <div className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#2563eb] mb-3">Session Timer</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                  </svg>
                </div>
                <span className="font-mono text-[22px] font-bold text-[#f5f0eb] tracking-[0.06em]">{timer}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#16a34a]">Live Session</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button onClick={() => { setOpen(false); router.push("/settings"); }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[12px] text-[12px] text-[#f5f0eb]/60 hover:text-[#f5f0eb] hover:bg-white/6 transition-all text-left group">
                <div className="w-6 h-6 rounded-[7px] bg-white/6 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563eb]/20 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                Profile
              </button>

              <button onClick={() => {
                  const next = !isDark;
                  setIsDark(next);
                  document.documentElement.classList.toggle("dark", next);
                  localStorage.setItem("dracula_theme", next ? "dark" : "light");
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[12px] text-[12px] text-[#f5f0eb]/60 hover:text-[#f5f0eb] hover:bg-white/6 transition-all text-left group">
                <div className={`w-6 h-6 rounded-[7px] bg-white/6 flex items-center justify-center flex-shrink-0 transition-colors ${isDark ? 'group-hover:bg-[#f5c518]/20' : 'group-hover:bg-[#7c3aed]/20'}`}>
                  {isDark ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                    </svg>
                  )}
                </div>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>

              <div className="h-px bg-white/6 mx-1 my-1" />

              <button onClick={signOut}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[12px] text-[12px] text-[#dc2626] hover:bg-[#dc2626]/10 transition-all text-left group">
                <div className="w-6 h-6 rounded-[7px] bg-[#dc2626]/10 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                </div>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HOME PAGE — scan console, device showcase, features
══════════════════════════════════════════════════════ */
export default function HomePage() {
  const [mode, setMode] = useState<"web" | "git">("web");
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const [logs, setLogs] = useState<Line[]>([
    { id: lid++, text: "── DRACULA ENGINE v3.0 ready ──", cls: "t-muted" },
    { id: lid++, text: "Awaiting target input…",          cls: "t-muted" },
  ]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  const addLog = (text: string, cls: string) =>
    setLogs(p => [...p, { id: lid++, text, cls }]);

  const runScan = () => {
    if (scanning) return;
    const t = target.trim() || (mode === "web" ? "example.com" : "user/repo");
    setScanning(true);
    addLog("", "t-muted");
    addLog(`── Scan started ──────────────────────────`, "t-muted");
    const set = mode === "web" ? WEB : GIT;
    let i = 0;
    const step = () => {
      if (i >= set.length) {
        const score = r(28, 97);
        addLog("", "t-muted");
        addLog(`── Done · Score ${score}/100 · Vulns ${r(0,12)} ──`, "t-muted");
        setScanning(false);
        return;
      }
      const [cls, fn] = set[i++];
      addLog(fn(t), cls);
      setTimeout(step, r(160, 480));
    };
    step();
  };

  return (
    <AuthGuard>
    <div className="relative min-h-screen bg-cream overflow-x-hidden">

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-5 pt-5"
      >
        <nav className="w-full max-w-5xl bg-cream/90 backdrop-blur-xl border border-black/8 shadow-soft rounded-[20px] px-6 py-3 flex items-center justify-between">
          <Logo size={30} dark={isDark} />
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Platform", href: "/platform" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Settings", href: "/settings" },
              { label: "Pricing", href: "/pricing" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-[13px] font-medium text-ink/60 hover:text-ink transition-colors">{l.label}</Link>
            ))}
          </div>
          <NavUser />
        </nav>
      </motion.header>

      {/* ══════════════════════════════════════
          HERO — full-height, asymmetric grid
      ══════════════════════════════════════ */}
      <section className="min-h-screen pt-28 pb-10 px-5 flex flex-col">
        <div className="max-w-[1320px] mx-auto w-full flex-1 flex flex-col gap-5">

          {/* Top row: scan card LEFT + visual panel RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-5 flex-1">

            {/* ── LEFT: dark scan card ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-dark-1 rounded-[32px] p-10 flex flex-col justify-between min-h-[580px] relative overflow-hidden"
            >
              {/* Subtle radial */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue/8 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-purple/6 blur-[80px] pointer-events-none" />

              {/* Header */}
              <div>
                <div className="section-label text-cream/40 mb-6">Target Control Console</div>
                <h1 className="font-bebas text-[clamp(52px,7vw,96px)] leading-[0.9] tracking-[0.03em] text-cream mb-4">
                  SCAN<br />
                  <span className="text-blue">ANYTHING.</span><br />
                  INSTANTLY.
                </h1>
                <p className="text-cream/50 text-[15px] leading-relaxed max-w-md mb-8">
                  Websites, GitHub repos, APIs, Playwright flows — DRACULA detects vulnerabilities before attackers do.
                </p>
              </div>

              {/* Mode tabs */}
              <div className="flex gap-2 mb-4">
                {(["web","git"] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-5 py-2.5 rounded-[12px] text-[12px] font-bold tracking-widest uppercase transition-all ${
                      mode === m
                        ? "bg-blue text-white"
                        : "bg-white/8 text-cream/50 hover:bg-white/12"
                    }`}
                  >
                    {m === "web" ? "Web URL" : "Git Repo"}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue font-mono text-[13px] flex-shrink-0">
                  {mode === "web" ? "https://" : "github.com/"}
                </span>
                <input
                  className="scan-input flex-1"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runScan()}
                  placeholder={mode === "web" ? "your-domain.com" : "username/repository"}
                />
              </div>

              {/* Terminal */}
              <div
                ref={termRef}
                className="mono bg-dark-2 rounded-[16px] p-4 h-[160px] overflow-y-auto mb-5 border border-white/5"
              >
                {logs.map(l => (
                  <div key={l.id} className={l.cls}>{l.text || "\u00A0"}</div>
                ))}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="t-blue">$</span>
                  <span className="inline-block w-2 h-[14px] bg-blue animate-blink" />
                </div>
              </div>

              {/* Execute */}
              <button
                onClick={runScan}
                disabled={scanning}
                className={`btn-solid w-full rounded-[16px] py-4 text-[14px] tracking-widest uppercase ${
                  scanning ? "bg-dark-4 text-cream/30 cursor-not-allowed" : "btn-blue"
                }`}
              >
                {scanning ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="12"/>
                    </svg>
                    Scanning…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                    Execute Scan
                  </span>
                )}
              </button>
            </motion.div>

            {/* ── RIGHT: device showcase ── */}
            <DeviceShowcase scannedUrl={target} />
          </div>

          {/* ── BOTTOM ROW: 4 brutalist cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {CARDS.map((c, i) => (
              <Link key={c.label} href={c.href}>
              <motion.div
                {...up(i * 0.07)}
                className="lift rounded-[28px] p-7 flex flex-col justify-between min-h-[180px] cursor-pointer relative overflow-hidden"
                style={{ background: c.bg }}
              >
                <div className="text-[32px] mb-2">{c.emoji}</div>
                <div>
                  <div className="font-bebas text-[32px] leading-none tracking-[0.04em] mb-1" style={{ color: c.fg }}>
                    {c.label}
                  </div>
                  <div className="text-[12px] font-medium" style={{ color: c.fg, opacity: 0.6 }}>
                    {c.sub}
                  </div>
                </div>
                <div className="absolute top-6 right-6 opacity-30" style={{ color: c.fg }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M7 17L17 7M7 7h10v10"/>
                  </svg>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════ */}
      <section id="platform" className="py-24 px-5">
        <div className="max-w-[1320px] mx-auto">
          <motion.div {...up()} className="mb-14">
            <div className="section-label text-ink mb-4">Platform Capabilities</div>
            <h2 className="font-bebas text-[clamp(48px,7vw,100px)] leading-[0.9] tracking-[0.03em] text-ink">
              EVERY ATTACK<br />SURFACE COVERED.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...up(i * 0.06)}
                className="lift bg-dark-1 rounded-[28px] p-8 flex flex-col gap-4 group cursor-pointer"
              >
                <div className="text-[36px]">{f.icon}</div>
                <div>
                  <h3 className="font-bebas text-[28px] tracking-[0.04em] text-cream leading-none mb-2">{f.title}</h3>
                  <p className="text-cream/50 text-[13.5px] leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 text-blue text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════ */}
      <section className="py-6 px-5">
        <div className="max-w-[1320px] mx-auto">
          <div className="bg-dark-1 rounded-[28px] grid grid-cols-2 md:grid-cols-4 divide-x divide-white/6">
            {[
              { val: "2,400+", label: "Teams Protected",       color: "#2563eb" },
              { val: "98%",    label: "Threat Detection Rate", color: "#f5c518" },
              { val: "1.2s",   label: "Average Scan Time",     color: "#7c3aed" },
              { val: "50K+",   label: "Vulnerabilities Found", color: "#dc2626" },
            ].map((s, i) => (
              <motion.div key={s.label} {...up(i * 0.08)} className="flex flex-col items-center py-10 px-6 text-center">
                <span className="font-bebas text-[52px] leading-none" style={{ color: s.color }}>{s.val}</span>
                <span className="text-[11px] text-cream/40 tracking-widest uppercase font-semibold mt-2">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DASHBOARD CTA — asymmetric
      ══════════════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-5">

            {/* Left — yellow CTA card */}
            <motion.div
              {...up()}
              className="bg-yellow rounded-[32px] p-12 flex flex-col justify-between min-h-[400px] relative overflow-hidden"
            >
              <div>
                <div className="section-label text-ink/50 mb-5">Full Dashboard</div>
                <h2 className="font-bebas text-[clamp(48px,5vw,80px)] leading-[0.9] tracking-[0.03em] text-ink mb-4">
                  COMMAND<br />CENTER.
                </h2>
                <p className="text-ink/60 text-[15px] leading-relaxed max-w-sm">
                  KPI cards, live terminal, findings gallery, AI remediation playbooks — all in one place.
                </p>
              </div>
              <Link href="/dashboard" className="btn-solid btn-dark self-start mt-8 rounded-[14px] py-4 px-8 text-[14px]">
                Open Dashboard →
              </Link>
              <div className="absolute -bottom-6 -right-4 font-bebas text-[160px] text-ink/6 leading-none select-none pointer-events-none">
                01
              </div>
            </motion.div>

            {/* Right — dark preview card */}
            <motion.div
              {...up(0.1)}
              className="bg-dark-1 rounded-[32px] p-8 flex flex-col gap-4 min-h-[400px] relative overflow-hidden"
            >
              <div className="section-label text-cream/30 mb-2">Live Preview</div>

              <div className="bg-dark-2 rounded-[20px] border border-white/6 overflow-hidden flex-1">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green/60" />
                  </div>
                  <div className="flex-1 mx-3 bg-white/5 rounded-lg px-3 py-1 text-[10px] text-cream/30 font-mono">
                    app.dracula.ai/dashboard
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Scans",     val: "247", color: "#2563eb" },
                    { label: "Score",     val: "94%", color: "#16a34a" },
                    { label: "Pipelines", val: "3",   color: "#7c3aed" },
                    { label: "Vulns",     val: "12",  color: "#dc2626" },
                  ].map(k => (
                    <div key={k.label} className="bg-dark-3 rounded-[14px] p-4">
                      <div className="font-bebas text-[30px] leading-none" style={{ color: k.color }}>{k.val}</div>
                      <div className="text-[9px] text-cream/30 tracking-widest uppercase mt-1">{k.label}</div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <div className="bg-dark-3 rounded-[14px] p-3">
                    <div className="text-[9px] text-cream/30 tracking-widest uppercase mb-2">Live Console</div>
                    <div className="mono space-y-0.5">
                      <div className="t-green">[CHROM] Browser ready ✓</div>
                      <div className="t-yellow">[SEC  ] ⚠  Missing CSP header</div>
                      <div className="t-green">[AI   ] Report generated ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="py-10 px-5 border-t border-black/8">
        <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={28} />
          <div className="flex items-center gap-6 text-[12px] text-ink/40 font-medium">
            {["Privacy","Terms","Security","Status"].map(l => (
              <a key={l} href="#" className="hover:text-ink transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-[12px] text-ink/35">© 2025 DRACULA AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </AuthGuard>
  );
}
