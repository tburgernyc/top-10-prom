"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Catalog", href: "/dresses" },
  { label: "Prom", href: "/prom" },
  { label: "Bridal", href: "/bridal" },
  { label: "Tuxedos", href: "/tux" },
  { label: "About", href: "/about" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollY = useMotionValue(0);
  // Opacity fades from 1 → 0.85 between 0–80px scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [1, 0.85]);
  // Subtle shadow intensifies on scroll
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollY.set(window.scrollY);
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollY]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[200]"
      style={{ opacity: bgOpacity }}
    >
      {/* Glass-2 backdrop bar */}
      <motion.div
        className="glass-2 border-b border-white/[0.06]"
        style={{
          boxShadow: useTransform(
            shadowOpacity,
            [0, 1],
            ["0 0 0 rgba(0,0,0,0)", "0 4px 32px rgba(0,0,0,0.5)"]
          ),
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6"
          aria-label="Main navigation"
        >
          {/* Logo — left */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group"
            aria-label="Top 10 Prom — home"
          >
            <span className="text-gold font-display text-xl font-semibold tracking-wide group-hover:text-gold-light transition-colors duration-200">
              Top 10 Prom
            </span>
          </Link>

          {/* Nav links — center (desktop) */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="relative px-3 py-1.5 text-sm text-platinum/80 hover:text-ivory
                             transition-colors duration-200 rounded-md hover:bg-white/[0.04]
                             focus-visible:outline-1 focus-visible:outline-gold"
                  data-cursor="pointer"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/auth/login"
              className="text-sm text-platinum/70 hover:text-ivory transition-colors duration-200 px-2 py-1"
              data-cursor="pointer"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-1.5 rounded-full border border-gold/40 text-gold text-sm
                         hover:bg-gold/10 hover:border-gold/70 transition-all duration-200"
              data-cursor="pointer"
            >
              Book Appointment
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            data-cursor="pointer"
          >
            <motion.span
              className="w-5 h-px bg-ivory block"
              animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="w-5 h-px bg-ivory block"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="w-5 h-px bg-ivory block"
              animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </nav>
      </motion.div>

      {/* Mobile drawer menu */}
      <motion.div
        className={cn(
          "md:hidden glass-2 border-b border-white/[0.06] overflow-hidden"
        )}
        initial={false}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <ul className="px-4 pb-4 pt-2 flex flex-col gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="block px-3 py-2.5 text-sm text-platinum/80 hover:text-ivory
                           hover:bg-white/[0.04] rounded-md transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="px-3 py-2 text-sm text-platinum/70 hover:text-ivory transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="mx-3 px-4 py-2 rounded-full border border-gold/40 text-gold text-sm text-center
                         hover:bg-gold/10 hover:border-gold/70 transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              Book Appointment
            </Link>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  );
}
