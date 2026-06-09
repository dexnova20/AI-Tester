"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [showCustomEmail, setShowCustomEmail] = useState(false);
  const [signingInAs, setSigningInAs] = useState("");

  const ACCOUNTS = [
    { name: "Narendra Modi",   email: "narendra.modi@gmail.com",   img: "https://i1-e.pinimg.com/736x/94/91/b5/9491b525931aa28f9a2d4322f23987dc.jpg" },
    { name: "Giorgia Meloni",  email: "giorgia.meloni@gmail.com",  img: "https://i1-e.pinimg.com/1200x/a5/fd/f9/a5fdf9b61fedfcc07fa16f8aecc240ee.jpg" },
  ];

  function handleLogin() {
    const eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const pOk = pass.length >= 6;
    setEmailErr(!eOk);
    setPassErr(!pOk);
    if (!eOk || !pOk) return;
    setLoading(true);
    const name = email.split("@")[0];
    setTimeout(() => {
      localStorage.setItem("dracula_user", JSON.stringify({ name, email }));
      router.push("/home");
    }, 1000);
  }

  function selectGoogle(name: string, em: string) {
    setShowCustomEmail(false);
    setSigningInAs(em);
    setGoogleLoading(true);
    setTimeout(() => {
      localStorage.setItem("dracula_user", JSON.stringify({ name, email: em }));
      router.push("/home");
    }, 1800);
  }

  function submitCustomGoogle() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customEmail)) return;
    const name = customEmail.split("@")[0];
    selectGoogle(name, customEmail);
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* Noise */}
      <div className="noise" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[820px] bg-[#0d0d0d] rounded-[28px] overflow-hidden flex shadow-[0_32px_80px_rgba(0,0,0,0.22)]"
      >
        {/* ── LEFT BRAND PANEL ── */}
        <div className="hidden md:flex flex-col items-center justify-center w-[270px] flex-shrink-0 bg-[#0a0a0a] border-r border-white/6 px-8 py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563eb]/40 to-transparent" />
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[200px] h-[180px] bg-[#2563eb]/6 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[160px] h-[140px] bg-[#7c3aed]/5 blur-[60px] rounded-full pointer-events-none" />

          <div className="mb-7">
            <Logo size={32} dark />
          </div>

          <div className="font-bebas text-[22px] tracking-[0.18em] text-[#f5f0eb] mb-1">DRACULA</div>
          <div className="text-[10px] text-[#f5f0eb]/35 tracking-[0.15em] uppercase font-medium mb-6">Secure Access Portal</div>

          <div className="w-[50px] h-px bg-gradient-to-r from-transparent via-[#2563eb]/40 to-transparent mb-6" />

          <div className="text-[9px] text-[#f5f0eb]/25 tracking-[0.15em] uppercase text-center mb-8">Authorized Personnel Only</div>

          <div className="flex flex-col gap-2.5 w-full">
            {[
              { icon: "🔒", text: "256-bit Encryption" },
              { icon: "🛡️", text: "Zero-Trust Architecture" },
              { icon: "🔑", text: "MFA Protected" },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] bg-white/4 border border-white/6 text-[11px] text-[#f5f0eb]/45">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="flex-1 px-8 md:px-10 py-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#2563eb] mb-2">Welcome back</div>
            <h1 className="font-bebas text-[32px] tracking-[0.04em] text-[#f5f0eb]">Sign In to Your Account</h1>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#f5f0eb]/40 mb-2">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="agent@domain.com"
                className="scan-input w-full"
                autoComplete="email"
              />
              {emailErr && <p className="text-[11px] text-[#dc2626] mt-1.5">Enter a valid email address.</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#f5f0eb]/40 mb-2">Password</label>
              <input
                id="login-pass"
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="scan-input w-full"
                autoComplete="current-password"
              />
              {passErr && <p className="text-[11px] text-[#dc2626] mt-1.5">Minimum 6 characters required.</p>}
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button onClick={() => alert("Reset link sent! (demo)")} className="text-[11px] text-[#2563eb] hover:text-[#2563eb]/70 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            id="login-btn"
            onClick={handleLogin}
            disabled={loading}
            className="btn-solid btn-blue w-full rounded-[14px] py-4 text-[13px] tracking-widest uppercase mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="12"/>
                </svg>
                Signing in…
              </span>
            ) : "Access System"}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] text-[#f5f0eb]/25 font-medium tracking-widest uppercase">or continue with</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <button
            id="google-login-btn"
            onClick={() => setShowGooglePicker(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-[14px] bg-white/6 border border-white/10 text-[13px] font-semibold text-[#f5f0eb] hover:bg-white/10 transition-all"
          >
            <svg viewBox="0 0 48 48" width="18" height="18">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.2 0 24 0 14.6 0 6.6 5.5 2.5 13.5l8 6.2C12.4 13.3 17.8 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
              <path fill="#FBBC05" d="M10.5 28.3A14.6 14.6 0 0 1 9.5 24c0-1.5.3-3 .7-4.3l-8-6.2A23.9 23.9 0 0 0 0 24c0 3.8.9 7.5 2.5 10.8l8-6.5z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.1 0-11.3-4.1-13.2-9.7l-8 6.2C6.6 42.6 14.6 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[12px] text-[#f5f0eb]/30 mt-6">
            No account?{" "}
            <Link href="/signup" className="text-[#2563eb] font-semibold hover:underline">Create one →</Link>
          </p>
        </div>
      </motion.div>

      {/* ── Google Picker Modal ── */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => { setShowGooglePicker(false); setShowCustomEmail(false); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 bg-[#0d0d0d] border border-white/10 rounded-[20px] w-[360px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-[#2563eb]/50 to-transparent" />

            {googleLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="12"/>
                </svg>
                <div className="text-[14px] text-[#f5f0eb]">Signing you in…</div>
                <div className="text-[11px] text-[#f5f0eb]/40">{signingInAs}</div>
              </div>
            ) : (
              <>
                <div className="px-7 pt-8 pb-4 text-center">
                  <svg viewBox="0 0 48 48" width="32" height="32" className="mx-auto mb-4">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.2 0 24 0 14.6 0 6.6 5.5 2.5 13.5l8 6.2C12.4 13.3 17.8 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
                    <path fill="#FBBC05" d="M10.5 28.3A14.6 14.6 0 0 1 9.5 24c0-1.5.3-3 .7-4.3l-8-6.2A23.9 23.9 0 0 0 0 24c0 3.8.9 7.5 2.5 10.8l8-6.5z"/>
                    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.1 0-11.3-4.1-13.2-9.7l-8 6.2C6.6 42.6 14.6 48 24 48z"/>
                  </svg>
                  <div className="text-[18px] font-semibold text-[#f5f0eb] mb-1">
                    <span style={{color:"#4285F4"}}>G</span><span style={{color:"#EA4335"}}>o</span><span style={{color:"#FBBC05"}}>o</span><span style={{color:"#4285F4"}}>g</span><span style={{color:"#34A853"}}>l</span><span style={{color:"#EA4335"}}>e</span>
                  </div>
                  <div className="text-[13px] text-[#f5f0eb]/40">Sign in to continue to DRACULA</div>
                </div>

                {!showCustomEmail ? (
                  <div className="px-3 pb-3">
                    {ACCOUNTS.map(a => (
                      <button
                        key={a.email}
                        onClick={() => selectGoogle(a.name, a.email)}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[12px] hover:bg-white/6 transition-colors text-left"
                      >
                        <img src={a.img} alt={a.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-[#f5f0eb] font-medium">{a.name}</div>
                          <div className="text-[11px] text-[#f5f0eb]/40">{a.email}</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#f5f0eb]/20"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    ))}
                    <button
                      onClick={() => setShowCustomEmail(true)}
                      className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[12px] hover:bg-white/6 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/6 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </div>
                      <div className="text-[13px] text-[#f5f0eb]/60 font-medium">Use another account</div>
                    </button>
                  </div>
                ) : (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-white/6 mb-5" />
                    <label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#f5f0eb]/35 mb-2">Email or phone</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && submitCustomGoogle()}
                      placeholder="Enter your Google email"
                      className="scan-input w-full mb-3"
                      autoFocus
                    />
                    <button onClick={submitCustomGoogle} className="btn-solid btn-blue w-full rounded-[12px] py-3.5 text-[12px] tracking-widest uppercase">
                      Next
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between px-5 py-4 border-t border-white/6">
                  <div className="flex gap-4">
                    {["Help", "Privacy", "Terms"].map(l => (
                      <a key={l} href="#" onClick={e => e.preventDefault()} className="text-[11px] text-[#2563eb] hover:underline">{l}</a>
                    ))}
                  </div>
                  <button onClick={() => { setShowGooglePicker(false); setShowCustomEmail(false); }} className="text-[11px] text-[#f5f0eb]/30 hover:text-[#f5f0eb]/60 border border-white/8 px-3 py-1.5 rounded-[8px] transition-colors">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
