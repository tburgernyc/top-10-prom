"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { submitInquiry } from "@/app/actions/availability";
import { inquiryInitialState, type InquiryFormState } from "@/lib/types/forms";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-1 text-xs text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function BookForm({ boutiques }: { boutiques: string[] }) {
  const [state, formAction, isPending] = useActionState<InquiryFormState, FormData>(
    submitInquiry,
    inquiryInitialState
  );

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center gap-6 py-12"
        role="status"
        aria-live="polite"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full border-2 border-gold/60 flex items-center justify-center"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        <div className="flex flex-col gap-2">
          <p className="font-display text-2xl text-ivory font-medium">Request Sent</p>
          <p className="text-sm text-platinum/60 leading-relaxed max-w-sm">
            {state.message}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6"
      aria-label="Book a fitting appointment"
      noValidate
    >
      {state.status === "error" && !state.errors && state.message && (
        <p
          role="alert"
          className="text-sm text-red-400 px-4 py-3 rounded-lg bg-red-400/10 border border-red-400/20"
        >
          {state.message}
        </p>
      )}

      {/* Boutique & Date */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-1">
          Appointment Details
        </legend>

        <div className="flex flex-col gap-1">
          <label htmlFor="store" className="text-xs font-medium text-platinum/50 tracking-wide">
            Select Boutique
          </label>
          <select
            id="store"
            name="store"
            required
            defaultValue=""
            className={cn(
              "w-full h-12 px-4 text-sm text-ivory rounded-lg",
              "glass-1 border border-white/[0.08]",
              "focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30",
              "bg-transparent transition-all duration-200",
              "[&>option]:bg-onyx [&>option]:text-ivory",
              state.errors?.store && "border-red-400/60"
            )}
          >
            <option value="" disabled>Choose a boutique…</option>
            {boutiques.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <FieldError message={state.errors?.store} />
        </div>

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
              "bg-transparent transition-all duration-200 [color-scheme:dark]",
              state.errors?.date && "border-red-400/60"
            )}
          />
          <FieldError message={state.errors?.date} />
        </div>
      </fieldset>

      {/* Contact info */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-1">
          Your Contact Info
        </legend>
        <Input name="name" label="Full Name" autoComplete="name" required error={state.errors?.name} />
        <Input name="email" type="email" label="Email Address" autoComplete="email" required error={state.errors?.email} />
        <Input name="phone" type="tel" label="Phone (optional)" autoComplete="tel" />
      </fieldset>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
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
                <motion.span
                  className="w-4 h-4 rounded-full border-2 border-onyx/30 border-t-onyx block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              "Request Appointment"
            )}
          </motion.span>
        </AnimatePresence>
      </Button>

      <p className="text-center text-xs text-platinum/30 leading-relaxed">
        No purchase required. Our team will reach out within 24 hours to confirm.
      </p>
    </form>
  );
}
