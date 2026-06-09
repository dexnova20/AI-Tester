"use client";
import { motion, AnimatePresence } from "framer-motion";

export interface Finding {
  id: number;
  target: string;
  type: "WEB SCAN" | "REPO SCAN";
  status: "pass" | "warn" | "fail";
  score: number;
  vulns: number;
  issues: number;
  ts: string;
}

const STATUS_CONFIG = {
  pass: { label: "PASS",    color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)" },
  warn: { label: "WARNING", color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)" },
  fail: { label: "CRITICAL",color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score >= 75 ? "#10b981" : score >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
      <circle
        cx="24" cy="24" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
      />
      <text x="24" y="28" textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="Bebas Neue, sans-serif">
        {score}
      </text>
    </svg>
  );
}

export default function FindingsPanel({ findings }: { findings: Finding[] }) {
  return (
    <div className="glass rounded-[24px] border border-white/6 overflow-hidden flex flex-col shadow-panel h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#8b5cf6]/12 text-[#8b5cf6]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[12px] font-bold tracking-widest uppercase text-[#f3f4f6]">
            Recent Findings
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/10 text-[#9ca3af]">
          {findings.length} Report{findings.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {findings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" opacity="0.3">
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="1.5"/>
                  <path d="M16.5 16.5l4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-[12px] text-[#4b5563] leading-relaxed">
                No scans yet.<br />Execute a scan to populate findings.
              </p>
            </div>
          ) : (
            findings.map((f) => {
              const cfg = STATUS_CONFIG[f.status];
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border p-4 relative overflow-hidden group cursor-pointer transition-all duration-200 hover:border-white/12"
                  style={{ background: "rgba(17,24,39,0.5)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {/* Left accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl"
                    style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}60` }}
                  />

                  <div className="flex items-start justify-between gap-3 pl-2">
                    <div className="flex-1 min-w-0">
                      {/* Target */}
                      <div className="text-[11px] font-mono text-[#9ca3af] truncate mb-1.5">
                        {f.target}
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span
                          className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
                          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-[#4b5563] font-semibold tracking-wider uppercase">
                          {f.type}
                        </span>
                        <span className="text-[10px] text-[#4b5563]">{f.ts}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-[15px] font-bold" style={{ color: f.vulns > 0 ? "#ef4444" : "#10b981" }}>
                            {f.vulns}
                          </div>
                          <div className="text-[9px] text-[#4b5563] tracking-widest uppercase">Vulns</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[15px] font-bold" style={{ color: f.issues > 0 ? "#f59e0b" : "#10b981" }}>
                            {f.issues}
                          </div>
                          <div className="text-[9px] text-[#4b5563] tracking-widest uppercase">Issues</div>
                        </div>
                      </div>
                    </div>

                    {/* Score ring */}
                    <ScoreRing score={f.score} />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
