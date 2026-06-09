"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const ACCOUNT_PHOTOS: Record<string, string> = {
  "narendra.modi@gmail.com":  "https://i1-e.pinimg.com/736x/94/91/b5/9491b525931aa28f9a2d4322f23987dc.jpg",
  "giorgia.meloni@gmail.com": "https://i1-e.pinimg.com/1200x/a5/fd/f9/a5fdf9b61fedfcc07fa16f8aecc240ee.jpg",
};

const NAV = [
  { icon: "⊞", label: "Dashboard",    href: "/dashboard"    },
  { icon: "⊕", label: "New Scan",     href: "/new-scan"     },
  { icon: "≡", label: "Reports",      href: "/reports"      },
  { icon: "⛨", label: "Security",     href: "/security"     },
  { icon: "⬡", label: "Integrations", href: "/integrations" },
  { icon: "👥", label: "Team Members", href: "/team"         },
  { icon: "⚙", label: "Settings",     href: "/settings"     },
];

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: { label: string; color: "green" | "blue" | "yellow" | "red" };
  actions?: React.ReactNode;
}

const badgeColors = {
  green:  { bg: "bg-[#dcfce7]",  text: "text-[#16a34a]" },
  blue:   { bg: "bg-[#dbeafe]",  text: "text-[#2563eb]" },
  yellow: { bg: "bg-[#fef9c3]",  text: "text-[#ca8a04]" },
  red:    { bg: "bg-[#fee2e2]",  text: "text-[#dc2626]" },
};

function useSessionTimer() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function useUser() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("dracula_user") || "null");
      if (u?.name) setUser(u);
    } catch {}
  }, []);
  return user;
}

