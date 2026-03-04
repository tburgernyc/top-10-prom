"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { submitInquiry } from "@/app/actions/availability";
import { inquiryInitialState, type InquiryFormState } from "@/lib/types/forms";
import type { Dress } from "@/lib/types/dress";

export interface AvailabilityFormProps {
  isOpen: boolean;
  onClose: () => void;
  dress: Dress | null;
  /** Pre-select a specific boutique (from DressDetailPanel "Check Availability") */
  preselectedStore?: string;
}

/* ── Inline field-error helper ───────────────────────────────────────────── */
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-1 text-xs text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ── Styled <select> wrapper (matches glass-1 Input aesthetic) ───────────── */
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

function SelectField({ label, error, children, className, id, ...props }: SelectFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="text-xs font-medium text-platinum/50 tracking-wide">
        {label}
      </label>
      <select
        id={fieldId}
        className={cn(
          "w-full h-12 px-4 text-sm text-ivory rounded-lg",
          "glass-1 border border-white/[0.08]",
          "focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30",
          "bg-transparent transition-all duration-200",
          "[&>option]:bg-onyx [&>option]:text-ivory",
          error && "border-red-400/60",
          className
        )}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      <FieldError message={error} />
    </div>
  );
}

/* ── Min date: today ─────────────────────────────────────────────────────── */
function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function AvailabilityForm({
  isOpen,
  onClose,
  dress,
  preselectedStore,
}: AvailabilityFormProps) {
  const [state, formAction, isPending] = useActionState<InquiryFormState, FormData>(
    submitInquiry,
    inquiryInitialState
  );

  // Auto-close on success after a short delay
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (state.status === "success") {
      closeTimerRef.current = setTimeout(onClose, 3200);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [state.status, onClose]);

  if (!dress) return null;

  const stores = dress.available_stores;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check Availability"
      description={`Request availability info for ${dress.name} by ${dress.designer}.`}
      size="md"
    >
      <AnimatePresence mode="wait" initial={false}>

        {/* ── Success state ─────────────────────────────────────────────── */}
        {state.status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center gap-4 py-6"
            role="status"
            aria-live="polite"
          >
            {/* Gold checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-14 h-14 rounded-full border-2 border-gold/60 flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <p className="text-sm text-platinum/80 leading-relaxed max-w-xs">
              {state.message}
            </p>
            <p className="text-xs text-platinum/40">This window will close automatically.</p>
          </motion.div>

        ) : (

          /* ── Form state ───────────────────────────────────────────────── */
          <motion.form
            key="form"
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5 pt-1"
            aria-label="Availability inquiry form"
            noValidate
          >
            {/* Global error banner */}
            <AnimatePresence>
              {state.status === "error" && !state.errors && state.message && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-400 px-3 py-2 rounded-lg bg-red-400/10 border border-red-400/20"
                >
                  {state.message}
                </motion.p>
              )}
            </AnimatePresence>

            {/* ── Section: Boutique & Date ────────────────────────────────── */}
            <fieldset className="flex flex-col gap-4">
              <legend className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-1">
                Appointment Details
              </legend>

              {/* Store Selection */}
              <SelectField
                label="Select Boutique"
                name="store"
                defaultValue={preselectedStore ?? ""}
                error={state.errors?.store}
                required
              >
                <option value="" disabled>Choose a boutique…</option>
                {stores.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </SelectField>

              {/* Preferred Date */}
              <div className="flex flex-col gap-1">
                <label htmlFor="date" className="text-xs font-medium text-platinum/50 tracking-wide">
                  Preferred Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={getTodayString()}
                  required
                  className={cn(
                    "w-full h-12 px-4 text-sm text-ivory rounded-lg",
                    "glass-1 border border-white/[0.08]",
                    "focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30",
                    "bg-transparent transition-all duration-200",
                    "[color-scheme:dark]",
                    state.errors?.date && "border-red-400/60"
                  )}
                  aria-describedby={state.errors?.date ? "date-error" : undefined}
                  aria-invalid={!!state.errors?.date}
                />
                <FieldError message={state.errors?.date} />
              </div>
            </fieldset>

            {/* ── Section: Contact Info ──────────────────────────────────── */}
            <fieldset className="flex flex-col gap-4">
              <legend className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-1">
                Your Contact Info
              </legend>

              <Input
                name="name"
                label="Full Name"
                autoComplete="name"
                required
                error={state.errors?.name}
                aria-describedby={state.errors?.name ? "name-error" : undefined}
              />

              <Input
                name="email"
                type="email"
                label="Email Address"
                autoComplete="email"
                required
                error={state.errors?.email}
              />

              <Input
                name="phone"
                type="tel"
                label="Phone (optional)"
                autoComplete="tel"
                error={state.errors?.phone}
              />
            </fieldset>

            {/* ── Submit ──────────────────────────────────────────────────── */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-1"
              disabled={isPending}
              aria-busy={isPending}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isPending ? "pending" : "idle"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      {/* Spinner */}
                      <motion.span
                        className="w-4 h-4 rounded-full border-2 border-onyx/30 border-t-onyx block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        aria-hidden="true"
                      />
                      Sending Inquiry…
                    </>
                  ) : (
                    "Send Availability Request"
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>

            <p className="text-center text-xs text-platinum/30 leading-relaxed">
              No purchase required. Our team will respond within 24 hours.
            </p>
          </motion.form>
        )}

      </AnimatePresence>
    </Modal>
  );
}
