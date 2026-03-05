"use client";

import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Designer Exclusives",
    body: "Bridal gowns from premier designers — Stella York, Allure Bridals, Maggie Sottero — available only through our boutique network.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Private Appointments",
    body: "Dedicated fitting sessions with a bridal stylist in an intimate setting — because finding your dress should feel special.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Alterations & Care",
    body: "Our network boutiques offer in-house alterations and preservation services to keep your gown perfect, forever.",
  },
] as const;

export default function BridalPage() {
  return (
    <main className="min-h-screen bg-onyx">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100svh] px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-platinum/[0.03] blur-[130px]" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/[0.04] blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-transparent to-onyx" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(192,192,192,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(192,192,192,0.4) 1px,transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <FadeIn className="relative text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-5">
            Top 10 Prom · Bridal
          </p>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-medium text-ivory leading-none mb-6">
            Bridal<br />
            <span className="text-platinum/70">Collection</span>
          </h1>
          <p className="text-lg sm:text-xl text-platinum/60 leading-relaxed mb-10 max-w-xl mx-auto">
            Timeless gowns for the most extraordinary day of your life.
            Curated. Personal. Unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dresses?category=bridal"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest bg-gold-gradient text-onyx hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300 rounded-none"
            >
              Shop Bridal Gowns
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
              The Bridal Experience
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
              Begin Your Bridal Journey
            </p>
            <p className="text-sm text-platinum/50">
              Book a private bridal appointment and let our stylists guide you to your perfect gown.
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
