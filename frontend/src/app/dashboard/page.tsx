"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import UrlInput from "@/components/UrlInput";
import RepoInput from "@/components/RepoInput";
import ScanDashboard from "@/components/ScanDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { testWebsite, analyzeRepo, getScanResult, checkBackendHealth } from "@/services/api";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"website" | "repo">("website");
  const [scanId, setScanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanData, setScanData] = useState<any>(null);

  // Health and error states
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const verifyHealth = async () => {
    setIsCheckingHealth(true);
    setErrorBanner(null);
    const online = await checkBackendHealth();
    setIsBackendOnline(online);
    setIsCheckingHealth(false);
  };

  // Run health check on initial mount
  useEffect(() => {
    verifyHealth();
  }, []);

  // Polling logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (scanId && isLoading) {
      intervalId = setInterval(async () => {
        try {
          const result = await getScanResult(scanId);
          setScanData(result);
          if (result.status === "completed" || result.status === "error") {
            setIsLoading(false);
            clearInterval(intervalId);
          }
        } catch (error: any) {
          console.error("Polling error", error);
          setErrorBanner(`Polling connection lost: ${error.message}`);
          setIsLoading(false);
          if (intervalId) clearInterval(intervalId);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [scanId, isLoading]);

  const handleWebsiteTest = async (url: string) => {
    try {
      setIsLoading(true);
      setScanData(null);
      setErrorBanner(null);
      const res = await testWebsite(url);
      setScanId(res.scan_id);
    } catch (e: any) {
      console.error(e);
      setErrorBanner(e.message || "Failed to initiate website scan");
      setIsLoading(false);
    }
  };

  const handleRepoTest = async (url: string) => {
    try {
      setIsLoading(true);
      setScanData(null);
      setErrorBanner(null);
      const res = await analyzeRepo(url);
      setScanId(res.scan_id);
    } catch (e: any) {
      console.error(e);
      setErrorBanner(e.message || "Failed to initiate repository analysis");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-200 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-10 relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {isCheckingHealth ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-t-2 border-red-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-red-900 rounded-full animate-spin direction-reverse"></div>
              </div>
              <p className="text-gray-500 font-mono tracking-widest text-sm uppercase animate-pulse">
                Establishing Secure Link...
              </p>
            </div>
          ) : isBackendOnline === false ? (
            <div className="max-w-xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gray-950/80 border border-red-500/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600"></div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-red-950/50 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500 font-black text-xl animate-pulse">
                    ⚠️
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-widest text-white">BACKEND OFFLINE</h2>
                    <p className="text-red-500/70 font-mono text-xs mt-0.5">SERVICE UNREACHABLE ON PORT 8000</p>
                  </div>
                </div>

                <div className="space-y-4 text-gray-400 font-mono text-sm leading-relaxed mb-8">
                  <p>
                    The frontend has booted successfully, but the Dracula API (at <code className="text-white bg-gray-900 px-1 py-0.5 rounded">http://localhost:8000</code>) is currently offline.
                  </p>
                  
                  <div className="bg-black/60 rounded-xl border border-gray-900 p-5 mt-4 space-y-3">
                    <p className="text-white text-xs font-bold uppercase tracking-wider text-red-500/95">⚡ How to Start Backend:</p>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-gray-500">
                      <li>Open a new powershell or command prompt terminal.</li>
                      <li>Run: <code className="text-green-400">cd backend</code></li>
                      <li>Activate virtual environment: <code className="text-green-400">.\venv\Scripts\Activate.ps1</code></li>
                      <li>Install requirements: <code className="text-green-400">pip install -r requirements.txt</code></li>
                      <li>Start backend server: <code className="text-green-400">uvicorn main:app --reload</code></li>
                    </ol>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={verifyHealth}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition font-mono tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  >
                    RETRY CONNECTION
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* TOP LEVEL ERROR WARNING BANNER */}
              {errorBanner && (
                <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-between text-red-400 font-mono text-sm animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">❌ ERROR:</span>
                    <span>{errorBanner}</span>
                  </div>
                  <button 
                    onClick={() => setErrorBanner(null)}
                    className="text-gray-500 hover:text-white transition font-bold text-xs uppercase tracking-widest ml-4"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {!scanData && !isLoading ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mt-12">
                  <h2 className="text-4xl font-black tracking-tighter text-white mb-2">NEW SCAN</h2>
                  <p className="text-gray-500 mb-10 font-mono">Initialize autonomous agent to analyze target.</p>
                  
                  <div className="flex space-x-4 mb-8">
                    <button 
                      onClick={() => setActiveTab("website")}
                      className={`px-6 py-2 rounded-full font-bold text-sm tracking-widest transition ${activeTab === 'website' ? 'bg-red-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                    >
                      WEBSITE
                    </button>
                    <button 
                      onClick={() => setActiveTab("repo")}
                      className={`px-6 py-2 rounded-full font-bold text-sm tracking-widest transition ${activeTab === 'repo' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                    >
                      GITHUB REPO
                    </button>
                  </div>

                  <div className="p-1 bg-gray-900/50 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                    {activeTab === "website" ? (
                      <UrlInput onSubmit={handleWebsiteTest} isLoading={isLoading} />
                    ) : (
                      <RepoInput onSubmit={handleRepoTest} isLoading={isLoading} />
                    )}
                  </div>
                </div>
              ) : isLoading && !scanData ? (
                <div className="mt-32">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="mt-4">
                  <button 
                    onClick={() => { setScanData(null); setScanId(null); setIsLoading(false); setErrorBanner(null); }}
                    className="mb-8 text-sm font-bold tracking-widest text-gray-500 hover:text-white flex items-center transition"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    NEW SCAN
                  </button>
                  <ScanDashboard data={scanData} />
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}

