"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signIn } from "@/app/actions/auth";
import { authInitialState, type AuthFormState } from "@/lib/types/forms";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    signIn,
    authInitialState
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-ivory mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-platinum/50">
          Sign in to your fitting room &amp; wishlist.
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="flex flex-col gap-5" noValidate>
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

        <Input
          name="email"
          type="email"
          label="Email Address"
          autoComplete="email"
          required
          error={state.errors?.email}
        />

        <div>
          <Input
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            error={state.errors?.password}
          />
          <div className="mt-1.5 text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-platinum/40 hover:text-gold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

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
                  <motion.span
                    className="w-4 h-4 rounded-full border-2 border-onyx/30 border-t-onyx block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-platinum/40">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-gold hover:text-gold-light transition-colors font-medium"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
