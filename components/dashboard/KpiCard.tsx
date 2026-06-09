"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  delta?: string;
  deltaUp?: boolean;
  color: string;
  icon: React.ReactNode;
  featured?: boolean;
}

function AnimCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const dur = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * ease));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function KpiCard({ label, value, suffix, delta, deltaUp, color, icon, featured }: KpiCardProps) {
  return (
    <div
      className={`card-hover relative rounded-[24px] p-5 border overflow-hidden flex flex-col gap-3 ${
        featured
          ? "border-white/10 bg-gradient-to-br from-[#111827] to-[#0f1115]"
          : "glass border-white/6"
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, color }}
      >
        {icon}
      </div>

      {/* Value */}
      <div>
        <div
          className="font-['Bebas_Neue'] text-[38px] leading-none tracking-wide"
          style={{ color }}
        >
          <AnimCounter to={value} suffix={suffix} />
        </div>
        <div className="text-[11px] text-[#9ca3af] tracking-widest uppercase font-semibold mt-1">
          {label}
        </div>
      </div>

      {/* Delta */}
      {delta && (
        <div className={`flex items-center gap-1.5 text-[11px] font-medium ${deltaUp ? "text-[#10b981]" : "text-[#ef4444]"}`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            {deltaUp
              ? <path d="M12 4l8 8H4l8-8z" />
              : <path d="M12 20l-8-8h16l-8 8z" />}
          </svg>
          {delta}
        </div>
      )}

      {/* Corner decoration */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-5 pointer-events-none"
        style={{ background: color, filter: "blur(20px)", transform: "translate(30%, 30%)" }}
      />
    </div>
  );
}
