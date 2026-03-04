"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Dress } from "@/lib/types/dress";

/* ─── getWishlist ─────────────────────────────────────────────────────────── */

export async function getWishlist(): Promise<Dress[]> {
  const supabase = await createSupabaseServerClient();

  // RLS "Users can manage own wishlist" → auth.uid() = user_id filters automatically
  const { data, error } = await supabase
    .from("wishlist")
    .select("dress_id, dresses(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data
    .map((row) => row.dresses as unknown as Dress)
    .filter(Boolean);
}

/* ─── addToWishlist ───────────────────────────────────────────────────────── */

export async function addToWishlist(dressId: string): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("wishlist")
    .insert({ user_id: user.id, dress_id: dressId });

  if (error) {
    // Unique constraint violation = already wishlisted
    if (error.code === "23505") return {};
    return { error: error.message };
  }

  revalidatePath("/dashboard/wishlist");
  return {};
}

/* ─── removeFromWishlist ──────────────────────────────────────────────────── */

export async function removeFromWishlist(dressId: string): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // RLS auth.uid() = user_id ensures users can only delete their own rows
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", user.id)
    .eq("dress_id", dressId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/wishlist");
  return {};
}
