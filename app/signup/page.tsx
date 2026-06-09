"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

function StrengthBar({ value }: { value: string }) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const colors = ["transparent", "#dc2626", "#ca8a04", "#2563eb", "#16a34a"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
      {value.length > 0 && (
        <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: colors[score] || "#9ca3af" }}>
          {labels[score]}
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fname: "", lname: "", dob: "", gender: "", email: "", countryCode: "+91", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  function handleSignup() {
    const errs: Record<string, string> = {};
    if (!form.fname.trim()) errs.fname = "First name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required.";
    if (form.password.length < 8) errs.password = "Minimum 8 characters.";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match.";
    if (!terms) errs.terms = "Accept the Terms of Service to continue.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const name = `${form.fname} ${form.lname}`.trim();
    setTimeout(() => {
      localStorage.setItem("dracula_user", JSON.stringify({ name, email: form.email }));
      router.push("/home");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="noise" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[960px] bg-[#0d0d0d] rounded-[28px] overflow-hidden flex shadow-[0_32px_80px_rgba(0,0,0,0.22)]"
      >
        {/* ── LEFT BRAND PANEL ── */}
        <div className="hidden lg:flex flex-col items-center justify-center w-[230px] flex-shrink-0 bg-[#0a0a0a] border-r border-white/6 px-7 py-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />
          <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[180px] h-[160px] bg-[#7c3aed]/6 blur-[60px] rounded-full pointer-events-none" />

          <div className="mb-6">
            <Logo size={28} dark />
          </div>
          <div className="font-bebas text-[18px] tracking-[0.18em] text-[#f5f0eb] mb-1">Create Account</div>
          <div className="text-[10px] text-[#f5f0eb]/30 tracking-[0.12em] uppercase font-medium mb-6">Join the DRACULA network</div>
          <div className="w-[40px] h-px bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent mb-6" />
          <div className="text-[9px] text-[#f5f0eb]/20 tracking-[0.13em] uppercase text-center leading-relaxed">
            Secure · Encrypted<br />Access Portal
          </div>

          <div className="mt-auto pt-10">
            <p className="text-[11px] text-[#f5f0eb]/30 text-center">
              Already registered?{" "}
              <Link href="/login" className="text-[#2563eb] hover:underline">← Sign in</Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="flex-1 px-8 md:px-10 py-10 overflow-y-auto max-h-[88vh]">
          <div className="mb-7">
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#7c3aed] mb-2">New Agent Registration</div>
            <h1 className="font-bebas text-[28px] tracking-[0.04em] text-[#f5f0eb]">Register Your Account</h1>
          </div>

          {/* Personal Info */}
          <div className="mb-6">
            <div className="section-label text-[#f5f0eb]/30 mb-4">Personal Info</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "fname", label: "First Name *", placeholder: "First", type: "text" },
                { key: "lname", label: "Last Name", placeholder: "Last", type: "text" },
                { key: "dob",   label: "Date of Birth", placeholder: "", type: "date" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb]/35 mb-1.5">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder} className="scan-input w-full text-[12px]" />
                  {errors[f.key] && <p className="text-[10px] text-[#dc2626] mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb]/35 mb-1.5">Gender</label>
                <select value={form.gender} onChange={e => set("gender", e.target.value)}
                  className="scan-input w-full text-[12px] cursor-pointer">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <div className="section-label text-[#f5f0eb]/30 mb-4">Contact Details</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb]/35 mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="agent@domain.com" className="scan-input w-full text-[12px]" autoComplete="email" />
                {errors.email && <p className="text-[10px] text-[#dc2626] mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb]/35 mb-1.5">Country Code</label>
                <select value={form.countryCode} onChange={e => set("countryCode", e.target.value)} className="scan-input w-full text-[12px] cursor-pointer">
                  {["🇮🇳 +91","🇺🇸 +1","🇬🇧 +44","🇦🇺 +61","🇦🇪 +971"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb]/35 mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="98765 43210" className="scan-input w-full text-[12px]" />
            </div>
          </div>

          {/* Security */}
          <div className="mb-7">
            <div className="section-label text-[#f5f0eb]/30 mb-4">Security</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb]/35 mb-1.5">Password *</label>
                <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                  placeholder="Min. 8 characters" className="scan-input w-full text-[12px]" autoComplete="new-password" />
                <StrengthBar value={form.password} />
                {errors.password && <p className="text-[10px] text-[#dc2626] mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-[#f5f0eb]/35 mb-1.5">Confirm Password *</label>
                <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)}
                  placeholder="Re-enter password" className="scan-input w-full text-[12px]" autoComplete="new-password" />
                {errors.confirm && <p className="text-[10px] text-[#dc2626] mt-1">{errors.confirm}</p>}
              </div>
            </div>
          </div>

          {/* Terms + Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="flex items-start gap-2.5 cursor-pointer flex-1">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                className="mt-0.5 accent-[#2563eb] w-4 h-4 flex-shrink-0 cursor-pointer" />
              <span className="text-[12px] text-[#f5f0eb]/40 leading-relaxed">
                I accept the{" "}
                <a href="#" onClick={e => e.preventDefault()} className="text-[#2563eb] hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" onClick={e => e.preventDefault()} className="text-[#2563eb] hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="text-[10px] text-[#dc2626]">{errors.terms}</p>}
            <button
              id="signup-btn"
              onClick={handleSignup}
              disabled={loading}
              className="btn-solid btn-blue rounded-[14px] py-3.5 px-8 text-[12px] tracking-widest uppercase flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="12"/>
                  </svg>
                  Creating…
                </span>
              ) : "Register Agent"}
            </button>
          </div>

          <p className="text-[11px] text-[#f5f0eb]/25 text-center mt-6 lg:hidden">
            Already registered? <Link href="/login" className="text-[#2563eb] hover:underline">← Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
