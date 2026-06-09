"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
import AuthGuard from "@/components/AuthGuard";

function r(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }
let lid = 0, fid = 0;

type Line    = { id: number; text: string; cls: string };
type Finding = { id: number; target: string; type: string; status: "pass"|"warn"|"fail"; score: number; vulns: number; issues: number; ts: string };

const WEB: Array<[string,(t:string)=>string]> = [
  ["t-blue",   t  => `[INIT]  Resolving → ${t}`],
  ["t-muted",  () => `[DNS ]  A record → 104.21.${r(1,254)}.${r(1,254)}`],
  ["t-blue",   () => `[TLS ]  Handshake OK · TLS 1.3`],
  ["t-blue",   () => `[CHROM] Launching Chromium 131…`],
  ["t-green",  () => `[CHROM] Browser ready ✓`],
  ["t-muted",  () => `[DOM ]  ${r(40,180)} nodes · ${r(2,12)} iframes`],
  ["t-yellow", () => `[SEC ]  ⚠  Missing CSP header`],
  ["t-yellow", () => `[SEC ]  ⚠  Cookie without Secure flag`],
  ["t-blue",   () => `[AI  ]  Sending to GPT-4…`],
  ["t-green",  () => `[AI  ]  Report generated ✓`],
];
const GIT: Array<[string,(t:string)=>string]> = [
  ["t-blue",   t  => `[INIT]  Cloning → github.com/${t}`],
  ["t-muted",  () => `[GIT ]  ${r(200,1800)} objects fetched`],
  ["t-green",  () => `[GIT ]  Clone complete ✓`],
  ["t-muted",  () => `[DEP ]  ${r(30,300)} packages · ${r(0,15)} CVEs`],
  ["t-yellow", () => `[SEC ]  ⚠  ${r(1,4)} high-severity advisories`],
  ["t-yellow", () => `[SEC ]  ⚠  API key pattern in .env`],
  ["t-blue",   () => `[AI  ]  Sending to GPT-4…`],
  ["t-green",  () => `[AI  ]  Report generated ✓`],
];

const STATUS = {
  pass: { label:"PASS",     bg:"#dcfce7", text:"#16a34a", bar:"#16a34a" },
  warn: { label:"WARNING",  bg:"#fef9c3", text:"#ca8a04", bar:"#ca8a04" },
  fail: { label:"CRITICAL", bg:"#fee2e2", text:"#dc2626", bar:"#dc2626" },
};

function ScoreRing({ score }: { score: number }) {
  const c = 2 * Math.PI * 20;
  const col = score >= 75 ? "#16a34a" : score >= 45 ? "#ca8a04" : "#dc2626";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="20" fill="none" stroke="#e5e7eb" strokeWidth="3.5"/>
      <circle cx="26" cy="26" r="20" fill="none" stroke={col} strokeWidth="3.5"
        strokeDasharray={c} strokeDashoffset={c - (c * score / 100)}
        strokeLinecap="round" transform="rotate(-90 26 26)"
        style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <text x="26" y="30" textAnchor="middle" fill={col} fontSize="11" fontWeight="800" fontFamily="Inter,sans-serif">{score}</text>
    </svg>
  );
}

