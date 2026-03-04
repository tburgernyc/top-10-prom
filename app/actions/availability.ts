"use server";

import type { InquiryFormState, InquiryFormErrors } from "@/lib/types/forms";

/* ─────────────────────────────────────────────────────────────────────────────
 * Server Action: submitInquiry
 * Phase 1 stub — validates input shape, returns typed FormState.
 * Production wiring (Supabase insert + Resend confirmation) lives in Task #34.
 * ──────────────────────────────────────────────────────────────────────────── */

export async function submitInquiry(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const store = formData.get("store")?.toString().trim() ?? "";
  const date  = formData.get("date")?.toString().trim() ?? "";
  const name  = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";

  const errors: InquiryFormErrors = {};
  if (!store) errors.store = "Please select a boutique.";
  if (!date)  errors.date  = "Please choose a preferred date.";
  if (!name)  errors.name  = "Your name is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "A valid email address is required.";
  }

  if (Object.keys(errors).length > 0) return { status: "error", errors };

  // ── TODO (Task #34): Insert into public.availability_inquiries via Supabase
  // ── TODO (Task #34): Send confirmation email via Resend
  await new Promise((r) => setTimeout(r, 600));

  console.log("[submitInquiry] stub:", { store, date, name, email, phone });

  return {
    status: "success",
    message: `Thanks ${name}! We've sent your inquiry for ${store} to our team. Check ${email} for a confirmation.`,
  };
}
