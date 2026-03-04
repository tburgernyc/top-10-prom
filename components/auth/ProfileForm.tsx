"use client";

import { useActionState, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/app/actions/auth";
import { profileInitialState, type ProfileFormState } from "@/lib/types/forms";

const STYLE_VIBES = [
  "Romantic",
  "Bold",
  "Classic",
  "Boho",
  "Glam",
  "Minimalist",
  "Whimsical",
  "Dramatic",
] as const;

export interface ProfileFormProps {
  initialData?: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    vibes?: string[];
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    profileInitialState
  );

  // Toast on success
  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast({ message: state.message, type: "success" });
    }
  }, [state.status, state.message, toast]);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {/* General error */}
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

      {/* ── Name ─────────────────────────────────────────────────────────── */}
      <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <legend className="col-span-full text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-2">
          Personal Info
        </legend>
        <div>
          <Input
            name="firstName"
            label="First Name"
            defaultValue={initialData?.firstName ?? ""}
            autoComplete="given-name"
            required
            error={state.errors?.firstName}
          />
        </div>
        <div>
          <Input
            name="lastName"
            label="Last Name"
            defaultValue={initialData?.lastName ?? ""}
            autoComplete="family-name"
            required
            error={state.errors?.lastName}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            name="phone"
            type="tel"
            label="Phone (optional)"
            defaultValue={initialData?.phone ?? ""}
            autoComplete="tel"
            error={state.errors?.phone}
          />
        </div>
      </fieldset>

      {/* ── Style Vibes ──────────────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-xs font-semibold tracking-widest uppercase text-platinum/40 mb-3">
          Your Style Vibes
        </legend>
        <VibeSelector
          name="vibes"
          defaultVibes={initialData?.vibes ?? []}
        />
        <p className="mt-2 text-xs text-platinum/30">
          Aria uses these to personalize style recommendations.
        </p>
      </fieldset>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending}
          aria-busy={isPending}
          className="min-w-[140px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isPending ? "saving" : "idle"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <motion.span
                    className="w-3.5 h-3.5 rounded-full border-2 border-onyx/30 border-t-onyx block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    aria-hidden="true"
                  />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </motion.span>
          </AnimatePresence>
        </Button>

        <AnimatePresence>
          {state.status === "success" && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-emerald-400 flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

/* ── Vibe chip multi-selector ────────────────────────────────────────────── */
function VibeSelector({
  name,
  defaultVibes,
}: {
  name: string;
  defaultVibes: string[];
}) {
  // Controlled locally — passes comma-joined string to hidden input
  const [selected, setSelected] = useState<string[]>(defaultVibes);

  function toggle(vibe: string) {
    setSelected((prev: string[]) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  }

  return (
    <>
      <input type="hidden" name={name} value={selected.join(",")} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Style vibes">
        {STYLE_VIBES.map((vibe) => {
          const active = selected.includes(vibe);
          return (
            <motion.button
              key={vibe}
              type="button"
              onClick={() => toggle(vibe)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                active
                  ? "glass-2 border-gold/50 text-gold"
                  : "border-white/[0.08] text-platinum/50 hover:text-platinum hover:border-white/[0.16]"
              )}
              whileTap={{ scale: 0.95 }}
              aria-pressed={active}
              data-cursor="pointer"
            >
              {vibe}
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
