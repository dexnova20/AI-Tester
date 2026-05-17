import { useState } from "react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    onSubmit(normalized);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition">
        <div className="px-4 py-3 bg-gray-800 text-gray-400 flex items-center border-r border-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
        </div>
        <input
          type="text"
          required
          placeholder="https://example.com"
          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 outline-none font-mono"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !url}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]"
      >
        {isLoading ? "INITIALIZING SCAN..." : "LAUNCH WEBSITE SCAN"}
      </button>
    </form>
  );
}
