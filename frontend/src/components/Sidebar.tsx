export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-950 border-r border-gray-800 flex flex-col p-6">
      <div className="flex items-center space-x-2 mb-10">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          D
        </div>
        <h1 className="text-xl font-black tracking-widest text-white">DRACULA</h1>
      </div>
      
      <nav className="space-y-4">
        <a href="/dashboard" className="flex items-center space-x-3 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span className="font-semibold text-sm tracking-wider">ACTIVE SCAN</span>
        </a>
        <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span className="font-semibold text-sm tracking-wider">HISTORY</span>
        </a>
      </nav>

      <div className="mt-auto">
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">System Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-green-400 font-mono">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
