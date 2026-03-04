import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { FadeIn } from "@/components/animations/FadeIn";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await getAuthUser();
  const supabase = await createSupabaseServerClient();

  // RLS: auth.uid() = id — user can only fetch their own profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone, style_preferences")
    .eq("id", user!.id)
    .single();

  const vibes = (profile?.style_preferences as { vibes?: string[] } | null)?.vibes ?? [];

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <FadeIn>
        <h1 className="font-display text-3xl font-medium text-ivory">My Profile</h1>
        <p className="text-sm text-platinum/50 mt-1">
          Update your details and style preferences.
        </p>
      </FadeIn>

      {/* Profile form */}
      <FadeIn delay={0.08}>
        <div className="glass-1 rounded-2xl p-6 sm:p-8">
          <ProfileForm
            initialData={{
              firstName: profile?.first_name,
              lastName: profile?.last_name,
              phone: profile?.phone,
              vibes,
            }}
          />
        </div>
      </FadeIn>

      {/* Account settings section */}
      <FadeIn delay={0.14}>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-3">
          Account Settings
        </h2>
        <div className="glass-1 rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-ivory">Email Address</p>
              <p className="text-xs text-platinum/40 mt-0.5">{user?.email}</p>
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/[0.08] text-platinum/40">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-ivory">Password</p>
              <p className="text-xs text-platinum/40 mt-0.5">Last changed: unknown</p>
            </div>
            <button
              className="text-xs text-gold/70 hover:text-gold transition-colors underline underline-offset-2"
              data-cursor="pointer"
            >
              Change
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-red-400/80">Delete Account</p>
              <p className="text-xs text-platinum/40 mt-0.5">
                This will permanently delete all your data.
              </p>
            </div>
            <button
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors underline underline-offset-2"
              data-cursor="pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
