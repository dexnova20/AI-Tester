import { useEffect, useRef, useState } from "react";
import StatusBadge from "./StatusBadge";

interface ScanDashboardProps {
  data: any;
}

function ScoreGauge({ score, label, colorClass, borderClass }: { score: number; label: string; colorClass: string; borderClass: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-gray-950/50 border border-gray-900 rounded-xl p-4 flex flex-col items-center justify-center backdrop-blur-sm relative group hover:border-gray-800 transition duration-300">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r={radius} className="stroke-gray-900" strokeWidth="5" fill="transparent" />
          <circle 
            cx="40" 
            cy="40" 
            r={radius} 
            className={`${colorClass} transition-all duration-1000`} 
            strokeWidth="5" 
            fill="transparent"
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
          />
        </svg>
        <span className="absolute text-xl font-black font-mono text-white">{score}%</span>
      </div>
      <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-2 text-center">{label}</span>
    </div>
  );
}

export default function ScanDashboard({ data }: ScanDashboardProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Auto-scroll log terminal on change
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.logs]);

  if (!data) return null;

  const isCompleted = data.status === "completed";
  const isRunning = data.status === "running" || data.status === "queued";
  
  // Scoring parameters (fallbacks)
  const scores = data.scores || { security: 85, accessibility: 78, ui_stability: 92 };

  // Logs stream fallback
  const logs = data.logs || [];

  // Screenshot gallery mapping
  const gallery = data.screenshot_gallery || (data.screenshot ? [{ path: data.screenshot, route: "/" }] : []);

  // Findings catalog mapping
  const findings = data.findings || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. REPORT MAIN BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-900 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-black tracking-widest text-white font-mono">SCAN CONSOLE</h2>
            <span className="text-red-500 font-mono text-xs px-2 py-0.5 bg-red-950/50 border border-red-500/30 rounded">SECURE LINK</span>
          </div>
          <p className="text-gray-500 font-mono text-xs mt-1.5 uppercase tracking-wider">Target: <span className="text-gray-300 font-semibold lowercase">{data.url || data.repo_url}</span></p>
        </div>
        <div className="flex items-center space-x-3">
          <StatusBadge status={data.status} />
        </div>
      </div>

      {/* 2. DYNAMIC WORKFLOW CHRONOLOGY PANEL */}
      {isRunning && (
        <div className="bg-gray-950/40 border border-red-500/20 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.02)]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
          <h4 className="text-[10px] text-red-500 font-bold uppercase font-mono tracking-widest mb-3 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
            Agent Operational Sequence
          </h4>
          <div className="grid grid-cols-4 text-center text-xs font-mono text-gray-500">
            <div className="text-red-400">1. BOOT</div>
            <div className={`${logs.length > 2 ? "text-red-400" : "text-gray-700 animate-pulse"}`}>2. CRAWL</div>
            <div className={`${logs.length > 6 ? "text-red-400" : "text-gray-700"}`}>3. AUDIT</div>
            <div className={`${logs.length > 10 ? "text-red-400" : "text-gray-700"}`}>4. GENERATE</div>
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-1000 rounded-full" 
              style={{ width: `${Math.min(100, Math.max(10, (logs.length / 15) * 100))}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 3. ENTERPRISE SCAN METRICS (Only shows when completed) */}
      {isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-1000">
          <ScoreGauge score={scores.security} label="Security Diagnostics" colorClass="stroke-orange-500" borderClass="border-orange-500/30" />
          <ScoreGauge score={scores.accessibility} label="Accessibility Audits" colorClass="stroke-indigo-500" borderClass="border-indigo-500/30" />
          <ScoreGauge score={scores.ui_stability} label="UI Layout Stability" colorClass="stroke-red-500" borderClass="border-red-500/30" />
          
          {/* Executive Bug Dashboard Tracker */}
          <div className="bg-gray-950/50 border border-gray-900 rounded-xl p-4 flex flex-col justify-between backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Telemetry Counters</span>
              <span className="text-[9px] text-green-500 border border-green-500/30 px-1 py-0.5 rounded font-mono">OK</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3">
              <div>
                <div className="text-xl font-bold font-mono text-red-500">{data.bugs_found || 0}</div>
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider mt-0.5">Bugs</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-yellow-500">{data.ui_issues || 0}</div>
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider mt-0.5">UI Slips</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-orange-500">{data.security_issues || 0}</div>
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider mt-0.5">Security</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN LAYOUT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Audit Details, Timeline, & AI Synthesis) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Executive Verdict */}
          {isCompleted && data.analysis && (
            <div className="bg-gray-950/40 border border-red-500/10 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-red-600"></div>
              <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs font-mono mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                AI DIAGNOSTIC VERDICT
              </h3>
              <p className="text-gray-300 font-mono text-xs leading-relaxed">
                {data.analysis.summary}
              </p>
              
              {data.analysis.suggested_fix && (
                <div className="mt-4 p-4 bg-black/60 border border-gray-900 rounded-lg text-green-400 font-mono text-[11px] leading-relaxed">
                  <strong className="text-white text-xs block mb-1">💡 CRITICAL MITIGATION:</strong>
                  {data.analysis.suggested_fix}
                </div>
              )}
            </div>
          )}

          {/* Scrolling Terminal Live logs */}
          <div className="bg-black border border-gray-900 rounded-xl overflow-hidden font-mono shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
            <div className="bg-gray-950 px-4 py-2 border-b border-gray-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-gray-500 text-[10px] ml-3 tracking-widest uppercase">TELEMETRY MONITOR</span>
              </div>
              <span className="text-[9px] text-gray-600 animate-pulse">SOCKET STREAMING...</span>
            </div>
            <div className="p-4 max-h-72 overflow-y-auto text-[11px] space-y-1.5 scrollbar-thin">
              {logs.map((log: string, idx: number) => {
                let colorClass = "text-gray-400";
                if (log.includes("[ERROR]") || log.includes("[PLAYWRIGHT_ERROR]")) {
                  colorClass = "text-red-500 font-semibold";
                } else if (log.includes("[WARN]")) {
                  colorClass = "text-yellow-500";
                } else if (log.includes("[AGENT]")) {
                  colorClass = "text-cyan-400";
                } else if (log.includes("[CRAWLER]")) {
                  colorClass = "text-green-400";
                }
                return (
                  <div key={idx} className={colorClass}>
                    <span className="text-gray-700 mr-2">›</span>
                    {log}
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Audit findings layout cards */}
          {isCompleted && findings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs font-mono">DETAILED ISSUES</h3>
              <div className="space-y-3">
                {findings.map((item: any, idx: number) => {
                  const severityColors = 
                    item.severity === "High" 
                      ? "from-red-950/20 to-transparent border-red-900/30 text-red-400"
                      : (item.severity === "Medium"
                          ? "from-yellow-950/20 to-transparent border-yellow-950/30 text-yellow-400"
                          : "from-green-950/20 to-transparent border-green-950/30 text-green-400");
                  
                  const severityBadge = 
                    item.severity === "High" 
                      ? "bg-red-500 text-white" 
                      : (item.severity === "Medium" ? "bg-yellow-500 text-black" : "bg-green-500 text-white");

                  return (
                    <div key={idx} className={`bg-gradient-to-r border rounded-xl p-5 font-mono text-xs space-y-3 ${severityColors}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-gray-500">[{item.category}]</span>
                          <p className="text-gray-200 text-xs font-bold leading-normal">{item.issue}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${severityBadge}`}>
                          {item.severity}
                        </span>
                      </div>
                      
                      {item.suggested_fix && (
                        <div className="bg-black/40 border border-gray-900/50 rounded p-3 text-[10px] text-gray-400 leading-normal">
                          <span className="text-white block font-bold mb-1">🛠️ SUGGESTED RESOLUTION:</span>
                          {item.suggested_fix}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Visual Gallery & State Inspections) */}
        <div className="space-y-6">
          
          {/* Visual Route exploration gallery */}
          {gallery.length > 0 && (
            <div className="bg-gray-950/40 border border-gray-900 rounded-xl p-5 backdrop-blur-sm space-y-4">
              <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs font-mono">EXPLORATION PATH</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {gallery.map((img: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedImg(`http://localhost:8000${img.path}`)}
                    className="border border-gray-900 rounded-lg overflow-hidden group cursor-pointer hover:border-red-600/30 transition duration-300 relative"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`http://localhost:8000${img.path}`} 
                      alt={`Route: ${img.route}`} 
                      className="w-full h-28 object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <span className="text-white text-[10px] tracking-widest uppercase font-mono border border-white/30 px-2 py-1 rounded">ZOOM CAPTURE</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full bg-gray-950/90 border-t border-gray-900 px-3 py-1.5 flex justify-between items-center">
                      <span className="text-[10px] text-gray-300 font-mono truncate max-w-[70%]">{img.route}</span>
                      <span className="text-[8px] text-gray-500 font-mono">Route {idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 5. VISUAL LIGHTBOX MODAL */}
      {selectedImg && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden p-1 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedImg} 
              alt="Visual Lightbox" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-4 right-4 bg-black/75 hover:bg-black border border-gray-800 hover:border-gray-500 text-white rounded-full p-2 transition font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
