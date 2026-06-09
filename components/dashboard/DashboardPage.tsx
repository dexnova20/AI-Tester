"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Logo from "../Logo";
import KpiCard from "./KpiCard";
import TerminalPanel from "./TerminalPanel";
import FindingsPanel, { Finding } from "./FindingsPanel";

type LogLine = { text: string; cls: string; id: number };
type Mode = "web" | "git";

let _lid = 0;
let _fid = 0;
function r(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

const WEB_LOGS: Array<[string, (t: string) => string]> = [
  ["cmd",     (t) => `[INIT]   Resolving target → ${t}`],
  ["data",    ()  => `[DNS ]   A record → 104.21.${r(1,254)}.${r(1,254)} · TTL 300s`],
  ["cmd",     ()  => `[TLS ]   Handshake OK · TLS 1.3`],
  ["cmd",     ()  => `[CHROM]  Launching Chromium 131.0.${r(6770,6800)}.0…`],
  ["success", ()  => `[CHROM]  Browser context ready ✓`],
  ["data",    ()  => `[CRAWL]  ${r(40,180)} DOM nodes · ${r(2,12)} iframes`],
  ["warn",    ()  => `[SEC  ]  ⚠  Missing Content-Security-Policy`],
  ["data",    ()  => `[A11Y ]  ${r(0,8)} WCAG 2.1 AA violations`],
  ["warn",    ()  => `[SEC  ]  ⚠  Cookie without Secure/SameSite`],
  ["cmd",     ()  => `[AI   ]  Sending corpus to GPT-4…`],
  ["success", ()  => `[AI   ]  Report generated ✓`],
];

const GIT_LOGS: Array<[string, (t: string) => string]> = [
  ["cmd",     (t) => `[INIT]   Cloning → github.com/${t}`],
  ["data",    ()  => `[GIT ]   ${r(200,1800)} objects fetched`],
  ["success", ()  => `[GIT ]   Clone complete ✓`],
  ["data",    ()  => `[DEP ]   ${r(30,300)} packages · ${r(0,15)} CVEs`],
  ["warn",    ()  => `[SEC ]   ⚠  ${r(1,4)} high-severity advisories`],
  ["warn",    ()  => `[SEC ]   ⚠  Potential API key in .env.example`],
  ["cmd",     ()  => `[AI   ]  Sending corpus to GPT-4…`],
  ["success", ()  => `[AI   ]  Report generated ✓`],
];

const CLS_MAP: Record<string, string> = {
  cmd: "term-cmd", data: "term-data", success: "term-success",
  warn: "term-warn", error: "term-error",
};

const NAV_ITEMS = [
  { icon: "grid",    label: "Dashboard", active: true  },
  { icon: "scan",    label: "New Scan",  active: false },
  { icon: "file",    label: "Reports",   active: false },
  { icon: "shield",  label: "Security",  active: false },
  { icon: "plug",    label: "Integrations", active: false },
  { icon: "settings",label: "Settings",  active: false },
];

function NavIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/></svg>,
    scan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.4"/></svg>,
    shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6"/></svg>,
    plug: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M9 10.5l6-3M9 13.5l6 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5"/></svg>,
  };
  return <>{icons[type]}</>;
}

