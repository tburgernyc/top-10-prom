import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animations";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Find a Boutique | Top 10 Prom",
  description:
    "Locate a Top 10 Prom partner boutique near you. Expert stylists, exclusive designs, and color protection at 500+ locations.",
};

interface Boutique {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  slug: string;
}

export default async function BoutiquesPage() {
  let boutiques: Boutique[] = [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("boutiques")
      .select("*")
      .order("state")
      .order("name");
    boutiques = (data ?? []) as Boutique[];
  } catch {
    // DB unavailable
  }

  return (
    <div className="min-h-screen bg-onyx">
      {/* Hero */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.05] blur-[120px]" />
        </div>
        <FadeIn className="relative max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-4">
            Partner Network
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-ivory font-medium mb-4">
            Find Your Boutique
          </h1>
          <p className="text-platinum/50 text-lg leading-relaxed">
            Every Top 10 Prom boutique offers color exclusivity, expert styling,
            and access to our exclusive 2026 designer collections.
          </p>
        </FadeIn>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-8" />

      {/* Boutique grid */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        {boutiques.length === 0 ? (
          <FadeIn className="text-center py-20">
            <p className="text-platinum/40 text-sm">
              Boutique directory coming soon. Contact us to find a partner near you.
            </p>
          </FadeIn>
        ) : (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boutiques.map((b) => (
              <StaggerItem key={b.id}>
                <div className="glass-1 rounded-2xl border border-white/[0.06] p-6 h-full flex flex-col gap-4 hover:border-gold/20 transition-colors duration-300">
                  {/* State badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-lg text-ivory font-medium leading-snug">
                      {b.name}
                    </h2>
                    <span className="flex-shrink-0 text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
                      {b.state}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-1 text-sm text-platinum/50">
                    <span>{b.address}</span>
                    <span>
                      {b.city}, {b.state}
                    </span>
                  </div>

                  {/* Phone */}
                  {b.phone && (
                    <a
                      href={`tel:${b.phone.replace(/\D/g, "")}`}
                      className="text-sm text-gold/70 hover:text-gold transition-colors"
                      data-cursor="pointer"
                    >
                      {b.phone}
                    </a>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* CTAs */}
                  <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
                    <Link
                      href="/book"
                      className="flex-1 text-center text-xs font-bold uppercase tracking-widest py-2.5 bg-gold-gradient text-onyx hover:shadow-gold-glow transition-all duration-200 rounded-none"
                      data-cursor="pointer"
                    >
                      Book Fitting
                    </Link>
                    {b.website && (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-xs font-bold uppercase tracking-widest py-2.5 glass-2 border border-white/10 text-ivory hover:border-gold/25 transition-all duration-200 rounded-none"
                        data-cursor="pointer"
                      >
                        Visit Site
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </section>

      {/* CTA band */}
      <section className="px-6 py-20 border-t border-white/[0.06] text-center">
        <FadeIn className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl text-ivory font-medium">
            Don&apos;t see one near you?
          </h2>
          <p className="text-platinum/50 text-sm leading-relaxed">
            Our network spans 500+ locations across the US and Canada.
            Let Aria help you find the closest partner boutique.
          </p>
          <Link
            href="/dresses"
            className="px-10 py-3.5 text-sm font-bold uppercase tracking-widest bg-gold-gradient text-onyx hover:shadow-gold-glow transition-all duration-200 rounded-none"
            data-cursor="pointer"
          >
            Browse the Catalog
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