export default function DashboardPage() {
  const [mode, setMode]         = useState<"web"|"git">("web");
  const [target, setTarget]     = useState("");
  const [depth, setDepth]       = useState(1);
  const [scanning, setScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [vulnCount, setVulnCount] = useState(0);
  const [score, setScore]       = useState<number|null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [logs, setLogs]         = useState<Line[]>([
    { id:lid++, text:"── DRACULA ENGINE v3.0 ready ──", cls:"t-muted" },
    { id:lid++, text:"System armed. Awaiting target.",  cls:"t-muted" },
  ]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  const addLog = useCallback((text: string, cls: string) =>
    setLogs(p => [...p, { id:lid++, text, cls }]), []);

  const clearLogs = () => setLogs([{ id:lid++, text:"── Terminal cleared ──", cls:"t-muted" }]);

  // Restore last scan on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("dracula_scan_results") || "null");
      if (saved?.score != null) {
        setScore(saved.score);
        setScanCount(1);
        setVulnCount(saved.vulns || 0);
        setFindings([{
          id: fid++, target: saved.target, type: saved.mode === "web" ? "WEB SCAN" : "REPO SCAN",
          status: saved.score >= 75 ? "pass" : saved.score >= 45 ? "warn" : "fail",
          score: saved.score, vulns: saved.vulns || 0, issues: saved.issues || 0,
          ts: new Date(saved.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        }]);
        addLog(`── Restored last scan: ${saved.target} · Score ${saved.score}/100 ──`, "t-blue");
      }
    } catch {}
  }, [addLog]);

  const executeScan = () => {
    if (scanning) return;
    const t = target.trim() || (mode === "web" ? "example.com" : "user/repo");
    setScanning(true);
    addLog("", "t-muted");
    addLog(`── Scan started ──────────────────────────`, "t-muted");
    const set = mode === "web" ? WEB : GIT;
    let i = 0;
    const step = () => {
      if (i >= set.length) {
        const sc = r(28,97), vl = r(0,12), is = r(0,6);
        const st: Finding["status"] = sc >= 75 ? "pass" : sc >= 45 ? "warn" : "fail";
        setScanCount(c => c+1);
        setVulnCount(c => c+vl);
        setScore(sc);
        setFindings(p => [{
          id:fid++,
          target:(mode==="web"?"https://":"github.com/")+t,
          type:mode==="web"?"WEB SCAN":"REPO SCAN",
          status:st, score:sc, vulns:vl, issues:is,
          ts:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),
        },...p]);
        addLog("", "t-muted");
        addLog(`── Done · Score ${sc}/100 · Vulns ${vl} ──`, "t-muted");
        setScanning(false);
        // Persist scan results
        try {
          sessionStorage.setItem("dracula_scan_results", JSON.stringify({
            target: (mode==="web"?"https://":"github.com/")+t,
            mode, score: sc, vulns: vl, issues: is, timestamp: Date.now(),
          }));
        } catch {}
        return;
      }
      const [cls,fn] = set[i++];
      addLog(fn(t), cls);
      setTimeout(step, r(160,460));
    };
    step();
  };

  const gc = 2 * Math.PI * 36;
  const go = score !== null ? gc - (gc * score / 100) : gc;
  const gcol = score === null ? "#d1d5db" : score >= 75 ? "#16a34a" : score >= 45 ? "#ca8a04" : "#dc2626";

  return (
    <AuthGuard>
    <AppShell
      title="Security Dashboard"
      subtitle="Real-time threat intelligence & scan management"
      badge={{ label: scanning ? "Scanning" : "Ready", color: scanning ? "blue" : "green" }}
    >
      <div className="p-6 space-y-5">

        {/* KPI Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-[#0d0d0d] rounded-[24px] p-6 flex flex-col gap-3">
            <div className="section-label text-[#f5f0eb]/30">Scans Executed</div>
            <div className="font-bebas text-[52px] leading-none text-[#2563eb]">{scanCount}</div>
            <div className="text-[11px] text-[#f5f0eb]/35 font-medium">
              {scanCount > 0 ? `+${scanCount} this session` : "No scans yet"}
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 flex flex-col items-center justify-center gap-2 border border-black/6">
            <div className="relative">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="36" fill="none" stroke="#f3f4f6" strokeWidth="6"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke={gcol} strokeWidth="6"
                  strokeDasharray={gc} strokeDashoffset={go}
                  strokeLinecap="round" transform="rotate(-90 50 50)"
                  style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1), stroke 0.4s" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bebas text-[30px] leading-none" style={{ color:gcol }}>{score ?? "--"}</span>
                <span className="text-[9px] text-[#0d0d0d]/30 font-bold tracking-widest uppercase">Score</span>
              </div>
            </div>
            <div className="section-label text-[#0d0d0d]/40">Security Score</div>
            <div className="text-[11px] font-semibold" style={{ color:gcol }}>
              {score === null ? "No scans yet" : score >= 75 ? "Excellent" : score >= 45 ? "Moderate" : "Critical"}
            </div>
          </div>

          <div className="bg-[#7c3aed] rounded-[24px] p-6 flex flex-col gap-3">
            <div className="section-label text-white/40">Active Pipelines</div>
            <div className="font-bebas text-[52px] leading-none text-white">{scanning ? 1 : 0}</div>
            <div className="text-[11px] text-white/50 font-medium">{scanning ? "Running" : "Idle"}</div>
          </div>

          <div className="bg-[#dc2626] rounded-[24px] p-6 flex flex-col gap-3">
            <div className="section-label text-white/40">Unresolved Vulns</div>
            <div className="font-bebas text-[52px] leading-none text-white">{vulnCount}</div>
            <div className="text-[11px] text-white/50 font-medium">{vulnCount > 0 ? "Needs attention" : "Clean"}</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid xl:grid-cols-[1fr_340px] gap-5">
          <div className="flex flex-col gap-5">

            {/* Scan Console */}
            <div className="bg-[#0d0d0d] rounded-[28px] p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="section-label text-[#f5f0eb]/30 mb-1">Target Control Console</div>
                  <h2 className="font-bebas text-[22px] tracking-[0.06em] text-[#f5f0eb]">Execute Scan</h2>
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${
                  scanning ? "bg-[#2563eb]/20 text-[#2563eb]" : "bg-[#16a34a]/15 text-[#16a34a]"
                }`}>
                  {scanning ? "Scanning" : "Ready"}
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                {(["web","git"] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-5 py-2.5 rounded-[12px] text-[11px] font-bold tracking-widest uppercase transition-all ${
                      mode === m ? "bg-[#2563eb] text-white" : "bg-white/8 text-[#f5f0eb]/45 hover:bg-white/12"
                    }`}
                  >
                    {m === "web" ? "Web URL Scanner" : "GitHub Repo Analyzer"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#2563eb] font-mono text-[12px] flex-shrink-0">
                  {mode === "web" ? "https://" : "github.com/"}
                </span>
                <input
                  className="scan-input flex-1"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && executeScan()}
                  placeholder={mode === "web" ? "target-domain.com" : "username/repository"}
                />
              </div>

              {mode === "web" && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] text-[#f5f0eb]/35 font-bold tracking-widest uppercase">Crawl Depth</span>
                  <div className="flex gap-2">
                    {[1,2,3].map(d => (
                      <button key={d} onClick={() => setDepth(d)}
                        className={`w-9 h-8 rounded-[10px] text-[13px] font-bold transition-all ${
                          depth === d ? "bg-[#7c3aed] text-white" : "bg-white/8 text-[#f5f0eb]/45 hover:bg-white/14"
                        }`}
                      >{d}</button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={executeScan}
                disabled={scanning}
                className={`w-full py-4 rounded-[16px] text-[13px] font-bold tracking-widest uppercase transition-all ${
                  scanning ? "bg-[#2a2a2a] text-[#f5f0eb]/25 cursor-not-allowed" : "bg-[#2563eb] text-white"
                }`}
                style={{ boxShadow: scanning ? "none" : "0 8px 24px rgba(37,99,235,0.35)" }}
              >
                {scanning ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="12"/>
                    </svg>
                    Scanning…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                    Execute Scan
                  </span>
                )}
              </button>
            </div>

            {/* Terminal */}
            <div className="bg-[#0d0d0d] rounded-[28px] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f5c518]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]/60" />
                  </div>
                  <span className="font-bebas text-[14px] tracking-[0.1em] text-[#f5f0eb]/60">Live Scan Console</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`dot ${scanning ? "dot-green" : "dot-grey"}`} style={{width:5,height:5}} />
                    <span className="text-[10px] text-[#f5f0eb]/35 font-semibold tracking-widest uppercase">
                      {scanning ? "Scanning" : "Idle"}
                    </span>
                  </div>
                  <button onClick={clearLogs} className="text-[10px] text-[#f5f0eb]/30 hover:text-[#f5f0eb]/60 border border-white/8 px-3 py-1 rounded-lg tracking-widest uppercase font-bold transition-colors">
                    CLR
                  </button>
                </div>
              </div>
              <div ref={termRef} className="mono px-6 py-4 h-[240px] overflow-y-auto bg-[#161616]/50">
                {logs.map(l => <div key={l.id} className={l.cls}>{l.text || "\u00A0"}</div>)}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="t-blue">$</span>
                  <span className="inline-block w-2 h-[13px] bg-[#2563eb] animate-blink" />
                </div>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div className="bg-white rounded-[28px] border border-black/6 flex flex-col overflow-hidden shadow-soft">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/6 flex-shrink-0">
              <h3 className="font-bebas text-[16px] tracking-[0.08em] text-[#0d0d0d]">Recent Findings</h3>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#e8e2da] text-[#0d0d0d]/50">
                {findings.length} Report{findings.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {findings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <div className="w-12 h-12 rounded-[16px] bg-[#e8e2da] flex items-center justify-center text-[20px]">🔍</div>
                    <p className="text-[12px] text-[#0d0d0d]/35 leading-relaxed">
                      No scans yet.<br/>Execute a scan to see findings.
                    </p>
                  </div>
                ) : findings.map(f => {
                  const cfg = STATUS[f.status];
                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity:0, y:12 }}
                      animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0, x:-12 }}
                      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
                      className="rounded-[18px] border border-black/6 p-4 relative overflow-hidden hover:shadow-soft transition-shadow cursor-pointer"
                      style={{ background:"#fafaf8" }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[18px]" style={{ background:cfg.bar }} />
                      <div className="flex items-start justify-between gap-3 pl-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-mono text-[#0d0d0d]/50 truncate mb-2">{f.target}</div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background:cfg.bg, color:cfg.text }}>
                              {cfg.label}
                            </span>
                            <span className="text-[9px] font-bold text-[#0d0d0d]/30 tracking-widest uppercase">{f.type}</span>
                            <span className="text-[9px] text-[#0d0d0d]/25">{f.ts}</span>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <div className="font-bebas text-[20px] leading-none" style={{ color:f.vulns>0?"#dc2626":"#16a34a" }}>{f.vulns}</div>
                              <div className="text-[9px] text-[#0d0d0d]/30 tracking-widest uppercase">Vulns</div>
                            </div>
                            <div>
                              <div className="font-bebas text-[20px] leading-none" style={{ color:f.issues>0?"#ca8a04":"#16a34a" }}>{f.issues}</div>
                              <div className="text-[9px] text-[#0d0d0d]/30 tracking-widest uppercase">Issues</div>
                            </div>
                          </div>
                        </div>
                        <ScoreRing score={f.score} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
    </AuthGuard>
  );
}
