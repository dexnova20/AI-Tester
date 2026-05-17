"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import UrlInput from "@/components/UrlInput";
import RepoInput from "@/components/RepoInput";
import ScanDashboard from "@/components/ScanDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { testWebsite, analyzeRepo, getScanResult } from "@/services/api";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"website" | "repo">("website");
  const [scanId, setScanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanData, setScanData] = useState<any>(null);

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
        } catch (error) {
          console.error("Polling error", error);
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
      const res = await testWebsite(url);
      setScanId(res.scan_id);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleRepoTest = async (url: string) => {
    try {
      setIsLoading(true);
      setScanData(null);
      const res = await analyzeRepo(url);
      setScanId(res.scan_id);
    } catch (e) {
      console.error(e);
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
          ) : isLoading && (!scanData || scanData.status === "running" || scanData.status === "queued") ? (
            <div className="mt-32">
              <LoadingSpinner />
              {scanData && (
                <div className="mt-8 text-center text-gray-500 font-mono max-w-md mx-auto p-4 bg-gray-900/30 rounded border border-gray-800">
                  <span className="text-red-500/70 mr-2">LOG ›</span> 
                  {scanData.status === "queued" ? "Waiting for resources..." : "Agent deployed. Gathering telemetry..."}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <button 
                onClick={() => { setScanData(null); setScanId(null); setIsLoading(false); }}
                className="mb-8 text-sm font-bold tracking-widest text-gray-500 hover:text-white flex items-center transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                NEW SCAN
              </button>
              <ScanDashboard data={scanData} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
