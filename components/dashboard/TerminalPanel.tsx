"use client";
import { useEffect, useRef } from "react";

interface TermLine { text: string; cls: string; id: number; }

interface TerminalPanelProps {
  logs: TermLine[];
  scanning: boolean;
  onClear: () => void;
}

export default function TerminalPanel({ logs, scanning, onClear }: TerminalPanelProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="glass rounded-[24px] border border-white/6 overflow-hidden flex flex-col shadow-panel">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M7 8l4 4-4 4M13 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[12px] font-bold tracking-widest uppercase text-[#f3f4f6]">
            Live Scan Console
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`status-dot ${scanning ? "online" : "idle"}`} />
            <span className="text-[10px] text-[#9ca3af] tracking-widest uppercase font-semibold">
              {scanning ? "Scanning" : "Idle"}
            </span>
          </div>
          <button
            onClick={onClear}
            className="text-[10px] text-[#4b5563] hover:text-[#9ca3af] border border-white/8 hover:border-white/15 px-3 py-1 rounded-lg tracking-widest uppercase font-semibold transition-all"
          >
            CLR
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="terminal-body flex-1 overflow-y-auto px-5 py-4 bg-[#050505]/60 min-h-[260px] max-h-[320px]"
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
  );
}
