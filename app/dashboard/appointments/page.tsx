import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";

export const metadata: Metadata = { title: "Appointments" };

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface AvailabilityInquiry {
  id: string;
  target_store: string;
  status: string;
  created_at: string;
  dress_id: string;
}

/* ─── Status pill ────────────────────────────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending_review: { label: "Pending Review", className: "text-gold/70 border-gold/30 bg-gold/5" },
    confirmed:      { label: "Confirmed",       className: "text-emerald-400/80 border-emerald-400/30 bg-emerald-400/5" },
    cancelled:      { label: "Cancelled",       className: "text-red-400/70 border-red-400/30 bg-red-400/5" },
  };
  const { label, className } = map[status] ?? { label: status, className: "text-platinum/50 border-white/[0.08]" };

  return (
    <span className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${className}`}>
      {label}
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function AppointmentsPage() {
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();

  // RLS: auth.uid() = user_id filters automatically
  const { data: inquiries } = await supabase
    .from("availability_inquiries")
    .select("id, target_store, status, created_at, dress_id")
    .order("created_at", { ascending: false })
    .returns<AvailabilityInquiry[]>();

  const pending = inquiries?.filter((i) => i.status === "pending_review") ?? [];
  const past    = inquiries?.filter((i) => i.status !== "pending_review") ?? [];

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <FadeIn>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium text-ivory">Appointments</h1>
            <p className="text-sm text-platinum/50 mt-1">
              Your boutique inquiries and booking history.
            </p>
          </div>
          <Link
            href="/book"
            className="text-xs text-gold/70 hover:text-gold transition-colors underline underline-offset-2"
          >
            + New booking
          </Link>
        </div>
      </FadeIn>

      {/* Empty state */}
      {(!inquiries || inquiries.length === 0) && (
        <FadeIn delay={0.08}>
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center glass-1 rounded-2xl">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-platinum/20" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-sm text-platinum/40">No appointments yet.</p>
            <Link href="/catalog" className="text-sm text-gold hover:text-gold-light transition-colors">
              Browse dresses to request availability →
            </Link>
          </div>
        </FadeIn>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <FadeIn delay={0.08}>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-3">
            Pending ({pending.length})
          </h2>
          <InquiryList inquiries={pending} />
        </FadeIn>
      )}

      {/* Past */}
      {past.length > 0 && (
        <FadeIn delay={0.14}>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-3">
            History
          </h2>
          <InquiryList inquiries={past} />
        </FadeIn>
      )}

      {/* Google Calendar note — Phase 2 */}
      <FadeIn delay={0.2}>
        <div className="glass-1 rounded-xl px-5 py-4 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-gold/50 flex-shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-platinum/40 leading-relaxed">
            Google Calendar sync is coming in Phase 2. Confirmed appointments will appear directly in your calendar.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

function InquiryList({ inquiries }: { inquiries: AvailabilityInquiry[] }) {
  return (
    <div className="flex flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {inquiries.map((inq) => (
        <div key={inq.id} className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-medium text-ivory">{inq.target_store}</p>
            <p className="text-xs text-platinum/40 mt-0.5">
              Requested{" "}
              {new Date(inq.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <StatusPill status={inq.status} />
        </div>
      ))}
    </div>
  );
}
