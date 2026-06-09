"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LogLine = { text: string; cls: string; id: number };

const WEB_LOGS: Array<[string, (t: string) => string]> = [
  ["cmd",     (t) => `[INIT]   Resolving target → ${t}`],
  ["data",    ()  => `[DNS ]   A record → 104.21.${r(1,254)}.${r(1,254)} · TTL 300s`],
  ["cmd",     ()  => `[TLS ]   Handshake OK · TLS 1.3 · ECDHE-RSA-AES256`],
  ["cmd",     ()  => `[CHROM]  Launching Chromium 131.0.${r(6770,6800)}.0 headless…`],
  ["success", ()  => `[CHROM]  Browser context ready ✓`],
  ["data",    ()  => `[CRAWL]  Page 1 — ${r(40,180)} DOM nodes · ${r(2,12)} iframes`],
  ["warn",    ()  => `[SEC  ]  ⚠  Missing Content-Security-Policy header`],
  ["data",    ()  => `[A11Y ]  ${r(0,8)} WCAG 2.1 AA violations`],
  ["data",    ()  => `[NET  ]  ${r(20,80)} requests · ${r(2,14)} cross-origin`],
  ["warn",    ()  => `[SEC  ]  ⚠  Cookie without Secure/SameSite flags`],
  ["cmd",     ()  => `[SCRN ]  Capturing full-page screenshot…`],
  ["success", ()  => `[SCRN ]  Saved ✓  ${r(1200,2400)}×${r(600,1100)}px`],
  ["data",    ()  => `[PERF ]  LCP ${(Math.random()*3+0.5).toFixed(2)}s · FID ${r(10,120)}ms · CLS ${(Math.random()*0.3).toFixed(3)}`],
  ["cmd",     ()  => `[AI   ]  Sending corpus to GPT-4 analysis engine…`],
  ["success", ()  => `[AI   ]  Report generated ✓  — Findings compiled`],
];

const GIT_LOGS: Array<[string, (t: string) => string]> = [
  ["cmd",     (t) => `[INIT]   Cloning → github.com/${t}`],
  ["data",    ()  => `[GIT ]   ${r(200,1800)} objects fetched`],
  ["success", ()  => `[GIT ]   Clone complete ✓`],
  ["cmd",     ()  => `[DEP ]   Parsing package manifests…`],
  ["data",    ()  => `[DEP ]   ${r(30,300)} packages · ${r(0,15)} CVEs found`],
  ["warn",    ()  => `[SEC ]   ⚠  ${r(1,4)} high-severity advisories`],
  ["cmd",     ()  => `[SEC ]   Secret-pattern scanner running…`],
  ["warn",    ()  => `[SEC ]   ⚠  Potential API key in .env.example`],
  ["cmd",     ()  => `[BUILD]  Attempting build…`],
  ["success", ()  => `[BUILD]  Build OK in ${(Math.random()*30+5).toFixed(1)}s ✓`],
  ["cmd",     ()  => `[AI   ]  Sending corpus to GPT-4 analysis engine…`],
  ["success", ()  => `[AI   ]  Report generated ✓  — Findings compiled`],
];