export default function AppShell({ children, title, subtitle, badge, actions }: AppShellProps) {
  const path    = usePathname();
  const router  = useRouter();
  const timer   = useSessionTimer();
  const user    = useUser();
  const [acctOpen,  setAcctOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen,  setNotiOpen]  = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDark, setIsDark]       = useState(false);
  const acctRef = useRef<HTMLDivElement>(null);

  const photo    = user ? ACCOUNT_PHOTOS[user.email] : null;
  const initials = user ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "";
  const Avatar = ({ size, textSize }: { size: string; textSize: string }) => (
    <div className={`${size} rounded-full flex-shrink-0 overflow-hidden`}>
      {photo
        ? <img src={photo} alt={user!.name} className="w-full h-full object-cover" />
        : <div className={`w-full h-full bg-[#2563eb] flex items-center justify-center ${textSize} font-bold text-white`}>{initials}</div>
      }
    </div>
  );

  // Theme toggle persisted
  useEffect(() => {
    const saved = localStorage.getItem("dracula_theme") === "dark";
    setIsDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("dracula_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (acctRef.current && !acctRef.current.contains(e.target as Node)) setAcctOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function signOut() {
    localStorage.removeItem("dracula_user");
    router.push("/");
  }

  return (
    <div className="flex h-screen bg-[#f0ece6] overflow-hidden font-inter">

      {/* ── SIDEBAR ── */}
      <aside className="w-[220px] flex-shrink-0 bg-[#0d0d0d] flex flex-col border-r border-white/5">
        <div className="px-5 py-5 border-b border-white/6">
          <Logo size={30} dark />
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(n => {
            const active = path === n.href;
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] font-medium transition-all ${
                  active
                    ? "bg-[#2563eb] text-white"
                    : "text-[#f5f0eb]/45 hover:text-[#f5f0eb] hover:bg-white/6"
                }`}
              >
                <span className="text-[15px] leading-none w-5 text-center">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* User card + account dropdown trigger */}
        <div className="px-4 py-4 border-t border-white/6 relative" ref={acctRef}>
          <button
            id="acct-avatar-btn"
            onClick={() => setAcctOpen(o => !o)}
            className="w-full flex items-center gap-3 hover:bg-white/5 rounded-[10px] px-1 py-1.5 transition-colors"
          >
            <Avatar size="w-8 h-8 ring-2 ring-[#2563eb]/30" textSize="text-[11px]" />
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[12px] font-semibold text-[#f5f0eb] truncate">{user?.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="dot dot-green" style={{ width: 5, height: 5 }} />
                <span className="text-[10px] text-[#16a34a]">Active</span>
              </div>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`text-[#f5f0eb]/25 transition-transform flex-shrink-0 ${acctOpen ? "rotate-180" : ""}`}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {/* Account Dropdown */}
          <AnimatePresence>
            {acctOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[72px] left-3 right-3 bg-[#161616] border border-white/10 rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50"
              >
                <div className="h-px bg-gradient-to-r from-transparent via-[#2563eb]/40 to-transparent" />

                {/* User info */}
                <div className="px-4 py-4 border-b border-white/6">
                  <div className="flex items-center gap-3">
                    <Avatar size="w-10 h-10" textSize="text-[13px]" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#f5f0eb] truncate">{user?.name}</div>
                      <div className="text-[10px] text-[#f5f0eb]/35 truncate">{user?.email}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="dot dot-green" style={{width:5,height:5}} />
                        <span className="text-[9px] font-bold tracking-widest uppercase text-[#16a34a]">Session Active</span>
                      </div>
                    </div>
                  </div>
                  {/* Session timer */}
                  <div className="flex items-center gap-2 mt-3 px-2 py-2 bg-white/4 rounded-[8px]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#2563eb] flex-shrink-0">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <span className="font-mono text-[15px] font-bold text-[#f5f0eb] tracking-wider">{timer}</span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  {[
                    { icon: "👤", label: "My Profile",    action: () => { setAcctOpen(false); setProfileOpen(true); } },
                    { icon: "🔔", label: "Notifications", action: () => { setAcctOpen(false); setNotiOpen(true); } },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[12px] text-[#f5f0eb]/60 hover:text-[#f5f0eb] hover:bg-white/6 transition-all text-left">
                      <span className="text-[14px] w-4 text-center leading-none">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <div className="h-px bg-white/6 my-1" />

                  {/* Theme toggle */}
                  <button onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[12px] text-[#f5f0eb]/60 hover:text-[#f5f0eb] hover:bg-white/6 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] w-4 text-center leading-none">{isDark ? "☀️" : "🌙"}</span>
                      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${isDark ? "bg-[#2563eb]" : "bg-white/10"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isDark ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                  </button>

                  <div className="h-px bg-white/6 my-1" />

                  <button onClick={signOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[12px] text-[#dc2626] hover:bg-[#dc2626]/10 transition-all text-left">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-7 py-4 bg-[#f0ece6] border-b border-black/6 flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-bebas text-[22px] tracking-[0.06em] text-[#0d0d0d]">{title}</h1>
              {badge && (
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${badgeColors[badge.color].bg} ${badgeColors[badge.color].text}`}>
                  {badge.label}
                </span>
              )}
            </div>
            {subtitle && <p className="text-[11px] text-[#0d0d0d]/40 font-medium mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {actions}
            {/* Notifications bell */}
            <button id="notifications-btn" onClick={() => setNotiOpen(true)}
              className="relative w-8 h-8 flex items-center justify-center rounded-[10px] bg-white border border-black/8 hover:bg-[#f5f0eb] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-[#0d0d0d]/50">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#dc2626] rounded-full" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-white border border-black/8 text-[11px] text-[#0d0d0d]/50 font-medium">
              <span className="dot dot-green" style={{ width: 5, height: 5 }} />
              All Systems Operational
            </div>
            <Link href="/home" className="text-[12px] font-semibold text-[#0d0d0d]/40 hover:text-[#0d0d0d] px-3 py-2 transition-colors">
              ← Home
            </Link>
          </div>
        </header>

        {/* Page body */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* ══════════════════════════════
          PROFILE MODAL
      ══════════════════════════════ */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setProfileOpen(false)} />
            <motion.div
              initial={{ opacity:0, scale:0.92, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }}
              transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
              className="relative z-10 bg-[#0d0d0d] border border-white/10 rounded-[24px] w-[min(520px,92vw)] max-h-[88vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-[#2563eb]/50 to-transparent" />
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden">
                    {ACCOUNT_PHOTOS[user.email] ? (
                      <img src={ACCOUNT_PHOTOS[user.email]} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#2563eb] flex items-center justify-center text-[22px] font-bold text-white">{initials}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-bebas text-[22px] tracking-[0.04em] text-[#f5f0eb]">{user.name}</div>
                    <div className="text-[12px] text-[#f5f0eb]/35 mt-0.5">{user.email}</div>
                    <div className="inline-flex items-center gap-1.5 mt-2 bg-[#16a34a]/10 border border-[#16a34a]/25 rounded-full px-3 py-1">
                      <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full" />
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#16a34a]">Active Agent</span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Full Name",     value: user.name },
                    { label: "Role",          value: "Security Agent" },
                    { label: "Member Since",  value: "May 2025" },
                    { label: "Plan",          value: "Pro ✦", accent: true },
                    { label: "Total Scans",   value: "0" },
                    { label: "2FA Status",    value: "Enabled ✓", green: true },
                  ].map(info => (
                    <div key={info.label} className="bg-white/4 border border-white/6 rounded-[12px] px-4 py-3">
                      <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#2563eb] mb-1.5">{info.label}</div>
                      <div className={`text-[13px] font-semibold ${info.green ? "text-[#16a34a]" : info.accent ? "text-[#f5c518]" : "text-[#f5f0eb]"}`}>
                        {info.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div className="bg-white/4 border border-white/6 rounded-[12px] px-4 py-3 mb-6">
                  <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#2563eb] mb-2">Bio</div>
                  <div className="text-[12px] text-[#f5f0eb]/45 leading-relaxed">
                    Autonomous security testing specialist. Focused on web vulnerability detection, CI/CD pipeline hardening, and AI-assisted QA workflows.
                  </div>
                </div>

                <button onClick={() => setProfileOpen(false)}
                  className="w-full py-3.5 bg-[#2563eb] text-white rounded-[12px] font-bold text-[12px] tracking-widest uppercase hover:bg-[#2563eb]/90 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════
          NOTIFICATIONS MODAL
      ══════════════════════════════ */}
      <AnimatePresence>
        {notiOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setNotiOpen(false)} />
            <motion.div
              initial={{ opacity:0, scale:0.92, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }}
              transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
              className="relative z-10 bg-[#0d0d0d] border border-white/10 rounded-[24px] w-[min(480px,92vw)] max-h-[80vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-[#dc2626]/50 to-transparent" />
              <div className="px-6 py-5 border-b border-white/6 flex items-center justify-between">
                <div>
                  <div className="font-bebas text-[18px] tracking-[0.06em] text-[#f5f0eb]">Notifications</div>
                  <div className="text-[10px] text-[#f5f0eb]/30 mt-0.5">3 unread alerts</div>
                </div>
                <button onClick={() => setNotiOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-white/6 text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {[
                  { icon:"⚠️", title:"High Severity CVE Detected", sub:"example.com scan — 3 min ago", color:"#dc2626", unread:true },
                  { icon:"✅", title:"Scan Complete — Score 87/100", sub:"github.com/user/repo — 15 min ago", color:"#16a34a", unread:true },
                  { icon:"🔔", title:"Weekly Security Report Ready", sub:"Download your full report — 2 hrs ago", color:"#2563eb", unread:true },
                  { icon:"ℹ️", title:"New Integration Available", sub:"GitHub Actions connector — 1 day ago", color:"#9ca3af", unread:false },
                ].map((n, i) => (
                  <div key={i} className={`flex gap-3 p-3.5 rounded-[14px] cursor-pointer transition-colors ${n.unread ? "bg-white/6 border border-white/8" : "hover:bg-white/4"}`}>
                    <span className="text-[18px] flex-shrink-0 mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12px] font-semibold ${n.unread ? "text-[#f5f0eb]" : "text-[#f5f0eb]/50"}`}>{n.title}</div>
                      <div className="text-[10px] text-[#f5f0eb]/30 mt-0.5">{n.sub}</div>
                    </div>
                    {n.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{background:n.color}} />}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════
          ACCOUNT SETTINGS MODAL
      ══════════════════════════════ */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSettingsOpen(false)} />
            <motion.div
              initial={{ opacity:0, scale:0.92, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }}
              transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
              className="relative z-10 bg-[#0d0d0d] border border-white/10 rounded-[24px] w-[min(560px,92vw)] max-h-[88vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-[#7c3aed]/50 to-transparent" />
              <div className="px-6 py-5 border-b border-white/6 flex items-center justify-between">
                <div className="font-bebas text-[18px] tracking-[0.06em] text-[#f5f0eb] flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round"/></svg>
                  Account Settings
                </div>
                <button onClick={() => setSettingsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-white/6 text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="p-5 flex flex-col gap-1">
                {[
                  { section: "Profile", items: [
                    { label: "Display Name", sub: "Your public name across the platform" },
                    { label: "Profile Photo", sub: "Upload or change your avatar" },
                  ]},
                  { section: "Security", items: [
                    { label: "Change Password", sub: "Last changed: Never" },
                    { label: "Two-Factor Authentication", sub: "Adds an extra layer of security", badge: "ON", badgeGreen: true },
                    { label: "Active Sessions", sub: "Manage devices logged in to your account" },
                  ]},
                  { section: "Preferences", items: [
                    { label: "Email Notifications", sub: "Receive scan reports via email", badge: "ON", badgeGreen: true },
                    { label: "Default Scan Depth", sub: "Currently set to: 1 page" },
                  ]},
                ].map(group => (
                  <div key={group.section}>
                    <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7c3aed] px-1 pt-4 pb-2">{group.section}</div>
                    <div className="bg-white/4 border border-white/6 rounded-[14px] overflow-hidden">
                      {group.items.map((item, idx) => (
                        <div key={item.label}
                          className={`flex items-center justify-between px-4 py-3.5 hover:bg-white/4 transition-colors cursor-pointer ${idx < group.items.length - 1 ? "border-b border-white/6" : ""}`}>
                          <div>
                            <div className="text-[12px] font-semibold text-[#f5f0eb]">{item.label}</div>
                            <div className="text-[10px] text-[#f5f0eb]/30 mt-0.5">{item.sub}</div>
                          </div>
                          {(item as any).badge ? (
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${(item as any).badgeGreen ? "text-[#16a34a] bg-[#16a34a]/10 border-[#16a34a]/25" : "text-[#ca8a04] bg-[#ca8a04]/10 border-[#ca8a04]/25"}`}>
                              {(item as any).badge}
                            </span>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#f5f0eb]/20"><path d="M9 18l6-6-6-6"/></svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Danger zone */}
                <div>
                  <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#dc2626] px-1 pt-4 pb-2">Danger Zone</div>
                  <div className="bg-[#dc2626]/5 border border-[#dc2626]/15 rounded-[14px] px-4 py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-[12px] font-semibold text-[#f5f0eb]">Delete Account</div>
                      <div className="text-[10px] text-[#f5f0eb]/30 mt-0.5">Permanently remove your account and all data</div>
                    </div>
                    <button className="text-[11px] font-bold text-[#dc2626] border border-[#dc2626]/30 px-3 py-1.5 rounded-[8px] hover:bg-[#dc2626]/10 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
