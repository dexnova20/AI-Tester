"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import Link from "next/link";

const LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-5 pt-5"
    >
      <nav
        className={`w-full max-w-5xl rounded-[20px] transition-all duration-500 ${
          scrolled
            ? "bg-[#0d0d0d] shadow-strong py-3 px-6"
            : "bg-cream/90 backdrop-blur-xl border border-black/8 shadow-soft py-3 px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          <Logo size={30} dark={scrolled} />

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`text-[13px] font-medium transition-opacity hover:opacity-60 ${
                  scrolled ? "text-cream" : "text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className={`text-[13px] font-medium px-4 py-2 rounded-xl transition-opacity hover:opacity-60 ${scrolled ? "text-cream" : "text-ink"}`}>
              Sign In
            </button>
            <Link
              href="/dashboard"
              className={`btn-solid text-[13px] py-2.5 px-5 rounded-[12px] ${scrolled ? "btn-cream" : "btn-dark"}`}
            >
              Get Access
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 flex flex-col gap-1.5"
            onClick={() => setOpen(!open)}
          >
            <span className={`block w-5 h-0.5 transition-all ${scrolled ? "bg-cream" : "bg-ink"} ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 transition-all ${scrolled ? "bg-cream" : "bg-ink"} ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 transition-all ${scrolled ? "bg-cream" : "bg-ink"} ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="md:hidden overflow-hidden"
            >
              <div className={`pt-4 pb-2 flex flex-col gap-1 border-t mt-3 ${scrolled ? "border-white/10" : "border-black/8"}`}>
                {LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`py-2.5 px-2 text-[14px] font-medium rounded-xl transition-colors ${
                      scrolled ? "text-cream hover:bg-white/8" : "text-ink hover:bg-black/5"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="flex gap-2 pt-3">
                  <Link href="/dashboard" className="flex-1 btn-solid btn-dark text-center rounded-[12px] py-2.5">
                    Open Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
