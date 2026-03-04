import Link from "next/link";

const FOOTER_LINKS = {
  Explore: [
    { label: "Catalog", href: "/catalog" },
    { label: "Collections", href: "/collections" },
    { label: "New Arrivals", href: "/catalog?sort=new" },
    { label: "Featured Designers", href: "/collections#designers" },
  ],
  Services: [
    { label: "Book Appointment", href: "/book" },
    { label: "Boutique Locator", href: "/boutiques" },
    { label: "Virtual Try-On", href: "/try-on" },
    { label: "Style Concierge", href: "/#aria" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-onyx relative">
      {/* Gold divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* 3-column link grid + brand column */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Top 10 Prom home">
              <span className="font-display text-xl font-semibold text-gold">
                Top 10 Prom
              </span>
            </Link>
            <p className="text-sm text-platinum/50 leading-relaxed max-w-[220px]">
              Curated prom collections from the region&apos;s finest boutiques. Your
              moment, perfectly dressed.
            </p>
          </div>

          {/* Link columns */}
          {(Object.keys(FOOTER_LINKS) as Array<keyof typeof FOOTER_LINKS>).map(
            (section) => (
              <div key={section}>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-gold/70 mb-4">
                  {section}
                </h3>
                <ul className="space-y-2.5" role="list">
                  {FOOTER_LINKS[section].map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-platinum/50 hover:text-platinum transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-platinum/30">
            &copy; {currentYear} Top 10 Prom. All rights reserved.
          </p>
          <p className="text-xs text-platinum/20">
            Phase 1 Digital Showroom &mdash; Intent Capture
          </p>
        </div>
      </div>
    </footer>
  );
}
