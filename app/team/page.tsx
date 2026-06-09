"use client";
import AppShell from "@/components/AppShell";
import AuthGuard from "@/components/AuthGuard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const COLORS = ["#2563eb","#7c3aed","#dc2626","#16a34a","#f5c518","#06b6d4"];

type Member = { name: string; role: string; email: string; scans: number; status: string; initials: string; color: string };

const INITIAL_TEAM: Member[] = [
  { name: "Narendra Modi",  role: "Owner", email: "narendra.modi@gmail.com",  scans: 42, status: "active", initials: "NM", color: "#2563eb" },
  { name: "Giorgia Meloni", role: "Admin", email: "giorgia.meloni@gmail.com", scans: 18, status: "active", initials: "GM", color: "#7c3aed" },
];
const ROLES = ["Owner","Admin","Analyst","Viewer"];

export default function TeamPage() {
  const [team, setTeam] = useState<Member[]>(INITIAL_TEAM);
  const [showModal, setShowModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Analyst");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function handleInvite() {
    const errs: { name?: string; email?: string } = {};
    if (!inviteName.trim()) errs.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) errs.email = "Valid email required.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const initials = inviteName.trim().split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const color = COLORS[team.length % COLORS.length];
    setTeam(t => [...t, { name: inviteName.trim(), role: inviteRole, email: inviteEmail.trim(), scans: 0, status: "active", initials, color }]);
    setInviteName(""); setInviteEmail(""); setInviteRole("Analyst"); setErrors({});
    setShowModal(false);
  }

  function removeMemeber(email: string) {
    setTeam(t => t.filter(m => m.email !== email));
  }

  return (
    <AuthGuard>
    <AppShell title="Team Members" subtitle="Manage your team's access and permissions">
      <div className="p-6 space-y-5">
        <div className="flex justify-end">
          <button onClick={() => setShowModal(true)} className="btn-solid btn-dark rounded-[14px] py-3 px-6 text-[12px] tracking-widest uppercase flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Invite Member
          </button>
        </div>

        <div className="bg-white rounded-[28px] border border-black/6 overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="font-bebas text-[16px] tracking-[0.08em] text-[#0d0d0d]">All Members</h2>
            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#e8e2da] text-[#0d0d0d]/50">{team.length} Members</span>
          </div>
          <div className="divide-y divide-black/4">
            {team.map((member, i) => (
              <motion.div key={member.email} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#fafaf8] transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                  style={{background:member.color}}>
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#0d0d0d]">{member.name}</div>
                  <div className="text-[10px] text-[#0d0d0d]/35">{member.email}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`dot ${member.status === "active" ? "dot-green" : member.status === "idle" ? "dot-yellow" : "dot-grey"}`} style={{width:5,height:5}} />
                  <span className="text-[10px] font-medium capitalize text-[#0d0d0d]/40">{member.status}</span>
                </div>
                <div className="text-center">
                  <div className="font-bebas text-[18px] leading-none text-[#0d0d0d]">{member.scans}</div>
                  <div className="text-[9px] text-[#0d0d0d]/30 tracking-widest uppercase">Scans</div>
                </div>
                <select defaultValue={member.role}
                  className="text-[11px] font-semibold bg-[#f5f0eb] border border-black/8 rounded-[8px] px-2 py-1.5 text-[#0d0d0d] outline-none cursor-pointer">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
                {member.role !== "Owner" && (
                  <button onClick={() => removeMemeber(member.email)} className="text-[10px] font-bold text-[#dc2626] border border-[#dc2626]/20 px-2.5 py-1.5 rounded-[8px] hover:bg-[#dc2626]/6 transition-colors">
                    Remove
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Invite Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{opacity:0, scale:0.93, y:16}}
              animate={{opacity:1, scale:1, y:0}}
              exit={{opacity:0, scale:0.93, y:16}}
              transition={{duration:0.3, ease:[0.16,1,0.3,1]}}
              className="relative z-10 bg-[#0d0d0d] border border-white/10 rounded-[24px] w-[min(460px,92vw)] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-[#2563eb]/50 to-transparent" />
              <div className="p-7">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="font-bebas text-[20px] tracking-[0.06em] text-[#f5f0eb]">Invite Team Member</div>
                    <div className="text-[11px] text-[#f5f0eb]/35 mt-0.5">They'll be added to your team instantly.</div>
                  </div>
                  <button onClick={() => setShowModal(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-white/6 text-[#f5f0eb]/40 hover:text-[#f5f0eb] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#f5f0eb]/40 mb-2">Full Name</label>
                    <input value={inviteName} onChange={e => setInviteName(e.target.value)}
                      placeholder="Jane Smith"
                      className="scan-input w-full" />
                    {errors.name && <p className="text-[11px] text-[#dc2626] mt-1.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#f5f0eb]/40 mb-2">Email Address</label>
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleInvite()}
                      placeholder="jane@company.com"
                      className="scan-input w-full" />
                    {errors.email && <p className="text-[11px] text-[#dc2626] mt-1.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#f5f0eb]/40 mb-2">Role</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      className="scan-input w-full cursor-pointer">
                      {["Admin","Analyst","Viewer"].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-[12px] text-[12px] font-bold tracking-widest uppercase bg-white/6 text-[#f5f0eb]/60 hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleInvite}
                    className="flex-1 py-3 rounded-[12px] text-[12px] font-bold tracking-widest uppercase bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors">
                    Send Invite
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
    </AuthGuard>
  );
}
