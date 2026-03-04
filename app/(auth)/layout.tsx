import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s | Top 10 Prom",
    default: "Account | Top 10 Prom",
  },
};

/**
 * Split layout: dark luxury left panel + glass-4 form right panel.
 * Left panel is hidden on mobile (form fills full width).
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex">
      {/* ── Left panel — decorative (desktop only) ───────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col
                   items-start justify-between p-12 overflow-hidden"
        aria-hidden="true"
      >
        {/* Deep dark background */}
        <div className="absolute inset-0 bg-onyx" />

        {/* Gold radial glow — top right */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
                     opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
        />

        {/* Platinum glow — bottom left */}
        <div
          className="absolute -bottom-48 -left-24 w-[400px] h-[400px] rounded-full
                     opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, #C0C0C0 0%, transparent 70%)" }}
        />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-semibold text-gold tracking-wide">
              Top 10 Prom
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <blockquote className="font-display text-3xl font-light text-ivory/80 leading-snug italic mb-6">
            &ldquo;Find the dress that makes you feel like the only one in the room.&rdquo;
          </blockquote>
          <p className="text-sm text-platinum/40">
            Curated collections from the region&apos;s finest boutiques.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-platinum/20">
            &copy; {new Date().getFullYear()} Top 10 Prom
          </p>
        </div>
      </div>

      {/* ── Right panel — form area ───────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center
                   px-6 py-12 lg:px-16 glass-4 lg:border-l lg:border-white/[0.06]"
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 self-start">
          <Link href="/">
            <span className="font-display text-xl font-semibold text-gold">
              Top 10 Prom
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
