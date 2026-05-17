import { useState } from "react";

interface RepoInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
        <div className="px-4 py-3 bg-gray-800 text-gray-400 flex items-center border-r border-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
        </div>
        <input
          type="url"
          required
          placeholder="https://github.com/user/repo"
          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 outline-none font-mono"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !url}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]"
      >
        {isLoading ? "INITIALIZING ANALYSIS..." : "LAUNCH REPO ANALYSIS"}
      </button>
    </form>
  );
}
