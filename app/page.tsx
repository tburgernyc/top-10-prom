import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Radial gold glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <FadeIn className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold/70">
            Top 10 Prom — Digital Showroom
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-ivory leading-[1.1] tracking-tight">
            Find the dress that{" "}
            <em className="text-gold not-italic">defines</em>{" "}
            your night.
          </h1>

          <p className="text-base sm:text-lg text-platinum/60 max-w-xl leading-relaxed">
            Curated prom collections from the region&apos;s finest boutiques —
            explore, save, and book your private fitting with Aria&apos;s guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/catalog"
              className="px-8 py-3.5 rounded-full bg-gold text-onyx text-sm font-bold
                         tracking-widest uppercase hover:bg-gold-light transition-colors duration-200
                         shadow-gold-glow"
              data-cursor="pointer"
            >
              Explore Collections
            </Link>
            <Link
              href="/book"
              className="px-8 py-3.5 rounded-full border border-gold/30 text-gold text-sm
                         font-medium hover:bg-gold/10 hover:border-gold/60 transition-all duration-200"
              data-cursor="pointer"
            >
              Book Appointment
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold/60 mb-3">
              The Experience
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory">
              Prom planning, elevated.
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Digital Fitting Room",
                desc: "Save your favorite looks to a personal fitting room and compare side-by-side.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.38 18H3.62a1 1 0 0 1-.7-1.71L12 8"/><path d="M12 8a2 2 0 1 0-2-2"/><path d="M12 8v1"/>
                  </svg>
                ),
              },
              {
                title: "Aria Style Concierge",
                desc: "Our AI concierge learns your style and guides you to your perfect look.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
                  </svg>
                ),
              },
              {
                title: "Boutique Bookings",
                desc: "Book private fittings at partner boutiques — no phone tag required.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <StaggerItem key={title}>
                <div className="glass-1 rounded-2xl p-6 flex flex-col gap-4 h-full
                                hover:border-white/[0.10] transition-all duration-300">
                  <span className="text-gold/60">{icon}</span>
                  <h3 className="font-medium text-ivory text-base">{title}</h3>
                  <p className="text-sm text-platinum/50 leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/[0.06] text-center">
        <FadeIn className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl font-light text-ivory">
            Your moment is waiting.
          </h2>
          <p className="text-sm text-platinum/50">
            Create a free account to save looks, chat with Aria, and book your fitting.
          </p>
          <Link
            href="/signup"
            className="px-10 py-3.5 rounded-full bg-gold text-onyx text-sm font-bold
                       tracking-widest uppercase hover:bg-gold-light transition-colors duration-200
                       shadow-gold-glow"
            data-cursor="pointer"
          >
            Get Started — It&apos;s Free
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