function r(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

let _id = 0;

export default function ScanConsole() {
  const [mode, setMode] = useState<"web" | "git">("web");
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([
    { text: "── DRACULA ENGINE v3.0 · Chromium 131 · Playwright v1.49 ──", cls: "term-comment", id: _id++ },
    { text: "System armed. Awaiting target.", cls: "text-[#9ca3af]", id: _id++ },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, cls: string) => {
    setLogs((prev) => [...prev, { text, cls, id: _id++ }]);
  };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [logs]);

  const runScan = () => {
    if (scanning) return;
    const t = target.trim() || (mode === "web" ? "example.com" : "user/repo");
    setScanning(true);
    addLog("", "");
    addLog(`── Scan Initiated ─────────────────────────────────────────`, "term-comment");

    const logSet = mode === "web" ? WEB_LOGS : GIT_LOGS;
    let i = 0;
    const step = () => {
      if (i >= logSet.length) {
        const score = r(28, 97);
        addLog("", "");
        addLog(`── Complete · Score: ${score}/100 · Vulns: ${r(0,12)} ──`, "term-comment");
        setScanning(false);
        return;
      }
      const [cls, fn] = logSet[i++];
      const clsMap: Record<string, string> = {
        cmd: "term-cmd", data: "term-data", success: "term-success",
        warn: "term-warn", error: "term-error",
      };
      addLog(fn(t), clsMap[cls] || "text-[#9ca3af]");
      setTimeout(step, r(180, 520));
    };
    step();
  };

  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-[#3b82f6] opacity-[0.05] absolute -left-20 top-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4] text-[11px] font-semibold tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-glow-pulse" />
              Live Console
            </span>
            <h2 className="font-['Bebas_Neue'] text-[clamp(36px,5vw,64px)] tracking-[0.04em] text-[#f3f4f6] leading-tight mb-5">
              WATCH THE AI<br />
              <span className="text-[#06b6d4] text-glow-cyan">WORK IN REAL TIME</span>
            </h2>
            <p className="text-[15px] text-[#9ca3af] leading-relaxed mb-8">
              Every scan streams live terminal output — DNS resolution, Chromium launch,
              DOM parsing, AI analysis — so you see exactly what DRACULA is doing.
            </p>

            {/* Feature list */}
            {[
              "Headless Chromium with full JS execution",
              "GPT-4 powered vulnerability correlation",
              "Playwright test suite integration",
              "Slack / webhook alerts on completion",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full bg-[#06b6d4]/15 border border-[#06b6d4]/30 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-[13.5px] text-[#9ca3af]">{item}</span>
              </div>
            ))}
          </motion.div>

          {/* Right — terminal */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Glow behind terminal */}
            <div className="absolute -inset-4 bg-[#3b82f6]/5 rounded-[36px] blur-2xl" />

            <div className="relative glass-strong rounded-[28px] border border-white/8 overflow-hidden shadow-panel">
              {/* Scan line */}
              {scanning && <div className="scan-line" />}

              {/* Title bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#10b981]/70" />
                  </div>
                  <span className="text-[11px] text-[#4b5563] font-mono ml-2">dracula@core:~$</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`status-dot ${scanning ? "online" : "idle"}`} />
                  <span className="text-[10px] text-[#4b5563] tracking-widest uppercase font-semibold">
                    {scanning ? "Scanning" : "Idle"}
                  </span>
                </div>
              </div>

              {/* Mode tabs */}
              <div className="flex border-b border-white/6">
                {(["web", "git"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all ${
                      mode === m
                        ? "text-[#3b82f6] border-b-2 border-[#3b82f6] bg-[#3b82f6]/5"
                        : "text-[#4b5563] hover:text-[#9ca3af]"
                    }`}
                  >
                    {m === "web" ? "Web URL Scanner" : "Git Repo Analyzer"}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
                <span className="text-[#3b82f6] font-mono text-[12px] flex-shrink-0">
                  {mode === "web" ? "https://" : "github.com/"}
                </span>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runScan()}
                  placeholder={mode === "web" ? "target-domain.com" : "username/repository"}
                  className="flex-1 bg-transparent text-[13px] text-[#f3f4f6] placeholder-[#4b5563] outline-none font-mono"
                />
                <button
                  onClick={runScan}
                  disabled={scanning}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all ${
                    scanning
                      ? "bg-white/5 text-[#4b5563] cursor-not-allowed"
                      : "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 hover:bg-[#3b82f6]/30"
                  }`}
                >
                  {scanning ? "Running…" : "Execute"}
                </button>
              </div>

              {/* Terminal body */}
              <div
                ref={bodyRef}
                className="terminal-body h-72 overflow-y-auto px-5 py-4 bg-[#050505]/80"
              >
                {logs.map((line) => (
                  <div key={line.id} className={`${line.cls} leading-7`}>
                    {line.text || "\u00A0"}
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-1">
                  <span className="term-prompt">dracula@core:~$</span>
                  <span className="inline-block w-2 h-4 bg-[#3b82f6] animate-terminal-cursor" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
