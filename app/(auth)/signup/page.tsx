"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signUp } from "@/app/actions/auth";
import { authInitialState, type AuthFormState } from "@/lib/types/forms";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    signUp,
    authInitialState
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-ivory mb-2">
          Create your account
        </h1>
        <p className="text-sm text-platinum/50">
          Save your favorites and book boutique appointments.
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="flex flex-col gap-4" noValidate>
        <AnimatePresence>
          {state.status === "error" && state.errors?.general && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-400 px-3 py-2.5 rounded-lg bg-red-400/10 border border-red-400/20"
            >
              {state.errors.general}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3">
          <Input
            name="firstName"
            label="First Name"
            autoComplete="given-name"
            required
            error={state.errors?.firstName}
          />
          <Input
            name="lastName"
            label="Last Name"
            autoComplete="family-name"
            required
            error={state.errors?.lastName}
          />
        </div>

        <Input
          name="email"
          type="email"
          label="Email Address"
          autoComplete="email"
          required
          error={state.errors?.email}
        />

        <Input
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          required
          error={state.errors?.password}
        />

        <Input
          name="phone"
          type="tel"
          label="Phone (optional)"
          autoComplete="tel"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </motion.span>
          </AnimatePresence>
        </Button>

        <p className="text-center text-xs text-platinum/30 leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="text-platinum/50 hover:text-platinum underline underline-offset-2">
            Terms of Service
          </Link>
          .
        </p>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-platinum/40">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-gold hover:text-gold-light transition-colors font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
