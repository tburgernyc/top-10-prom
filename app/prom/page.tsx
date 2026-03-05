"use client";

import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Color Exclusivity",
    body: "Your boutique registers your color so no one else in your school wears the same look.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Hundreds of Styles",
    body: "From timeless ball gowns to sleek minimalist silhouettes — every aesthetic, every budget.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Expert Stylists",
    body: "In-store appointments with specialists who understand fit, color theory, and your personal vision.",
  },
] as const;

export default function PromPage() {
  return (
    <main className="min-h-screen bg-onyx">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100svh] px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/[0.05] blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/30 via-transparent to-onyx" />
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.5) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <FadeIn className="relative text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-5">
            Top 10 Prom · 2026 Collection
          </p>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-medium text-ivory leading-none mb-6">
            Prom 2026
          </h1>
          <p className="text-lg sm:text-xl text-platinum/60 leading-relaxed mb-10 max-w-xl mx-auto">
            Find the gown that turns every head. Exclusive styles. Color protection.
            An unforgettable night.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dresses?category=prom"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest bg-gold-gradient text-onyx hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300 rounded-none"
            >
              Shop Prom Dresses
            </Link>
            <Link
              href="/boutiques"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest glass-2 border border-white/10 text-ivory hover:bg-white/10 hover:border-gold/25 transition-all duration-300 rounded-none"
            >
              Find Your Boutique
            </Link>
          </div>
        </FadeIn>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-platinum/30" aria-hidden="true">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-platinum/30 to-transparent" />
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-ivory font-medium">
              The Prom Experience
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <StaggerItem key={f.title}>
                <div className="glass-1 rounded-2xl border border-white/[0.06] p-7 h-full flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-xl text-ivory font-medium">{f.title}</h3>
                  <p className="text-sm text-platinum/50 leading-relaxed flex-grow">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────────────────── */}
      <section className="relative mx-6 mb-16 rounded-2xl overflow-hidden glass-gold border border-gold/20">
        <div className="px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div>
            <p className="font-display text-2xl text-ivory font-medium mb-1">
              Reserve Your Look Today
            </p>
            <p className="text-sm text-platinum/50">
              Color exclusivity sells out fast. Book your fitting before someone else claims your style.
            </p>
          </div>
          <Link
            href="/book"
            className="flex-shrink-0 inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold uppercase tracking-widest bg-gold-gradient text-onyx hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300 rounded-none whitespace-nowrap"
          >
            Book a Fitting
          </Link>
        </div>
      </section>
    </main>
  );
}
