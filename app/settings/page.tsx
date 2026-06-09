"use client";
import AppShell from "@/components/AppShell";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SETTINGS = [
  {
    section: "Profile",
    items: [
      { label: "Display Name",   sub: "Your public name across the platform",   type: "input",  defaultVal: "__name__" },
      { label: "Email Address",  sub: "Your login email",                        type: "input",  defaultVal: "__email__" },
    ],
  },
  {
    section: "Security",
    items: [
      { label: "Change Password",             sub: "Last changed: Never",                   type: "button", btnLabel: "Update" },
      { label: "Two-Factor Authentication",   sub: "Adds an extra layer of security",       type: "toggle", defaultVal: true },
      { label: "Active Sessions",             sub: "Manage devices logged in to your account", type: "button", btnLabel: "Manage" },
    ],
  },
  {
    section: "Notifications",
    items: [
      { label: "Email Notifications",   sub: "Receive scan reports via email",      type: "toggle", defaultVal: true },
      { label: "Slack Alerts",          sub: "Send critical findings to Slack",     type: "toggle", defaultVal: false },
      { label: "Weekly Digest",         sub: "Summary report every Monday",         type: "toggle", defaultVal: true },
    ],
  },
  {
    section: "Scan Defaults",
    items: [
      { label: "Default Scan Depth",    sub: "How many pages to crawl per scan",    type: "select", options: ["1 page","2 pages","3 pages"], defaultVal: "1 page" },
      { label: "Auto-Scan on Deploy",   sub: "Trigger scan after GitHub push",      type: "toggle", defaultVal: false },
    ],
  },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Two-Factor Authentication": true,
    "Email Notifications": true,
    "Slack Alerts": false,
    "Weekly Digest": true,
    "Auto-Scan on Deploy": false,
  });
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("dracula_user") || "{}");
      if (u.name) setUser({ name: u.name, email: u.email || "" });
    } catch {}
  }, []);

  return (
    <AuthGuard>
    <AppShell title="Settings" subtitle="Manage your account & platform preferences">
      <div className="p-6 space-y-5 max-w-[720px]">
        {SETTINGS.map((group, gi) => (
          <motion.div key={group.section} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:gi*0.07}}>
            <div className="section-label text-[#0d0d0d]/40 mb-3">{group.section}</div>
            <div className="bg-white rounded-[20px] border border-black/6 overflow-hidden">
              {group.items.map((item, idx) => (
                <div key={item.label}
                  className={`flex items-center justify-between px-5 py-4 gap-4 ${idx < group.items.length - 1 ? "border-b border-black/4" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0d0d0d]">{item.label}</div>
                    <div className="text-[10px] text-[#0d0d0d]/40 mt-0.5">{item.sub}</div>
                  </div>
                  {item.type === "toggle" && (
                    <button onClick={() => setToggles(t => ({...t, [item.label]: !t[item.label]}))}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${toggles[item.label] ? "bg-[#2563eb]" : "bg-black/10"}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${toggles[item.label] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  )}
                  {item.type === "input" && (
                    <input
                      defaultValue={
                        (item as any).defaultVal === "__name__" ? user.name :
                        (item as any).defaultVal === "__email__" ? user.email :
                        (item as any).defaultVal
                      }
                      className="text-[12px] font-mono bg-[#f5f0eb] border border-black/8 rounded-[8px] px-3 py-2 text-[#0d0d0d] outline-none focus:border-[#2563eb] transition-colors w-[200px]" />
                  )}
                  {item.type === "select" && (
                    <select defaultValue={(item as any).defaultVal}
                      className="text-[12px] bg-[#f5f0eb] border border-black/8 rounded-[8px] px-3 py-2 text-[#0d0d0d] outline-none cursor-pointer">
                      {(item as any).options.map((o: string) => <option key={o}>{o}</option>)}
                    </select>
                  )}
                  {item.type === "button" && (
                    <button className="text-[11px] font-bold tracking-widest uppercase text-[#2563eb] border border-[#2563eb]/25 px-4 py-2 rounded-[8px] hover:bg-[#2563eb]/6 transition-colors flex-shrink-0">
                      {(item as any).btnLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Save */}
        <div className="flex justify-end">
          <button className="btn-solid btn-dark rounded-[14px] py-3.5 px-8 text-[12px] tracking-widest uppercase">
            Save Changes
          </button>
        </div>
      </div>
    </AppShell>
    </AuthGuard>
  );
}
