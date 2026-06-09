"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useState } from "react";

const FAQS = [
  { q: "How do I run my first scan?", a: "Go to the Dashboard, enter any URL or GitHub repo in the scan console, and hit Execute Scan. Results appear in the terminal and findings panel in real time." },
  { q: "Is my data stored anywhere?", a: "All scans are processed in isolated sandboxes. Scan results are stored only in your session and are never shared with third parties." },
  { q: "Can I integrate DRACULA into my CI/CD pipeline?", a: "Yes. Use the GitHub Actions integration under Integrations to trigger scans automatically on every push or pull request." },
  { q: "What does the security score mean?", a: "The score (0–100) reflects the overall security posture of the scanned target. 75+ is Excellent, 45–74 is Moderate, below 45 is Critical." },
  { q: "How do I report a bug or request a feature?", a: "Open an issue on our GitHub repository or reach out via the community Discord. We respond within 24 hours." },
];

const up = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0eb]">
      <div className="noise" aria-hidden="true" />

      {/* Nav */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/6">
        <Logo size={28} dark />
        <Link href="/home" className="text-[12px] text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">← Back</Link>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-20">
        <motion.div {...up()} className="text-center mb-16">
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#dc2626] mb-4">Help</div>
          <h1 className="font-bebas text-[clamp(56px,8vw,100px)] leading-[0.9] tracking-[0.04em] mb-5">
            SUPPORT &<br />COMMUNITY.
          </h1>
          <p className="text-[16px] text-[#f5f0eb]/45 leading-relaxed">
            Find answers, get help, and connect with the DRACULA community.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { emoji: "💬", title: "Discord", desc: "Join 1,200+ security engineers in our community server.", color: "#7c3aed" },
            { emoji: "🐙", title: "GitHub", desc: "Report bugs, request features, and contribute to the project.", color: "#f5f0eb" },
            { emoji: "📧", title: "Email", desc: "Reach our support team at support@dracula.ai.", color: "#2563eb" },
          ].map((c, i) => (
            <motion.div key={c.title} {...up(i * 0.07)}
              className="bg-white/[0.03] border border-white/[0.07] rounded-[20px] p-6 text-center hover:bg-white/[0.06] transition-colors cursor-pointer">
              <div className="text-[32px] mb-3">{c.emoji}</div>
              <div className="font-bebas text-[20px] tracking-[0.06em] mb-2" style={{ color: c.color }}>{c.title}</div>
              <div className="text-[12px] text-[#f5f0eb]/40 leading-relaxed">{c.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div {...up(0.1)}>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#f5f0eb]/30 mb-6">Frequently Asked Questions</div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} {...up(i * 0.05)}
                className="bg-white/[0.03] border border-white/[0.07] rounded-[16px] overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="text-[13px] font-semibold text-[#f5f0eb]">{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className={`text-[#f5f0eb]/30 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-[13px] text-[#f5f0eb]/45 leading-relaxed border-t border-white/6 pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
