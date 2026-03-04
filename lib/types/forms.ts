/**
 * Form state types and initial values shared between Server Actions and Client Components.
 * Kept in a plain lib file (not "use server") so they can be exported freely.
 */

/* ─── Auth forms ─────────────────────────────────────────────────────────── */

export type AuthFormErrors = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  general?: string;
};

export type AuthFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: AuthFormErrors;
};

export const authInitialState: AuthFormState = { status: "idle" };

/* ─── Profile form ───────────────────────────────────────────────────────── */

export type ProfileFormErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  general?: string;
};

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: ProfileFormErrors;
};

export const profileInitialState: ProfileFormState = { status: "idle" };

/* ─── Availability inquiry form ──────────────────────────────────────────── */

export type InquiryFormErrors = {
  store?: string;
  date?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type InquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: InquiryFormErrors;
};

export const inquiryInitialState: InquiryFormState = { status: "idle" };
