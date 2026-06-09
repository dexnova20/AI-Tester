"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0eb] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#2563eb]/6 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10"
      >
        <h1 className="font-bebas text-[clamp(120px,20vw,220px)] leading-none tracking-[0.1em] text-[#2563eb] mb-2">
          404
        </h1>
        <h2 className="font-bebas text-[clamp(24px,4vw,40px)] tracking-[0.12em] text-[#f5f0eb] mb-3">
          PAGE NOT FOUND
        </h2>
        <p className="text-[14px] text-[#f5f0eb]/35 max-w-md mx-auto mb-10 leading-relaxed">
          The system could not locate the requested resource. It may have been moved, deleted, or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-[13px] font-bold tracking-[0.15em] uppercase px-8 py-4 rounded-[14px] hover:bg-[#1d4ed8] transition-colors shadow-[0_4px_24px_rgba(37,99,235,0.25)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Return to Base
        </Link>
      </motion.div>
    </div>
  );
}
