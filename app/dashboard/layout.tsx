import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getAuthUser } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | Dashboard — Top 10 Prom", default: "Dashboard — Top 10 Prom" },
};

/* ── Nav items ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Wishlist",
    href: "/dashboard/wishlist",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: "Appointments",
    href: "/dashboard/appointments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
] as const;

/* ── Sidebar link ────────────────────────────────────────────────────────── */
function SidebarLink({
  item,
}: {
  item: (typeof NAV_ITEMS)[number];
}) {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                 text-platinum/60 hover:text-ivory hover:bg-white/[0.04]
                 transition-all duration-200 group"
      data-cursor="pointer"
    >
      <span className="text-platinum/40 group-hover:text-gold transition-colors duration-200">
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

/* ── Bottom tab (mobile) ─────────────────────────────────────────────────── */
function BottomTab({ item }: { item: (typeof NAV_ITEMS)[number] }) {
  return (
    <Link
      href={item.href}
      className="flex flex-col items-center gap-1 px-3 py-2 text-platinum/50
                 hover:text-gold transition-colors duration-200 flex-1"
      data-cursor="pointer"
    >
      {item.icon}
      <span className="text-[9px] font-medium tracking-wide uppercase">{item.label}</span>
    </Link>
  );
}

/* ── Dashboard shell ─────────────────────────────────────────────────────── */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();

  // Fetch first name for greeting
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user!.id)
    .single();

  const displayName = profile?.first_name ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex">
      {/* ── Sidebar — desktop only ──────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0
                   border-r border-white/[0.06] py-8 px-3"
        aria-label="Dashboard navigation"
      >
        {/* User greeting */}
        <div className="px-3 mb-6">
          <p className="text-xs text-platinum/40 mb-0.5">Welcome back,</p>
          <p className="text-sm font-medium text-ivory truncate capitalize">{displayName}</p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Sign out */}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                       text-platinum/40 hover:text-red-400 hover:bg-red-400/[0.06]
                       transition-all duration-200"
            data-cursor="pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </form>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 px-4 py-8 lg:px-10 pb-24 lg:pb-8">
        {children}
      </main>

      {/* ── Bottom tab bar — mobile only ────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[150]
                   glass-4 border-t border-white/[0.06]
                   flex items-center justify-around px-2 py-1 safe-pb"
        aria-label="Dashboard navigation"
      >
        {NAV_ITEMS.map((item) => (
          <BottomTab key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );
}
