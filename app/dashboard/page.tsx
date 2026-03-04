import Link from "next/link";
import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/animations/FadeIn";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage() {
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();

  const [{ data: profile }, { data: wishlist }, { data: inquiries }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user!.id)
        .single(),
      // RLS auth.uid() = user_id auto-filters
      supabase
        .from("wishlist")
        .select("dress_id")
        .limit(3),
      supabase
        .from("availability_inquiries")
        .select("id, target_store, status, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  const greeting =
    profile?.first_name
      ? `Welcome back, ${profile.first_name}.`
      : "Welcome back.";

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <FadeIn>
        <h1 className="font-display text-3xl font-medium text-ivory">{greeting}</h1>
        <p className="text-sm text-platinum/50 mt-1">
          Your personal prom planning hub.
        </p>
      </FadeIn>

      {/* ── Quick stats ──────────────────────────────────────────────────── */}
      <FadeIn delay={0.08}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Saved to Wishlist", value: wishlist?.length ?? 0, href: "/dashboard/wishlist" },
            { label: "Inquiries Sent", value: inquiries?.length ?? 0, href: "/dashboard/appointments" },
            { label: "Boutique Partners", value: "10+", href: "/boutiques" },
          ].map(({ label, value, href }) => (
            <Link
              key={label}
              href={href}
              className="glass-1 rounded-xl p-5 flex flex-col gap-1
                         hover:glass-2 hover:border-white/[0.10] transition-all duration-300"
              data-cursor="pointer"
            >
              <span className="text-2xl font-bold text-gold">{value}</span>
              <span className="text-xs text-platinum/50">{label}</span>
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* ── Quick links ──────────────────────────────────────────────────── */}
      <FadeIn delay={0.14}>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Browse Catalog", desc: "Explore new arrivals and collections.", href: "/catalog" },
            { label: "Book Appointment", desc: "Schedule a private fitting session.", href: "/book" },
            { label: "My Wishlist", desc: "Review your saved dresses.", href: "/dashboard/wishlist" },
            { label: "Edit Profile", desc: "Update your style preferences.", href: "/dashboard/profile" },
          ].map(({ label, desc, href }) => (
            <Link
              key={label}
              href={href}
              className="glass-1 rounded-xl p-4 flex flex-col gap-1
                         hover:border-gold/20 transition-all duration-300 group"
              data-cursor="pointer"
            >
              <span className="text-sm font-medium text-ivory group-hover:text-gold transition-colors duration-200">
                {label}
              </span>
              <span className="text-xs text-platinum/40">{desc}</span>
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* ── Recent inquiries ─────────────────────────────────────────────── */}
      {inquiries && inquiries.length > 0 && (
        <FadeIn delay={0.2}>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-3">
            Recent Inquiries
          </h2>
          <div className="flex flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {inquiries.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-ivory">{inq.target_store}</p>
                  <p className="text-xs text-platinum/40 mt-0.5">
                    {new Date(inq.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border border-white/[0.08] text-platinum/50 capitalize">
                  {inq.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