export default function DashboardPage({ userName = "Agent" }: { userName?: string }) {
  const [mode, setMode] = useState<Mode>("web");
  const [target, setTarget] = useState("");
  const [depth, setDepth] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [vulnCount, setVulnCount] = useState(0);
  const [secScore, setSecScore] = useState<number | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [logs, setLogs] = useState<LogLine[]>([
    { text: "── DRACULA ENGINE v3.0 · Chromium 131 · Playwright v1.49 ──", cls: "term-comment", id: _lid++ },
    { text: `System armed. Welcome, ${userName}.`, cls: "term-success", id: _lid++ },
  ]);

  const addLog = useCallback((text: string, cls: string) => {
    setLogs((prev) => [...prev, { text, cls, id: _lid++ }]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([
      { text: "── Terminal cleared. Awaiting next target. ──", cls: "term-comment", id: _lid++ },
    ]);
  }, []);

  const executeScan = () => {
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
        const vulns = r(0, 12);
        const issues = r(0, 6);
        const status: Finding["status"] = score >= 75 ? "pass" : score >= 45 ? "warn" : "fail";

        setScanCount((c) => c + 1);
        setVulnCount((c) => c + vulns);
        setSecScore(score);

        setFindings((prev) => [
          {
            id: _fid++,
            target: (mode === "web" ? "https://" : "github.com/") + t,
            type: mode === "web" ? "WEB SCAN" : "REPO SCAN",
            status,
            score,
            vulns,
            issues,
            ts: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ]);

        addLog("", "");
        addLog(`── Complete · Score: ${score}/100 · Vulns: ${vulns} · Issues: ${issues} ──`, "term-comment");
        setScanning(false);
        return;
      }
      const [cls, fn] = logSet[i++];
      addLog(fn(t), CLS_MAP[cls] || "text-[#9ca3af]");
      setTimeout(step, r(180, 500));
    };
    step();
  };

  // Gauge
  const gaugeCirc = 2 * Math.PI * 33;
  const gaugeOffset = secScore !== null ? gaugeCirc - (gaugeCirc * secScore) / 100 : gaugeCirc;
  const gaugeColor = secScore === null ? "#4b5563" : secScore >= 75 ? "#10b981" : secScore >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col glass-strong border-r border-white/6 z-20">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/6">
          <Logo size={32} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left w-full ${
                item.active
                  ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/20"
                  : "text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-white/5"
              }`}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-[#f3f4f6] truncate">{userName}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="status-dot online" style={{ width: 5, height: 5 }} />
                <span className="text-[10px] text-[#10b981]">Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/6 glass-strong flex-shrink-0">
          <div>
            <h1 className="text-[16px] font-bold text-[#f3f4f6]">Security Dashboard</h1>
            <p className="text-[11px] text-[#4b5563] mt-0.5">Real-time threat intelligence & scan management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8 glass text-[11px] text-[#9ca3af]">
              <div className="status-dot online" style={{ width: 5, height: 5 }} />
              All Systems Operational
            </div>
            <button className="w-9 h-9 rounded-xl glass border border-white/8 flex items-center justify-center text-[#9ca3af] hover:text-[#f3f4f6] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* KPI Row */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              label="Scans Executed"
              value={scanCount}
              delta={scanCount > 0 ? `+${scanCount} this session` : undefined}
              deltaUp
              color="#3b82f6"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
            />

            {/* Featured gauge card */}
            <div className="card-hover col-span-2 xl:col-span-1 glass rounded-[24px] border border-white/8 p-5 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent" />
              <div className="relative">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="33" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                  <circle
                    cx="45" cy="45" r="33"
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="5"
                    strokeDasharray={gaugeCirc}
                    strokeDashoffset={gaugeOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 45 45)"
                    style={{
                      transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1), stroke 0.5s",
                      filter: `drop-shadow(0 0 6px ${gaugeColor}80)`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-['Bebas_Neue'] text-[28px] leading-none" style={{ color: gaugeColor }}>
                    {secScore ?? "--"}
                  </span>
                  <span className="text-[9px] text-[#4b5563] font-semibold tracking-widest uppercase">%</span>
                </div>
              </div>
              <div className="text-[11px] text-[#9ca3af] tracking-widest uppercase font-semibold">Security Score</div>
              <div className="text-[10px]" style={{ color: gaugeColor }}>
                {secScore === null ? "No scans yet" : secScore >= 75 ? "Excellent" : secScore >= 45 ? "Moderate" : "Critical"}
              </div>
            </div>

            <KpiCard
              label="Active Pipelines"
              value={scanning ? 1 : 0}
              delta={scanning ? "Running" : "Idle"}
              deltaUp={scanning}
              color="#8b5cf6"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M13 17h8M17 13v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            />

            <KpiCard
              label="Unresolved Vulns"
              value={vulnCount}
              delta={vulnCount > 0 ? "Needs attention" : "Clean"}
              deltaUp={vulnCount === 0}
              color="#ef4444"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            />
          </div>

          {/* Main grid */}
          <div className="grid xl:grid-cols-[1fr_340px] gap-5">

            {/* Left column */}
            <div className="flex flex-col gap-5">

              {/* Scan Console */}
              <div className="glass rounded-[24px] border border-white/6 p-5 shadow-panel">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/6">
                  <div className="w-7 h-7 rounded-lg bg-[#3b82f6]/12 text-[#3b82f6] flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  </div>
                  <span className="text-[12px] font-bold tracking-widest uppercase text-[#f3f4f6]">Target Control Console</span>
                  <span className={`ml-auto text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${scanning ? "border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6]" : "border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]"}`}>
                    {scanning ? "Scanning" : "Ready"}
                  </span>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-0 border border-white/8 rounded-xl overflow-hidden mb-4">
                  {(["web", "git"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all ${
                        mode === m ? "bg-[#3b82f6]/15 text-[#3b82f6]" : "text-[#4b5563] hover:text-[#9ca3af]"
                      }`}
                    >
                      {m === "web" ? "Web URL Scanner" : "GitHub Repo Analyzer"}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex items-center glass rounded-xl border border-white/8 mb-4 overflow-hidden focus-within:border-[#3b82f6]/40 transition-colors">
                  <span className="pl-4 pr-2 text-[#3b82f6] font-mono text-[12px] flex-shrink-0">
                    {mode === "web" ? "https://" : "github.com/"}
                  </span>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && executeScan()}
                    placeholder={mode === "web" ? "target-domain.com" : "username/repository"}
                    className="flex-1 bg-transparent py-3 text-[13px] text-[#f3f4f6] placeholder-[#4b5563] outline-none font-mono"
                  />
                </div>

                {/* Options */}
                {mode === "web" && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] text-[#4b5563] tracking-widest uppercase font-semibold">Crawl Depth</span>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDepth(d)}
                          className={`w-8 h-7 rounded-lg text-[12px] font-bold transition-all ${
                            depth === d
                              ? "bg-[#8b5cf6] text-white shadow-glow-purple"
                              : "glass border border-white/8 text-[#9ca3af] hover:border-white/15"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execute */}
                <button
                  onClick={executeScan}
                  disabled={scanning}
                  className={`w-full py-3.5 rounded-xl text-[13px] font-bold tracking-widest uppercase relative overflow-hidden transition-all ${
                    scanning ? "opacity-50 cursor-not-allowed" : "group"
                  }`}
                >
                  {!scanning && (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4]" />
                      <span className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
                    </>
                  )}
                  {scanning && <span className="absolute inset-0 bg-white/5" />}
                  <span className="relative flex items-center justify-center gap-2 text-white">
                    {scanning ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12"/></svg>
                        Scanning…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                        Execute Scan
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Terminal */}
              <TerminalPanel logs={logs} scanning={scanning} onClear={clearLogs} />
            </div>

            {/* Right — Findings */}
            <FindingsPanel findings={findings} />
          </div>
        </div>
      </main>
    </div>
  );
}
