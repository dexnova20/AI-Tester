import StatusBadge from "./StatusBadge";

interface ScanDashboardProps {
  data: any;
}

export default function ScanDashboard({ data }: ScanDashboardProps) {
  if (!data) return null;

  const isWebsite = !!data.url;
  const isRepo = !!data.repo_url;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-widest text-white">SCAN REPORT</h2>
          <p className="text-gray-500 font-mono text-sm mt-1">{data.url || data.repo_url}</p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Details & AI Analysis) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <h3 className="text-red-500 font-bold uppercase tracking-widest mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              AI DIAGNOSIS
            </h3>
            <p className="text-gray-300 leading-relaxed font-mono">
              {data.analysis?.summary}
            </p>
            {data.analysis?.suggested_fix && (
              <div className="mt-4 p-4 bg-gray-950 border border-gray-800 rounded text-green-400 font-mono text-sm">
                <strong>SUGGESTED FIX:</strong> {data.analysis.suggested_fix}
              </div>
            )}
            
            {(data.analysis?.details || data.analysis?.key_issues) && (
              <div className="mt-6">
                <h4 className="text-gray-500 font-bold uppercase text-xs mb-2 tracking-wider">Key Findings</h4>
                <ul className="space-y-2">
                  {(data.analysis.details || data.analysis.key_issues).map((issue: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-gray-400 font-mono">
                      <span className="text-red-500 mr-2">›</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Logs Terminal (if repo) */}
          {isRepo && data.logs && (
            <div className="bg-black border border-gray-800 rounded-lg overflow-hidden font-mono">
              <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-500 text-xs ml-4 tracking-widest">TERMINAL / LOGS</span>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto text-sm">
                {data.logs.map((log: string, idx: number) => (
                  <div key={idx} className={`${log.includes("FAIL") || log.includes("WARN") || log.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                    <span className="text-gray-600 mr-2">[{new Date().toISOString().split('T')[1].substring(0,8)}]</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Visuals & Stats) */}
        <div className="space-y-6">
          {isWebsite && data.screenshot && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-3">Vision Capture</h3>
              <div className="rounded border border-gray-700 overflow-hidden relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`http://localhost:8000${data.screenshot}`} 
                  alt="Website Scan" 
                  className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition duration-300 mix-blend-overlay"></div>
              </div>
            </div>
          )}

          {isWebsite && data.analysis && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-black text-red-500">{data.analysis.bugs_found || 0}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Bugs</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-black text-yellow-500">{data.analysis.ui_issues || 0}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">UI Issues</div>
              </div>
            </div>
          )}
          
          {isRepo && data.project_type && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-xl font-black text-indigo-400">{data.project_type}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Detected Framework</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
