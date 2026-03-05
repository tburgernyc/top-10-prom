"use client";

import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: "Classic to Contemporary",
    body: "From traditional black-tie to modern slim-cut designs, every silhouette and color story covered.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    title: "Complete Packages",
    body: "Tux, shirt, tie, pocket square, cufflinks — we coordinate every detail so your look is perfectly cohesive.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Perfect Fit Guarantee",
    body: "Our expert tailors ensure every measurement is exact. Alterations included until it's flawless.",
  },
] as const;

export default function TuxPage() {
  return (
    <main className="min-h-screen bg-onyx">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100svh] px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/[0.04] blur-[150px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-onyx to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.3) 1px,transparent 1px)",
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        <FadeIn className="relative text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-5">
            Top 10 Prom · Formalwear
          </p>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-medium text-ivory leading-none mb-6">
            Tuxedos<br />
            <span className="text-platinum/60">&amp; Suits</span>
          </h1>
          <p className="text-lg sm:text-xl text-platinum/60 leading-relaxed mb-10 max-w-xl mx-auto">
            Dress sharp. Arrive in style. From sleek modern cuts to
            timeless black-tie — your look, perfected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dresses?category=tux"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest bg-gold-gradient text-onyx hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300 rounded-none"
            >
              Shop Tuxedos &amp; Suits
            </Link>
            <Link
              href="/boutiques"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest glass-2 border border-white/10 text-ivory hover:bg-white/10 hover:border-gold/25 transition-all duration-300 rounded-none"
            >
              Find Your Boutique
            </Link>
          </div>
        </FadeIn>

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
              Styled to Perfection
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
              Get Measured. Look Sharp.
            </p>
            <p className="text-sm text-platinum/50">
              Walk in for a complimentary fitting and let our formalwear experts build your complete look.
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
