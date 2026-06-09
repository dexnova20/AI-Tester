"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const STATS = [
  { value: 2400,  suffix: "+", label: "Teams Protected",      color: "#3b82f6" },
  { value: 98,    suffix: "%", label: "Threat Detection Rate", color: "#8b5cf6" },
  { value: 1.2,   suffix: "s", label: "Avg Scan Time",         color: "#06b6d4", decimal: true },
  { value: 50000, suffix: "+", label: "Vulns Detected",        color: "#ef4444" },
];

function Counter({ to, suffix, decimal, color }: { to: number; suffix: string; decimal?: boolean; color: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(parseFloat((to * ease).toFixed(decimal ? 1 : 0)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, decimal]);

  return (
    <span ref={ref} className="font-['Bebas_Neue'] text-[48px] leading-none tracking-wide" style={{ color }}>
      {decimal ? val.toFixed(1) : val.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass flex flex-col items-center justify-center py-10 px-6 text-center gap-2"
            >
              <Counter to={s.value} suffix={s.suffix} decimal={s.decimal} color={s.color} />
              <span className="text-[12px] text-[#9ca3af] tracking-widest uppercase font-medium">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
