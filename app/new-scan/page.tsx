"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AppShell from "@/components/AppShell";
import AuthGuard from "@/components/AuthGuard";

function r(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }
let lid = 0;
type Line = { id: number; text: string; cls: string };

const WEB: Array<[string, (t: string) => string]> = [
  ["t-blue",   t  => `[INIT]  Resolving → ${t}`],
  ["t-muted",  () => `[DNS ]  A record → 104.21.${r(1,254)}.${r(1,254)}`],
  ["t-blue",   () => `[TLS ]  Handshake OK · TLS 1.3`],
  ["t-blue",   () => `[CHROM] Launching Chromium 131…`],
  ["t-green",  () => `[CHROM] Browser ready ✓`],
  ["t-muted",  () => `[DOM ]  ${r(40,180)} nodes · ${r(2,12)} iframes`],
  ["t-yellow", () => `[SEC ]  ⚠  Missing CSP header`],
  ["t-yellow", () => `[SEC ]  ⚠  Cookie without Secure flag`],
  ["t-muted",  () => `[A11Y]  ${r(0,8)} WCAG 2.1 AA violations`],
  ["t-blue",   () => `[AI  ]  Sending to analysis engine…`],
  ["t-green",  () => `[AI  ]  Report generated ✓`],
];
const GIT: Array<[string, (t: string) => string]> = [
  ["t-blue",   t  => `[INIT]  Cloning → github.com/${t}`],
  ["t-muted",  () => `[GIT ]  ${r(200,1800)} objects fetched`],
  ["t-green",  () => `[GIT ]  Clone complete ✓`],
  ["t-muted",  () => `[DEP ]  ${r(30,300)} packages · ${r(0,15)} CVEs`],
  ["t-yellow", () => `[SEC ]  ⚠  ${r(1,4)} high-severity advisories`],
  ["t-yellow", () => `[SEC ]  ⚠  API key pattern in .env`],
  ["t-blue",   () => `[AI  ]  Sending to analysis engine…`],
  ["t-green",  () => `[AI  ]  Report generated ✓`],
];

export default function NewScanPage() {
  const [mode, setMode]       = useState<"web" | "git">("web");
  const [target, setTarget]   = useState("");
  const [depth, setDepth]     = useState(1);
  const [scanning, setScanning] = useState(false);
  const [a11y, setA11y]       = useState(true);
  const [sec, setSec]         = useState(true);
  const [ui, setUi]           = useState(false);
  const [buildAudit, setBuild] = useState(true);
  const [secrets, setSecrets] = useState(true);
  const [docker, setDocker]   = useState(false);
  const [logs, setLogs]       = useState<Line[]>([
    { id: lid++, text: "── DRACULA ENGINE v3.0 ready ──", cls: "t-muted" },
    { id: lid++, text: "Awaiting target input…",          cls: "t-muted" },
  ]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  const addLog = useCallback((text: string, cls: string) =>
    setLogs(p => [...p, { id: lid++, text, cls }]), []);

  function runScan() {
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
  }

  function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <button onClick={onChange}
          className={`w-9 h-5 rounded-full relative transition-colors ${checked ? "bg-[#2563eb]" : "bg-white/10"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
        <span className="text-[12px] text-[#f5f0eb]/55">{label}</span>
      </label>
    );
  }

  return (
    <AuthGuard>
    <AppShell title="New Scan" subtitle="Configure and execute a security scan" badge={{ label: scanning ? "Scanning" : "Ready", color: scanning ? "blue" : "green" }}>
      <div className="p-6">
        <div className="grid xl:grid-cols-[1fr_360px] gap-5">

          {/* Config Panel */}
          <div className="bg-[#0d0d0d] rounded-[28px] p-7 flex flex-col gap-5">
            <div>
              <div className="section-label text-[#f5f0eb]/30 mb-2">Target Control Console</div>
              <h2 className="font-bebas text-[20px] tracking-[0.06em] text-[#f5f0eb]">Configure Scan</h2>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2">
              {(["web","git"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-5 py-2.5 rounded-[12px] text-[11px] font-bold tracking-widest uppercase transition-all ${
                    mode === m ? "bg-[#2563eb] text-white" : "bg-white/8 text-[#f5f0eb]/45 hover:bg-white/12"}`}>
                  {m === "web" ? "Web URL Scanner" : "GitHub Repo Analyzer"}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2">
              <span className="text-[#2563eb] font-mono text-[12px] flex-shrink-0">
                {mode === "web" ? "https://" : "github.com/"}
              </span>
              <input className="scan-input flex-1" value={target}
                onChange={e => setTarget(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runScan()}
                placeholder={mode === "web" ? "target-domain.com" : "username/repository"} />
            </div>

            {/* Options */}
            {mode === "web" ? (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[10px] text-[#f5f0eb]/30 font-bold tracking-widest uppercase mb-3">Crawl Depth</div>
                  <div className="flex gap-2">
                    {[1,2,3].map(d => (
                      <button key={d} onClick={() => setDepth(d)}
                        className={`w-10 h-9 rounded-[10px] text-[13px] font-bold transition-all ${
                          depth === d ? "bg-[#7c3aed] text-white" : "bg-white/8 text-[#f5f0eb]/45 hover:bg-white/14"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#f5f0eb]/30 font-bold tracking-widest uppercase mb-3">Analysis Options</div>
                  <div className="flex flex-col gap-3">
                    <Toggle label="Accessibility (WCAG 2.1 AA)" checked={a11y} onChange={() => setA11y(v => !v)} />
                    <Toggle label="Security Headers & Cookies"  checked={sec}  onChange={() => setSec(v => !v)} />
                    <Toggle label="UI Regression"               checked={ui}   onChange={() => setUi(v => !v)} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[10px] text-[#f5f0eb]/30 font-bold tracking-widest uppercase mb-3">Analysis Mode</div>
                <div className="flex flex-col gap-3">
                  <Toggle label="Build & Dependency Audit" checked={buildAudit} onChange={() => setBuild(v => !v)} />
                  <Toggle label="Secret Leakage Scan"      checked={secrets}    onChange={() => setSecrets(v => !v)} />
                  <Toggle label="Docker Config Review"     checked={docker}      onChange={() => setDocker(v => !v)} />
                </div>
              </div>
            )}

            <button onClick={runScan} disabled={scanning}
              className={`w-full py-4 rounded-[16px] text-[13px] font-bold tracking-widest uppercase transition-all mt-auto ${
                scanning ? "bg-[#2a2a2a] text-[#f5f0eb]/25 cursor-not-allowed" : "bg-[#2563eb] text-white hover:bg-[#2563eb]/90"}`}
              style={{ boxShadow: scanning ? "none" : "0 8px 24px rgba(37,99,235,0.35)" }}>
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
          <div className="bg-[#0d0d0d] rounded-[28px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f5c518]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]/60" />
                </div>
                <span className="font-bebas text-[14px] tracking-[0.1em] text-[#f5f0eb]/60">Live Console</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`dot ${scanning ? "dot-green" : "dot-grey"}`} style={{width:5,height:5}} />
                <span className="text-[10px] text-[#f5f0eb]/30 font-bold tracking-widest uppercase">{scanning ? "Scanning" : "Idle"}</span>
              </div>
            </div>
            <div ref={termRef} className="mono px-5 py-4 flex-1 overflow-y-auto min-h-[300px]">
              {logs.map(l => <div key={l.id} className={l.cls}>{l.text || "\u00A0"}</div>)}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="t-blue">$</span>
                <span className="inline-block w-2 h-[13px] bg-[#2563eb] animate-blink" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
    </AuthGuard>
  );
}
