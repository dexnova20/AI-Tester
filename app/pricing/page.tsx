"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/Logo";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    color: "#f5f0eb",
    bg: "#161616",
    border: "border-white/10",
    features: ["5 scans / month", "Web URL scanner", "Basic security report", "Community support"],
    cta: "Get Started",
    ctaStyle: "bg-white/8 text-[#f5f0eb] hover:bg-white/14",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    color: "#2563eb",
    bg: "#0d1a3a",
    border: "border-[#2563eb]/40",
    badge: "Most Popular",
    features: ["Unlimited scans", "Web + GitHub analyzer", "AI remediation playbooks", "Slack & webhook alerts", "Priority support"],
    cta: "Start Free Trial",
    ctaStyle: "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[0_4px_24px_rgba(37,99,235,0.35)]",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    color: "#f5c518",
    bg: "#1a1500",
    border: "border-[#f5c518]/25",
    features: ["Everything in Pro", "SSO & SAML", "Custom integrations", "SLA guarantee", "Dedicated support"],
    cta: "Contact Sales",
    ctaStyle: "bg-[#f5c518] text-[#0d0d0d] hover:bg-[#e6b800]",
  },
];

const up = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0eb]">
      <div className="noise" aria-hidden="true" />

      {/* Nav */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/6">
        <Logo size={28} dark />
        <Link href="/home" className="text-[12px] text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">← Back</Link>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-20">
        <motion.div {...up()} className="text-center mb-16">
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#2563eb] mb-4">Pricing</div>
          <h1 className="font-bebas text-[clamp(56px,8vw,110px)] leading-[0.9] tracking-[0.04em] mb-5">
            SIMPLE,<br />TRANSPARENT.
          </h1>
          <p className="text-[16px] text-[#f5f0eb]/45 max-w-md mx-auto leading-relaxed">
            No hidden fees. Start free, scale when you need to.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} {...up(i * 0.08)}
              className={`relative rounded-[28px] p-8 border flex flex-col gap-6 ${plan.border}`}
              style={{ background: plan.bg }}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div>
                <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: plan.color }}>{plan.name}</div>
                <div className="flex items-end gap-1">
                  <span className="font-bebas text-[52px] leading-none" style={{ color: plan.color }}>{plan.price}</span>
                  {plan.period && <span className="text-[14px] text-[#f5f0eb]/35 mb-2">{plan.period}</span>}
                </div>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#f5f0eb]/60">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3.5 rounded-[14px] text-[12px] font-bold tracking-[0.12em] uppercase transition-all ${plan.ctaStyle}`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div {...up(0.2)} className="text-center text-[13px] text-[#f5f0eb]/30">
          All plans include a 14-day free trial. No credit card required.
        </motion.div>
      </div>
    </div>
  );
}
