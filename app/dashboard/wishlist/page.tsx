import type { Metadata } from "next";
import { getWishlist } from "@/app/actions/wishlist";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const dresses = await getWishlist();

  return (
    <div className="flex flex-col gap-8">
      <FadeIn>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium text-ivory">My Wishlist</h1>
            <p className="text-sm text-platinum/50 mt-1">
              {dresses.length > 0
                ? `${dresses.length} dress${dresses.length !== 1 ? "es" : ""} saved.`
                : "No dresses saved yet."}
            </p>
          </div>
          {dresses.length > 0 && (
            <Link
              href="/catalog"
              className="text-xs text-gold/70 hover:text-gold transition-colors underline underline-offset-2"
            >
              Browse more
            </Link>
          )}
        </div>
      </FadeIn>

      {dresses.length === 0 ? (
        <FadeIn delay={0.08}>
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center glass-1 rounded-2xl">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-platinum/20" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="text-sm text-platinum/40">Your wishlist is empty.</p>
            <Link
              href="/catalog"
              className="text-sm text-gold hover:text-gold-light transition-colors font-medium"
            >
              Start browsing →
            </Link>
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.08}>
          {/* DressCardGrid requires client interactivity (store + onSelect).
              Wishlist page renders a simpler server-side grid of dress cards. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {dresses.map((dress) => (
              <div
                key={dress.id}
                className="glass-1 rounded-xl overflow-hidden border border-white/[0.06]"
              >
                <div className="p-4 flex flex-col gap-1.5">
                  <p className="text-xs text-gold/70 font-medium tracking-wide uppercase truncate">
                    {dress.designer}
                  </p>
                  <p className="text-sm font-medium text-ivory leading-snug line-clamp-2">
                    {dress.name}
                  </p>
                  <p className="text-xs text-platinum/40 mt-1">
                    {dress.available_stores.length} boutique{dress.available_stores.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Link
                      href={`/catalog?id=${dress.id}`}
                      className="text-xs text-gold/70 hover:text-gold transition-colors underline underline-offset-2"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
