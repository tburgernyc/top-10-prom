"use client";

import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import {
  ABOUT_PARAGRAPHS,
  ABOUT_HEADLINE,
  ABOUT_SUBHEADLINE,
} from "@/lib/content/about";

const VALUES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Curated Excellence",
    body: "Every boutique in our network is hand-selected for their commitment to quality, designer exclusives, and exceptional client service.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Personal Styling",
    body: "Our expert stylists work one-on-one to help you discover the silhouette, color, and designer that perfectly expresses who you are.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Nationwide Reach",
    body: "Hundreds of boutique locations across the US and Canada, each offering color exclusivity so you'll never show up in the same dress.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-onyx">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] px-6 py-32 overflow-hidden">
        {/* Radial gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.06] blur-[120px]" />
        </div>

        <FadeIn className="relative text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-4">
            Our Story
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-ivory leading-tight mb-6">
            {ABOUT_HEADLINE}
          </h1>
          <p className="text-lg text-platinum/60 leading-relaxed">
            {ABOUT_SUBHEADLINE}
          </p>
        </FadeIn>
      </section>

      {/* ── Gold divider ──────────────────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-8" />

      {/* ── Story content ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* Left: brand block */}
          <FadeIn className="lg:sticky lg:top-28">
            <div className="glass-2 rounded-2xl border border-white/[0.06] p-8">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <p className="font-display text-2xl text-ivory font-medium mb-2">
                Top 10 Prom
              </p>
              <p className="text-sm text-platinum/50 mb-6">
                Est. 1994 · Fairview, NC
              </p>
              <div className="border-t border-white/[0.06] pt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-platinum/50">
                  <span className="text-gold font-medium text-base">500+</span>
                  Partner Boutiques
                </div>
                <div className="flex items-center gap-3 text-sm text-platinum/50">
                  <span className="text-gold font-medium text-base">50</span>
                  States &amp; Canada
                </div>
                <div className="flex items-center gap-3 text-sm text-platinum/50">
                  <span className="text-gold font-medium text-base">30+</span>
                  Years of Excellence
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: paragraphs */}
          <div className="flex flex-col gap-6">
            {ABOUT_PARAGRAPHS.map((paragraph, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <p className="text-platinum/70 leading-[1.85] text-base">
                  {paragraph}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values strip ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-onyx/80">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-3">
              What Sets Us Apart
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ivory font-medium">
              The Top 10 Difference
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="glass-1 rounded-2xl border border-white/[0.06] p-6 h-full flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    {v.icon}
                  </div>
                  <h3 className="font-display text-xl text-ivory font-medium">
                    {v.title}
                  </h3>
                  <p className="text-sm text-platinum/50 leading-relaxed flex-grow">
                    {v.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <FadeIn className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl sm:text-4xl text-ivory font-medium">
            Ready to Find Your Look?
          </h2>
          <p className="text-platinum/50 text-base leading-relaxed">
            Visit a boutique near you or browse our full catalog of
            2026 designer gowns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/dresses"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest bg-gold-gradient text-onyx hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300 rounded-none"
            >
              Explore the Catalog
            </Link>
            <Link
              href="/boutiques"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest glass-2 border border-white/10 text-ivory hover:bg-white/10 hover:border-gold/25 transition-all duration-300 rounded-none"
            >
              Find a Boutique
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
