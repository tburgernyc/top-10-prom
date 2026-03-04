"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AuthFormState,
  AuthFormErrors,
  ProfileFormState,
  ProfileFormErrors,
} from "@/lib/types/forms";

/* ─── signUp ─────────────────────────────────────────────────────────────── */

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  const errors: AuthFormErrors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email required.";
  if (!password || password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { status: "error", errors: { general: error.message } };

  // Insert profile row — RLS: auth.uid() = id enforced server-side
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      style_preferences: {},
    });
  }

  redirect("/dashboard");
}

/* ─── signIn ─────────────────────────────────────────────────────────────── */

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const errors: AuthFormErrors = {};
  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      errors: { general: "Invalid email or password. Please try again." },
    };
  }

  redirect("/dashboard");
}

/* ─── signOut ────────────────────────────────────────────────────────────── */

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

/* ─── updateProfile ──────────────────────────────────────────────────────── */

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const vibesRaw = formData.get("vibes")?.toString() ?? "";
  const vibes = vibesRaw ? vibesRaw.split(",").map((v) => v.trim()).filter(Boolean) : [];

  const errors: ProfileFormErrors = {};
  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const supabase = await createSupabaseServerClient();

  // Verify authenticated — auth.uid() RLS enforces this on the DB side too
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", errors: { general: "Not authenticated." } };

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      style_preferences: { vibes },
    })
    .eq("id", user.id); // Belt-and-suspenders alongside RLS auth.uid() = id

  if (error) {
    return { status: "error", errors: { general: "Failed to save profile. Please try again." } };
  }

  return { status: "success", message: "Profile updated successfully." };
}
