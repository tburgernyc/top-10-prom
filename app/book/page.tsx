import type { Metadata } from "next";
import { FadeIn } from "@/components/animations";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BookForm } from "./BookForm";

export const metadata: Metadata = {
  title: "Book a Fitting | Top 10 Prom",
  description:
    "Request a private fitting appointment at a Top 10 Prom partner boutique. Expert stylists, exclusive styles, color protection.",
};

// Fallback list in case DB is unavailable
const FALLBACK_BOUTIQUES = [
  "So Sweet Boutique",
  "Ashley Rene's Prom & Pageant",
  "The Prom Shop",
  "That's My Dress",
  "Henri's",
  "Terry Costa",
  "Formals XO",
];

export default async function BookPage() {
  let boutiques: string[] = [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("boutiques")
      .select("name")
      .order("name");
    boutiques = (data ?? []).map((b: { name: string }) => b.name);
  } catch {
    boutiques = FALLBACK_BOUTIQUES;
  }

  if (boutiques.length === 0) boutiques = FALLBACK_BOUTIQUES;

  return (
    <div className="min-h-screen bg-onyx">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <FadeIn>
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold mb-4">
              Private Appointments
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-ivory font-medium mb-4">
              Book Your Fitting
            </h1>
            <p className="text-platinum/50 text-base leading-relaxed max-w-md mx-auto">
              Reserve a private styling session at your nearest partner boutique.
              One-on-one attention, exclusive styles, color protection guaranteed.
            </p>
          </div>

          {/* What to expect */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Private Session", detail: "1-on-1 with a stylist" },
              { label: "Color Lock", detail: "Your style is yours alone" },
              { label: "No Pressure", detail: "Browse at your own pace" },
            ].map((item) => (
              <div
                key={item.label}
                className="glass-1 rounded-xl border border-white/[0.06] p-4 text-center"
              >
                <p className="text-xs font-semibold text-ivory mb-1">{item.label}</p>
                <p className="text-[10px] text-platinum/40 leading-snug">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="glass-2 rounded-2xl border border-white/[0.06] p-8">
            <BookForm boutiques={boutiques} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
